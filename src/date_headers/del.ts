import { actOnDates } from "./utils";
import { Option } from "../option";
import * as u from "../utils";

function clickDelete(nm: string) {
  u.log(`Removing date header: ${nm}`);

  const nodes: NodeListOf<Element> = document.querySelectorAll(".ui-kyle-menu");
  const menus: Element[] = Array.from(nodes);
  const len: number = menus.length;

  for (let i: number = 0; i < len; i++) {
    if (menus[i].getAttribute("aria-hidden") !== "false") {
      continue;
    }

    const menuItem: HTMLElement = menus[i] as HTMLElement;
    const miLen: number = menuItem.children.length;
    const btn: Option<HTMLElement> = u.getChild(menuItem, [miLen - 1, 0]);

    btn?.click();
  }
}

// [3, 2, 1, -1, 0] is the child-index path for the delete button, where -1 is the last child

export function removeOldDates() {
  const orig: () => boolean = u.overrideConfirm();
  actOnDates([3, 2, 1, -1, 0], clickDelete);
  u.restoreConfirm(orig);
}
