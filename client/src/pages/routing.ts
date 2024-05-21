import { createArenaPage } from "./Arena/mainArena";
import { createHomepage } from "./Homepage/homepage";
import { create404Page } from "./Error/404";
import { createLoginPage } from "./Auth/login";
import { createRegistrationPage } from "./Auth/register";
interface Route {
	title: string;
	handler: () => Promise<void>;
}

export const routes: { [key: string]: Route } = {
	404: {
		title: "404 Page Not Found",
		handler: create404Page,
	},
	"/home": {
		title: "ACG| A Card Game",
		handler: createHomepage,
	},
	"/arena": {
		title: "ACG| Arena",
		handler: createArenaPage,
	},
	"/login": {
		title: "Login to ACG!",
		handler: createLoginPage,
	},
	"/register": {
		title: "Register new Player!",
		handler: createRegistrationPage,
	},
};
