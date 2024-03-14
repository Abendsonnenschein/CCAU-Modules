import * as u from "../utils";
import { Option } from "../option";
import { actOnDates } from "./utils";
import { removeOldDates } from "./del";
import { getDates } from "./update";
import { lenientName } from "../env";

function defaultToSubheader() {
  const sel: string = "#add_module_item_select";
  const element: Option<Element> = document.querySelector(sel);
  const select: HTMLSelectElement = element as HTMLSelectElement;
  const options: HTMLOptionElement[] = Array.from(select.options);

  options?.forEach((opt) => (opt.value = "context_module_sub_header"));
}

// [3, 1, 0] is the child-index path to the publish button in the .ig-row element

function publish() {
  actOnDates([3, 1, 0], (nm) => {
    u.log(`Publishing ${nm}`);
  });
}

function setInput(sel: string, val: string) {
  const element: Option<Element> = document.querySelector(sel);
  const textBox: HTMLInputElement = element as HTMLInputElement;

  textBox.value = val;
}

function addDates() {
  removeOldDates();
  defaultToSubheader();

  const dates: { [key: string]: string } = getDates();
  const mods: HTMLElement[] = u.moduleList();
  let endIdx: number = u.indexOf("START HERE", 1);

  if (endIdx === -1) {
    u.log("Course not detected as a copy, updating all modules.");
    endIdx = mods.length;
  }

  for (let i = 0; i < endIdx; i++) {
    const title: string = mods[i].title;
    const name: Option<string> = lenientName(title);

    if (!name) {
      u.log(`${title} has an invalid name.`);
      continue;
    }

    if (!dates[name]) {
      u.log(`No date found for ${name}`);
      continue;
    }

    u.openMenu(u.indexOf(name), 2);
    setInput("#sub_header_title", dates[name]);
    u.clickButton(".add_item_button");
  }

  setTimeout(publish, 1500);
}

export function dateButton() {
  u.addButton(
    "Add Dates",
    "ccau-dates",
    addDates,
    ".header-bar-right__buttons",
  );
}
