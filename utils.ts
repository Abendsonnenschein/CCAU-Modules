import { OptElement, OptHTMLElement, OptUndHTMLElement } from "./aliases";

export function moduleList(): HTMLElement[] {
  const sel: string = ".collapse_module_link";
  const mods: HTMLElement[] = Array.from(document.querySelectorAll(sel));
  return mods;
}

export function indexOf(name: string, skip: number): number {
  return moduleList().findIndex((m, i) => i >= skip && m.title === name);
}

export function isEmpty(idx: number): boolean {
  const mods: HTMLElement[] = moduleList();
  const thisMod: OptUndHTMLElement = mods[idx].parentElement?.parentElement;
  return getChild(thisMod as OptHTMLElement, [2, 0])?.children.length == 0;
}

export function addButton(
  name: string,
  id: string,
  fn: VoidFunction,
  sel: string,
) {
  const bar: OptElement = document.querySelector(sel);
  const newHTML: string = `<a class="btn" tabindex="0" id="${id}">${name}</a>`;

  bar?.insertAdjacentHTML("afterbegin", newHTML);
  bar?.insertAdjacentHTML("afterbegin", "&nbsp;");

  const btn: OptElement = document.querySelector(`#${id}`);
  btn?.addEventListener("click", fn, false);
}

//SAFETY: I have checked Canvas code, no RC unless some other extension interferes
export function overrideConfirm(): () => boolean {
  const orig: () => boolean = window.confirm;

  window.confirm = function () {
    return true;
  };

  return orig;
}

export function restoreConfirm(orig: () => boolean) {
  window.confirm = orig;
}

export function getChild(
  element: OptHTMLElement,
  indices: number[],
): OptHTMLElement {
  let cur: OptHTMLElement = element;

  indices.forEach((idx) => {
    if (cur?.children && cur.children.length > idx) {
      cur = cur?.children[idx] as OptHTMLElement;
    } else {
      return null;
    }
  });

  return cur;
}

function gRHHelp(key: string): boolean {
  return key.startsWith("__reactEventHandlers");
}

function getReactHandler(obj: object): string | undefined {
  const keys: string[] = Object.keys(obj);
  const rctKey: string | undefined = keys.find(gRHHelp);

  return rctKey;
}

export function setInput(sel: string, val: string) {
  const element: OptElement = document.querySelector(sel);
  const textBox: HTMLInputElement = element as HTMLInputElement;

  textBox.value = val;
}

export function clickButton(sel: string) {
  const element: OptElement = document.querySelector(sel);
  const btn: OptHTMLElement = element as OptHTMLElement;

  btn?.click();
}

export function selectDestination(name: string) {
  const sel: string = ".move-select-form";
  const _form: OptHTMLElement = document.querySelector(sel) as OptHTMLElement;
  const form: HTMLSelectElement = _form as HTMLSelectElement;
  const options: HTMLOptionsCollection | null = form?.options;
  const len: number = options?.length;

  for (let i: number = 0; i < len; i++) {
    if (options[i].text !== name) {
      continue;
    }

    form.selectedIndex = i;
    form.value = options[i].value;

    const handlerName: string | undefined = getReactHandler(form);
    const fakeObj = { target: { value: form.value } };

    if (!handlerName) {
      continue;
    }

    form[handlerName].onChange(fakeObj);
    return true;
  }

  return false;
}

export function actOnDates(fn: (nm: string) => void) {
  const rows: NodeListOf<Element> = document.querySelectorAll(".ig-row");
  const len: number = rows.length;

  for (let i: number = 0; i < len; i++) {
    const rowItem: OptHTMLElement = rows[i] as OptHTMLElement;
    const label: OptHTMLElement = getChild(rowItem, [2, 0]);
    const btn: OptHTMLElement = getChild(rowItem, [3, 2, 0]);
    const nm: string = label?.innerText || "";

    if (!nm.startsWith("*") || !nm.endsWith("*")) {
      continue;
    }

    btn?.click();
    fn(nm);
  }
}

export function scrollUp() {
  scrollTo({ top: 0, behavior: "smooth" });
}

export async function delayedFunc(func: () => void, secs: number) {
  setTimeout(func, secs * 1000);
}
