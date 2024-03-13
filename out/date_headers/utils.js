import * as u from "../utils";
export function actOnDates(idc, fn) {
    const rows = document.querySelectorAll(".ig-row");
    const len = rows.length;
    for (let i = 0; i < len; i++) {
        const rowItem = rows[i];
        const label = u.getChild(rowItem, [2, 0]);
        const btn = u.getChild(rowItem, idc);
        const nm = label?.innerText || "";
        const rgx = /^\*[a-z]{3,12} \d{1,2} - [a-z]{0,12} ?\d{1,2}\*$/;
        if (!rgx.test(nm.toLowerCase())) {
            continue;
        }
        btn?.click();
        fn(nm);
    }
}
