import { OptHTMLElement } from "./aliases";
import { addButton, getChild, indexOf, isEmpty, moduleList } from "./utils";

function openMenu(name: string, skip: number) {
  const mods: HTMLElement[] = moduleList();
  const idx: number = indexOf(name, skip);
  const hpe: OptHTMLElement = mods[idx].parentElement;
  const btn: OptHTMLElement = getChild(hpe, [5, 0, 3]);

  if (btn?.getAttribute("aria-label")?.startsWith("Manage")) {
    btn?.click();
  }
}

function clickMoveContents() {
  const nodes: NodeListOf<Element> = document.querySelectorAll(".ui-kyle-menu");
  const menus: Element[] = Array.from(nodes);
  const len: number = menus.length;

  for (let i: number = 0; i < len; i++) {
    if (menus[i].getAttribute("aria-hidden") !== "false") {
      continue;
    }

    const menuItem: HTMLElement = menus[i] as HTMLElement;
    const btn: HTMLElement | null = getChild(menuItem, [2, 0]);

    btn?.click();
  }
}

function gRHHelp(key: string): boolean {
  return key.startsWith("__reactEventHandlers");
}

function getReactHandler(obj: object): string | undefined {
  const keys: string[] = Object.keys(obj);
  const rctKey: string | undefined = keys.find(gRHHelp);

  return rctKey;
}

function selectDestination(name: string) {
  const sel: string = ".move-select-form";
  const _form: OptHTMLElement = document.querySelector(sel) as OptHTMLElement;
  const form: HTMLSelectElement = _form as HTMLSelectElement;
  const options: HTMLOptionsCollection | null = form?.options;
  const len: number = options?.length;

  for (let i: number = 0; i < len; i++) {
    if (options[i].text !== name) {
      continue;
    }

    form.selectedIndex = i;
    form.value = options[i].value;

    const handlerName: string | undefined = getReactHandler(form);
    const fakeObj = { target: { value: form.value } };

    if (!handlerName) {
      continue;
    }

    form[handlerName].onChange(fakeObj);

    return true;
  }

  return false;
}

function moveAll() {
  const startIdx: number = indexOf("START HERE", 1);
  const mods: HTMLElement[] = moduleList();
  const len: number = mods.length;
  const sel: string = "#move-item-tray-submit-button";

  if (startIdx === -1) {
    return;
  }

  for (let i: number = startIdx; i < len; i++) {
    const name: string = mods[i].title;

    if (isEmpty(i)) {
      continue;
    }

    openMenu(name, startIdx);
    clickMoveContents();

    if (!selectDestination(name)) {
      continue;
    }

    const btn: OptHTMLElement = document.querySelector(sel) as OptHTMLElement;
    btn?.click();
  }
}

export function addMoveButton() {
  addButton("Auto-Move", "ccau-move", moveAll, ".header-bar-right__buttons");
}
