import { Option } from "../option";
import * as u from "../utils";

export function actOnDates(idc: number[], fn: (nm: string) => void) {
  const rows: NodeListOf<Element> = document.querySelectorAll(".ig-row");
  const len: number = rows.length;

  for (let i: number = 0; i < len; i++) {
    const rowItem: Option<HTMLElement> = rows[i] as Option<HTMLElement>;
    const label: Option<HTMLElement> = u.getChild(rowItem, [2, 0]);
    const btn: Option<HTMLElement> = u.getChild(rowItem, idc);
    const nm: string = label?.innerText || "";
    const rgx: RegExp = /^\*[a-z]{3,12} \d{1,2} - [a-z]{0,12} ?\d{1,2}\*$/;

    if (!rgx.test(nm.toLowerCase())) {
      continue;
    }

    btn?.click();
    fn(nm);
  }
}
