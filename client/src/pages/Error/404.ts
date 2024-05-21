export const create404Page = async () => {
	const body = document.querySelector("body") as HTMLBodyElement;
	const errorPage = document.createElement("div");
	errorPage.className = "Error-404";

	const heading = document.createElement("h1") as HTMLHeadingElement;
	heading.innerText = "Error: 404 Page Not Found";

	errorPage.appendChild(heading);
	body.appendChild(errorPage);
};

export const remove404Page = () => {
	const errorPage = document.querySelector(".404");
	errorPage?.remove();
};
