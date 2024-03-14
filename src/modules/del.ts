import * as u from "../utils";
import { isEmpty } from "./utils";
import { Option } from "../option";

function clickDelete() {
  const sel: string = ".ui-kyle-menu";
  const menus: Element[] = Array.from(document.querySelectorAll(sel));
  const len: number = menus.length;

  for (let i: number = 0; i < len; i++) {
    if (menus[i].getAttribute("aria-hidden") !== "false") {
      continue;
    }

    const menuItem: HTMLElement = menus[i] as HTMLElement;
    const btn: Option<HTMLElement> = u.getChild(menuItem, [4, 0]);

    btn?.click();
  }
}

function removeEmpty() {
  const orig: () => boolean = u.overrideConfirm();
  const mods: HTMLElement[] = u.moduleList();
  const len: number = mods.length;

  for (let i: number = 0; i < len - 1; i++) {
    if (!isEmpty(i)) {
      continue;
    }

    u.openMenu(i, 3);
    clickDelete();
  }

  u.restoreConfirm(orig);
}

export function deleteButton() {
  u.addButton(
    "Remove Empty",
    "ccau_delete",
    removeEmpty,
    ".header-bar-right__buttons",
  );
}
