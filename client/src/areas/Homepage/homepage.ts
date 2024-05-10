export async function createHomepage() {
	const html: HTMLElement = document.documentElement;
	const homepage: HTMLDivElement = document.createElement("div");

	homepage.className = "pseudo-homepage";

	const btn1: HTMLButtonElement = document.createElement("button");
	btn1.textContent = "Red";
	btn1.className = "red-btn";

	const btn2: HTMLButtonElement = document.createElement("button");
	btn2.textContent = "Blue";
	btn2.className = "blue-btn";

	homepage.appendChild(btn1);
	homepage.appendChild(btn2);
	html.appendChild(homepage);
}
