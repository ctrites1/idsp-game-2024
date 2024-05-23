import { changeHomepage } from "./login";

export async function createRegistrationPage() {
	await changeHomepage("auth");
	const homepage = document.querySelector(".pseudo-homepage") as HTMLDivElement;
	const formDiv = document.createElement("div");
	formDiv.className = "register-form";

	const registerForm: HTMLFormElement = document.createElement("form");
	registerForm.method = "POST";
	registerForm.action = "/api/register";

	const title: HTMLHeadingElement = document.createElement("h1");
	const username: HTMLInputElement = document.createElement("input");
	const password: HTMLInputElement = document.createElement("input");
	const email: HTMLInputElement = document.createElement("input");
	const submit: HTMLButtonElement = document.createElement("button");

	title.textContent = "Register New User";

	username.setAttribute("placeholder", "username");
	username.setAttribute("name", "username");
	username.type = "username";

	password.setAttribute("placeholder", "password");
	password.setAttribute("name", "password");
	password.type = "password";

	/*         
	<button type="button" id="togglePassword">
    <i id="toggleIcon" class="fas fa-eye"></i>
    </button> 
	*/

	email.setAttribute("placeholder", "email");
	email.setAttribute("name", "email");
	email.type = "email";

	submit.type = "submit";
	submit.innerText = "Register";

	registerForm.appendChild(username);
	registerForm.appendChild(password);
	registerForm.appendChild(email);
	registerForm.appendChild(submit);
	formDiv.appendChild(title);
	formDiv.appendChild(registerForm);
	homepage.appendChild(formDiv);
}
