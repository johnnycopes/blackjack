import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from "@testing-library/svelte";
import Button from "../../src/components/Button.svelte";

test("should render", () => {
	const button = render(Button);

	expect(button.getByText("Button").textContent).toEqual("Button");
});

test("click works", async () => {
	const button = render(Button);
	const buttonEl = button.getByText("Button");

	await fireEvent.click(buttonEl);

	expect(buttonEl.textContent).toEqual("Button Clicked");
});