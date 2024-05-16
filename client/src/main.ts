import { createHomepage } from "./areas/Homepage/homepage";

document.addEventListener("DOMContentLoaded", async () => {
	try {
		await createHomepage();
	} catch (error) {
		console.error("Error during page initialization:", error);
	}
});
