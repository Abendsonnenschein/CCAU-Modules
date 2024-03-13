import { actOnDates } from "./utils";
import * as u from "../utils";
function clickDelete(nm) {
    u.log(`Removing date header: ${nm}`);
    const nodes = document.querySelectorAll(".ui-kyle-menu");
    const menus = Array.from(nodes);
    const len = menus.length;
    for (let i = 0; i < len; i++) {
        if (menus[i].getAttribute("aria-hidden") !== "false") {
            continue;
        }
        const menuItem = menus[i];
        const miLen = menuItem.children.length;
        const btn = u.getChild(menuItem, [miLen - 1, 0]);
        btn?.click();
    }
}
export function removeOldDates() {
    const orig = u.overrideConfirm();
    actOnDates([3, 2, 1, -1, 0], clickDelete);
    u.restoreConfirm(orig);
}
