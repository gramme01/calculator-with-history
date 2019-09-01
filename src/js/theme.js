import { persistTheme, themeInitializer } from "./theme-modules";

export default function themeHandler() {
	const app = document.documentElement;
	const themeSwitch = document.getElementsByClassName(
		"theme-toggler__checkbox"
	)[0];

	themeInitializer(app, themeSwitch);
	const toggleTheme = e => {
		if (e.target.checked) {
			app.setAttribute("data-theme", "light");
			persistTheme("light");
		} else {
			app.setAttribute("data-theme", "dark");
			persistTheme("dark");
		}
	};

	themeSwitch.addEventListener("change", toggleTheme, false);
}
