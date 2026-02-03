/**
 * Concept Registry
 *
 * This module tracks concepts introduced throughout the course.
 * When a concept is first introduced, users see a detailed explanation.
 * On subsequent encounters, they see a brief tooltip.
 */

import type { ConceptDefinition } from './types';

export const concepts: Record<string, ConceptDefinition> = {
  // ============================================
  // Chapter 1: Prompt Chaining Concepts
  // ============================================

  'langchain': {
    id: 'langchain',
    name: 'LangChain',
    shortDescription: 'A framework for building LLM-powered applications',
    fullExplanation: `LangChain is the most popular framework for building applications with Large Language Models. It provides:

• **Abstractions** - Unified interfaces for different LLM providers (OpenAI, Anthropic, Google, etc.)
• **Chains** - Composable building blocks that connect prompts, models, and tools
• **Memory** - Built-in conversation history and state management
• **Agents** - Autonomous decision-makers that use tools to accomplish tasks

Think of LangChain as the "React of AI" - it gives you the building blocks to compose complex AI applications from simple, reusable pieces.`,
    relatedConcepts: ['langchain-openai', 'prompt-template', 'llm-chain'],
    externalLinks: [
      { label: 'LangChain Documentation', url: 'https://python.langchain.com/docs/' },
      { label: 'LangChain GitHub', url: 'https://github.com/langchain-ai/langchain' }
    ]
  },

  'langchain-openai': {
    id: 'langchain-openai',
    name: 'ChatOpenAI',
    shortDescription: 'LangChain\'s interface to OpenAI chat models',
    fullExplanation: `ChatOpenAI is LangChain's wrapper around OpenAI's chat completion API. Key parameters:

• **model** - Which model to use (e.g., "gpt-4o-mini", "gpt-4o")
• **temperature** - Creativity control (0 = deterministic, 1 = creative)
• **max_tokens** - Maximum response length

\`\`\`python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0  # Consistent, factual responses
)
\`\`\`

Using temperature=0 is recommended for prompt chains because it produces consistent, reproducible outputs.`,
    relatedConcepts: ['langchain', 'llm-temperature'],
    externalLinks: [
      { label: 'OpenAI Models', url: 'https://platform.openai.com/docs/models' }
    ]
  },

  'prompt-template': {
    id: 'prompt-template',
    name: 'PromptTemplate',
    shortDescription: 'A template for creating dynamic prompts with variables',
    fullExplanation: `PromptTemplate lets you create reusable prompts with placeholder variables:

\`\`\`python
from langchain.prompts import PromptTemplate

template = PromptTemplate(
    input_variables=["topic"],
    template="Explain {topic} in simple terms."
)

# Usage: template.format(topic="quantum computing")
# Output: "Explain quantum computing in simple terms."
\`\`\`

**Why use templates?**
1. **Reusability** - Same template, different inputs
2. **Type safety** - Catch missing variables early
3. **Chaining** - Output variables flow to next template's inputs
4. **Testing** - Easily test prompts with different inputs`,
    relatedConcepts: ['langchain', 'llm-chain', 'sequential-chain'],
  },

  'llm-chain': {
    id: 'llm-chain',
    name: 'LLMChain',
    shortDescription: 'Combines a prompt template with an LLM to create a single step',
    fullExplanation: `An LLMChain pairs a PromptTemplate with an LLM to create one processing step:

\`\`\`python
from langchain.chains import LLMChain

chain = LLMChain(
    llm=llm,
    prompt=extract_prompt,
    output_key="extracted_data"  # Name this step's output
)

result = chain.invoke({"document": "..."})
# Access via result["extracted_data"]
\`\`\`

The **output_key** is crucial for chaining - it names the output so the next step can reference it as an input variable.`,
    relatedConcepts: ['prompt-template', 'sequential-chain'],
  },

  'sequential-chain': {
    id: 'sequential-chain',
    name: 'SequentialChain',
    shortDescription: 'Orchestrates multiple LLMChains in sequence',
    fullExplanation: `SequentialChain connects multiple LLMChains, automatically piping outputs to inputs:

\`\`\`python
from langchain.chains import SequentialChain

full_chain = SequentialChain(
    chains=[chain1, chain2, chain3],
    input_variables=["document"],      # Initial input
    output_variables=["final_result"]  # What to return
)
\`\`\`

**Data flow:**
1. \`document\` → chain1 → \`topics\` (output_key)
2. \`topics\` → chain2 → \`summary\` (output_key)
3. \`summary\` → chain3 → \`final_result\` (output_key)

Each chain's output_key must match the next chain's input_variable name for automatic piping.`,
    relatedConcepts: ['llm-chain', 'prompt-template', 'prompt-chaining'],
  },

  'prompt-chaining': {
    id: 'prompt-chaining',
    name: 'Prompt Chaining',
    shortDescription: 'Breaking complex tasks into sequential prompt steps',
    fullExplanation: `Prompt Chaining is a fundamental agentic pattern that decomposes complex tasks into manageable steps:

**The Assembly Line Analogy:**
Just like a factory assembly line, each "station" (prompt) does one thing well:
1. Station 1: Extract raw materials (parse input)
2. Station 2: Process materials (transform data)
3. Station 3: Quality check (validate output)
4. Station 4: Package product (format final result)

**Benefits:**
• **Debuggability** - Inspect intermediate results
• **Optimization** - Tune each step independently
• **Reliability** - Smaller prompts = more consistent outputs
• **Flexibility** - Swap out individual steps

**When to use:**
✓ Task too complex for single prompt
✓ Need intermediate results for debugging
✓ Different steps need different instructions
✓ Want to optimize cost/latency per step`,
    relatedConcepts: ['sequential-chain', 'llm-chain'],
  },

  'llm-temperature': {
    id: 'llm-temperature',
    name: 'Temperature',
    shortDescription: 'Controls randomness in LLM outputs (0=deterministic, 1=creative)',
    fullExplanation: `Temperature controls the "creativity" of LLM responses:

• **temperature=0** - Always picks the most likely next token
  - Use for: factual tasks, code, data extraction, chains
  - Output is reproducible and consistent

• **temperature=0.7** - Balanced creativity
  - Use for: general conversation, explanations

• **temperature=1.0** - Maximum creativity
  - Use for: brainstorming, creative writing
  - Output varies significantly between runs

**For prompt chains, always use temperature=0** because:
1. Consistent outputs make debugging easier
2. Downstream steps depend on predictable formats
3. Reproducible results for testing`,
    relatedConcepts: ['langchain-openai'],
  },

  'output-key': {
    id: 'output-key',
    name: 'Output Key',
    shortDescription: 'Names the output of a chain step for downstream reference',
    fullExplanation: `The output_key parameter names a chain step's output, enabling data flow:

\`\`\`python
# Step 1: output_key="topics"
# Step 2: input_variables=["topics"]  # Receives step 1's output!
\`\`\`

**Naming conventions:**
• Use descriptive names: "extracted_topics", "summary", "action_items"
• Match output_key → input_variable exactly
• Use snake_case for consistency

**Debugging tip:** Print intermediate outputs to verify data flow:
\`\`\`python
result = chain.invoke({"document": text})
print(result["topics"])   # Check step 1 output
print(result["summary"])  # Check step 2 output
\`\`\``,
    relatedConcepts: ['llm-chain', 'sequential-chain'],
  },

  // ============================================
  // Common Concepts (used across chapters)
  // ============================================

  'api-key': {
    id: 'api-key',
    name: 'API Key',
    shortDescription: 'Secret credential for accessing LLM APIs',
    fullExplanation: `An API key authenticates your requests to LLM providers:

**Setting up:**
\`\`\`bash
# Option 1: Environment variable (recommended)
export OPENAI_API_KEY="sk-..."

# Option 2: .env file with python-dotenv
# .env file:
OPENAI_API_KEY=sk-...

# Python:
from dotenv import load_dotenv
load_dotenv()
\`\`\`

**Security best practices:**
• NEVER commit API keys to git
• Use environment variables or .env files
• Add .env to .gitignore
• Use separate keys for dev/prod
• Set usage limits in provider dashboard`,
    relatedConcepts: ['langchain-openai'],
    externalLinks: [
      { label: 'Get OpenAI API Key', url: 'https://platform.openai.com/api-keys' }
    ]
  },

  'lcel': {
    id: 'lcel',
    name: 'LCEL (LangChain Expression Language)',
    shortDescription: 'Modern pipe syntax for composing LangChain components',
    fullExplanation: `LCEL is the modern way to compose LangChain components using the pipe (|) operator:

\`\`\`python
from langchain_core.output_parsers import StrOutputParser

# Old way (deprecated)
chain = LLMChain(llm=llm, prompt=prompt)

# LCEL way (modern)
chain = prompt | llm | StrOutputParser()

# Compose multiple steps
full_chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)
\`\`\`

**Benefits of LCEL:**
• More readable, declarative syntax
• Better streaming support
• Automatic batching and parallelization
• Easier debugging with .invoke() and .stream()`,
    relatedConcepts: ['langchain', 'prompt-template'],
    externalLinks: [
      { label: 'LCEL Documentation', url: 'https://python.langchain.com/docs/expression_language/' }
    ]
  },
};

/**
 * Get concepts introduced in a specific chapter
 */
export function getChapterConcepts(chapterNumber: number): ConceptDefinition[] {
  const chapterConceptIds = chapterConceptMap[chapterNumber] || [];
  return chapterConceptIds.map(id => concepts[id]).filter(Boolean);
}

/**
 * Map of chapter numbers to concept IDs introduced in that chapter
 */
export const chapterConceptMap: Record<number, string[]> = {
  1: [
    'prompt-chaining',
    'langchain',
    'langchain-openai',
    'prompt-template',
    'llm-chain',
    'sequential-chain',
    'llm-temperature',
    'output-key',
    'api-key',
    'lcel'
  ],
  // Future chapters will add their concepts here
  2: [],
  3: [],
  // ... etc
};

/**
 * Check if this is the first time a concept appears
 */
export function isFirstAppearance(conceptId: string, currentChapter: number): boolean {
  for (const [chapter, conceptIds] of Object.entries(chapterConceptMap)) {
    if (conceptIds.includes(conceptId)) {
      return parseInt(chapter) === currentChapter;
    }
  }
  return false;
}
