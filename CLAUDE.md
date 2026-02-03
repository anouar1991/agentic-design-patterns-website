# Agentic Design Patterns Website - Development Rules

## Chapter Creation Rules

### CRITICAL

#### 1. Source Content from Notebooks
- MUST read the corresponding Jupyter notebook before creating chapter content
- Code examples MUST match the notebook code exactly
- Tutorial content should follow the notebook's teaching progression
- Location: `/home/noreddine/agentic-ai/Agentic_Design_Patterns/notebooks/`

#### 2. Verify Documentation Before Adding Code Terms
- MUST check official documentation for each library/framework used
- Use WebSearch to find current API references
- Never assume syntax - verify imports, method names, and parameters
- Update code terms with accurate docUrl links to official docs

#### 3. Tutorial Section Structure
Each chapter tutorial should include these step types:
- **narrative**: Explanatory text with analogies and context
- **code**: Actual runnable code from the notebook
- **tip**: Pro tips and best practices (green styling)
- **warning**: Common mistakes to avoid (amber styling)
- **exercise**: Hands-on challenges for the reader (purple styling)
- **checkpoint**: Summary of what was learned (blue styling)

#### 4. Make Code Terms Clickable
- Identify key classes, methods, and concepts in code blocks
- Add terms to `src/data/codeTerms.ts` with full documentation
- Include: syntax, parameters, return types, examples, tips, and doc URL
- Add pattern matching in `TutorialCodeBlock.tsx` for highlighting

#### 5. Enable Diagram Node to Code Linking
- Every process node MUST have `codeExampleIndex` pointing to relevant code
- Set `codeHighlightLines` to highlight specific lines when node is clicked
- Ensure "Pattern Code Examples" section exists for nodes to link to
- Test that "View in Code" button scrolls and highlights correctly

### Standards

#### 6. Narrative Writing Style
- Start chapters with a relatable real-world analogy
- Use bold for key terms, backticks for code references
- Keep paragraphs short and scannable
- End sections with checkpoint summaries

#### 7. Diagram Node Roles
- **input**: Entry points (gray color)
- **process**: Processing steps (chapter color)
- **output**: Final results (green color)
- Use `detailedHint` for expanded explanations in the detail panel

#### 8. Section Organization
Chapters with tutorials have 4 sections:
1. Key Concepts - What you'll learn
2. Tutorial - Step-by-step with clickable terms
3. Pattern Code Examples - Complete runnable code (diagram targets)
4. Validate Your Learning - Quiz

### Verification

Before marking a chapter complete:
- [ ] Code matches the Jupyter notebook
- [ ] All code terms have up-to-date documentation
- [ ] Clickable terms open modals with explanations
- [ ] Diagram "View in Code" scrolls to correct code section
- [ ] Build passes without errors
- [ ] Test all interactive features in browser

---

## Changelog

- **2026-01-18**: Initial rules for chapter creation
