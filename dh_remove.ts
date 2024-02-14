import { getChild, overrideConfirm, restoreConfirm } from "./utils";
import { OptHTMLElement } from "./aliases";

function clickDelete() {
  const nodes: NodeListOf<Element> = document.querySelectorAll(".ui-kyle-menu");
  const menus: Element[] = Array.from(nodes);
  const len: number = menus.length;

  for (let i: number = 0; i < len; i++) {
    if (menus[i].getAttribute("aria-hidden") !== "false") {
      continue;
    }

    const menuItem: HTMLElement = menus[i] as HTMLElement;
    const miLen: number = menuItem.children.length;
    let idx: number = -1;

    for (let j: number = 0; j < miLen; j++) {
      const child: Element = menuItem.children[j].children[0];

      if (child.getAttribute("title")?.startsWith("Remove")) {
        idx = j;
        break;
      }
    }

    const btn: OptHTMLElement = getChild(menuItem, [idx, 0]);
    btn?.click();
  }
}

export function removeOldDates() {
  const orig: () => boolean = overrideConfirm();
  const rows: NodeListOf<Element> = document.querySelectorAll(".ig-row");
  const len: number = rows.length;

  for (let i: number = 0; i < len; i++) {
    const rowItem: OptHTMLElement = rows[i] as OptHTMLElement;
    const label: OptHTMLElement = getChild(rowItem, [2, 0]);
    const btn: OptHTMLElement = getChild(rowItem, [3, 2, 0]);

    if (!label?.innerText.startsWith("*") || !label?.innerText.endsWith("*")) {
      continue;
    }

    btn?.click();
    clickDelete();
  }

  restoreConfirm(orig);
}
