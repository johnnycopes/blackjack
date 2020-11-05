export async function wait(ms: number = 0): Promise<void> {
	return new Promise<void>((resolve): void => {
		setTimeout(resolve, ms);
	});
}

export function preloadImage(src: string): Promise<void> {
	return new Promise(resolve => {
		const image = new Image();
		image.addEventListener("load", () => resolve());
		image.addEventListener("error", () => resolve());
		image.setAttribute("src", src);
	})
}