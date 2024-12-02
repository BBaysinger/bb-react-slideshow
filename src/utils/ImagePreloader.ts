/**
 * Preload image utility. Each load occurs sequentially,
 * one at a time.
 * Each image completes loading before the next load starts.
 * Default rel is 'prefetch' (passive) to let the browser
 * prioritize elements onscreen.
 *
 * @author Bradley Baysinger
 * @since The beginning of time.
 * @version N/A
 */

class ImagePreloader {
  private images: string[];
  private loadedCount: number;
  private rel: string;

  constructor(images: string[], rel: string = "prefetch") {
    if (!Array.isArray(images) || images.length === 0) {
      throw new Error("Images must be a non-empty array.");
    }

    this.images = images;
    this.loadedCount = 0;
    this.rel = rel;
  }

  async preload(): Promise<void> {
    for (const image of this.images) {
      try {
        await this.preloadImage(image);
      } catch (error) {
        console.error(error);
      }
    }
  }

  private preloadImage(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const link = document.createElement("link");
      link.rel = this.rel;
      link.as = "image";
      link.href = url;
      document.head.appendChild(link);

      link.onload = () => {
        document.head.removeChild(link);
        this.loadedCount++;
        // console.info(`Loaded ${this.loadedCount}/${this.images.length}`);
        resolve();
      };

      link.onerror = () => {
        document.head.removeChild(link);
        console.error(`Failed to preload ${url}`);
        reject(new Error(`Failed to preload ${url}`));
      };
    });
  }
}

export default ImagePreloader;
