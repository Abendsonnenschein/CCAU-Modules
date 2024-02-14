import {
  addButton,
  getChild,
  isEmpty,
  moduleList,
  overrideConfirm,
  restoreConfirm,
} from "./utils";

import { OptHTMLElement } from "./aliases";

function openMenu(idx: number) {
  const mods: HTMLElement[] = moduleList();
  const hpe: OptHTMLElement = mods[idx].parentElement;
  const btn: OptHTMLElement = getChild(hpe, [5, 0, 3]);

  if (btn?.getAttribute("aria-label")?.startsWith("Manage")) {
    btn?.click();
  }
}

function clickDelete() {
  const nodes: NodeListOf<Element> = document.querySelectorAll(".ui-kyle-menu");
  const menus: Element[] = Array.from(nodes);
  const len: number = menus.length;

  for (let i: number = 0; i < len; i++) {
    if (menus[i].getAttribute("aria-hidden") !== "false") {
      continue;
    }

    const menuItem: HTMLElement = menus[i] as HTMLElement;
    const btn: OptHTMLElement = getChild(menuItem, [4, 0]);

    btn?.click();
  }
}

function removeEmpty() {
  const orig: () => boolean = overrideConfirm();
  const mods: HTMLElement[] = moduleList();
  const len: number = mods.length;

  for (let i: number = 0; i < len; i++) {
    if (!isEmpty(i)) {
      continue;
    }

    openMenu(i);
    clickDelete();
  }

  restoreConfirm(orig);
}

export function addRemoveButton() {
  addButton(
    "Remove Empty",
    "ccau_delete",
    removeEmpty,
    ".header-bar-right__buttons",
  );
}
