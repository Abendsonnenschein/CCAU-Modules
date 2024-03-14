import { Option } from "../option";
import * as u from "../utils";

export function isEmpty(idx: number): boolean {
  const mods: HTMLElement[] = u.moduleList();
  const mod: Option<HTMLElement> = mods[idx].parentElement?.parentElement;
  return u.getChild(mod as Option<HTMLElement>, [2, 0])?.children.length === 0;
}

export function getReactHandler(obj: object): Option<string> {
  const sel: string = "__reactEventHandler";
  const keys: string[] = Object.keys(obj);
  const key: Option<string> = keys.find((k) => k.startsWith(sel));

  return key;
}
