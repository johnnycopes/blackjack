import App from "./components/App.svelte";
import { appConfig } from "./config/app-config";

const app = new App({
	target: document.body,
	props: { mode: appConfig.mode }
});

export default app;