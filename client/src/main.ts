import { createHomepage } from "./areas/Homepage/homepage";
import {
	loginAsPlayer1,
	loginAsPlayer2,
	logout,
} from "./areas/Homepage/choosePlayer";

document.addEventListener("DOMContentLoaded", async () => {
	await createHomepage();
});
