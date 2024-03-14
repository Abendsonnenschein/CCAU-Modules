import { Option } from "./option";

export function addButton(
  name: string,
  id: string,
  fn: VoidFunction,
  sel: string,
) {
  const bar: Option<Element> = document.querySelector(sel);
  const newHTML: string = `<a class="btn" tabindex="0" id="${id}">${name}</a>`;

  bar?.insertAdjacentHTML("afterbegin", newHTML);
  bar?.insertAdjacentHTML("afterbegin", "&nbsp;");

  const btn: Option<Element> = document.querySelector(`#${id}`);
  btn?.addEventListener("click", fn, false);
}

export function clickButton(sel: string) {
  const element: Option<Element> = document.querySelector(sel);
  const btn: Option<HTMLElement> = element as Option<HTMLElement>;

  btn?.click();
}

export function getChild(
  element: Option<HTMLElement>,
  indices: number[],
): Option<HTMLElement> {
  let cur: Option<HTMLElement> = element;

  indices.forEach((i_) => {
    const children: HTMLCollection = cur?.children as HTMLCollection;
    const len: number = children.length;
    const i: number = i_ >= 0 ? i_ : len + i_;

    len > i ? (cur = children[i] as HTMLElement) : null;
  });

  return cur;
}

export function indexOf(name: string, skip: number = 0): number {
  return moduleList().findIndex(
    (m, i) => i >= skip && m.title.toLowerCase() === name.toLowerCase(),
  );
}

export function log(msg: string) {
  console.log("[CCAU] " + msg);
}

export function moduleList(): HTMLElement[] {
  const sel: string = ".collapse_module_link";
  const mods: HTMLElement[] = Array.from(document.querySelectorAll(sel));
  return mods;
}

export function openMenu(idx: number, btnIdx: number) {
  const mods: HTMLElement[] = moduleList();
  const hpe: Option<HTMLElement> = mods[idx].parentElement;
  const btn: Option<HTMLElement> = getChild(hpe, [5, 0, btnIdx]);

  btn?.click();
}

export function overrideConfirm(): () => boolean {
  const orig: () => boolean = window.confirm;
  window.confirm = () => true;
  return orig;
}

export function restoreConfirm(orig: () => boolean) {
  window.confirm = orig;
}
