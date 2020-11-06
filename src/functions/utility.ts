export async function wait(ms: number = 0): Promise<void> {
	return new Promise<void>((resolve): void => {
		setTimeout(resolve, ms);
	});
}

export async function preloadImage(src: string): Promise<string> {
	const response = await fetch(src);
	const blob = await response.blob();
	return URL.createObjectURL(blob);
}