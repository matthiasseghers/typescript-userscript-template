# Migration Guide: Legacy Userscript to TypeScript Template

This guide walks you through migrating an existing userscript to the TypeScript template, transforming monolithic JavaScript into modular, typed, testable code.

## Why Migrate?

**Benefits:**
- 🎯 **Type Safety** - Catch errors at compile-time instead of runtime
- 📦 **Modularity** - Split code into focused, reusable modules
- 🧪 **Testability** - Write comprehensive tests with Jest
- 📚 **Maintainability** - Clear structure makes future changes easier
- 🔍 **IDE Support** - Full autocomplete and refactoring tools
- 🚀 **Modern Tooling** - ESLint, Prettier, CI/CD out of the box

**Trade-offs:**
- Initial time investment (varies by project size)
- Learning curve if new to TypeScript
- Build step required (no more direct editing)

## Prerequisites

- Basic TypeScript knowledge (or willingness to learn)
- Understanding of your original userscript's functionality
- Node.js 20+ and npm installed

## Migration Process

### Phase 1: Setup (30 minutes)

1. **Create project from template**
   ```bash
   # Use the template on GitHub or clone directly
   git clone https://github.com/yourusername/typescript-userscript-template.git my-userscript
   cd my-userscript
   npm install
   ```

2. **Configure metadata**
   
   Update `meta.json` with your userscript details:
   ```json
   {
     "name": "Your Userscript Name",
     "version": "1.0.0",
     "description": "...",
     "author": "Your Name",
     "match": ["https://example.com/*"],
     "grant": [],
     "run-at": "document-end"
   }
   ```

3. **Test the build**
   ```bash
   npm run build
   # Verify dist/userscript.user.js was created
   ```

### Phase 2: Analysis (1-2 hours)

Before writing code, analyze your legacy script:

1. **Identify major components**
   - What does the script do? (List main features)
   - What external libraries does it use? (@require)
   - What DOM elements does it interact with?
   - What GM APIs does it use? (Add to `grant` in meta.json)

2. **Map out data structures**
   - What data does the script work with?
   - What are the main data types?
   - What state is tracked?

3. **List functions and their purposes**
   - Group related functions together
   - Identify utility functions vs. core logic
   - Note dependencies between functions

**Example Analysis:**
```
Features:
- Parses training table from page
- Calculates optimal training sessions
- Displays results in custom UI
- Responds to user input

Data Types:
- Stats: { HP, MP, OFF, DEF, SPD, BRN }
- Training effects: { trainingName → stat gains }
- Results: { trainingName → session count }

External Dependencies:
- javascript-lp-solver (@require)

GM APIs Used:
- None (add any you use to grant array)
```

### Phase 3: Type Definitions (1-2 hours)

Start with TypeScript types - they guide the rest of the migration.

1. **Create domain types** (`src/types/training.ts`)
   ```typescript
   /**
    * Valid stat names in the game
    */
   export type StatName = 'HP' | 'MP' | 'OFF' | 'DEF' | 'SPD' | 'BRN';

   /**
    * Stats object containing all six stat values
    */
   export interface Stats {
     HP: number;
     MP: number;
     OFF: number;
     DEF: number;
     SPD: number;
     BRN: number;
   }

   /**
    * Result from optimization - either success or error
    */
   export type OptimizationResult = 
     | { [trainingName: string]: number }
     | { error: string };
   ```

2. **Add external library types** (`src/types/solver.d.ts`)
   ```typescript
   /**
    * Type definitions for external javascript-lp-solver library
    * loaded via @require
    */
   declare global {
     interface Window {
       solver: {
         Solve: (model: LPModel) => LPResult;
       };
     }
   }
   
   export interface LPModel {
     optimize: string;
     opType: 'min' | 'max';
     constraints: Record<string, { min?: number; max?: number }>;
     variables: Record<string, Record<string, number>>;
   }
   
   // ... etc
   ```

3. **Add asset types if needed** (`src/types/assets.d.ts`)
   ```typescript
   /**
    * Allow importing images as data URIs
    */
   declare module '*.gif' {
     const content: string;
     export default content;
   }
   ```

### Phase 4: Module Structure (2-4 hours)

Break your code into focused modules. Recommended order:

#### 1. Constants (`src/constants.ts`)
Extract magic strings and values:
```typescript
export const STAT_NAMES = ['HP', 'MP', 'OFF', 'DEF', 'SPD', 'BRN'] as const;

export const ELEMENT_IDS = {
  CALCULATE_BUTTON: 'calculateButton',
  MESSAGE_ROW: 'messageRow',
} as const;

export const MAX_VALUES = {
  HP: 9999,
  MP: 9999,
  OFF: 999,
  DEF: 999,
  SPD: 999,
  BRN: 999,
} as const;
```

#### 2. Utilities (`src/utils.ts`)
General-purpose helper functions:
```typescript
export function parseNumber(value: string): number {
  const num = parseInt(value, 10);
  return isNaN(num) ? 0 : num;
}

export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

export function log(message: string): void {
  console.log(`[Your Script] ${message}`);
}
```

#### 3. DOM Utilities (`src/dom-utils.ts`)
Type-safe DOM helpers:
```typescript
export function getElement<T extends HTMLElement>(selector: string): T | null {
  return document.querySelector<T>(selector);
}

export function getAllElements<T extends HTMLElement>(selector: string): T[] {
  return Array.from(document.querySelectorAll<T>(selector));
}
```

#### 4. State Management (`src/state.ts`)
Centralize application state:
```typescript
let currentStats: Stats = { HP: 0, MP: 0, OFF: 0, DEF: 0, SPD: 0, BRN: 0 };
let goalStats: Stats = { HP: 0, MP: 0, OFF: 0, DEF: 0, SPD: 0, BRN: 0 };
let results: OptimizationResult | null = null;

export function getCurrentStats(): Stats {
  return { ...currentStats };
}

export function setCurrentStats(stats: Partial<Stats>): void {
  currentStats = { ...currentStats, ...stats };
}

// ... similar for goalStats and results
```

#### 5. Core Logic (`src/optimizer.ts`, `src/parser.ts`, etc.)
Your main business logic, split by responsibility:
```typescript
// src/training-parser.ts
export function parseTrainingTable(): TrainingEffects | null {
  const table = findTrainingTable();
  if (!table) return null;
  
  // Parsing logic...
  return effects;
}

// src/optimizer.ts
export function calculateOptimalTraining(
  statDifference: Stats
): OptimizationResult {
  const trainingEffects = parseTrainingTable();
  if (!trainingEffects) return { error: 'Cannot parse training table' };
  
  // Optimization logic...
  return results;
}
```

#### 6. UI Components (`src/ui-renderer.ts`)
Create and update UI elements:
```typescript
export function createCustomTable(): HTMLDivElement {
  const container = document.createElement('div');
  // Build your UI...
  return container;
}

export function updateResults(results: OptimizationResult): void {
  // Update UI with results...
}
```

#### 7. Event Handlers (`src/event-handlers.ts`)
User interaction logic:
```typescript
export function attachEventListeners(): void {
  const button = document.querySelector('#calculateButton');
  button?.addEventListener('click', handleCalculate);
  
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('input', handleInputChange);
  });
}

function handleCalculate(): void {
  // Handle button click...
}
```

#### 8. Observers (`src/observers.ts`)
Monitor page changes:
```typescript
export function monitorTable(): void {
  const observer = new MutationObserver(() => {
    // React to changes...
  });
  
  observer.observe(targetElement, {
    childList: true,
    subtree: true,
  });
}
```

#### 9. Main Entry Point (`src/index.ts`)
Orchestrate everything:
```typescript
import { createCustomTable } from './ui-renderer';
import { attachEventListeners } from './event-handlers';
import { monitorTable } from './observers';

async function main(): Promise<void> {
  try {
    // Initialize UI
    createCustomTable();
    
    // Set up event handlers
    attachEventListeners();
    
    // Start monitoring
    monitorTable();
    
    log('Userscript initialized successfully');
  } catch (error) {
    console.error('Initialization failed:', error);
  }
}

main();
```

### Phase 5: Testing (2-4 hours)

Write tests as you build modules to ensure correctness.

1. **Install test dependencies** (already in template)
   ```bash
   npm install --save-dev jest @types/jest ts-jest @testing-library/dom jest-environment-jsdom
   ```

2. **Create test files** (`tests/*.test.ts`)
   ```typescript
   // tests/utils.test.ts
   import { parseNumber, debounce } from '../src/utils';

   describe('parseNumber', () => {
     test('should parse valid integers', () => {
       expect(parseNumber('123')).toBe(123);
       expect(parseNumber('0')).toBe(0);
     });

     test('should return 0 for invalid input', () => {
       expect(parseNumber('abc')).toBe(0);
       expect(parseNumber('')).toBe(0);
     });
   });
   ```

3. **Mock external dependencies**
   ```typescript
   // tests/setup.ts
   (global as any).window = global;
   if (typeof window !== 'undefined') {
     (window as any).solver = {
       Solve: jest.fn(),
     };
   }
   ```

4. **Test with realistic data**
   ```typescript
   // tests/integration.test.ts
   test('HP 1000 should require 13 training sessions', () => {
     const result = calculateOptimalTraining({ HP: 1000, ... });
     expect(result).toEqual({ HP: 13 });
   });
   ```

5. **Run tests**
   ```bash
   npm test
   npm run test:coverage  # Check coverage
   ```

### Phase 6: Validation & Deployment (1 hour)

1. **Run all checks**
   ```bash
   npm run validate
   # Runs: lint, format, type-check, tests, build
   ```

2. **Test in browser**
   - Copy `dist/userscript.user.js` to Tampermonkey
   - Verify all features work
   - Check browser console for errors

3. **Compare with original**
   - Test the same scenarios in both versions
   - Ensure behavior is identical (or improved)

4. **Update documentation**
   - Update README.md with project-specific info
   - Document any changes from original behavior
   - Add usage examples

5. **Commit and deploy**
   ```bash
   git add .
   git commit -m "feat: migrate to TypeScript"
   git push
   # GitHub Actions will build and deploy automatically
   ```

## Common Patterns

### Pattern 1: Converting Global Variables to State

**Before:**
```javascript
var currentHP = 0;
var goalHP = 0;
var results = null;
```

**After:**
```typescript
// src/state.ts
let currentStats: Stats = { HP: 0, ... };
let goalStats: Stats = { HP: 0, ... };
let results: OptimizationResult | null = null;

export function setCurrentStats(stats: Partial<Stats>): void {
  currentStats = { ...currentStats, ...stats };
}
```

### Pattern 2: Breaking Down Large Functions

**Before:**
```javascript
function doEverything() {
  // 200 lines of mixed concerns
  parseTable();
  calculateResults();
  updateUI();
  handleErrors();
}
```

**After:**
```typescript
// src/training-parser.ts
export function parseTrainingTable(): TrainingEffects | null { ... }

// src/optimizer.ts
export function calculateOptimalTraining(...): OptimizationResult { ... }

// src/ui-renderer.ts
export function updateResults(results: OptimizationResult): void { ... }

// src/index.ts
function main() {
  const effects = parseTrainingTable();
  const results = calculateOptimalTraining(effects);
  updateResults(results);
}
```

### Pattern 3: Type-Safe Event Handlers

**Before:**
```javascript
input.addEventListener('input', function(e) {
  var value = e.target.value;  // Any type
  // ...
});
```

**After:**
```typescript
function handleInput(event: Event): void {
  const input = event.target as HTMLInputElement;
  const value = parseNumber(input.value);  // Type-safe
  const stat = input.dataset.stat as StatName;
  // ...
}
```

### Pattern 4: External Library Integration

**Before:**
```javascript
// @require https://unpkg.com/some-library/dist/library.js
// Library available as global, no types

var result = LibraryGlobal.method(data);
```

**After:**
```typescript
// meta.json: add to "require" array
// src/types/library.d.ts
declare global {
  interface Window {
    LibraryGlobal: {
      method(data: SomeType): ResultType;
    };
  }
}

// Now fully typed!
const result = window.LibraryGlobal.method(data);
```

## Tips & Gotchas

### Tree-Shaking
❌ **Won't work** - unused export is removed:
```typescript
// src/ui-renderer.ts
export function createLoadingOverlay() { ... }

// src/index.ts
import { createLoadingOverlay } from './ui-renderer';
// Never call it - gets tree-shaken!
```

✅ **Will work** - export is used:
```typescript
// src/index.ts
const overlay = createLoadingOverlay();  // Called!
document.body.appendChild(overlay);
```

### Asset Handling
For images, CSS, or other assets:

1. Create type definition:
   ```typescript
   // src/types/assets.d.ts
   declare module '*.gif' {
     const content: string;
     export default content;
   }
   ```

2. Import in code:
   ```typescript
   import loadingGif from './assets/loading.gif';
   // Rollup converts to base64 data URI
   ```

3. Configure Rollup:
   ```javascript
   // rollup.config.js
   import image from '@rollup/plugin-image';
   
   plugins: [image()]
   ```

### Debugging with Sourcemaps

Development builds include inline sourcemaps:
```bash
npm run dev  # Watch mode with sourcemaps
```

In browser DevTools:
- See original TypeScript file names
- Set breakpoints in TypeScript code
- Step through your actual source code

Production builds exclude sourcemaps for smaller size:
```bash
npm run build  # No sourcemaps
```

### Performance Considerations

**Debouncing expensive operations:**
```typescript
// Prevent calculation on every keystroke
const debouncedCalculate = debounce(calculate, 300);
input.addEventListener('input', debouncedCalculate);
```

**Loading indicators:**
```typescript
function calculate() {
  showLoading(true);
  
  setTimeout(() => {
    // Do expensive work
    const result = optimizer.calculate();
    updateUI(result);
    showLoading(false);
  }, 100);  // Give UI time to update
}
```

### Common Mistakes

1. **Forgetting to call exports** → Tree-shaking removes them
2. **Not adding GM APIs to grant** → Functions won't work
3. **Missing external library types** → No autocomplete
4. **Not testing in browser** → Surprises after migration
5. **Trying to do everything at once** → Incremental is better

## Incremental Migration Strategy

Don't feel you need to migrate everything at once. You can:

1. **Start with utilities**
   - Move helper functions to TypeScript
   - Add types gradually
   - Keep main logic in original script

2. **One feature at a time**
   - Migrate one feature completely
   - Test it works
   - Move to next feature

3. **Keep both versions**
   - Maintain legacy script during transition
   - Users can switch back if needed
   - Remove old version once confident

## Getting Help

- **TypeScript errors:** Check [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- **Jest testing:** See [Jest Documentation](https://jestjs.io/docs/getting-started)
- **Template issues:** Open issue on template repository
- **Migration questions:** Look at the example project or ask in discussions

## Conclusion

Migrating to TypeScript requires upfront effort but pays dividends:
- Catch bugs before they reach users
- Easier to maintain and extend
- Better IDE support and refactoring
- Comprehensive testing gives confidence
- Modern development workflow

The key is taking it step-by-step: types → modules → tests → validation.

Good luck with your migration! 🚀
