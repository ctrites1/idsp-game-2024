import { getCardData } from "./areas/Arena/cardArena";
import { createHomepage } from "./areas/Homepage/homepage";

document.addEventListener("DOMContentLoaded", async () => {
	await createHomepage();
	getCardData();
});
