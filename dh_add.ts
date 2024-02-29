import { removeOldDates } from "./dh_remove";
import * as u from "./utils";
import { OptElement, OptHTMLElement } from "./aliases";

function defaultToSubheader() {
  const sel: string = "#add_module_item_select";
  const element: OptElement = document.querySelector(sel);
  const select: HTMLSelectElement = element as HTMLSelectElement;
  const options: HTMLOptionElement[] = Array.from(select.options);

  options?.forEach((opt) => (opt.value = "context_module_sub_header"));
}

function publishAll() {
  const rows: NodeListOf<Element> = document.querySelectorAll(".ig-row");
  const len: number = rows.length;

  for (let i: number = 0; i < len; i++) {
    const rowItem: OptHTMLElement = rows[i] as OptHTMLElement;
    const label: OptHTMLElement = u.getChild(rowItem, [2, 0]);
    const btn: OptHTMLElement = u.getChild(rowItem, [3, 1, 0]);

    if (!label?.innerText.startsWith("*") || !label?.innerText.endsWith("*")) {
      continue;
    }

    btn?.click();
  }
}

function updateDates() {
  const now: number = Date.now();
  const last: number = Number(localStorage.getItem("ccau-updated")) ?? 0;
  const url: string =
    "https://raw.githubusercontent.com/Abendsonnenschein/CCAU-Modules/main/dates.json";

  if (now - last < 0x9a7ec800) {
    return;
  }

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      localStorage.setItem("ccau-dates", JSON.stringify(data));
      localStorage.setItem("ccau-updated", now.toString());
    });
}

function openMenu(name: string, btnIdx: number, label: string) {
  const mods: HTMLElement[] = u.moduleList();
  const idx: number = u.indexOf(name, 0);
  const hpe: OptHTMLElement = mods[idx].parentElement;
  const btn: OptHTMLElement = u.getChild(hpe, [5, 0, btnIdx]);

  if (btn?.getAttribute("aria-label")?.startsWith(label)) {
    btn?.click();
  }
}

async function addDates(dateSet: { [key: string]: string }) {
  removeOldDates();
  defaultToSubheader();

  let endIdx: number = u.indexOf("START HERE", 1);
  const mods: HTMLElement[] = u.moduleList();

  if (endIdx === -1) {
    endIdx = mods.length;
  }

  for (let i = 0; i < endIdx; i++) {
    const name = mods[i].title;

    if (!dateSet[name]) {
      console.log(`No date found for ${name}`);
      continue;
    }

    openMenu(name, 2, "Add Content");
    u.setInput("#sub_header_title", dateSet[name]);
    u.clickButton(".add_item_button");
  }
}

function semToString(semester: number): string {
  switch (semester) {
    case 1:
      return "Spring";
    case 2:
      return "Summer";
    case 3:
      return "Fall";
    default:
      return "???";
  }
}

async function addDatePrompt() {
  updateDates();

  const cached: string = localStorage.getItem("ccau-dates") ?? "{}";
  const dates = JSON.parse(cached);

  const msg = `Please enter the term for which you would like to add dates.
    Valid terms are 1, 1B, 2, 2B, 3, 3B.
    1 = Spring, 2 = Summer, 3 = Fall`;

  const term: string = prompt(msg, "") ?? "";

  if (/^[123]B?$/.exec(term) === null) {
    console.log("Invalid term entered.");
    return;
  }

  const semester: number = parseInt(term[0], 10);
  const isB: boolean = term.length === 2;
  const semDates: string[] = dates[semToString(semester)];
  const start: number = isB ? 8 : 0;
  const dict: { [key: string]: string } = {};

  if (!semDates) {
    console.log("No dates found for this semester.");
    return;
  }

  for (let i = 0; i < semDates.length; i++) {
    dict[`Week ${i + 1}`] = semDates[start + i];
  }

  console.log(dict);

  addDates(dict);
  await u.delayedFunc(publishAll, 1.5);
  await u.delayedFunc(u.scrollUp, 2);
}

export function addDatesButton() {
  u.addButton(
    "Add Dates",
    "ccau-dates",
    addDatePrompt,
    ".header-bar-right__buttons",
  );
}
