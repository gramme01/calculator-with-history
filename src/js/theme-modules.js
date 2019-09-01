const persistTheme = theme => {
	localStorage.setItem("theme", theme);
};

const themeInitializer = (element, control) => {
	const savedTheme = localStorage.getItem("theme")
		? localStorage.getItem("theme")
		: null;

	if (savedTheme) {
		element.setAttribute("data-theme", savedTheme);
		if (savedTheme === "light") {
			control.checked = true;
		}
	}
};

export { persistTheme, themeInitializer };
