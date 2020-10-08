export async function wait(ms: number = 0): Promise<void> {
	return new Promise<void>((resolve): void => {
		setTimeout(resolve, ms);
	});
}