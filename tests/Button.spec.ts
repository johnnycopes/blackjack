import { render } from "@testing-library/svelte";
import Button from "../src/Button.svelte";

test("should render", () => {
	const results = render(Button, { props: { name: "World" } });

	expect(() => results.getByText("Hello World!")).not.toThrow();
});