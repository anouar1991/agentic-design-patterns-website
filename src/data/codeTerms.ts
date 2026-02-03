/**
 * Code Terms Registry
 *
 * Definitions for all clickable code terms in tutorials.
 * Each term includes documentation sourced from official docs.
 *
 * Sources:
 * - https://python.langchain.com/docs/concepts/lcel/
 * - https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html
 * - https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.string.StrOutputParser.html
 * - https://google.github.io/adk-docs/ (Google Agent Development Kit)
 * - https://heapq.readthedocs.io/ (Python heapq module)
 */

export interface CodeTerm {
  id: string;
  name: string;
  type: 'class' | 'function' | 'method' | 'operator' | 'module' | 'parameter' | 'concept';
  shortDescription: string;
  fullDescription: string;
  syntax?: string;
  example?: string;
  parameters?: Array<{
    name: string;
    type: string;
    description: string;
    default?: string;
  }>;
  returns?: {
    type: string;
    description: string;
  };
  tips?: string[];
  seeAlso?: string[];
  docUrl?: string;
}

export const codeTerms: Record<string, CodeTerm> = {
  // ==================== IMPORTS & MODULES ====================
  'langchain_openai': {
    id: 'langchain_openai',
    name: 'langchain_openai',
    type: 'module',
    shortDescription: 'OpenAI integration for LangChain',
    fullDescription: 'The `langchain_openai` package provides integrations with OpenAI models. It includes ChatOpenAI for chat models and OpenAI for completion models. This is the recommended way to use OpenAI with LangChain as of 2024+.',
    syntax: 'from langchain_openai import ChatOpenAI',
    tips: [
      'Install with: pip install langchain-openai',
      'Requires OPENAI_API_KEY environment variable',
      'Supports both GPT-3.5 and GPT-4 models'
    ],
    docUrl: 'https://python.langchain.com/docs/integrations/platforms/openai/'
  },

  'langchain_core.prompts': {
    id: 'langchain_core.prompts',
    name: 'langchain_core.prompts',
    type: 'module',
    shortDescription: 'Core prompt templates for LangChain',
    fullDescription: 'The prompts module contains classes for creating and managing prompt templates. These templates allow you to create reusable prompts with variable placeholders that get filled in at runtime.',
    syntax: 'from langchain_core.prompts import ChatPromptTemplate',
    docUrl: 'https://python.langchain.com/api_reference/core/prompts.html'
  },

  'langchain_core.output_parsers': {
    id: 'langchain_core.output_parsers',
    name: 'langchain_core.output_parsers',
    type: 'module',
    shortDescription: 'Output parsing utilities',
    fullDescription: 'Output parsers transform the raw text output from language models into structured formats. They can parse JSON, extract specific fields, or simply convert messages to strings.',
    syntax: 'from langchain_core.output_parsers import StrOutputParser, JsonOutputParser',
    docUrl: 'https://python.langchain.com/api_reference/core/output_parsers.html'
  },

  // ==================== CLASSES ====================
  'ChatOpenAI': {
    id: 'ChatOpenAI',
    name: 'ChatOpenAI',
    type: 'class',
    shortDescription: 'OpenAI chat model wrapper',
    fullDescription: 'ChatOpenAI is a wrapper around OpenAI\'s chat models (GPT-3.5-turbo, GPT-4, etc.). It implements the Runnable interface, making it composable with other LangChain components using LCEL (the | operator).',
    syntax: 'llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)',
    parameters: [
      { name: 'model', type: 'str', description: 'Model name to use', default: '"gpt-3.5-turbo"' },
      { name: 'temperature', type: 'float', description: 'Sampling temperature (0-2). Lower = more deterministic', default: '0.7' },
      { name: 'max_tokens', type: 'int', description: 'Maximum tokens to generate', default: 'None' },
      { name: 'api_key', type: 'str', description: 'OpenAI API key (or use env var)', default: 'None' }
    ],
    returns: {
      type: 'ChatOpenAI',
      description: 'A runnable chat model instance'
    },
    tips: [
      'Use temperature=0 for consistent, deterministic outputs',
      'GPT-4o-mini is cost-effective for most tasks',
      'The model implements .invoke(), .stream(), and .batch() methods'
    ],
    docUrl: 'https://python.langchain.com/docs/integrations/chat/openai/'
  },

  'ChatPromptTemplate': {
    id: 'ChatPromptTemplate',
    name: 'ChatPromptTemplate',
    type: 'class',
    shortDescription: 'Template for chat model prompts',
    fullDescription: 'ChatPromptTemplate creates reusable prompt templates with variable placeholders. Variables are denoted with {curly_braces} and get filled in when the template is invoked. It\'s designed specifically for chat models and handles message formatting automatically.',
    syntax: 'prompt = ChatPromptTemplate.from_template("Your prompt with {variable}")',
    parameters: [
      { name: 'template', type: 'str', description: 'The prompt template string with {variables}' }
    ],
    returns: {
      type: 'ChatPromptTemplate',
      description: 'A runnable prompt template'
    },
    example: `prompt = ChatPromptTemplate.from_template(
    "Translate {text} to {language}"
)
# Later: prompt.invoke({"text": "Hello", "language": "French"})`,
    tips: [
      'Use descriptive variable names for clarity',
      'Templates are immutable - create new ones for different prompts',
      'Can also create from message lists for multi-turn conversations'
    ],
    docUrl: 'https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html'
  },

  'StrOutputParser': {
    id: 'StrOutputParser',
    name: 'StrOutputParser',
    type: 'class',
    shortDescription: 'Converts LLM output to plain string',
    fullDescription: 'StrOutputParser is a simple output parser that extracts the string content from an LLM response. Chat models return AIMessage objects, and this parser extracts just the text content, making it easier to work with in chains.',
    syntax: 'parser = StrOutputParser()',
    returns: {
      type: 'str',
      description: 'The text content of the LLM response'
    },
    example: `from langchain_core.output_parsers import StrOutputParser

chain = prompt | llm | StrOutputParser()
result = chain.invoke({"topic": "AI"})
# result is now a plain string, not an AIMessage`,
    tips: [
      'Always use at the end of chains when you need plain text',
      'Without it, you get AIMessage objects with .content attribute',
      'For structured output, use JsonOutputParser instead'
    ],
    docUrl: 'https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.string.StrOutputParser.html'
  },

  // ==================== METHODS ====================
  'from_template': {
    id: 'from_template',
    name: '.from_template()',
    type: 'method',
    shortDescription: 'Create prompt from template string',
    fullDescription: 'A class method that creates a ChatPromptTemplate from a simple template string. Variables in {curly_braces} become the input variables for the prompt. This is the most common way to create prompts.',
    syntax: 'ChatPromptTemplate.from_template("Your {variable} here")',
    parameters: [
      { name: 'template', type: 'str', description: 'Template string with {variable} placeholders' }
    ],
    returns: {
      type: 'ChatPromptTemplate',
      description: 'A configured prompt template ready for use in chains'
    },
    example: `# Simple template
prompt = ChatPromptTemplate.from_template(
    "Summarize this text: {text}"
)

# Multiple variables
prompt = ChatPromptTemplate.from_template(
    "Write a {tone} email about {topic}"
)`,
    tips: [
      'Variable names must be valid Python identifiers',
      'Use meaningful names like {user_query} not {x}',
      'The template string becomes a HumanMessage by default'
    ]
  },

  'invoke': {
    id: 'invoke',
    name: '.invoke()',
    type: 'method',
    shortDescription: 'Execute a chain with input',
    fullDescription: 'The invoke() method runs a chain (or any Runnable) with the given input and returns the output. It\'s synchronous and waits for the complete result. All LCEL components implement this method.',
    syntax: 'result = chain.invoke({"input_key": "value"})',
    parameters: [
      { name: 'input', type: 'dict | str', description: 'Input data matching the chain\'s expected variables' }
    ],
    returns: {
      type: 'Any',
      description: 'The output of the chain (type depends on the final component)'
    },
    example: `chain = prompt | llm | StrOutputParser()

# Single invocation
result = chain.invoke({"topic": "machine learning"})

# For batch processing, use .batch()
results = chain.batch([
    {"topic": "AI"},
    {"topic": "robotics"}
])`,
    tips: [
      'Use .stream() for streaming responses',
      'Use .batch() for processing multiple inputs efficiently',
      'Use .ainvoke() for async operations'
    ]
  },

  // ==================== OPERATORS ====================
  'pipe_operator': {
    id: 'pipe_operator',
    name: '| (Pipe Operator)',
    type: 'operator',
    shortDescription: 'Chain components together in LCEL',
    fullDescription: 'The pipe operator (|) is the core of LangChain Expression Language (LCEL). It connects components so the output of one becomes the input of the next, similar to Unix pipes. This creates a "chain" that processes data through multiple steps.',
    syntax: 'chain = component1 | component2 | component3',
    example: `# Basic chain: prompt → model → parser
chain = prompt | llm | StrOutputParser()

# The data flows like this:
# {"text": "hello"} → prompt → "Translate: hello" → llm → AIMessage → parser → "Bonjour"`,
    tips: [
      'Read left-to-right: data flows through each component',
      'Each component must accept the previous component\'s output type',
      'You can also use .pipe() method: prompt.pipe(llm).pipe(parser)'
    ],
    seeAlso: ['invoke', 'RunnableSequence']
  },

  // ==================== LCEL CONCEPTS ====================
  'LCEL': {
    id: 'LCEL',
    name: 'LCEL (LangChain Expression Language)',
    type: 'concept',
    shortDescription: 'Declarative way to compose chains',
    fullDescription: 'LangChain Expression Language (LCEL) is a declarative way to compose chains using the pipe operator (|). It provides a standardized interface (Runnable) that all components implement, enabling seamless composition, streaming, batching, and async operations.',
    example: `# LCEL makes chain composition intuitive:
chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

# All these methods work automatically:
chain.invoke(query)      # Single run
chain.stream(query)      # Streaming
chain.batch([q1, q2])    # Batch processing
await chain.ainvoke(q)   # Async`,
    tips: [
      'Every LCEL component implements invoke, stream, batch',
      'Chains are lazy - they don\'t run until invoked',
      'Use RunnableParallel for parallel operations',
      'Use RunnableLambda to wrap custom functions'
    ],
    docUrl: 'https://python.langchain.com/docs/concepts/lcel/'
  },

  'Runnable': {
    id: 'Runnable',
    name: 'Runnable Protocol',
    type: 'concept',
    shortDescription: 'Standard interface for LCEL components',
    fullDescription: 'The Runnable protocol is the foundation of LCEL. Any class implementing Runnable can be composed with other Runnables using the pipe operator. It guarantees invoke(), stream(), batch(), and async variants are available.',
    tips: [
      'All LangChain components (prompts, models, parsers) are Runnables',
      'You can create custom Runnables with RunnableLambda',
      'Runnables can be nested and combined freely'
    ]
  },

  // ==================== PARAMETERS ====================
  'temperature': {
    id: 'temperature',
    name: 'temperature',
    type: 'parameter',
    shortDescription: 'Controls randomness in output',
    fullDescription: 'Temperature controls the randomness/creativity of the model\'s output. A value of 0 makes the model deterministic (always choosing the most likely token), while higher values (up to 2) increase randomness and creativity.',
    example: `# Deterministic (for factual tasks)
llm = ChatOpenAI(temperature=0)

# Creative (for brainstorming)
llm = ChatOpenAI(temperature=0.9)

# Balanced (general purpose)
llm = ChatOpenAI(temperature=0.7)`,
    tips: [
      'Use 0 for code generation, extraction, and factual tasks',
      'Use 0.7-0.9 for creative writing and brainstorming',
      'Values above 1.0 can produce incoherent output'
    ]
  },

  // ==================== ADVANCED PATTERNS ====================
  'RunnablePassthrough': {
    id: 'RunnablePassthrough',
    name: 'RunnablePassthrough',
    type: 'class',
    shortDescription: 'Pass input through unchanged',
    fullDescription: 'RunnablePassthrough passes its input through unchanged. It\'s useful in parallel chains where you need to forward the original input alongside transformed data.',
    syntax: 'from langchain_core.runnables import RunnablePassthrough',
    example: `chain = {
    "context": retriever,
    "question": RunnablePassthrough()
} | prompt | llm`,
    docUrl: 'https://python.langchain.com/docs/how_to/passthrough/'
  },

  'RunnableParallel': {
    id: 'RunnableParallel',
    name: 'RunnableParallel',
    type: 'class',
    shortDescription: 'Run multiple chains in parallel',
    fullDescription: 'RunnableParallel allows you to run multiple Runnables in parallel and collect their outputs into a dictionary. You can also use dict syntax as shorthand.',
    syntax: `# Explicit
parallel = RunnableParallel({"a": chain_a, "b": chain_b})

# Dict shorthand (equivalent)
parallel = {"a": chain_a, "b": chain_b}`,
    example: `# Both chains run in parallel
chain = {
    "summary": summarize_chain,
    "keywords": extract_keywords_chain
} | combine_prompt | llm`,
    tips: [
      'Dict syntax automatically creates RunnableParallel',
      'Great for gathering context from multiple sources',
      'All parallel branches receive the same input'
    ]
  },

  // ==================== CHAIN VARIABLES ====================
  'chain_variable': {
    id: 'chain_variable',
    name: 'Chain Variable Passing',
    type: 'concept',
    shortDescription: 'How data flows between chain steps',
    fullDescription: 'In LCEL, data flows through chains via dictionaries. When you use {"key": some_runnable}, the output of that runnable becomes available to the next component under that key name.',
    example: `# The extraction_chain output becomes "specifications"
chain = (
    {"specifications": extraction_chain}
    | transform_prompt  # Can use {specifications} in template
    | llm
    | StrOutputParser()
)`,
    tips: [
      'Key names must match template variable names',
      'Use descriptive keys for maintainability',
      'You can pass multiple values in parallel using dict syntax'
    ]
  },

  // ==================== GOOGLE ADK (Agent Development Kit) ====================
  'google.adk.agents': {
    id: 'google.adk.agents',
    name: 'google.adk.agents',
    type: 'module',
    shortDescription: 'Google Agent Development Kit agents module',
    fullDescription: 'The google.adk.agents module provides the core agent classes for building AI agents with Google\'s Agent Development Kit. It includes Agent for single agents and orchestrator types like SequentialAgent and ParallelAgent.',
    syntax: 'from google.adk.agents import Agent, SequentialAgent',
    tips: [
      'ADK uses Gemini models by default',
      'Agents communicate through shared state',
      'Install with: pip install google-adk'
    ],
    docUrl: 'https://google.github.io/adk-docs/'
  },

  'Agent': {
    id: 'Agent',
    name: 'Agent',
    type: 'class',
    shortDescription: 'Google ADK base agent class',
    fullDescription: 'The Agent class is the fundamental building block in Google ADK. Each Agent has a name, model, instruction (system prompt), and optional tools. Agents can access shared state and communicate with other agents through state flags.',
    syntax: `agent = Agent(
    name="my_agent",
    model="gemini-2.0-flash-exp",
    instruction="Your system prompt here",
    tools=[tool1, tool2]
)`,
    parameters: [
      { name: 'name', type: 'str', description: 'Unique identifier for the agent' },
      { name: 'model', type: 'str', description: 'Gemini model to use', default: '"gemini-2.0-flash-exp"' },
      { name: 'instruction', type: 'str', description: 'System prompt defining agent behavior' },
      { name: 'tools', type: 'list', description: 'List of tool functions the agent can use', default: '[]' }
    ],
    returns: {
      type: 'Agent',
      description: 'An agent instance ready for execution'
    },
    tips: [
      'Use descriptive names for debugging multi-agent systems',
      'Instructions should be clear and specific about the agent\'s role',
      'Access shared state via state["key"] in instructions'
    ],
    docUrl: 'https://google.github.io/adk-docs/'
  },

  'SequentialAgent': {
    id: 'SequentialAgent',
    name: 'SequentialAgent',
    type: 'class',
    shortDescription: 'Orchestrator that runs agents in order',
    fullDescription: 'SequentialAgent is an orchestrator that executes sub-agents in a strict sequence. Each agent runs to completion before the next begins, ensuring predictable execution order. Agents can communicate via shared state.',
    syntax: `orchestrator = SequentialAgent(
    name="my_pipeline",
    sub_agents=[agent1, agent2, agent3]
)`,
    parameters: [
      { name: 'name', type: 'str', description: 'Unique identifier for the orchestrator' },
      { name: 'sub_agents', type: 'list[Agent]', description: 'Ordered list of agents to execute' }
    ],
    returns: {
      type: 'SequentialAgent',
      description: 'An orchestrator agent that runs sub-agents in sequence'
    },
    example: `# Fallback pattern: primary → fallback → response
orchestrator = SequentialAgent(
    name="robust_agent",
    sub_agents=[primary_handler, fallback_handler, response_agent]
)`,
    tips: [
      'Order matters! Agents run in the order provided',
      'Use state flags to signal between agents (e.g., state["primary_failed"])',
      'Each agent sees the state updates from previous agents'
    ],
    seeAlso: ['Agent', 'ParallelAgent', 'state'],
    docUrl: 'https://google.github.io/adk-docs/'
  },

  'ParallelAgent': {
    id: 'ParallelAgent',
    name: 'ParallelAgent',
    type: 'class',
    shortDescription: 'Orchestrator that runs agents concurrently',
    fullDescription: 'ParallelAgent executes multiple sub-agents concurrently. All agents start at the same time and run in parallel. Useful when tasks are independent and can be performed simultaneously for better performance.',
    syntax: `orchestrator = ParallelAgent(
    name="parallel_tasks",
    sub_agents=[agent1, agent2, agent3]
)`,
    parameters: [
      { name: 'name', type: 'str', description: 'Unique identifier for the orchestrator' },
      { name: 'sub_agents', type: 'list[Agent]', description: 'List of agents to execute in parallel' }
    ],
    tips: [
      'Use for independent tasks that don\'t depend on each other',
      'Results are collected after all agents complete',
      'Be careful with shared state - parallel writes can conflict'
    ],
    seeAlso: ['Agent', 'SequentialAgent'],
    docUrl: 'https://google.github.io/adk-docs/'
  },

  'state': {
    id: 'state',
    name: 'state (ADK)',
    type: 'concept',
    shortDescription: 'Shared memory between agents',
    fullDescription: 'In Google ADK, state is a shared dictionary that persists across agent executions. Agents can read and write to state to communicate with each other. State keys can be referenced in agent instructions using state["key"] syntax.',
    example: `# Agent 1 sets a flag
instruction = """
If the lookup fails, set state["primary_failed"] = True.
"""

# Agent 2 checks the flag
instruction = """
Check if state["primary_failed"] is True.
If so, use the fallback approach.
"""`,
    tips: [
      'Use descriptive key names like state["location_result"]',
      'State persists across the entire agent session',
      'Great for implementing patterns like fallback and escalation'
    ],
    seeAlso: ['Agent', 'SequentialAgent']
  },

  'sub_agents': {
    id: 'sub_agents',
    name: 'sub_agents',
    type: 'parameter',
    shortDescription: 'List of child agents for orchestrators',
    fullDescription: 'The sub_agents parameter in SequentialAgent and ParallelAgent specifies which agents to orchestrate. For SequentialAgent, order matters. For ParallelAgent, all run concurrently.',
    syntax: 'sub_agents=[agent1, agent2, agent3]',
    tips: [
      'Agents are executed in list order for SequentialAgent',
      'Each agent should have a unique name',
      'Agents can be other orchestrators (nesting is allowed)'
    ]
  },

  'instruction': {
    id: 'instruction',
    name: 'instruction',
    type: 'parameter',
    shortDescription: 'System prompt for ADK agents',
    fullDescription: 'The instruction parameter defines the agent\'s behavior through a system prompt. It tells the agent what role it plays, what tools to use, and how to interact with state. Triple-quoted strings allow multi-line instructions.',
    example: `instruction="""
You are a technical support specialist.
1. Use troubleshoot_issue tool for technical problems.
2. Use create_ticket for persistent issues.
3. Use escalate_to_human for complex cases.
Check state["customer_info"] for personalization.
"""`,
    tips: [
      'Be specific about when to use each tool',
      'Reference state keys the agent should read/write',
      'Include decision logic for different scenarios'
    ]
  },

  // ==================== ADK CALLBACKS ====================
  'CallbackContext': {
    id: 'CallbackContext',
    name: 'CallbackContext',
    type: 'class',
    shortDescription: 'Context object for ADK callbacks',
    fullDescription: 'CallbackContext provides access to the agent\'s state and session information within callback functions. Use it to read/modify state or access metadata about the current execution.',
    syntax: 'from google.adk.callbacks import CallbackContext',
    example: `def my_callback(callback_context: CallbackContext, llm_request: LlmRequest):
    # Access state
    customer_info = callback_context.state.get("customer_info")
    # Modify request based on state
    return None  # Continue with modified request`,
    tips: [
      'callback_context.state gives access to shared state',
      'Return None to continue, return modified request to alter it',
      'Great for adding personalization or context'
    ]
  },

  'LlmRequest': {
    id: 'LlmRequest',
    name: 'LlmRequest',
    type: 'class',
    shortDescription: 'Request object for LLM calls',
    fullDescription: 'LlmRequest represents the request being sent to the language model. Callbacks can inspect and modify this request before it reaches the LLM, enabling dynamic prompt injection, personalization, and context enrichment.',
    syntax: 'from google.adk.models.llm import LlmRequest',
    example: `def personalization_callback(ctx: CallbackContext, req: LlmRequest):
    # Access and modify the request contents
    if req.contents:
        # Add a system message
        system_content = types.Content(
            role="system",
            parts=[types.Part(text="Custom context here")]
        )
        req.contents.insert(0, system_content)
    return None`,
    tips: [
      'req.contents contains the conversation messages',
      'Modify contents to inject context or instructions',
      'Return None to continue with modifications'
    ]
  },

  // ==================== PYTHON STANDARD LIBRARY ====================
  'heapq': {
    id: 'heapq',
    name: 'heapq',
    type: 'module',
    shortDescription: 'Python priority queue implementation',
    fullDescription: 'The heapq module provides an implementation of the heap queue algorithm (priority queue). It maintains a list where the smallest element is always at index 0, enabling efficient priority-based task scheduling.',
    syntax: 'import heapq',
    example: `import heapq

# Create a priority queue
tasks = []
heapq.heappush(tasks, (1, "high priority"))
heapq.heappush(tasks, (3, "low priority"))
heapq.heappush(tasks, (2, "medium priority"))

# Pop tasks in priority order
while tasks:
    priority, task = heapq.heappop(tasks)
    print(f"Processing: {task}")`,
    tips: [
      'Lower numbers = higher priority (min-heap)',
      'Use tuples: (priority, item) for prioritization',
      'heappop() always returns the smallest item'
    ],
    docUrl: 'https://docs.python.org/3/library/heapq.html'
  },

  'heappush': {
    id: 'heappush',
    name: 'heapq.heappush()',
    type: 'function',
    shortDescription: 'Add item to priority queue',
    fullDescription: 'heappush() adds an item to a heap while maintaining the heap property. The smallest item stays at index 0. Time complexity is O(log n).',
    syntax: 'heapq.heappush(heap, item)',
    parameters: [
      { name: 'heap', type: 'list', description: 'The heap list to push onto' },
      { name: 'item', type: 'Any', description: 'The item to add (use tuple for priority)' }
    ],
    example: `heapq.heappush(tasks, (1, "urgent task"))
heapq.heappush(tasks, (5, "low priority task"))`,
    tips: [
      'The list must already be a valid heap (or empty)',
      'Use negative priorities for max-heap behavior'
    ]
  },

  'heappop': {
    id: 'heappop',
    name: 'heapq.heappop()',
    type: 'function',
    shortDescription: 'Remove and return smallest item',
    fullDescription: 'heappop() removes and returns the smallest item from the heap while maintaining the heap property. This is the core operation for priority queue dequeuing.',
    syntax: 'item = heapq.heappop(heap)',
    parameters: [
      { name: 'heap', type: 'list', description: 'The heap list to pop from' }
    ],
    returns: {
      type: 'Any',
      description: 'The smallest item from the heap'
    },
    example: `# Process tasks in priority order
while tasks:
    priority, task = heapq.heappop(tasks)
    process(task)`,
    tips: [
      'Raises IndexError if heap is empty',
      'Check len(heap) > 0 before popping'
    ]
  },

  // ==================== AGENTIC CONCEPTS ====================
  'escalation': {
    id: 'escalation',
    name: 'Escalation',
    type: 'concept',
    shortDescription: 'Transferring to human operators',
    fullDescription: 'Escalation is the process of transferring control from an automated agent to a human operator. It\'s triggered when the agent encounters situations beyond its capability, high-stakes decisions, or requests for human expertise.',
    example: `def escalate_to_human(issue_type: str) -> dict:
    # Transfer to human queue
    return {
        "status": "escalated",
        "message": f"Escalated {issue_type} to human specialist"
    }

# In agent instruction:
instruction = """
For complex issues beyond troubleshooting:
1. Use escalate_to_human tool
2. Inform user about transfer
"""`,
    tips: [
      'Define clear escalation triggers in instructions',
      'Always inform the user about the escalation',
      'Log escalation reasons for improving the agent'
    ]
  },

  'fallback': {
    id: 'fallback',
    name: 'Fallback Pattern',
    type: 'concept',
    shortDescription: 'Alternative action when primary fails',
    fullDescription: 'The fallback pattern provides alternative approaches when the primary method fails. In ADK, this is typically implemented using SequentialAgent where a fallback handler checks state flags set by the primary handler.',
    example: `# Primary sets flag on failure
primary_handler = Agent(
    instruction="If lookup fails, set state['failed'] = True"
)

# Fallback checks flag
fallback_handler = Agent(
    instruction="If state['failed'], use alternative approach"
)

# Sequential ensures order
pipeline = SequentialAgent(
    sub_agents=[primary_handler, fallback_handler]
)`,
    tips: [
      'Use state flags to communicate failure',
      'Fallback should be less precise but more reliable',
      'Consider multiple fallback levels'
    ],
    seeAlso: ['SequentialAgent', 'state', 'escalation']
  },

  'graceful_degradation': {
    id: 'graceful_degradation',
    name: 'Graceful Degradation',
    type: 'concept',
    shortDescription: 'Maintaining partial functionality during failures',
    fullDescription: 'Graceful degradation means continuing to operate with reduced capabilities rather than failing completely. When a premium feature fails, the agent provides basic functionality and informs the user of limitations.',
    example: `# In agent instruction:
instruction = """
If precise location lookup fails:
1. Try general area lookup instead
2. Inform user: "I found the general area, but couldn't get exact coordinates"
3. Still provide value with available information
"""`,
    tips: [
      'Always provide some value to the user',
      'Be transparent about reduced functionality',
      'Log degradation events for monitoring'
    ]
  },

  'retry_strategy': {
    id: 'retry_strategy',
    name: 'Retry Strategy',
    type: 'concept',
    shortDescription: 'Automatic retries with backoff',
    fullDescription: 'Retry strategies handle transient failures by automatically retrying operations with increasing delays (exponential backoff). This prevents overwhelming failing services while still attempting recovery.',
    example: `import time

def retry_with_backoff(func, max_retries=3):
    for attempt in range(max_retries):
        try:
            return func()
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            delay = 2 ** attempt  # 1s, 2s, 4s
            time.sleep(delay)`,
    tips: [
      'Exponential backoff: 1s, 2s, 4s, 8s...',
      'Set a maximum retry count',
      'Only retry transient errors, not permanent ones'
    ]
  },

  // ==================== OPENAI SDK ====================
  'openai-client': {
    id: 'openai-client',
    name: 'OpenAI',
    type: 'class',
    shortDescription: 'OpenAI Python SDK client',
    fullDescription: 'The OpenAI class is the main client for the OpenAI Python SDK. It provides access to chat completions, embeddings, and other API endpoints. Initialize it with your API key to start making requests.',
    syntax: `from openai import OpenAI\nclient = OpenAI(api_key="...")`,
    tips: [
      'Set OPENAI_API_KEY env var instead of passing key directly',
      'The client is thread-safe and can be reused across requests',
      'Use AsyncOpenAI for async applications'
    ],
    docUrl: 'https://platform.openai.com/docs/libraries/python-library'
  },

  'chat-completions': {
    id: 'chat-completions',
    name: 'chat.completions.create',
    type: 'method',
    shortDescription: 'Generate chat completions from OpenAI models',
    fullDescription: 'The chat.completions.create method sends a list of messages to an OpenAI model and receives a generated response. Messages include roles (system, user, assistant) and content. This is the primary API for conversational AI.',
    syntax: `client.chat.completions.create(\n    model="gpt-4o",\n    messages=[{"role": "user", "content": "Hello"}],\n    temperature=0\n)`,
    parameters: [
      { name: 'model', type: 'str', description: 'Model ID (e.g., "gpt-4o", "gpt-4o-mini", "o4-mini")' },
      { name: 'messages', type: 'list[dict]', description: 'Conversation messages with role and content' },
      { name: 'temperature', type: 'float', description: 'Sampling temperature (0-2). Lower = more deterministic', default: '1.0' }
    ],
    tips: [
      'Use temperature=0 for classification tasks',
      'gpt-4o-mini is 10-20x cheaper than gpt-4o for simple tasks',
      'Access response: response.choices[0].message.content'
    ],
    docUrl: 'https://platform.openai.com/docs/api-reference/chat/create'
  },

  // ==================== GOOGLE ADK (Extended) ====================
  'base-agent': {
    id: 'base-agent',
    name: 'BaseAgent',
    type: 'class',
    shortDescription: 'Abstract base for custom ADK agents',
    fullDescription: 'BaseAgent is the abstract base class for building custom agents in Google ADK. Override _run_async_impl to define custom behavior like routing, orchestration, or specialized processing. Use this when the built-in Agent class is insufficient.',
    syntax: `from google.adk.agents import BaseAgent\n\nclass MyAgent(BaseAgent):\n    async def _run_async_impl(self, context):\n        yield Event(author=self.name, content=result)`,
    tips: [
      'Override _run_async_impl for custom logic',
      'Yield Event objects to produce output',
      'Use for routers, orchestrators, or custom processing pipelines'
    ],
    docUrl: 'https://google.github.io/adk-docs/'
  },

  'agent-tool': {
    id: 'agent-tool',
    name: 'AgentTool',
    type: 'class',
    shortDescription: 'Wrap an agent as a tool for another agent',
    fullDescription: 'AgentTool wraps an ADK Agent so it can be used as a tool by another agent. This enables agent composition — a root agent can delegate to specialized sub-agents by calling them as tools.',
    syntax: `from google.adk.tools import agent_tool\n\ntools=[agent_tool.AgentTool(agent=my_agent)]`,
    tips: [
      'The root agent decides when to call each sub-agent',
      'Sub-agents can have different models (cost optimization)',
      'Combine with search and code execution agents for ReAct'
    ],
    docUrl: 'https://google.github.io/adk-docs/'
  },

  'code-executor': {
    id: 'code-executor',
    name: 'BuiltInCodeExecutor',
    type: 'class',
    shortDescription: 'Execute code within ADK agents',
    fullDescription: 'BuiltInCodeExecutor enables ADK agents to write and execute Python code during their reasoning process. This is essential for agents that need to perform calculations, data processing, or verify their logic programmatically.',
    syntax: `from google.adk.code_executors import BuiltInCodeExecutor\n\nagent = Agent(\n    code_executor=[BuiltInCodeExecutor]\n)`,
    tips: [
      'Code execution runs in a sandboxed environment',
      'Useful for math, data analysis, and verification tasks',
      'Combine with search agents for ReAct-style reasoning'
    ],
    docUrl: 'https://google.github.io/adk-docs/'
  },

  'before-tool-callback': {
    id: 'before-tool-callback',
    name: 'before_tool_callback',
    type: 'parameter',
    shortDescription: 'ADK hook to validate tool calls before execution',
    fullDescription: 'The before_tool_callback parameter on ADK agents registers a function that runs before every tool execution. It receives the tool, its arguments, and a context object. Return None to allow execution or return a dict to block it with an error message.',
    syntax: `def validate(tool, args, tool_context):\n    # Return None to allow, dict to block\n    return None\n\nagent = Agent(before_tool_callback=validate)`,
    parameters: [
      { name: 'tool', type: 'BaseTool', description: 'The tool about to be executed' },
      { name: 'args', type: 'Dict[str, Any]', description: 'Arguments passed to the tool' },
      { name: 'tool_context', type: 'ToolContext', description: 'Context with session state and metadata' }
    ],
    tips: [
      'Use for security: validate user IDs, check permissions',
      'Access session state via tool_context.state',
      'Return a dict with error_message to block with explanation'
    ],
    docUrl: 'https://google.github.io/adk-docs/'
  },

  'tool-context': {
    id: 'tool-context',
    name: 'ToolContext',
    type: 'class',
    shortDescription: 'Context object for ADK tool callbacks',
    fullDescription: 'ToolContext provides access to session state and metadata within tool callbacks. Use tool_context.state to read and write session-level data for validation, logging, or state management during tool execution.',
    syntax: `from google.adk.tools.tool_context import ToolContext\n\ndef my_callback(tool, args, tool_context: ToolContext):\n    user_id = tool_context.state.get("session_user_id")`,
    tips: [
      'State is shared across all tools in a session',
      'Use state for permission checks and audit trails',
      'Changes to state persist for the session duration'
    ],
    docUrl: 'https://google.github.io/adk-docs/'
  },

  // ==================== LANGGRAPH ====================
  'state-graph': {
    id: 'state-graph',
    name: 'StateGraph',
    type: 'class',
    shortDescription: 'LangGraph state machine for agent workflows',
    fullDescription: 'StateGraph is the core building block of LangGraph. It defines a directed graph of nodes (processing functions) and edges (transitions). Each node receives and returns state, enabling complex multi-step agent workflows with conditional routing and cycles.',
    syntax: `from langgraph.graph import StateGraph, START, END\n\nbuilder = StateGraph(MyState)\nbuilder.add_node("step1", my_function)\nbuilder.add_edge(START, "step1")\ngraph = builder.compile()`,
    tips: [
      'Nodes are functions that receive state and return state updates',
      'Use add_conditional_edges for routing based on state',
      'compile() produces a runnable graph',
      'State persists across nodes within a single execution'
    ],
    docUrl: 'https://langchain-ai.github.io/langgraph/'
  },

  'conditional-edges': {
    id: 'conditional-edges',
    name: 'add_conditional_edges',
    type: 'method',
    shortDescription: 'Add routing logic between graph nodes',
    fullDescription: 'add_conditional_edges allows dynamic routing in a StateGraph based on the current state. A routing function examines the state and returns the name of the next node to execute. This enables loops, branching, and complex multi-step workflows.',
    syntax: `builder.add_conditional_edges(\n    "reflection",\n    evaluate_research,  # routing function\n    ["web_research", "finalize_answer"]  # possible targets\n)`,
    tips: [
      'The routing function returns a node name as a string',
      'Use for iterative loops (e.g., research → reflect → repeat)',
      'Can fan out to multiple nodes with Send objects for parallelism'
    ],
    docUrl: 'https://langchain-ai.github.io/langgraph/'
  },

  // ==================== CREWAI ====================
  'crewai-task': {
    id: 'crewai-task',
    name: 'Task (CrewAI)',
    type: 'class',
    shortDescription: 'Define tasks for CrewAI agents',
    fullDescription: 'A CrewAI Task defines work for an agent to complete. Tasks have descriptions, expected outputs, and can include guardrail functions for output validation. Use output_pydantic to enforce structured output schemas.',
    syntax: `from crewai import Task\n\ntask = Task(\n    description="Research topic...",\n    agent=researcher,\n    guardrail=validate_fn,\n    output_pydantic=OutputModel\n)`,
    parameters: [
      { name: 'description', type: 'str', description: 'What the agent should do' },
      { name: 'agent', type: 'Agent', description: 'The agent assigned to this task' },
      { name: 'guardrail', type: 'Callable', description: 'Validation function: (output) -> (bool, str)' },
      { name: 'output_pydantic', type: 'BaseModel', description: 'Pydantic model for structured output' }
    ],
    tips: [
      'guardrail function returns (True, output) to approve, (False, reason) to reject',
      'CrewAI auto-retries when guardrail rejects output',
      'Use context=[other_task] to chain task outputs'
    ],
    docUrl: 'https://docs.crewai.com/'
  },

  'pydantic-model': {
    id: 'pydantic-model',
    name: 'BaseModel (Pydantic)',
    type: 'class',
    shortDescription: 'Data validation with Python type annotations',
    fullDescription: 'Pydantic BaseModel provides automatic data validation using Python type hints. In agent systems, it enforces structured LLM outputs — the model must return data matching the schema or validation fails. Use model_validate() for parsing and model_dump_json() for serialization.',
    syntax: `from pydantic import BaseModel, Field\n\nclass MyOutput(BaseModel):\n    title: str = Field(description="...")\n    score: float = Field(ge=0.0, le=1.0)`,
    tips: [
      'Field descriptions help LLMs understand the expected format',
      'Use Field(ge=0, le=1) for range constraints',
      'model_validate(data) parses and validates dictionaries',
      'Combine with json.loads() for LLM output parsing'
    ],
    docUrl: 'https://docs.pydantic.dev/'
  },

  // ==================== GOOGLE GENERATIVE AI ====================
  'generative-ai': {
    id: 'generative-ai',
    name: 'google.generativeai',
    type: 'module',
    shortDescription: 'Google Generative AI Python SDK',
    fullDescription: 'The google-generativeai package provides access to Google Gemini models for text generation, evaluation, and embedding. Use genai.configure() to set up API keys and GenerativeModel to create model instances.',
    syntax: `import google.generativeai as genai\n\ngenai.configure(api_key=os.environ["GOOGLE_API_KEY"])\nmodel = genai.GenerativeModel("gemini-1.5-flash")`,
    tips: [
      'Install with: pip install google-generativeai',
      'Set GOOGLE_API_KEY environment variable',
      'Use response_mime_type="application/json" for structured output'
    ],
    docUrl: 'https://ai.google.dev/gemini-api/docs'
  },

  'generation-config': {
    id: 'generation-config',
    name: 'GenerationConfig',
    type: 'class',
    shortDescription: 'Configure generation parameters for Gemini models',
    fullDescription: 'GenerationConfig controls how Gemini models generate responses. Set temperature for creativity vs consistency, response_mime_type for structured output format, and other parameters like max_output_tokens.',
    syntax: `genai.types.GenerationConfig(\n    temperature=0.2,\n    response_mime_type="application/json"\n)`,
    parameters: [
      { name: 'temperature', type: 'float', description: 'Sampling temperature (0-2). Lower = deterministic', default: '1.0' },
      { name: 'response_mime_type', type: 'str', description: 'Output format: "text/plain" or "application/json"' },
      { name: 'max_output_tokens', type: 'int', description: 'Maximum tokens to generate' }
    ],
    tips: [
      'Use temperature=0.2 for evaluation/judge tasks',
      'response_mime_type="application/json" forces JSON output',
      'Lower temperature = more consistent but less creative'
    ],
    docUrl: 'https://ai.google.dev/gemini-api/docs/text-generation'
  }
};

/**
 * Get a code term by ID
 */
export function getCodeTerm(id: string): CodeTerm | undefined {
  return codeTerms[id];
}

/**
 * Get all terms of a specific type
 */
export function getTermsByType(type: CodeTerm['type']): CodeTerm[] {
  return Object.values(codeTerms).filter(term => term.type === type);
}

/**
 * Search terms by name or description
 */
export function searchTerms(query: string): CodeTerm[] {
  const lower = query.toLowerCase();
  return Object.values(codeTerms).filter(term =>
    term.name.toLowerCase().includes(lower) ||
    term.shortDescription.toLowerCase().includes(lower)
  );
}
