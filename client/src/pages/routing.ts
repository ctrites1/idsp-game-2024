import { createArenaPage } from "./Arena/mainArena";
import { createHomepage } from "./Homepage/homepage";
import { create404Page } from "./Error/404";
import { showLoginForm } from "./Homepage/Auth/login";
import { createRegistrationPage } from "./Homepage/Auth/register";
interface Route {
	title: string;
	handler: () => Promise<void>;
}

export const routes: { [key: string]: Route } = {
	404: {
		title: "404 Page Not Found",
		handler: create404Page,
	},
	"/": {
		title: "ACG| A Card Game",
		handler: createHomepage,
	},
	"/arena": {
		title: "ACG| Arena",
		handler: createArenaPage,
	},
	"/login": {
		title: "Login to ACG!",
		handler: showLoginForm,
	},
	"/register": {
		title: "Register new Player!",
		handler: createRegistrationPage,
	},
};

export const router = async () => {
	const path = location.pathname;
	const route = routes[path] || routes[404];

	document.title = route.title;
	await route.handler();
};

export const addRouteToBtn = async (
	button: HTMLButtonElement,
	path: string
) => {
	button.addEventListener("click", async () => {
		try {
			history.pushState(null, "", path);
			await router();
		} catch (err) {
			console.error(err);
		}
	});
};