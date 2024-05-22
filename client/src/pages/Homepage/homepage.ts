export async function createHomepage() {
	const body = document.querySelector("body") as HTMLBodyElement;
	const errorPage = document.querySelector(".Error-404");
	if (errorPage) {
		errorPage.remove();
	}

	const homepage: HTMLDivElement = document.createElement("div");

	homepage.className = "pseudo-homepage";

	const logoImg: HTMLImageElement = document.createElement("img");
	logoImg.src = "./assets/Logos/logooo.svg";
	logoImg.alt = "Game Logo";
	logoImg.className = "homepage-logo";

	/* ----------------------------- 2 Main Buttons ----------------------------- */
	const loginBtn: HTMLButtonElement = document.createElement("button");
	loginBtn.className = "auth-button login-btn";

	const registerBtn: HTMLButtonElement = document.createElement("button");
	registerBtn.className = "auth-button register-btn";

	const loginImg: HTMLImageElement = document.createElement("img");
	const registerImg: HTMLImageElement = document.createElement("img");

	const loginLabel: HTMLHeadingElement = document.createElement("h1");
	const registerLabel: HTMLHeadingElement = document.createElement("h1");
	loginLabel.textContent = "Login";
	registerLabel.textContent = "Register";

	loginBtn.appendChild(loginImg);
	loginBtn.appendChild(loginLabel);
	registerBtn.appendChild(registerImg);
	registerBtn.appendChild(registerLabel);

	const authBtnDiv: HTMLDivElement = document.createElement("div");
	authBtnDiv.className = "auth-buttons-container";

	loginBtn.addEventListener("click", async () => {
		try {
			window.location.href = "/login";
		} catch (err) {
			console.error(err);
		}
	});
	registerBtn.addEventListener("click", async () => {
		try {
			window.location.href = "/register";
		} catch (err) {
			console.error(err);
		}
	});
	/* ------------------------------------ * ----------------------------------- */

	authBtnDiv.appendChild(loginBtn);
	authBtnDiv.appendChild(registerBtn);

	homepage.appendChild(logoImg);
	homepage.appendChild(authBtnDiv);

	const blurDiv: HTMLDivElement = document.createElement("div");
	blurDiv.className = "blur";
	homepage.appendChild(blurDiv);

	body.appendChild(homepage);
}

export async function removeHomepage() {
	const homepage = document.querySelector(".pseudo-homepage");
    if (!homepage) {
        throw new Error("Failed to create or find the homepage element.");
    }
    homepage.remove();
}
