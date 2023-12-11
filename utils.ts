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
  return getChild(thisMod, [2, 0])?.children.length == 0;
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
