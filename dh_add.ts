import { removeOldDates } from "./dh_remove";
import { addButton, getChild, indexOf, moduleList } from "./utils";

function justSubheader() {
  const sel: string = "#add_module_item_select";
  const element: OptElement = document.querySelector(sel);
  const select: HTMLSelectElement = element as HTMLSelectElement;
  const options: HTMLOptionElement[] = Array.from(select.options);

  options?.forEach((opt) => (opt.value = "context_module_sub_header"));
}

function setInput(val: string) {
  const sel: string = "#sub_header_title";
  const element: OptElement = document.querySelector(sel);
  const textBox: HTMLInputElement = element as HTMLInputElement;

  textBox.value = val;
}

function submitAdd() {
  const sel: string = ".add_item_button";
  const element: OptElement = document.querySelector(sel);
  const btn: OptHTMLElement = element as OptHTMLElement;

  btn?.click();
}

function openMenu(name: string, skip: number) {
  const mods: HTMLElement[] = moduleList();
  const idx: number = indexOf(name, skip);
  const hpe: OptHTMLElement = mods[idx].parentElement;
  const btn: OptHTMLElement = getChild(hpe, [5, 0, 2]);

  if (btn?.getAttribute("aria-label")?.startsWith("Add Content")) {
    btn?.click();
  }
}

function addDates(dateSet: { [key: string]: string }) {
  removeOldDates();
  justSubheader();

  let endIdx: number = indexOf("START HERE", 1);
  const mods: HTMLElement[] = moduleList();

  if (endIdx === -1) {
    endIdx = mods.length;
  }

  for (let i = 0; i < endIdx; i++) {
    const name = mods[i].title;

    if (!dateSet[name]) {
      continue;
    }

    openMenu(name, 0);
    setInput(dateSet[name]);
    submitAdd();
  }
}

function addDatePrompt() {
  const datesB = {
    "Week 1": "*March 4 - 10*",
    "Week 2": "*March 11 - 17*",
    "Week 3": "*March 25 - 31*",
    "Week 4": "*April 1 - 7*",
    "Week 5": "*April 8 - 14*",
    "Week 6": "*April 15 - 21*",
    "Week 7": "*April 22 - 28*",
    "Week 8": "*April 29 - May 5*",
  };

  const datesF = {
    "Week 1": "*January 8 - 14*",
    "Week 2": "*January 15 - 21*",
    "Week 3": "*January 22 - 28*",
    "Week 4": "*January 29 - February 4*",
    "Week 5": "*February 5 - 11*",
    "Week 6": "*February 12 - 18*",
    "Week 7": "*February 19 - 25*",
    "Week 8": "*February 26 - March 3*",
    "Week 9": "*March 4 - 10*",
    "Week 10": "*March 11 - 17*",
    "Week 11": "*March 25 - 31*",
    "Week 12": "*April 1 - 7*",
    "Week 13": "*April 8 - 14*",
    "Week 14": "*April 15 - 21*",
    "Week 15": "*April 22 - 28*",
    "Week 16": "*April 29 - May 5*",
  };

  if (confirm("Is this course 7B?\n\nOK = Yes\nCancel = No")) {
    addDates(datesB);
  } else {
    addDates(datesF);
  }
}

export function addDatesButton() {
  addButton(
    "Add Dates",
    "ccau-dates",
    addDatePrompt,
    ".header-bar-right__buttons",
  );
}
