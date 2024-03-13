import * as u from "../utils";
function autoupdate() {
    const week = 0x240c8400;
    const now = Date.now();
    const last = Number(localStorage.getItem("ccau-updated")) ?? 0;
    const url = "https://raw.githubusercontent.com/Abendsonnenschein/CCAU-Modules/main/dates.json";
    if (now - last < week) {
        u.log("To force an update, clear localStorage and refresh the page.");
        return;
    }
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
        localStorage.setItem("ccau-dates", JSON.stringify(data));
        localStorage.setItem("ccau-updated", now.toString());
    });
}
function resolveSemester(semester) {
    switch (semester) {
        case 1:
            return "Spring";
        case 2:
            return "Summer";
        case 3:
            return "Fall";
        default:
            return "Winter";
    }
}
export function getDates() {
    autoupdate();
    const cached = localStorage.getItem("ccau-dates") ?? "{}";
    const dates = JSON.parse(cached);
    const msg = `Please enter the term for which you would like to add dates.
    Valid terms are 1, 1B, 2, 2B, 3, 3B.
    1 = Spring, 2 = Summer, 3 = Fall`;
    const term = prompt(msg, "") ?? "";
    if (/^[123]B?$/.exec(term) === null) {
        u.log("Invalid term entered.");
        return {};
    }
    const semester = parseInt(term[0], 10);
    const isB = term.length === 2;
    const semDates = dates[resolveSemester(semester)];
    const start = isB ? 8 : 0;
    const dict = {};
    if (!semDates) {
        u.log("No dates found for this semester.");
        return {};
    }
    for (let i = 0; i < semDates.length; i++) {
        dict[`Week ${i + 1}`] = semDates[start + i];
    }
    return dict;
}
