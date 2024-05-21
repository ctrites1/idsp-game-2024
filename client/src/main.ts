import { routes } from "../src/pages/routing";

document.addEventListener("DOMContentLoaded", async () => {
	try {
		const navigateTo = (url: string) => {
			history.pushState(null, "", url);
			router();
		};

		const router = async () => {
			const path = location.pathname;
			const route = routes[path] || routes[404];

			document.title = route.title;
			await route.handler();
		};

		window.addEventListener("popstate", router);

		document.body.addEventListener("click", (e) => {
			const target = e.target as HTMLAnchorElement;
			if (target.matches("[data-link]")) {
				e.preventDefault();
				navigateTo(target.href);
			}
		});

		router();
	} catch (error) {
		console.error("Error during page initialization:", error);
	}
});
