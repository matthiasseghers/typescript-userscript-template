import { log } from './utils';

/**
 * Main entry point for the userscript
 */
function main(): void {
  log('Hello from TypeScript Userscript!');
}

// Start the userscript when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}
