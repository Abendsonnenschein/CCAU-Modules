// ==UserScript==
// @name        CCAU - Modules Section
// @namespace   CCAU Suite
// @description Automate course copies
// @match       https://*.instructure.com/courses/*/modules
// @version     0.2.4
// @author      Abendsonnenschein
// @icon        https://du11hjcvx0uqb.cloudfront.net/br/dist/images/favicon-e10d657a73.ico
// @grant       none
// @license     AGPL-3.-or-later
// ==/UserScript==
(() => {
  // out/utils.js
  function addButton(name, id, fn, sel) {
    const bar = document.querySelector(sel);
    const newHTML = `<a class="btn" tabindex="0" id="${id}">${name}</a>`;
    bar?.insertAdjacentHTML("afterbegin", newHTML);
    bar?.insertAdjacentHTML("afterbegin", "&nbsp;");
    const btn = document.querySelector(`#${id}`);
    btn?.addEventListener("click", fn, false);
  }
  function clickButton(sel) {
    const element = document.querySelector(sel);
    const btn = element;
    btn?.click();
  }
  function getChild(element, indices) {
    let cur = element;
    indices.forEach((i_) => {
      const children = cur?.children;
      const len = children.length;
      const i = i_ >= 0 ? i_ : len - 1;
      len > i ? cur = children[i] : null;
    });
    return cur;
  }
  function indexOf(name, skip) {
    return moduleList().findIndex((m, i) => i >= skip && m.title.toLowerCase() === name.toLowerCase());
  }
  function lenientName(name) {
    const ln = name.toLowerCase();
    const stdFmt = /^(week|module|unit) \d{1,2}$/;
    const colFmt = /^(week|module|unit) \d{1,2}:/;
    if (ln === "start here") {
      return "START HERE";
    }
    if (stdFmt.test(ln)) {
      return ln.replace(ln.split(" ")[0], "Week");
    }
    if (colFmt.test(ln)) {
      return ln.split(":")[0].replace(ln.split(" ")[0], "Week");
    }
    return null;
  }
  function log(msg) {
    console.log("[CCAU] " + msg);
  }
  function moduleList() {
    const sel = ".collapse_module_link";
    const mods = Array.from(document.querySelectorAll(sel));
    return mods;
  }
  function overrideConfirm() {
    const orig = window.confirm;
    window.confirm = function() {
      return true;
    };
    return orig;
  }
  function restoreConfirm(orig) {
    window.confirm = orig;
  }

  // out/date_headers/utils.js
  function actOnDates(idc, fn) {
    const rows = document.querySelectorAll(".ig-row");
    const len = rows.length;
    for (let i = 0; i < len; i++) {
      const rowItem = rows[i];
      const label = getChild(rowItem, [2, 0]);
      const btn = getChild(rowItem, idc);
      const nm = label?.innerText || "";
      const rgx = /^\*[a-z]{3,12} \d{1,2} - [a-z]{0,12} ?\d{1,2}\*$/;
      if (!rgx.test(nm.toLowerCase())) {
        continue;
      }
      btn?.click();
      fn(nm);
    }
  }

  // out/date_headers/del.js
  function clickDelete(nm) {
    log(`Removing date header: ${nm}`);
    const nodes = document.querySelectorAll(".ui-kyle-menu");
    const menus = Array.from(nodes);
    const len = menus.length;
    for (let i = 0; i < len; i++) {
      if (menus[i].getAttribute("aria-hidden") !== "false") {
        continue;
      }
      const menuItem = menus[i];
      const miLen = menuItem.children.length;
      const btn = getChild(menuItem, [miLen - 1, 0]);
      btn?.click();
    }
  }
  function removeOldDates() {
    const orig = overrideConfirm();
    actOnDates([3, 2, 1, -1, 0], clickDelete);
    restoreConfirm(orig);
  }

  // out/date_headers/update.js
  function autoupdate() {
    const week = 6048e5;
    const now = Date.now();
    const last = Number(localStorage.getItem("ccau-updated")) ?? 0;
    const url = "https://raw.githubusercontent.com/Abendsonnenschein/CCAU-Modules/main/dates.json";
    if (now - last < week) {
      log("To force an update, clear localStorage and refresh the page.");
      return;
    }
    fetch(url).then((response) => response.json()).then((data) => {
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
  function getDates() {
    autoupdate();
    const cached = localStorage.getItem("ccau-dates") ?? "{}";
    const dates = JSON.parse(cached);
    const msg = `Please enter the term for which you would like to add dates.
    Valid terms are 1, 1B, 2, 2B, 3, 3B.
    1 = Spring, 2 = Summer, 3 = Fall`;
    const term = prompt(msg, "") ?? "";
    if (/^[123]B?$/.exec(term) === null) {
      log("Invalid term entered.");
      return {};
    }
    const semester = parseInt(term[0], 10);
    const isB = term.length === 2;
    const semDates = dates[resolveSemester(semester)];
    const start = isB ? 8 : 0;
    const dict = {};
    if (!semDates) {
      log("No dates found for this semester.");
      return {};
    }
    for (let i = 0; i < semDates.length; i++) {
      dict[`Week ${i + 1}`] = semDates[start + i];
    }
    return dict;
  }

  // out/date_headers/add.js
  function defaultToSubheader() {
    const sel = "#add_module_item_select";
    const element = document.querySelector(sel);
    const select = element;
    const options = Array.from(select.options);
    options?.forEach((opt) => opt.value = "context_module_sub_header");
  }
  function publish() {
    actOnDates([3, 1, 0], (nm) => {
      log(`Publishing ${nm}`);
    });
  }
  function openMenu(name, btnIdx, label) {
    const mods = moduleList();
    const idx = indexOf(name, 0);
    const hpe = mods[idx].parentElement;
    const btn = getChild(hpe, [5, 0, btnIdx]);
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
    const mods = moduleList();
    let endIdx = indexOf("START HERE", 1);
    if (endIdx === -1) {
      log("Course not detected as a copy, updating all modules.");
      endIdx = mods.length;
    }
    for (let i = 0; i < endIdx; i++) {
      const title = mods[i].title;
      const name = lenientName(title);
      if (!name) {
        log(`${title} has an invalid name.`);
        continue;
      }
      if (!dates[name]) {
        log(`No date found for ${name}`);
        continue;
      }
      openMenu(title, 2, "Add Content");
      setInput("#sub_header_title", dates[name]);
      clickButton(".add_item_button");
    }
    setTimeout(publish, 1500);
  }
  function dateButton() {
    addButton("Add Dates", "ccau-dates", addDates, ".header-bar-right__buttons");
  }

  // out/index.js
  dateButton();
})();
