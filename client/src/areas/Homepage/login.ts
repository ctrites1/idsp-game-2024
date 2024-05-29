export async function showLoginForm() {
  const body = document.querySelector("body") as HTMLBodyElement;
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
  username.type = "username";

  password.setAttribute("placeholder", "password");
  password.setAttribute("name", "password");
  password.type = "password";

  submit.type = "submit";
  submit.innerText = "Login";

  loginForm.appendChild(username);
  loginForm.appendChild(password);
  loginForm.appendChild(submit);
  formDiv.appendChild(loginForm);
  body.appendChild(formDiv);
}
