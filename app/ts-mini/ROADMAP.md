# TypeScript Compiler Visualizer - Roadmap

This document outlines planned improvements and features for the interactive TypeScript compiler demonstration.

## High Priority Features

### 1. Editable Code Panel

**Goal**: Allow users to input their own TypeScript code and see how it compiles through each stage.

**Implementation Plan**:
- Add a `<textarea>` or Monaco Editor component above the visualizer
- Add state to track user's custom code vs example code
- Add "Compile" button to process the custom code
- Add "Reset to Example" button to restore default
- Consider code validation before processing
- Persist user code in localStorage for session continuity

**Technical Approach**:
```tsx
const [userCode, setUserCode] = useState<string | null>(null);
const [isCustomCode, setIsCustomCode] = useState(false);
const activeCode = userCode ?? sampleCode;

// Monaco Editor for syntax highlighting while editing
<Editor
  height="300px"
  defaultLanguage="typescript"
  value={userCode ?? sampleCode}
  onChange={(value) => setUserCode(value)}
  theme="vs-dark"
/>
```

**Dependencies**:
- `@monaco-editor/react` for code editing experience
- Or simple `<textarea>` for MVP

---

### 2. Stage Output Panels

**Goal**: Show what each compiler stage actually produces, making the internal workings visible.

**Implementation Plan**:

#### Scanner Output
- Parse code into tokens using a simple tokenizer
- Display token list: `[KEYWORD: interface] [IDENTIFIER: User] [PUNCTUATION: {]`
- Highlight current token when hovering over code

**Technical Approach**:
```tsx
interface Token {
  type: 'keyword' | 'identifier' | 'punctuation' | 'string' | 'number';
  value: string;
  position: { start: number; end: number };
}

function tokenize(code: string): Token[] {
  // Simple regex-based tokenizer
  // Or use TypeScript's actual scanner API: ts.createScanner()
}
```

#### Parser Output
- Generate a simplified AST representation
- Display as collapsible tree structure
- Show node types: InterfaceDeclaration, FunctionDeclaration, etc.

**Technical Approach**:
```tsx
// Use TypeScript compiler API
import ts from 'typescript';

function getAST(code: string) {
  const sourceFile = ts.createSourceFile(
    'example.ts',
    code,
    ts.ScriptTarget.Latest,
    true
  );

  return astToTreeData(sourceFile);
}

// Render with a tree component
<Tree data={astData} />
```

#### Binder Output
- Show symbol table with scopes
- Display: Symbol name, Type, Scope level

#### Type Checker Output
- Show inferred types for each variable/function
- Display type errors if any
- Show type relationships

**UI Component**:
```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
  <div>{/* Code visualizer */}</div>
  <div className="border rounded-lg p-4">
    <h4>Stage Output: {stage.name}</h4>
    {renderStageOutput(stage)}
  </div>
</div>
```

---

### 3. Multiple Code Examples

**Goal**: Provide various examples demonstrating different TypeScript features and compiler behaviors.

**Implementation Plan**:
- Create a library of code examples
- Add dropdown/tabs to switch between examples
- Each example should highlight different aspects of the compiler

**Example Library**:

```tsx
interface CodeExample {
  id: string;
  title: string;
  description: string;
  code: string;
  category: 'basics' | 'advanced' | 'errors';
}

const examples: CodeExample[] = [
  {
    id: 'interface-basic',
    title: 'Basic Interface',
    description: 'Simple interface and function',
    code: sampleCode,
    category: 'basics'
  },
  {
    id: 'generics',
    title: 'Generic Functions',
    description: 'How generics work through compilation',
    code: `function identity<T>(arg: T): T {
  return arg;
}

const result = identity<string>("hello");`,
    category: 'advanced'
  },
  {
    id: 'class',
    title: 'Class with Methods',
    description: 'Class declaration and methods',
    code: `class Calculator {
  add(a: number, b: number): number {
    return a + b;
  }
}

const calc = new Calculator();
calc.add(5, 3);`,
    category: 'basics'
  },
  {
    id: 'type-error',
    title: 'Type Error Example',
    description: 'How the type checker catches errors',
    code: `function greet(name: string): string {
  return "Hello, " + name;
}

// This will cause a type error
greet(123);`,
    category: 'errors'
  },
  {
    id: 'union-types',
    title: 'Union Types',
    description: 'Type narrowing and unions',
    code: `type Result = { success: true; data: string } | { success: false; error: string };

function handleResult(result: Result) {
  if (result.success) {
    console.log(result.data);
  } else {
    console.error(result.error);
  }
}`,
    category: 'advanced'
  }
];
```

**UI Component**:
```tsx
<Select value={selectedExample} onValueChange={setSelectedExample}>
  {examples.map(ex => (
    <SelectItem key={ex.id} value={ex.id}>
      {ex.title}
    </SelectItem>
  ))}
</Select>
```

---

### 4. Error Demonstration

**Goal**: Show how the TypeScript compiler catches different types of errors at different stages.

**Implementation Plan**:
- Add examples that intentionally have errors
- Show where in the pipeline the error is caught
- Display error messages from the actual TypeScript compiler
- Visual indicator (red highlight) for error locations

**Error Categories**:

1. **Syntax Errors** (caught in Parser stage)
   ```typescript
   function broken( {  // Missing closing paren
     return "error";
   }
   ```

2. **Undefined Reference** (caught in Binder stage)
   ```typescript
   console.log(undefinedVariable);
   ```

3. **Type Errors** (caught in Type Checker stage)
   ```typescript
   const num: number = "not a number";
   ```

**Technical Approach**:
```tsx
import ts from 'typescript';

function getCompilerErrors(code: string) {
  const sourceFile = ts.createSourceFile('temp.ts', code, ts.ScriptTarget.Latest);
  const program = ts.createProgram(['temp.ts'], {});
  const diagnostics = ts.getPreEmitDiagnostics(program);

  return diagnostics.map(d => ({
    message: ts.flattenDiagnosticMessageText(d.messageText, '\n'),
    start: d.start,
    length: d.length,
    category: d.category // Error, Warning, etc.
  }));
}
```

**UI Enhancement**:
- Show error icon on stage buttons where errors occur
- Red highlights in code for error locations
- Error panel below code showing error messages

---

### 5. Visual AST Tree

**Goal**: Display an interactive tree diagram of the Abstract Syntax Tree for the parser stage.

**Implementation Plan**:
- Use TypeScript's compiler API to get actual AST
- Render as interactive tree (collapsible nodes)
- Clicking a tree node highlights corresponding code
- Hovering code highlights corresponding tree node

**Libraries to Consider**:
- `react-d3-tree` for tree visualization
- `react-flow` for node-based graph
- Custom recursive component for simplicity

**Technical Approach**:
```tsx
interface ASTNode {
  type: string;
  children: ASTNode[];
  position: { start: number; end: number };
  properties?: Record<string, any>;
}

function ASTTreeNode({ node, onNodeClick }: ASTTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="ml-4">
      <div
        className="flex items-center gap-2 hover:bg-blue-500/10 cursor-pointer"
        onClick={() => onNodeClick(node.position)}
      >
        {node.children.length > 0 && (
          <button onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? '▼' : '►'}
          </button>
        )}
        <span className="text-blue-400">{node.type}</span>
      </div>
      {isExpanded && node.children.map((child, i) => (
        <ASTTreeNode key={i} node={child} onNodeClick={onNodeClick} />
      ))}
    </div>
  );
}
```

---

## Medium Priority Features

### Keyboard Shortcuts
- **Space**: Play/Pause auto-play
- **Arrow Left/Right**: Previous/Next stage
- **Numbers 0-6**: Jump to specific stage
- **R**: Reset to first stage
- **E**: Toggle edit mode

**Implementation**:
```tsx
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === ' ') {
      e.preventDefault();
      handlePlayPause();
    } else if (e.key === 'ArrowLeft') {
      handlePrevious();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    } // ... etc
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [currentStage]);
```

---

### Animation Transitions
- Smooth stage transitions with fade effects
- Animated highlight appearance
- Easing functions for professional feel

**Implementation**:
```tsx
// Use framer-motion
import { motion, AnimatePresence } from 'framer-motion';

<AnimatePresence mode="wait">
  <motion.div
    key={currentStage}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {/* Stage content */}
  </motion.div>
</AnimatePresence>
```

---

### Share/Export Feature
- Generate shareable URL with code and current stage
- Copy link to clipboard
- URL parameters: `?code=base64encoded&stage=3`

**Implementation**:
```tsx
function encodeState() {
  const state = {
    code: userCode ?? sampleCode,
    stage: currentStage
  };
  return btoa(JSON.stringify(state));
}

function loadFromURL() {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get('state');
  if (encoded) {
    const state = JSON.parse(atob(encoded));
    setUserCode(state.code);
    setCurrentStage(state.stage);
  }
}
```

---

### Theme Switcher
- Multiple Shiki themes to choose from
- Match user's preferred code style
- Options: Catppuccin, Dracula, Nord, Monokai, etc.

**Implementation**:
```tsx
const themes = [
  'catppuccin-mocha',
  'dracula',
  'nord',
  'monokai',
  'github-dark'
];

const [selectedTheme, setSelectedTheme] = useState('catppuccin-mocha');

// Use in codeToHtml
theme: selectedTheme
```

---

## Technical Dependencies to Add

```json
{
  "dependencies": {
    "@monaco-editor/react": "^4.6.0",
    "typescript": "^5.3.3",
    "framer-motion": "^11.0.0",
    "react-d3-tree": "^3.6.1"
  }
}
```

---

## Implementation Phases

### Phase 1: Foundation (Current ✅)
- [x] Basic stage navigation
- [x] Code syntax highlighting
- [x] Stage descriptions
- [x] Accurate position highlighting

### Phase 2: Interactivity
- [ ] Editable code panel
- [ ] Multiple code examples
- [ ] Basic keyboard shortcuts

### Phase 3: Deeper Insights
- [ ] Stage output panels (tokens, AST, etc.)
- [ ] Error demonstration
- [ ] Visual AST tree

### Phase 4: Polish
- [ ] Animations
- [ ] Share feature
- [ ] Theme switcher
- [ ] Mobile responsiveness improvements

---

## Notes & Ideas

- Consider using the actual TypeScript compiler API (`typescript` package) for accurate parsing, binding, and type checking
- Could add "mini-compiler mode" that implements a simplified compiler from scratch (like mini-typescript)
- Add performance metrics showing how long each stage takes
- Show memory usage or AST size statistics
- Add a "Challenge Mode" where users fix broken code
- Integration with TypeScript Playground for live experimentation
- Add explanations of common compiler optimizations in the transformer stage

---

## Resources

- [TypeScript Compiler API](https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API)
- [mini-typescript](https://github.com/sandersn/mini-typescript)
- [Shiki Documentation](https://shiki.matsu.io/)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
