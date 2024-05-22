import { router } from "../src/pages/routing";

document.addEventListener("DOMContentLoaded", async () => {
	try {
		window.addEventListener("popstate", router);
		await router();
	} catch (error) {
		console.error("Error during page initialization:", error);
	}
});
