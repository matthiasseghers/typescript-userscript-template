// ==UserScript==
// @name        My TypeScript Userscript
// @description A userscript built with TypeScript
// @namespace   https://github.com/yourusername
// @version     1.0.0
// @author      Your Name
// @match       https://example.com/*
// @run-at      document-end
// @grant       GM_addStyle
// ==/UserScript==
(function () {
    'use strict';

    /**
     * Example utility functions - add more as needed
     */
    /**
     * Logs a message with a prefix
     */
    function log(message) {
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

    /**
     * Main entry point for the userscript
     */
    function main() {
        log('Hello from TypeScript Userscript!');
    }
    // Start the userscript
    // Note: With @run-at document-end, the DOM is already loaded
    main();

})();
