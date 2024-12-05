/**
 * A utility class for preloading images using the HTML `<link>`
 * element. Each load occurs sequentially, one at a time, each
 * completing loading before the next load starts.
 * Default rel is 'prefetch' (passive) to let the browser
 * prioritize onscreen elements.
 *
 * @author Bradley Baysinger
 * @since The beginning of time.
 * @version N/A
 */
class ImagePreloader {
  // Array of image URLs to preload
  private images: string[];
  // Counter for the number of successfully loaded images
  private loadedCount: number;
  // The `rel` attribute value for the `<link>` element (e.g., "prefetch" or "preload")
  private rel: string;

  /**
   * Initializes the ImagePreloader with a list of image URLs and a `rel` value.
   *
   * @param images - An array of image URLs to preload.
   * @param rel - The value for the `rel` attribute of the `<link>` element.
   * Defaults to "prefetch".
   * @throws If the `images` array is empty or not an array.
   */
  constructor(images: string[], rel: string = "prefetch") {
    if (!Array.isArray(images) || images.length === 0) {
      throw new Error("Images must be a non-empty array.");
    }

    this.images = images;
    this.loadedCount = 0;
    this.rel = rel;
  }

  /**
   * Starts preloading all images in the list.
   * Waits for each image to finish preloading before proceeding to the next.
   *
   * @returns A promise that resolves when all images have been preloaded, regardless of errors.
   */
  async preload(): Promise<void> {
    for (const image of this.images) {
      try {
        await this.preloadImage(image);
      } catch (error) {
        console.error(error); // Log any errors during preloading
      }
    }
  }

  /**
   * Preloads a single image using a `<link>` element.
   *
   * @param url - The URL of the image to preload.
   * @returns A promise that resolves when the image is successfully preloaded or rejects on failure.
   */
  private preloadImage(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Create a `<link>` element with the appropriate attributes
      const link = document.createElement("link");
      link.rel = this.rel;
      link.as = "image";
      link.href = url;

      // Append the `<link>` element to the document head
      document.head.appendChild(link);

      // Resolve the promise when the link loads successfully
      link.onload = () => {
        document.head.removeChild(link); // Clean up after the link is loaded
        this.loadedCount++;
        // console.info(`Loaded ${this.loadedCount}/${this.images.length}`); // Optional: Log progress
        resolve();
      };

      // Reject the promise if the link fails to load
      link.onerror = () => {
        document.head.removeChild(link); // Clean up even if loading fails
        console.error(`Failed to preload ${url}`); // Log the error
        reject(new Error(`Failed to preload ${url}`));
      };
    });
  }
}

export default ImagePreloader;
