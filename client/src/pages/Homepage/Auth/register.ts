export async function createRegistrationPage() {
	const body = document.querySelector("body") as HTMLBodyElement;
	const formDiv = document.createElement("div");
	formDiv.className = "register-form";

	const registerForm: HTMLFormElement = document.createElement("form");
	registerForm.method = "POST";
	registerForm.action = "/api/register";

	const username: HTMLInputElement = document.createElement("input");
	const password: HTMLInputElement = document.createElement("input");
	const email: HTMLInputElement = document.createElement("input");
	const submit: HTMLButtonElement = document.createElement("button");

	username.setAttribute("placeholder", "username");
	username.setAttribute("name", "username");
	username.type = "username";

	password.setAttribute("placeholder", "password");
	password.setAttribute("name", "password");
	password.type = "password";

	email.setAttribute("placeholder", "email");
	email.setAttribute("name", "email");
	email.type = "email";

	submit.type = "submit";
	submit.innerText = "Login";

	registerForm.appendChild(username);
	registerForm.appendChild(password);
	registerForm.appendChild(email);
	registerForm.appendChild(submit);
	formDiv.appendChild(registerForm);
	body.appendChild(formDiv);
}
