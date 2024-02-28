import * as u from "./utils";
import { OptHTMLElement } from "./aliases";

function openMenu(idx: number) {
  const mods: HTMLElement[] = u.moduleList();
  const hpe: OptHTMLElement = mods[idx].parentElement;
  const btn: OptHTMLElement = u.getChild(hpe, [5, 0, 3]);

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
    const btn: OptHTMLElement = u.getChild(menuItem, [4, 0]);

    btn?.click();
  }
}

function removeEmpty() {
  const orig: () => boolean = u.overrideConfirm();
  const mods: HTMLElement[] = u.moduleList();
  const len: number = mods.length;

  for (let i: number = 0; i < len - 1; i++) {
    if (!u.isEmpty(i)) {
      continue;
    }

    openMenu(i);
    clickDelete();
  }

  u.restoreConfirm(orig);
  u.scrollUp();
}

export function addRemoveButton() {
  u.addButton(
    "Remove Empty",
    "ccau_delete",
    removeEmpty,
    ".header-bar-right__buttons",
  );
}
