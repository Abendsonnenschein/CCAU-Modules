import * as u from "../utils";
import { actOnDates } from "./utils";
import { removeOldDates } from "./del";
import { getDates } from "./update";
function defaultToSubheader() {
    const sel = "#add_module_item_select";
    const element = document.querySelector(sel);
    const select = element;
    const options = Array.from(select.options);
    options?.forEach((opt) => (opt.value = "context_module_sub_header"));
}
function publish() {
    actOnDates([3, 1, 0], (nm) => {
        u.log(`Publishing ${nm}`);
    });
}
function openMenu(name, btnIdx, label) {
    const mods = u.moduleList();
    const idx = u.indexOf(name, 0);
    const hpe = mods[idx].parentElement;
    const btn = u.getChild(hpe, [5, 0, btnIdx]);
    if (btn?.getAttribute("aria-label")?.startsWith(label)) {
        btn?.click();
    }
}
function setInput(sel, val) {
    const element = document.querySelector(sel);
    const textBox = element;
    textBox.value = val;
}
function addDates() {
    removeOldDates();
    defaultToSubheader();
    const dates = getDates();
    const mods = u.moduleList();
    let endIdx = u.indexOf("START HERE", 1);
    if (endIdx === -1) {
        u.log("Course not detected as a copy, updating all modules.");
        endIdx = mods.length;
    }
    for (let i = 0; i < endIdx; i++) {
        const title = mods[i].title;
        const name = u.lenientName(title);
        if (!name) {
            u.log(`${title} has an invalid name.`);
            continue;
        }
        if (!dates[name]) {
            u.log(`No date found for ${name}`);
            continue;
        }
        openMenu(title, 2, "Add Content");
        setInput("#sub_header_title", dates[name]);
        u.clickButton(".add_item_button");
    }
    setTimeout(publish, 1500);
}
export function dateButton() {
    u.addButton("Add Dates", "ccau-dates", addDates, ".header-bar-right__buttons");
}
