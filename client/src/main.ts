import { getCardData } from "./areas/Arena/Card";
import { createHomepage } from "./areas/Homepage/homepage";

document.addEventListener("DOMContentLoaded", async () => {
	await createHomepage();
	getCardData();
});

//* For demo, should refactor later - maybe not use class for footer for easier function calls?
const surrenderButton = document.querySelector(
	".surrender-button"
) as HTMLElement;
surrenderButton.addEventListener("click", () => {
	console.log("Surrender clicked");
	location.reload();
	// TODO: Logic to handle log viewing to be added here
});
