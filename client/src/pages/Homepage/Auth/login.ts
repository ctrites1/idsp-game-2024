import { login } from "../choosePlayer";
import { createHomepage } from "../homepage";

const changeLogo = async () => {
  const logo = document.querySelector(".homepage-logo") as HTMLImageElement;
  if (!logo) {
    throw new Error("Failed to find the logo element.");
  }
  logo.classList.remove("homepage-logo");
  logo.classList.add("smaller-homepage-logo");
};

export const changeHomepage = async (name: string) => {
  let homepage = document.querySelector(".pseudo-homepage") as HTMLDivElement;
  if (!homepage) {
    await createHomepage();
    homepage = document.querySelector(".pseudo-homepage") as HTMLDivElement;
    if (!homepage) {
      throw new Error("Failed to create or find the homepage element.");
    }
  }
  homepage.classList.add(`${name}-homepage`);
  const authBtns = document.querySelector(
    ".auth-buttons-container"
  ) as HTMLDivElement;
  if (authBtns) {
    authBtns.remove();
  }

  await changeLogo();
};

export async function showLoginForm() {
  await changeHomepage("auth");

  const homepage = document.querySelector(".pseudo-homepage") as HTMLDivElement;
  const formDiv = document.createElement("div");
  formDiv.className = "login-form";

  const loginForm: HTMLFormElement = document.createElement("form");
  loginForm.method = "POST";
  loginForm.action = "/api/login";
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
  });

  const title: HTMLHeadingElement = document.createElement("h1");
  const errorDiv: HTMLDivElement = document.createElement("div");
  const username: HTMLInputElement = document.createElement("input");
  const password: HTMLInputElement = document.createElement("input");
  const submit: HTMLButtonElement = document.createElement("button");
  const registerNow: HTMLLinkElement = document.createElement("link");

  title.textContent = "Login";
  errorDiv.className = "error-message";
  errorDiv.style.display = "none";
  errorDiv.textContent = "Invalid password or username";

  username.setAttribute("placeholder", "username");
  username.setAttribute("name", "username");
  username.type = "text";

  password.setAttribute("placeholder", "password");
  password.setAttribute("name", "password");
  password.type = "password";

  registerNow.innerText ="Register Now";

  submit.innerText = "Login";
  submit.addEventListener("click", async (event) => {
    event.preventDefault();
    const inputUsername: string = username.value;
    const inputPassword: string = password.value;

    if (!inputUsername || !inputPassword) {
      errorDiv.style.display = "block";
      return;
    }

    const success = await login(inputUsername, inputPassword);
    if (!success) {
      errorDiv.style.display = "block";
    } else {
      errorDiv.style.display = "none";
    }
  });

  formDiv.appendChild(title);
  formDiv.appendChild(errorDiv);
  loginForm.appendChild(username);
  loginForm.appendChild(password);
  loginForm.appendChild(submit);
  formDiv.appendChild(loginForm);

  homepage.appendChild(formDiv);
}
