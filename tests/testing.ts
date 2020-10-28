import userEvent, { TargetElement } from "@testing-library/user-event";
import { wait } from "../src/functions/utility";

export async function click(element: TargetElement): Promise<void> {
	userEvent.click(element);
	await wait();
}