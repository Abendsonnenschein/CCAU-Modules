import * as u from "../utils";
import { Option } from "../option";

function createModal(div: HTMLDivElement): HTMLDivElement {
  const container: HTMLDivElement = document.createElement("div");

  container.className = "ccau_modal";
  container.style.position = "fixed";
  container.style.top = "0";
  container.style.left = "0";
  container.style.width = "100%";
  container.style.height = "100%";
  container.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  container.style.display = "flex";
  container.style.justifyContent = "center";
  container.style.alignItems = "center";
  container.style.zIndex = "1000";

  document.body.appendChild(container);

  const content: HTMLDivElement = document.createElement("div");

  content.className = "ccau_modal_content";
  content.style.backgroundColor = "white";
  content.style.padding = "20px";
  content.style.borderRadius = "20px";
  content.style.textAlign = "center";
  content.style.border = "1px solid black";

  container.appendChild(content);
  content.appendChild(div);

  return container;
}

function termButtons(semester: string): HTMLButtonElement[] {
  const cached: string = localStorage.getItem("ccau_data") ?? "{}";
  const data = JSON.parse(cached);
  const terms: string[] = Object.keys(data["ranges"][semester]);

  return terms.map((term) => {
    const button: HTMLButtonElement = document.createElement("button");

    button.textContent = term;
    button.classList.add("ccau_term_button");
    button.classList.add("btn");

    return button;
  });
}

function replaceButtons(semester: string): void {
  const sel: string = ".ccau_semester_button";
  const buttons: Element[] = Array.from(document.querySelectorAll(sel));

  buttons.forEach((button) => button.remove());

  const newButtons: HTMLButtonElement[] = termButtons(semester);
  const modal: Option<Element> = document.querySelector(".ccau_modal_content");

  if (!modal) {
    u.log("Can't add buttons to null modal.");
    return;
  }

  newButtons.forEach((button) => modal.appendChild(button));
}

function semesterButtons(): HTMLButtonElement[] {
  const cached: string = localStorage.getItem("ccau_data") ?? "{}";
  const data = JSON.parse(cached);
  const semesters: string[] = Object.keys(data["dates"]);

  return semesters.map((sem) => {
    const button: HTMLButtonElement = document.createElement("button");

    button.textContent = sem;
    button.classList.add("ccau_semester_button");
    button.classList.add("btn");

    return button;
  });
}

export async function showModal(): Promise<[Option<string>, Option<string>]> {
  return new Promise((resolve) => {
    const div: HTMLDivElement = document.createElement("div");
    const buttons: HTMLButtonElement[] = semesterButtons();
    const label: HTMLDivElement = document.createElement("div");

    label.textContent = "Which semester is this course?";
    div.appendChild(label);

    let semester: Option<string> = null;
    let term: Option<string> = null;

    const termHandler = (btn: HTMLButtonElement) => {
      btn.addEventListener("click", () => {
        term = btn.textContent;
        resolve([semester, term]);
        modal.remove();
      });
    };

    const semHandler = (btn: HTMLButtonElement) => {
      btn.addEventListener("click", () => {
        semester = btn.textContent;
        replaceButtons(semester || "");

        const termButtons: HTMLButtonElement[] = Array.from(
          document.querySelectorAll(".ccau_term_button"),
        );

        termButtons.forEach(termHandler);
      });

      div.appendChild(btn);
    };

    buttons.forEach(semHandler);
    const modal = createModal(div);
  });
}
