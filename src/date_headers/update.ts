import * as u from "../utils";
import { DATE_URL } from "../env";
import { Option } from "../option";
import { showModal } from "./modal";

function update() {
  const week: number = 0x240c8400;
  const now: number = Date.now();
  const last: number = Number(localStorage.getItem("ccau_update_time")) ?? 0;

  if (now - last < week) {
    u.log("To force an update, clear localStorage and refresh the page.");
    return;
  }

  fetch(DATE_URL)
    .then((response) => response.json())
    .then((data) => {
      localStorage.setItem("ccau_data", JSON.stringify(data));
      localStorage.setItem("ccau_update_time", now.toString());
    });
}

function getRawDates(sem: string): Option<string[]> {
  const cached: string = localStorage.getItem("ccau_data") ?? "{}";
  const data = JSON.parse(cached);
  const dates: string[] = data["dates"][sem];

  if (!dates) {
    u.log("No dates found for this term.");
    return null;
  }

  return dates;
}

function getDateRange(sem: string, term: string): Option<string> {
  const cached: string = localStorage.getItem("ccau_data") ?? "{}";
  const data = JSON.parse(cached);
  const ret: Option<string> = data["ranges"][sem][term];

  if (!ret) {
    u.log("No date range found for this term.");
    return null;
  }

  return ret;
}

function datesInRange(dates: string[], range: string): string[] {
  return range.split(",").flatMap((r: string) => {
    const nums: number[] = r.split("-").map(Number);
    const start: number = nums[0];
    const end: Option<number> = nums[1];

    return dates.slice(start - 1, end || start);
  });
}

function mapToWeeks(dates: string[]): { [key: string]: string } {
  const dict: { [key: string]: string } = {};

  for (let i = 0; i < dates.length; i++) {
    dict[`Week ${i + 1}`] = dates[i];
  }

  return dict;
}

export async function getDates(): Promise<{ [key: string]: string }> {
  return new Promise((resolve) => {
    update();

    showModal().then(async ([sem, term]) => {
      if (!sem || !term) {
        u.log("Semester: " + sem);
        u.log("Term: " + term);
        resolve({});
        return;
      }

      const rawDates: Option<string[]> = getRawDates(sem);
      const range: Option<string> = getDateRange(sem, term);

      if (!rawDates || !range) {
        resolve({});
        return;
      }

      const dates: string[] = datesInRange(rawDates, range);
      resolve(mapToWeeks(dates));
    });
  });
}
