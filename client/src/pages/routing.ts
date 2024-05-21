import { createArenaPage } from "./Arena/mainArena";
import { createHomepage } from "./Homepage/homepage";
import { create404Page } from "./Error/404";

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
		title: "Home",
		handler: createHomepage,
	},
	"/arena": {
		title: "Arena",
		handler: createArenaPage,
	},
	// "/login": { title: "Login", },
	// "/register": { title: "Register" },
};
