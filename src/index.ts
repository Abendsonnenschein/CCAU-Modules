import { dateButton } from "./date_headers/add";
import { deleteButton } from "./modules/del";
import { moveButton } from "./modules/mov";
import { log } from "./utils";

if (document.querySelector("#global_nav_accounts_link") !== null) {
  dateButton();
  deleteButton();
  moveButton();

  log("Initialisation complete.");
} else {
  log("Only admins can use this script.");
}
