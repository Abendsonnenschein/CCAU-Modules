import * as u from "./utils";
import { OptHTMLElement } from "./aliases";

function clickDelete(nm: string) {
  console.log(`Removing ${nm}`);

  const nodes: NodeListOf<Element> = document.querySelectorAll(".ui-kyle-menu");
  const menus: Element[] = Array.from(nodes);
  const len: number = menus.length;

  for (let i: number = 0; i < len; i++) {
    if (menus[i].getAttribute("aria-hidden") !== "false") {
      continue;
    }

    const menuItem: HTMLElement = menus[i] as HTMLElement;
    const miLen: number = menuItem.children.length;
    const btn: OptHTMLElement = u.getChild(menuItem, [miLen - 1, 0]);

    btn?.click();
  }
}

export function removeOldDates() {
  const orig: () => boolean = u.overrideConfirm();
  u.actOnDates(clickDelete);
  u.restoreConfirm(orig);
}
