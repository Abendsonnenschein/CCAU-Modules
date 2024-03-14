import * as u from "../utils";
import { Option } from "../option";
import { isEmpty, getReactHandler } from "./utils";
import { lenientName } from "../env";

function clickMoveContents() {
  const sel: string = ".ui-kyle-menu";
  const menus: Element[] = Array.from(document.querySelectorAll(sel));
  const len: number = menus.length;

  for (let i: number = 0; i < len; i++) {
    if (menus[i].getAttribute("aria-hidden") !== "false") {
      continue;
    }

    const menuItem: HTMLElement = menus[i] as HTMLElement;
    const btn: Option<HTMLElement> = u.getChild(menuItem, [2, 0]);

    btn?.click();
  }
}

function selectDestination(name: string): boolean {
  const sel: string = ".move-select-form";
  const elem: Option<Element> = document.querySelector(sel);
  const form: Option<HTMLSelectElement> = elem as Option<HTMLSelectElement>;
  const options: Option<HTMLOptionsCollection> = form?.options;
  const len: Option<number> = options?.length;

  if (!form) {
    u.log("No form found");
    return false;
  }

  if (!options || !len) {
    u.log("No options found");
    return false;
  }

  for (let i: number = 0; i < len; i++) {
    if (options[i].text !== name) {
      continue;
    }

    form.selectedIndex = i;
    form.value = options[i].value;

    const handlerName: Option<string> = getReactHandler(form);
    const fakeObj = { target: { value: form.value } };

    if (!handlerName) {
      continue;
    }

    const handler: any = form[handlerName as any];
    handler.onChange(fakeObj);

    return true;
  }

  return false;
}

function moveAll() {
  const startIdx: number = u.indexOf("START HERE", 1);
  const mods: HTMLElement[] = u.moduleList();
  const len: number = mods.length;

  if (startIdx === -1) {
    u.log("START HERE not found. Please add it to fix.");
    return;
  }

  for (let i: number = startIdx; i < len; i++) {
    const title: string = mods[i].title;
    const name: Option<string> = lenientName(title);
    const idx: number = u.indexOf(title, startIdx);

    if (!name) {
      u.log(`${title} has an invalid name.`);
      continue;
    }

    if (isEmpty(i)) {
      u.log(`Skipping ${name} because it's empty`);
      continue;
    }

    u.openMenu(idx, 3);
    clickMoveContents();

    if (!selectDestination(name)) {
      u.log(`No destination selected for ${name}`);
      continue;
    }

    u.clickButton("#move-item-tray-submit-button");
  }
}

export function moveButton() {
  u.addButton("Auto-Move", "ccau-move", moveAll, ".header-bar-right__buttons");
}
