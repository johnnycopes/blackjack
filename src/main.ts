import App from "./components/App.svelte";
import { EAppMode } from "./models/enums/app-mode.enum";

const app = new App({
	target: document.body,
	props: { mode: EAppMode.Prod }
});

export default app;