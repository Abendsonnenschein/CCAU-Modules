import { Option } from "./option";

// Change this URL to one that points to the dates for your university.

export const DATE_URL: string =
  "https://raw.githubusercontent.com/Abendsonnenschein/CCAU-Modules/main/data.json";

// lenientName takes the title of a module and converts it into the expected name format, if possible.
// E.g., "WEEK 1" -> "Week 1", "Week 1: *January 1 - 8*" -> "Week 1", "Start Here" -> "START HERE", "Resources" -> null.
// null returns will be ignored by the rest of the script, as they are assumed to not be weekly modules.
// However, it only works for the structure at my university, so it may need to be modified for other universities.

export function lenientName(name: string): Option<string> {
  const ln: string = name.toLowerCase();
  const idealFmt: RegExp = /^week \d{1,2}$/;
  const dateFmt: RegExp = /^week \d{1,2}:/;

  if (ln === "start here") {
    return "START HERE";
  }

  if (idealFmt.test(ln)) {
    return ln.replace("w", "W");
  }

  if (dateFmt.test(ln)) {
    return ln.split(":")[0].replace("w", "W");
  }

  return null;
}
