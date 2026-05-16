/**
 * Example utility functions - add more as needed
 */

/**
 * Logs a message with a prefix
 */
export function log(message: string): void {
  console.log(`[UserScript] ${message}`);
}

/**
 * Polls for an element matching `selector` using requestAnimationFrame.
 * Resolves once found; rejects after `timeout` ms.
 */
export function waitForElement(selector: string, timeout = 5000): Promise<Element> {
  return new Promise<Element>((resolve, reject) => {
    const start = performance.now();

    function poll(): void {
      const el = document.querySelector(selector);
      if (el) {
        resolve(el);
        return;
      }
      if (performance.now() - start >= timeout) {
        reject(new Error(`waitForElement: element "${selector}" not found within ${timeout}ms`));
        return;
      }
      requestAnimationFrame(poll);
    }

    requestAnimationFrame(poll);
  });
}
