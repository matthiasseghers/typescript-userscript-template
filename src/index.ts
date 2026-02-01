import { log } from './utils';

/**
 * Main entry point for the userscript
 */
function main(): void {
  log('Hello from TypeScript Userscript!');
}

// Start the userscript
// Note: With @run-at document-end, the DOM is already loaded
main();
