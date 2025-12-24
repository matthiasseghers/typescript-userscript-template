/**
 * Example utility functions - add more as needed
 */

/**
 * Logs a message with a prefix
 */
export function log(message: string): void {
  console.log(`[UserScript] ${message}`);
}

// /**
//  * Waits for an element to appear in the DOM
//  */
// export function waitForElement(selector: string, timeout = 5000): Promise<Element> {
//   return new Promise((resolve, reject) => {
//     const startTime = Date.now();
//     const checkElement = () => {
//       const element = document.querySelector(selector);
//       if (element) {
//         resolve(element);
//       } else if (Date.now() - startTime > timeout) {
//         reject(new Error(`Timeout waiting for element: ${selector}`));
//       } else {
//         setTimeout(checkElement, 100);
//       }
//     };
//     checkElement();
//   });
// }

// /**
//  * Add CSS styles using GM_addStyle
//  */
// export function addStyles(css: string): void {
//   GM_addStyle(css);
// }
