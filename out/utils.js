export function addButton(name, id, fn, sel) {
    const bar = document.querySelector(sel);
    const newHTML = `<a class="btn" tabindex="0" id="${id}">${name}</a>`;
    bar?.insertAdjacentHTML("afterbegin", newHTML);
    bar?.insertAdjacentHTML("afterbegin", "&nbsp;");
    const btn = document.querySelector(`#${id}`);
    btn?.addEventListener("click", fn, false);
}
export function clickButton(sel) {
    const element = document.querySelector(sel);
    const btn = element;
    btn?.click();
}
export function getChild(element, indices) {
    let cur = element;
    indices.forEach((i_) => {
        const children = cur?.children;
        const len = children.length;
        const i = i_ >= 0 ? i_ : len - 1;
        len > i ? (cur = children[i]) : null;
    });
    return cur;
}
export function indexOf(name, skip) {
    return moduleList().findIndex((m, i) => i >= skip && m.title.toLowerCase() === name.toLowerCase());
}
export function lenientName(name) {
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
export function log(msg) {
    console.log("[CCAU] " + msg);
}
export function moduleList() {
    const sel = ".collapse_module_link";
    const mods = Array.from(document.querySelectorAll(sel));
    return mods;
}
export function overrideConfirm() {
    const orig = window.confirm;
    window.confirm = function () {
        return true;
    };
    return orig;
}
export function restoreConfirm(orig) {
    window.confirm = orig;
}
