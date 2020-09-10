export async function wait(ms: number): Promise<void> {
	return new Promise<void>((resolve): void => {
		setTimeout(resolve, ms);
	});
}