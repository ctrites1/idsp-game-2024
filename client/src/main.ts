import { router } from "../src/pages/routing";

document.addEventListener("DOMContentLoaded", async () => {
	window.addEventListener("popstate", async () => {
		await router();
	});

	await router();
});
