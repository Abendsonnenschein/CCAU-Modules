import { OptHTMLElement } from "./aliases";
import * as u from "./utils";

function openMenu(name: string, skip: number) {
  const mods: HTMLElement[] = u.moduleList();
  const idx: number = u.indexOf(name, skip);
  const hpe: OptHTMLElement = mods[idx].parentElement;
  const btn: OptHTMLElement = u.getChild(hpe, [5, 0, 3]);

  if (btn?.getAttribute("aria-label")?.startsWith("Manage")) {
    btn?.click();
  }
}

function clickMoveContents() {
  const nodes: NodeListOf<Element> = document.querySelectorAll(".ui-kyle-menu");
  const menus: Element[] = Array.from(nodes);
  const len: number = menus.length;

  for (let i: number = 0; i < len; i++) {
    if (menus[i].getAttribute("aria-hidden") !== "false") {
      continue;
    }

    const menuItem: HTMLElement = menus[i] as HTMLElement;
    const btn: HTMLElement | null = u.getChild(menuItem, [2, 0]);

    btn?.click();
  }
}

function moveAll() {
  const startIdx: number = u.indexOf("START HERE", 1);
  const mods: HTMLElement[] = u.moduleList();
  const len: number = mods.length;

  if (startIdx === -1) {
    return;
  }

  for (let i: number = startIdx; i < len; i++) {
    const name: string = mods[i].title;

    if (u.isEmpty(i)) {
      console.log(`Skipping ${name} because it's empty`);
      continue;
    }

    openMenu(name, startIdx);
    clickMoveContents();

    if (!u.selectDestination(name)) {
      console.log(`No destination selected for ${name}`);
      continue;
    }

    u.clickButton("#move-item-tray-submit-button");
  }

  u.scrollUp();
}

export function addMoveButton() {
  u.addButton("Auto-Move", "ccau-move", moveAll, ".header-bar-right__buttons");
}
