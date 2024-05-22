import { createHomepage } from "../homepage";

const changeLogo = async () => {
	const logo = document.querySelector(".homepage-logo") as HTMLImageElement;
	if (!logo) {
		throw new Error("Failed to find the logo element.");
	}
	logo.classList.remove("homepage-logo");
	logo.classList.add("smaller-homepage-logo");
};

const changeHomepage = async () => {
	let homepage = document.querySelector(".pseudo-homepage") as HTMLDivElement;
	if (!homepage) {
		await createHomepage();
		homepage = document.querySelector(".pseudo-homepage") as HTMLDivElement;
		if (!homepage) {
			throw new Error("Failed to create or find the homepage element.");
		}
	}
	homepage.classList.add("login-homepage");
	const authBtns = document.querySelector(
		".auth-buttons-container"
	) as HTMLDivElement;
	if (authBtns) {
		authBtns.remove();
	}

	await changeLogo();
};

export async function showLoginForm() {
	await changeHomepage();

	const homepage = document.querySelector(".pseudo-homepage") as HTMLDivElement;
	const formDiv = document.createElement("div");
	formDiv.className = "login-form";

	const loginForm: HTMLFormElement = document.createElement("form");
	loginForm.method = "POST";
	loginForm.action = "/api/login";

	const username: HTMLInputElement = document.createElement("input");
	const password: HTMLInputElement = document.createElement("input");
	const submit: HTMLButtonElement = document.createElement("button");

	username.setAttribute("placeholder", "username");
	username.setAttribute("name", "username");
	username.type = "text";

	password.setAttribute("placeholder", "password");
	password.setAttribute("name", "password");
	password.type = "password";

	submit.type = "submit";
	submit.innerText = "Login";

	loginForm.appendChild(username);
	loginForm.appendChild(password);
	loginForm.appendChild(submit);
	formDiv.appendChild(loginForm);

	homepage.appendChild(formDiv);
}
