const e={langchain_openai:{id:"langchain_openai",name:"langchain_openai",type:"module",shortDescription:"OpenAI integration for LangChain",fullDescription:"The `langchain_openai` package provides integrations with OpenAI models. It includes ChatOpenAI for chat models and OpenAI for completion models. This is the recommended way to use OpenAI with LangChain as of 2024+.",syntax:"from langchain_openai import ChatOpenAI",tips:["Install with: pip install langchain-openai","Requires OPENAI_API_KEY environment variable","Supports both GPT-3.5 and GPT-4 models"],docUrl:"https://python.langchain.com/docs/integrations/platforms/openai/"},"langchain_core.prompts":{id:"langchain_core.prompts",name:"langchain_core.prompts",type:"module",shortDescription:"Core prompt templates for LangChain",fullDescription:"The prompts module contains classes for creating and managing prompt templates. These templates allow you to create reusable prompts with variable placeholders that get filled in at runtime.",syntax:"from langchain_core.prompts import ChatPromptTemplate",docUrl:"https://python.langchain.com/api_reference/core/prompts.html"},"langchain_core.runnables":{id:"langchain_core.runnables",name:"langchain_core.runnables",type:"module",shortDescription:"LCEL runnable building blocks",fullDescription:"The runnables module contains the composable building blocks for LCEL chains. It includes RunnablePassthrough (pass-through), RunnableParallel (fan-out), RunnableBranch (routing), and RunnableLambda (custom functions).",syntax:"from langchain_core.runnables import RunnablePassthrough, RunnableParallel, RunnableBranch",docUrl:"https://python.langchain.com/api_reference/core/runnables.html"},langchain_google_genai:{id:"langchain_google_genai",name:"langchain_google_genai",type:"module",shortDescription:"Google Gemini integration for LangChain",fullDescription:"The langchain-google-genai package provides LangChain integrations with Google's Gemini models. It includes ChatGoogleGenerativeAI for chat models and GoogleGenerativeAIEmbeddings for embeddings.",syntax:"from langchain_google_genai import ChatGoogleGenerativeAI",tips:["Install with: pip install langchain-google-genai","Requires GOOGLE_API_KEY environment variable","Drop-in replacement for langchain_openai in LCEL chains"],docUrl:"https://python.langchain.com/docs/integrations/chat/google_generative_ai/"},"langchain_core.output_parsers":{id:"langchain_core.output_parsers",name:"langchain_core.output_parsers",type:"module",shortDescription:"Output parsing utilities",fullDescription:"Output parsers transform the raw text output from language models into structured formats. They can parse JSON, extract specific fields, or simply convert messages to strings.",syntax:"from langchain_core.output_parsers import StrOutputParser, JsonOutputParser",docUrl:"https://python.langchain.com/api_reference/core/output_parsers.html"},ChatOpenAI:{id:"ChatOpenAI",name:"ChatOpenAI",type:"class",shortDescription:"OpenAI chat model wrapper",fullDescription:"ChatOpenAI is a wrapper around OpenAI's chat models (GPT-3.5-turbo, GPT-4, etc.). It implements the Runnable interface, making it composable with other LangChain components using LCEL (the | operator).",syntax:'llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)',parameters:[{name:"model",type:"str",description:"Model name to use",default:'"gpt-3.5-turbo"'},{name:"temperature",type:"float",description:"Sampling temperature (0-2). Lower = more deterministic",default:"0.7"},{name:"max_tokens",type:"int",description:"Maximum tokens to generate",default:"None"},{name:"api_key",type:"str",description:"OpenAI API key (or use env var)",default:"None"}],returns:{type:"ChatOpenAI",description:"A runnable chat model instance"},tips:["Use temperature=0 for consistent, deterministic outputs","GPT-4o-mini is cost-effective for most tasks","The model implements .invoke(), .stream(), and .batch() methods"],docUrl:"https://python.langchain.com/docs/integrations/chat/openai/"},ChatPromptTemplate:{id:"ChatPromptTemplate",name:"ChatPromptTemplate",type:"class",shortDescription:"Template for chat model prompts",fullDescription:"ChatPromptTemplate creates reusable prompt templates with variable placeholders. Variables are denoted with {curly_braces} and get filled in when the template is invoked. It's designed specifically for chat models and handles message formatting automatically.",syntax:'prompt = ChatPromptTemplate.from_template("Your prompt with {variable}")',parameters:[{name:"template",type:"str",description:"The prompt template string with {variables}"}],returns:{type:"ChatPromptTemplate",description:"A runnable prompt template"},example:`prompt = ChatPromptTemplate.from_template(
    "Translate {text} to {language}"
)
# Later: prompt.invoke({"text": "Hello", "language": "French"})`,tips:["Use descriptive variable names for clarity","Templates are immutable - create new ones for different prompts","Can also create from message lists for multi-turn conversations"],docUrl:"https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html"},StrOutputParser:{id:"StrOutputParser",name:"StrOutputParser",type:"class",shortDescription:"Converts LLM output to plain string",fullDescription:"StrOutputParser is a simple output parser that extracts the string content from an LLM response. Chat models return AIMessage objects, and this parser extracts just the text content, making it easier to work with in chains.",syntax:"parser = StrOutputParser()",returns:{type:"str",description:"The text content of the LLM response"},example:`from langchain_core.output_parsers import StrOutputParser

chain = prompt | llm | StrOutputParser()
result = chain.invoke({"topic": "AI"})
# result is now a plain string, not an AIMessage`,tips:["Always use at the end of chains when you need plain text","Without it, you get AIMessage objects with .content attribute","For structured output, use JsonOutputParser instead"],docUrl:"https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.string.StrOutputParser.html"},from_template:{id:"from_template",name:".from_template()",type:"method",shortDescription:"Create prompt from template string",fullDescription:"A class method that creates a ChatPromptTemplate from a simple template string. Variables in {curly_braces} become the input variables for the prompt. This is the most common way to create prompts.",syntax:'ChatPromptTemplate.from_template("Your {variable} here")',parameters:[{name:"template",type:"str",description:"Template string with {variable} placeholders"}],returns:{type:"ChatPromptTemplate",description:"A configured prompt template ready for use in chains"},example:`# Simple template
prompt = ChatPromptTemplate.from_template(
    "Summarize this text: {text}"
)

# Multiple variables
prompt = ChatPromptTemplate.from_template(
    "Write a {tone} email about {topic}"
)`,tips:["Variable names must be valid Python identifiers","Use meaningful names like {user_query} not {x}","The template string becomes a HumanMessage by default"]},invoke:{id:"invoke",name:".invoke()",type:"method",shortDescription:"Execute a chain with input",fullDescription:"The invoke() method runs a chain (or any Runnable) with the given input and returns the output. It's synchronous and waits for the complete result. All LCEL components implement this method.",syntax:'result = chain.invoke({"input_key": "value"})',parameters:[{name:"input",type:"dict | str",description:"Input data matching the chain's expected variables"}],returns:{type:"Any",description:"The output of the chain (type depends on the final component)"},example:`chain = prompt | llm | StrOutputParser()

# Single invocation
result = chain.invoke({"topic": "machine learning"})

# For batch processing, use .batch()
results = chain.batch([
    {"topic": "AI"},
    {"topic": "robotics"}
])`,tips:["Use .stream() for streaming responses","Use .batch() for processing multiple inputs efficiently","Use .ainvoke() for async operations"]},pipe_operator:{id:"pipe_operator",name:"| (Pipe Operator)",type:"operator",shortDescription:"Chain components together in LCEL",fullDescription:'The pipe operator (|) is the core of LangChain Expression Language (LCEL). It connects components so the output of one becomes the input of the next, similar to Unix pipes. This creates a "chain" that processes data through multiple steps.',syntax:"chain = component1 | component2 | component3",example:`# Basic chain: prompt → model → parser
chain = prompt | llm | StrOutputParser()

# The data flows like this:
# {"text": "hello"} → prompt → "Translate: hello" → llm → AIMessage → parser → "Bonjour"`,tips:["Read left-to-right: data flows through each component","Each component must accept the previous component's output type","You can also use .pipe() method: prompt.pipe(llm).pipe(parser)"],seeAlso:["invoke","RunnableSequence"]},LCEL:{id:"LCEL",name:"LCEL (LangChain Expression Language)",type:"concept",shortDescription:"Declarative way to compose chains",fullDescription:"LangChain Expression Language (LCEL) is a declarative way to compose chains using the pipe operator (|). It provides a standardized interface (Runnable) that all components implement, enabling seamless composition, streaming, batching, and async operations.",example:`# LCEL makes chain composition intuitive:
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
await chain.ainvoke(q)   # Async`,tips:["Every LCEL component implements invoke, stream, batch","Chains are lazy - they don't run until invoked","Use RunnableParallel for parallel operations","Use RunnableLambda to wrap custom functions"],docUrl:"https://python.langchain.com/docs/concepts/lcel/"},Runnable:{id:"Runnable",name:"Runnable Protocol",type:"concept",shortDescription:"Standard interface for LCEL components",fullDescription:"The Runnable protocol is the foundation of LCEL. Any class implementing Runnable can be composed with other Runnables using the pipe operator. It guarantees invoke(), stream(), batch(), and async variants are available.",tips:["All LangChain components (prompts, models, parsers) are Runnables","You can create custom Runnables with RunnableLambda","Runnables can be nested and combined freely"]},temperature:{id:"temperature",name:"temperature",type:"parameter",shortDescription:"Controls randomness in output",fullDescription:"Temperature controls the randomness/creativity of the model's output. A value of 0 makes the model deterministic (always choosing the most likely token), while higher values (up to 2) increase randomness and creativity.",example:`# Deterministic (for factual tasks)
llm = ChatOpenAI(temperature=0)

# Creative (for brainstorming)
llm = ChatOpenAI(temperature=0.9)

# Balanced (general purpose)
llm = ChatOpenAI(temperature=0.7)`,tips:["Use 0 for code generation, extraction, and factual tasks","Use 0.7-0.9 for creative writing and brainstorming","Values above 1.0 can produce incoherent output"]},RunnablePassthrough:{id:"RunnablePassthrough",name:"RunnablePassthrough",type:"class",shortDescription:"Pass input through unchanged",fullDescription:"RunnablePassthrough passes its input through unchanged. It's useful in parallel chains where you need to forward the original input alongside transformed data.",syntax:"from langchain_core.runnables import RunnablePassthrough",example:`chain = {
    "context": retriever,
    "question": RunnablePassthrough()
} | prompt | llm`,docUrl:"https://python.langchain.com/docs/how_to/passthrough/"},RunnableParallel:{id:"RunnableParallel",name:"RunnableParallel",type:"class",shortDescription:"Run multiple chains in parallel",fullDescription:"RunnableParallel allows you to run multiple Runnables in parallel and collect their outputs into a dictionary. You can also use dict syntax as shorthand.",syntax:`# Explicit
parallel = RunnableParallel({"a": chain_a, "b": chain_b})

# Dict shorthand (equivalent)
parallel = {"a": chain_a, "b": chain_b}`,example:`# Both chains run in parallel
chain = {
    "summary": summarize_chain,
    "keywords": extract_keywords_chain
} | combine_prompt | llm`,tips:["Dict syntax automatically creates RunnableParallel","Great for gathering context from multiple sources","All parallel branches receive the same input"]},chain_variable:{id:"chain_variable",name:"Chain Variable Passing",type:"concept",shortDescription:"How data flows between chain steps",fullDescription:'In LCEL, data flows through chains via dictionaries. When you use {"key": some_runnable}, the output of that runnable becomes available to the next component under that key name.',example:`# The extraction_chain output becomes "specifications"
chain = (
    {"specifications": extraction_chain}
    | transform_prompt  # Can use {specifications} in template
    | llm
    | StrOutputParser()
)`,tips:["Key names must match template variable names","Use descriptive keys for maintainability","You can pass multiple values in parallel using dict syntax"]},"google.adk.agents":{id:"google.adk.agents",name:"google.adk.agents",type:"module",shortDescription:"Google Agent Development Kit agents module",fullDescription:"The google.adk.agents module provides the core agent classes for building AI agents with Google's Agent Development Kit. It includes Agent for single agents and orchestrator types like SequentialAgent and ParallelAgent.",syntax:"from google.adk.agents import Agent, SequentialAgent",tips:["ADK uses Gemini models by default","Agents communicate through shared state","Install with: pip install google-adk"],docUrl:"https://google.github.io/adk-docs/"},Agent:{id:"Agent",name:"Agent",type:"class",shortDescription:"Google ADK base agent class",fullDescription:"The Agent class is the fundamental building block in Google ADK. Each Agent has a name, model, instruction (system prompt), and optional tools. Agents can access shared state and communicate with other agents through state flags.",syntax:`agent = Agent(
    name="my_agent",
    model="gemini-2.0-flash-exp",
    instruction="Your system prompt here",
    tools=[tool1, tool2]
)`,parameters:[{name:"name",type:"str",description:"Unique identifier for the agent"},{name:"model",type:"str",description:"Gemini model to use",default:'"gemini-2.0-flash-exp"'},{name:"instruction",type:"str",description:"System prompt defining agent behavior"},{name:"tools",type:"list",description:"List of tool functions the agent can use",default:"[]"}],returns:{type:"Agent",description:"An agent instance ready for execution"},tips:["Use descriptive names for debugging multi-agent systems","Instructions should be clear and specific about the agent's role",'Access shared state via state["key"] in instructions'],docUrl:"https://google.github.io/adk-docs/"},SequentialAgent:{id:"SequentialAgent",name:"SequentialAgent",type:"class",shortDescription:"Orchestrator that runs agents in order",fullDescription:"SequentialAgent is an orchestrator that executes sub-agents in a strict sequence. Each agent runs to completion before the next begins, ensuring predictable execution order. Agents can communicate via shared state.",syntax:`orchestrator = SequentialAgent(
    name="my_pipeline",
    sub_agents=[agent1, agent2, agent3]
)`,parameters:[{name:"name",type:"str",description:"Unique identifier for the orchestrator"},{name:"sub_agents",type:"list[Agent]",description:"Ordered list of agents to execute"}],returns:{type:"SequentialAgent",description:"An orchestrator agent that runs sub-agents in sequence"},example:`# Fallback pattern: primary → fallback → response
orchestrator = SequentialAgent(
    name="robust_agent",
    sub_agents=[primary_handler, fallback_handler, response_agent]
)`,tips:["Order matters! Agents run in the order provided",'Use state flags to signal between agents (e.g., state["primary_failed"])',"Each agent sees the state updates from previous agents"],seeAlso:["Agent","ParallelAgent","state"],docUrl:"https://google.github.io/adk-docs/"},ParallelAgent:{id:"ParallelAgent",name:"ParallelAgent",type:"class",shortDescription:"Orchestrator that runs agents concurrently",fullDescription:"ParallelAgent executes multiple sub-agents concurrently. All agents start at the same time and run in parallel. Useful when tasks are independent and can be performed simultaneously for better performance.",syntax:`orchestrator = ParallelAgent(
    name="parallel_tasks",
    sub_agents=[agent1, agent2, agent3]
)`,parameters:[{name:"name",type:"str",description:"Unique identifier for the orchestrator"},{name:"sub_agents",type:"list[Agent]",description:"List of agents to execute in parallel"}],tips:["Use for independent tasks that don't depend on each other","Results are collected after all agents complete","Be careful with shared state - parallel writes can conflict"],seeAlso:["Agent","SequentialAgent"],docUrl:"https://google.github.io/adk-docs/"},state:{id:"state",name:"state (ADK)",type:"concept",shortDescription:"Shared memory between agents",fullDescription:'In Google ADK, state is a shared dictionary that persists across agent executions. Agents can read and write to state to communicate with each other. State keys can be referenced in agent instructions using state["key"] syntax.',example:`# Agent 1 sets a flag
instruction = """
If the lookup fails, set state["primary_failed"] = True.
"""

# Agent 2 checks the flag
instruction = """
Check if state["primary_failed"] is True.
If so, use the fallback approach.
"""`,tips:['Use descriptive key names like state["location_result"]',"State persists across the entire agent session","Great for implementing patterns like fallback and escalation"],seeAlso:["Agent","SequentialAgent"]},sub_agents:{id:"sub_agents",name:"sub_agents",type:"parameter",shortDescription:"List of child agents for orchestrators",fullDescription:"The sub_agents parameter in SequentialAgent and ParallelAgent specifies which agents to orchestrate. For SequentialAgent, order matters. For ParallelAgent, all run concurrently.",syntax:"sub_agents=[agent1, agent2, agent3]",tips:["Agents are executed in list order for SequentialAgent","Each agent should have a unique name","Agents can be other orchestrators (nesting is allowed)"]},instruction:{id:"instruction",name:"instruction",type:"parameter",shortDescription:"System prompt for ADK agents",fullDescription:"The instruction parameter defines the agent's behavior through a system prompt. It tells the agent what role it plays, what tools to use, and how to interact with state. Triple-quoted strings allow multi-line instructions.",example:`instruction="""
You are a technical support specialist.
1. Use troubleshoot_issue tool for technical problems.
2. Use create_ticket for persistent issues.
3. Use escalate_to_human for complex cases.
Check state["customer_info"] for personalization.
"""`,tips:["Be specific about when to use each tool","Reference state keys the agent should read/write","Include decision logic for different scenarios"]},CallbackContext:{id:"CallbackContext",name:"CallbackContext",type:"class",shortDescription:"Context object for ADK callbacks",fullDescription:"CallbackContext provides access to the agent's state and session information within callback functions. Use it to read/modify state or access metadata about the current execution.",syntax:"from google.adk.callbacks import CallbackContext",example:`def my_callback(callback_context: CallbackContext, llm_request: LlmRequest):
    # Access state
    customer_info = callback_context.state.get("customer_info")
    # Modify request based on state
    return None  # Continue with modified request`,tips:["callback_context.state gives access to shared state","Return None to continue, return modified request to alter it","Great for adding personalization or context"]},LlmRequest:{id:"LlmRequest",name:"LlmRequest",type:"class",shortDescription:"Request object for LLM calls",fullDescription:"LlmRequest represents the request being sent to the language model. Callbacks can inspect and modify this request before it reaches the LLM, enabling dynamic prompt injection, personalization, and context enrichment.",syntax:"from google.adk.models.llm import LlmRequest",example:`def personalization_callback(ctx: CallbackContext, req: LlmRequest):
    # Access and modify the request contents
    if req.contents:
        # Add a system message
        system_content = types.Content(
            role="system",
            parts=[types.Part(text="Custom context here")]
        )
        req.contents.insert(0, system_content)
    return None`,tips:["req.contents contains the conversation messages","Modify contents to inject context or instructions","Return None to continue with modifications"]},heapq:{id:"heapq",name:"heapq",type:"module",shortDescription:"Python priority queue implementation",fullDescription:"The heapq module provides an implementation of the heap queue algorithm (priority queue). It maintains a list where the smallest element is always at index 0, enabling efficient priority-based task scheduling.",syntax:"import heapq",example:`import heapq

# Create a priority queue
tasks = []
heapq.heappush(tasks, (1, "high priority"))
heapq.heappush(tasks, (3, "low priority"))
heapq.heappush(tasks, (2, "medium priority"))

# Pop tasks in priority order
while tasks:
    priority, task = heapq.heappop(tasks)
    print(f"Processing: {task}")`,tips:["Lower numbers = higher priority (min-heap)","Use tuples: (priority, item) for prioritization","heappop() always returns the smallest item"],docUrl:"https://docs.python.org/3/library/heapq.html"},heappush:{id:"heappush",name:"heapq.heappush()",type:"function",shortDescription:"Add item to priority queue",fullDescription:"heappush() adds an item to a heap while maintaining the heap property. The smallest item stays at index 0. Time complexity is O(log n).",syntax:"heapq.heappush(heap, item)",parameters:[{name:"heap",type:"list",description:"The heap list to push onto"},{name:"item",type:"Any",description:"The item to add (use tuple for priority)"}],example:`heapq.heappush(tasks, (1, "urgent task"))
heapq.heappush(tasks, (5, "low priority task"))`,tips:["The list must already be a valid heap (or empty)","Use negative priorities for max-heap behavior"]},heappop:{id:"heappop",name:"heapq.heappop()",type:"function",shortDescription:"Remove and return smallest item",fullDescription:"heappop() removes and returns the smallest item from the heap while maintaining the heap property. This is the core operation for priority queue dequeuing.",syntax:"item = heapq.heappop(heap)",parameters:[{name:"heap",type:"list",description:"The heap list to pop from"}],returns:{type:"Any",description:"The smallest item from the heap"},example:`# Process tasks in priority order
while tasks:
    priority, task = heapq.heappop(tasks)
    process(task)`,tips:["Raises IndexError if heap is empty","Check len(heap) > 0 before popping"]},escalation:{id:"escalation",name:"Escalation",type:"concept",shortDescription:"Transferring to human operators",fullDescription:"Escalation is the process of transferring control from an automated agent to a human operator. It's triggered when the agent encounters situations beyond its capability, high-stakes decisions, or requests for human expertise.",example:`def escalate_to_human(issue_type: str) -> dict:
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
"""`,tips:["Define clear escalation triggers in instructions","Always inform the user about the escalation","Log escalation reasons for improving the agent"]},fallback:{id:"fallback",name:"Fallback Pattern",type:"concept",shortDescription:"Alternative action when primary fails",fullDescription:"The fallback pattern provides alternative approaches when the primary method fails. In ADK, this is typically implemented using SequentialAgent where a fallback handler checks state flags set by the primary handler.",example:`# Primary sets flag on failure
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
)`,tips:["Use state flags to communicate failure","Fallback should be less precise but more reliable","Consider multiple fallback levels"],seeAlso:["SequentialAgent","state","escalation"]},graceful_degradation:{id:"graceful_degradation",name:"Graceful Degradation",type:"concept",shortDescription:"Maintaining partial functionality during failures",fullDescription:"Graceful degradation means continuing to operate with reduced capabilities rather than failing completely. When a premium feature fails, the agent provides basic functionality and informs the user of limitations.",example:`# In agent instruction:
instruction = """
If precise location lookup fails:
1. Try general area lookup instead
2. Inform user: "I found the general area, but couldn't get exact coordinates"
3. Still provide value with available information
"""`,tips:["Always provide some value to the user","Be transparent about reduced functionality","Log degradation events for monitoring"]},retry_strategy:{id:"retry_strategy",name:"Retry Strategy",type:"concept",shortDescription:"Automatic retries with backoff",fullDescription:"Retry strategies handle transient failures by automatically retrying operations with increasing delays (exponential backoff). This prevents overwhelming failing services while still attempting recovery.",example:`import time

def retry_with_backoff(func, max_retries=3):
    for attempt in range(max_retries):
        try:
            return func()
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            delay = 2 ** attempt  # 1s, 2s, 4s
            time.sleep(delay)`,tips:["Exponential backoff: 1s, 2s, 4s, 8s...","Set a maximum retry count","Only retry transient errors, not permanent ones"]},"openai-client":{id:"openai-client",name:"OpenAI",type:"class",shortDescription:"OpenAI Python SDK client",fullDescription:"The OpenAI class is the main client for the OpenAI Python SDK. It provides access to chat completions, embeddings, and other API endpoints. Initialize it with your API key to start making requests.",syntax:`from openai import OpenAI
client = OpenAI(api_key="...")`,tips:["Set OPENAI_API_KEY env var instead of passing key directly","The client is thread-safe and can be reused across requests","Use AsyncOpenAI for async applications"],docUrl:"https://platform.openai.com/docs/libraries/python-library"},"chat-completions":{id:"chat-completions",name:"chat.completions.create",type:"method",shortDescription:"Generate chat completions from OpenAI models",fullDescription:"The chat.completions.create method sends a list of messages to an OpenAI model and receives a generated response. Messages include roles (system, user, assistant) and content. This is the primary API for conversational AI.",syntax:`client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello"}],
    temperature=0
)`,parameters:[{name:"model",type:"str",description:'Model ID (e.g., "gpt-4o", "gpt-4o-mini", "o4-mini")'},{name:"messages",type:"list[dict]",description:"Conversation messages with role and content"},{name:"temperature",type:"float",description:"Sampling temperature (0-2). Lower = more deterministic",default:"1.0"}],tips:["Use temperature=0 for classification tasks","gpt-4o-mini is 10-20x cheaper than gpt-4o for simple tasks","Access response: response.choices[0].message.content"],docUrl:"https://platform.openai.com/docs/api-reference/chat/create"},"base-agent":{id:"base-agent",name:"BaseAgent",type:"class",shortDescription:"Abstract base for custom ADK agents",fullDescription:"BaseAgent is the abstract base class for building custom agents in Google ADK. Override _run_async_impl to define custom behavior like routing, orchestration, or specialized processing. Use this when the built-in Agent class is insufficient.",syntax:`from google.adk.agents import BaseAgent

class MyAgent(BaseAgent):
    async def _run_async_impl(self, context):
        yield Event(author=self.name, content=result)`,tips:["Override _run_async_impl for custom logic","Yield Event objects to produce output","Use for routers, orchestrators, or custom processing pipelines"],docUrl:"https://google.github.io/adk-docs/"},"agent-tool":{id:"agent-tool",name:"AgentTool",type:"class",shortDescription:"Wrap an agent as a tool for another agent",fullDescription:"AgentTool wraps an ADK Agent so it can be used as a tool by another agent. This enables agent composition — a root agent can delegate to specialized sub-agents by calling them as tools.",syntax:`from google.adk.tools import agent_tool

tools=[agent_tool.AgentTool(agent=my_agent)]`,tips:["The root agent decides when to call each sub-agent","Sub-agents can have different models (cost optimization)","Combine with search and code execution agents for ReAct"],docUrl:"https://google.github.io/adk-docs/"},"code-executor":{id:"code-executor",name:"BuiltInCodeExecutor",type:"class",shortDescription:"Execute code within ADK agents",fullDescription:"BuiltInCodeExecutor enables ADK agents to write and execute Python code during their reasoning process. This is essential for agents that need to perform calculations, data processing, or verify their logic programmatically.",syntax:`from google.adk.code_executors import BuiltInCodeExecutor

agent = Agent(
    code_executor=[BuiltInCodeExecutor]
)`,tips:["Code execution runs in a sandboxed environment","Useful for math, data analysis, and verification tasks","Combine with search agents for ReAct-style reasoning"],docUrl:"https://google.github.io/adk-docs/"},"before-tool-callback":{id:"before-tool-callback",name:"before_tool_callback",type:"parameter",shortDescription:"ADK hook to validate tool calls before execution",fullDescription:"The before_tool_callback parameter on ADK agents registers a function that runs before every tool execution. It receives the tool, its arguments, and a context object. Return None to allow execution or return a dict to block it with an error message.",syntax:`def validate(tool, args, tool_context):
    # Return None to allow, dict to block
    return None

agent = Agent(before_tool_callback=validate)`,parameters:[{name:"tool",type:"BaseTool",description:"The tool about to be executed"},{name:"args",type:"Dict[str, Any]",description:"Arguments passed to the tool"},{name:"tool_context",type:"ToolContext",description:"Context with session state and metadata"}],tips:["Use for security: validate user IDs, check permissions","Access session state via tool_context.state","Return a dict with error_message to block with explanation"],docUrl:"https://google.github.io/adk-docs/"},"tool-context":{id:"tool-context",name:"ToolContext",type:"class",shortDescription:"Context object for ADK tool callbacks",fullDescription:"ToolContext provides access to session state and metadata within tool callbacks. Use tool_context.state to read and write session-level data for validation, logging, or state management during tool execution.",syntax:`from google.adk.tools.tool_context import ToolContext

def my_callback(tool, args, tool_context: ToolContext):
    user_id = tool_context.state.get("session_user_id")`,tips:["State is shared across all tools in a session","Use state for permission checks and audit trails","Changes to state persist for the session duration"],docUrl:"https://google.github.io/adk-docs/"},"state-graph":{id:"state-graph",name:"StateGraph",type:"class",shortDescription:"LangGraph state machine for agent workflows",fullDescription:"StateGraph is the core building block of LangGraph. It defines a directed graph of nodes (processing functions) and edges (transitions). Each node receives and returns state, enabling complex multi-step agent workflows with conditional routing and cycles.",syntax:`from langgraph.graph import StateGraph, START, END

builder = StateGraph(MyState)
builder.add_node("step1", my_function)
builder.add_edge(START, "step1")
graph = builder.compile()`,tips:["Nodes are functions that receive state and return state updates","Use add_conditional_edges for routing based on state","compile() produces a runnable graph","State persists across nodes within a single execution"],docUrl:"https://langchain-ai.github.io/langgraph/"},"conditional-edges":{id:"conditional-edges",name:"add_conditional_edges",type:"method",shortDescription:"Add routing logic between graph nodes",fullDescription:"add_conditional_edges allows dynamic routing in a StateGraph based on the current state. A routing function examines the state and returns the name of the next node to execute. This enables loops, branching, and complex multi-step workflows.",syntax:`builder.add_conditional_edges(
    "reflection",
    evaluate_research,  # routing function
    ["web_research", "finalize_answer"]  # possible targets
)`,tips:["The routing function returns a node name as a string","Use for iterative loops (e.g., research → reflect → repeat)","Can fan out to multiple nodes with Send objects for parallelism"],docUrl:"https://langchain-ai.github.io/langgraph/"},"crewai-task":{id:"crewai-task",name:"Task (CrewAI)",type:"class",shortDescription:"Define tasks for CrewAI agents",fullDescription:"A CrewAI Task defines work for an agent to complete. Tasks have descriptions, expected outputs, and can include guardrail functions for output validation. Use output_pydantic to enforce structured output schemas.",syntax:`from crewai import Task

task = Task(
    description="Research topic...",
    agent=researcher,
    guardrail=validate_fn,
    output_pydantic=OutputModel
)`,parameters:[{name:"description",type:"str",description:"What the agent should do"},{name:"agent",type:"Agent",description:"The agent assigned to this task"},{name:"guardrail",type:"Callable",description:"Validation function: (output) -> (bool, str)"},{name:"output_pydantic",type:"BaseModel",description:"Pydantic model for structured output"}],tips:["guardrail function returns (True, output) to approve, (False, reason) to reject","CrewAI auto-retries when guardrail rejects output","Use context=[other_task] to chain task outputs"],docUrl:"https://docs.crewai.com/"},"pydantic-model":{id:"pydantic-model",name:"BaseModel (Pydantic)",type:"class",shortDescription:"Data validation with Python type annotations",fullDescription:"Pydantic BaseModel provides automatic data validation using Python type hints. In agent systems, it enforces structured LLM outputs — the model must return data matching the schema or validation fails. Use model_validate() for parsing and model_dump_json() for serialization.",syntax:`from pydantic import BaseModel, Field

class MyOutput(BaseModel):
    title: str = Field(description="...")
    score: float = Field(ge=0.0, le=1.0)`,tips:["Field descriptions help LLMs understand the expected format","Use Field(ge=0, le=1) for range constraints","model_validate(data) parses and validates dictionaries","Combine with json.loads() for LLM output parsing"],docUrl:"https://docs.pydantic.dev/"},"generative-ai":{id:"generative-ai",name:"google.generativeai",type:"module",shortDescription:"Google Generative AI Python SDK",fullDescription:"The google-generativeai package provides access to Google Gemini models for text generation, evaluation, and embedding. Use genai.configure() to set up API keys and GenerativeModel to create model instances.",syntax:`import google.generativeai as genai

genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
model = genai.GenerativeModel("gemini-1.5-flash")`,tips:["Install with: pip install google-generativeai","Set GOOGLE_API_KEY environment variable",'Use response_mime_type="application/json" for structured output'],docUrl:"https://ai.google.dev/gemini-api/docs"},"generation-config":{id:"generation-config",name:"GenerationConfig",type:"class",shortDescription:"Configure generation parameters for Gemini models",fullDescription:"GenerationConfig controls how Gemini models generate responses. Set temperature for creativity vs consistency, response_mime_type for structured output format, and other parameters like max_output_tokens.",syntax:`genai.types.GenerationConfig(
    temperature=0.2,
    response_mime_type="application/json"
)`,parameters:[{name:"temperature",type:"float",description:"Sampling temperature (0-2). Lower = deterministic",default:"1.0"},{name:"response_mime_type",type:"str",description:'Output format: "text/plain" or "application/json"'},{name:"max_output_tokens",type:"int",description:"Maximum tokens to generate"}],tips:["Use temperature=0.2 for evaluation/judge tasks",'response_mime_type="application/json" forces JSON output',"Lower temperature = more consistent but less creative"],docUrl:"https://ai.google.dev/gemini-api/docs/text-generation"},PromptTemplate:{id:"PromptTemplate",name:"PromptTemplate",type:"class",shortDescription:"Simple string prompt template",fullDescription:"PromptTemplate creates reusable prompt templates with placeholder variables using {curly_braces}. Unlike ChatPromptTemplate (which formats messages for chat models), PromptTemplate produces a single string. Used with the older LLMChain/SequentialChain API.",syntax:`PromptTemplate(
    input_variables=["topic"],
    template="Write about {topic}"
)`,parameters:[{name:"input_variables",type:"list[str]",description:"Variable names that appear in the template"},{name:"template",type:"str",description:"Template string with {variable} placeholders"}],returns:{type:"PromptTemplate",description:"A prompt template ready for use in chains"},tips:["input_variables must match the {variables} in the template string","For chat models, prefer ChatPromptTemplate.from_messages()","This is the older API — LCEL with ChatPromptTemplate is now recommended"],docUrl:"https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.prompt.PromptTemplate.html"},LLMChain:{id:"LLMChain",name:"LLMChain",type:"class",shortDescription:"Pairs a prompt with an LLM (legacy)",fullDescription:"LLMChain combines a PromptTemplate with an LLM and an optional output_key. When invoked, it fills the template with input data, sends it to the LLM, and returns the result under the specified output_key. This is the legacy API — modern code uses LCEL pipe syntax instead.",syntax:'LLMChain(llm=llm, prompt=my_prompt, output_key="result")',parameters:[{name:"llm",type:"BaseLLM",description:"The language model to use"},{name:"prompt",type:"PromptTemplate",description:"The prompt template"},{name:"output_key",type:"str",description:"Name for this chain's output",default:'"text"'}],tips:["output_key names how the next step references this chain's output","Modern equivalent: prompt | llm | StrOutputParser()","Still useful for understanding chain composition concepts"],docUrl:"https://python.langchain.com/docs/versions/migrating_chains/llm_chain/"},SequentialChain:{id:"SequentialChain",name:"SequentialChain",type:"class",shortDescription:"Chains multiple LLMChains in sequence (legacy)",fullDescription:"SequentialChain orchestrates multiple LLMChains so the output of one feeds into the next. Each chain's output_key must match the next chain's input_variables. This is the legacy API — modern code uses LCEL pipe chains instead.",syntax:`SequentialChain(
    chains=[chain1, chain2, chain3],
    input_variables=["document"],
    output_variables=["topics", "summary", "actions"]
)`,parameters:[{name:"chains",type:"list[Chain]",description:"Ordered list of chains to execute"},{name:"input_variables",type:"list[str]",description:"Initial input variable names"},{name:"output_variables",type:"list[str]",description:"Which chain outputs to include in result"}],tips:["Include intermediate outputs in output_variables for debugging","output_key of chain N must match input_variables of chain N+1","Modern equivalent: chain1 | chain2 | chain3 using LCEL"],docUrl:"https://python.langchain.com/docs/versions/migrating_chains/sequential_chain/"},RunnableBranch:{id:"RunnableBranch",name:"RunnableBranch",type:"class",shortDescription:"Conditional routing between chains",fullDescription:"RunnableBranch routes input to different processing chains based on conditions. It takes a list of (condition, runnable) pairs and a default runnable. The first condition that returns True determines which chain runs — similar to if/elif/else logic.",syntax:`RunnableBranch(
    (lambda x: "booking" in x, booking_chain),
    (lambda x: "info" in x, info_chain),
    default_chain
)`,example:`from langchain_core.runnables import RunnableBranch

router = RunnableBranch(
    (lambda x: x["category"] == "booking", booking_handler),
    (lambda x: x["category"] == "support", support_handler),
    general_handler  # default
)`,tips:["Conditions are evaluated in order — first True wins","The last argument (no condition) is the default/fallback","Use with a classifier chain for intelligent routing"],docUrl:"https://python.langchain.com/docs/how_to/routing/"},ChatGoogleGenerativeAI:{id:"ChatGoogleGenerativeAI",name:"ChatGoogleGenerativeAI",type:"class",shortDescription:"Google Gemini chat model for LangChain",fullDescription:"ChatGoogleGenerativeAI wraps Google's Gemini models for use in LangChain chains. It implements the same Runnable interface as ChatOpenAI, so you can swap between providers without changing your chain logic.",syntax:`from langchain_google_genai import ChatGoogleGenerativeAI

llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0)`,parameters:[{name:"model",type:"str",description:'Gemini model name (e.g., "gemini-2.0-flash", "gemini-2.5-flash")'},{name:"temperature",type:"float",description:"Sampling temperature (0-2)",default:"0.7"},{name:"google_api_key",type:"str",description:"API key (or use GOOGLE_API_KEY env var)",default:"None"}],tips:["Install with: pip install langchain-google-genai","Requires GOOGLE_API_KEY environment variable","Drop-in replacement for ChatOpenAI in any LCEL chain"],docUrl:"https://python.langchain.com/docs/integrations/chat/google_generative_ai/"},from_messages:{id:"from_messages",name:".from_messages()",type:"method",shortDescription:"Create prompt from message list",fullDescription:"Creates a ChatPromptTemplate from a list of (role, content) tuples. This is the preferred way to create prompts for chat models because it gives explicit control over system, user, and assistant messages. Variables use {curly_braces}.",syntax:`ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant."),
    ("human", "Analyze this: {input}")
])`,parameters:[{name:"messages",type:"list[tuple]",description:'List of (role, template) pairs. Roles: "system", "human", "ai"'}],returns:{type:"ChatPromptTemplate",description:"A configured prompt template with multi-role messages"},example:`prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a {role} specialist."),
    ("human", "Help me with: {question}")
])

# Invoke with variables
chain = prompt | llm | StrOutputParser()
result = chain.invoke({"role": "Python", "question": "decorators"})`,tips:['Use "system" for behavior instructions, "human" for user input',"Preferred over from_template() for multi-turn conversations","Variables in any role message become input parameters"]},ainvoke:{id:"ainvoke",name:".ainvoke()",type:"method",shortDescription:"Async version of invoke",fullDescription:"ainvoke() is the async version of invoke(). It runs a chain asynchronously, enabling concurrent execution of multiple chains or integration with async web frameworks like FastAPI. All LCEL components support ainvoke().",syntax:'result = await chain.ainvoke({"input_key": "value"})',parameters:[{name:"input",type:"dict | str",description:"Input data matching the chain's expected variables"}],returns:{type:"Any",description:"The output of the chain (same as invoke but async)"},example:`import asyncio

async def run_parallel():
    # Run multiple chains concurrently
    results = await asyncio.gather(
        chain1.ainvoke({"topic": "AI"}),
        chain2.ainvoke({"topic": "ML"})
    )
    return results`,tips:["Must be called with await inside an async function","Use asyncio.gather() to run multiple ainvoke() calls in parallel","Essential for parallelization patterns (Chapter 3)"]},tool_decorator:{id:"tool_decorator",name:"@tool",type:"function",shortDescription:"Decorator to define agent tools",fullDescription:"The @tool decorator converts a regular Python function into a tool that LLM agents can call. The function's docstring becomes the tool description the model sees, and type hints define the parameter schema. This is how you give agents capabilities beyond text generation.",syntax:`from langchain_core.tools import tool

@tool
def my_tool(param: str) -> str:
    """Description the LLM sees."""
    return result`,example:`@tool
def get_weather(city: str) -> str:
    """Get current weather for a city."""
    # API call here
    return f"Weather in {city}: 72°F, sunny"`,tips:["The docstring is critical — it tells the LLM when to use this tool","Use clear type hints for parameter and return types","The LLM decides when to call tools based on the user query"],docUrl:"https://python.langchain.com/docs/how_to/custom_tools/"},AgentExecutor:{id:"AgentExecutor",name:"AgentExecutor",type:"class",shortDescription:"Runs agent with tools in a loop",fullDescription:"AgentExecutor is the runtime that manages the agent loop: it sends the query to the LLM, executes any tool calls the LLM makes, feeds results back, and repeats until the LLM produces a final answer. It handles tool errors, output parsing, and iteration limits.",syntax:`from langchain.agents import AgentExecutor

executor = AgentExecutor(
    agent=agent,
    tools=tools,
    verbose=True
)`,parameters:[{name:"agent",type:"Agent",description:"The agent (created by create_tool_calling_agent)"},{name:"tools",type:"list[Tool]",description:"Tools the agent can use"},{name:"verbose",type:"bool",description:"Print agent reasoning steps",default:"False"}],tips:["verbose=True shows the agent's thought process step by step","Set max_iterations to prevent infinite loops","The executor handles tool errors gracefully"],docUrl:"https://python.langchain.com/docs/how_to/agent_executor/"},create_tool_calling_agent:{id:"create_tool_calling_agent",name:"create_tool_calling_agent",type:"function",shortDescription:"Create an agent that calls tools",fullDescription:"create_tool_calling_agent creates a LangChain agent that uses the model's native function/tool calling API. The agent receives a prompt and a list of tools, and uses the LLM's built-in tool-calling capability to decide which tools to invoke.",syntax:`from langchain.agents import create_tool_calling_agent

agent = create_tool_calling_agent(llm, tools, prompt)`,parameters:[{name:"llm",type:"BaseChatModel",description:"Chat model with tool calling support"},{name:"tools",type:"list[Tool]",description:"Tools the agent can use"},{name:"prompt",type:"ChatPromptTemplate",description:"Prompt with agent_scratchpad placeholder"}],tips:["The prompt must include a {agent_scratchpad} variable","Use with AgentExecutor to run the agent loop","Supports any model with native tool calling (GPT-4, Gemini, Claude)"],docUrl:"https://python.langchain.com/docs/how_to/agent_executor/"},ConversationBufferMemory:{id:"ConversationBufferMemory",name:"ConversationBufferMemory",type:"class",shortDescription:"Stores full conversation history",fullDescription:"ConversationBufferMemory stores the complete conversation history as a list of messages. It's the simplest memory type — every message is kept. For long conversations, consider ConversationSummaryMemory which compresses older messages.",syntax:`from langchain.memory import ConversationBufferMemory

memory = ConversationBufferMemory(memory_key="history")`,parameters:[{name:"memory_key",type:"str",description:"Key to store conversation under",default:'"history"'},{name:"return_messages",type:"bool",description:"Return as message objects vs string",default:"False"}],example:`memory = ConversationBufferMemory(memory_key="history")
memory.save_context(
    {"input": "Hi, I'm Alice"},
    {"output": "Hello Alice! How can I help?"}
)
print(memory.load_memory_variables({}))`,tips:["Use memory_key to name the variable your prompt references","save_context() adds a human-AI turn pair","Token usage grows linearly — use summary memory for long chats"],docUrl:"https://python.langchain.com/docs/versions/migrating_memory/"},InMemoryStore:{id:"InMemoryStore",name:"InMemoryStore",type:"class",shortDescription:"LangGraph in-memory state storage",fullDescription:"InMemoryStore provides in-memory storage for LangGraph agent state. It stores data in namespaced key-value pairs, enabling per-user or per-session memory isolation. Data is lost when the process ends — use a database-backed store for persistence.",syntax:`from langgraph.store.memory import InMemoryStore

store = InMemoryStore()`,example:`store = InMemoryStore()

# Store data with namespace isolation
store.put(("user", "alice"), "preferences", {"theme": "dark"})

# Retrieve data
result = store.get(("user", "alice"), "preferences")`,tips:['Use namespaces like ("user", user_id) for per-user isolation',"Data is ephemeral — lost on restart","For production, use PostgresStore or similar persistent backend"],docUrl:"https://langchain-ai.github.io/langgraph/reference/store/"},FastMCP:{id:"FastMCP",name:"FastMCP",type:"class",shortDescription:"Quick MCP server framework",fullDescription:'FastMCP is a lightweight framework for building Model Context Protocol (MCP) servers. It provides decorators to expose Python functions as tools that any MCP-compatible agent can discover and call. Think of it as "FastAPI for AI tools."',syntax:`from fastmcp import FastMCP

mcp = FastMCP("my_server")

@mcp.tool()
def my_tool(param: str) -> str:
    return result`,example:`from fastmcp import FastMCP

mcp = FastMCP("weather_server")

@mcp.tool()
def get_weather(city: str) -> str:
    """Get weather for a city."""
    return f"Weather in {city}: sunny, 72°F"

mcp.run()`,tips:["Install with: pip install fastmcp","Docstrings become tool descriptions for the agent","Supports both STDIO and HTTP transport modes"],docUrl:"https://gofastmcp.com/"},MCPToolset:{id:"MCPToolset",name:"MCPToolset",type:"class",shortDescription:"Connect ADK agents to MCP servers",fullDescription:"MCPToolset connects Google ADK agents to MCP servers, allowing agents to discover and use tools exposed by any MCP-compatible server. It handles the protocol handshake, tool discovery, and request/response marshaling.",syntax:`from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset
from mcp import StdioServerParameters

tools = MCPToolset(
    connection_params=StdioServerParameters(...),
    tool_filter=["tool_name"]
)`,parameters:[{name:"connection_params",type:"ServerParameters",description:"How to connect to the MCP server (STDIO or HTTP)"},{name:"tool_filter",type:"list[str]",description:"Only expose these tools to the agent",default:"None (all tools)"}],tips:["Use tool_filter to limit which tools the agent can access","StdioServerParameters for local servers, HttpServerParameters for remote","The agent automatically discovers tool schemas from the server"],docUrl:"https://google.github.io/adk-docs/"},LlmAgent:{id:"LlmAgent",name:"LlmAgent",type:"class",shortDescription:"ADK agent with LLM integration",fullDescription:"LlmAgent is a Google ADK agent type that integrates directly with a language model. Unlike the base Agent class, LlmAgent provides explicit control over model selection, output handling (via output_key), and tool integration. Used when you need fine-grained control over the LLM interaction.",syntax:`from google.adk.agents import LlmAgent

agent = LlmAgent(
    name="my_agent",
    model="gemini-2.0-flash",
    instruction="Your prompt here",
    tools=[...]
)`,parameters:[{name:"name",type:"str",description:"Unique agent identifier"},{name:"model",type:"str",description:"LLM model to use"},{name:"instruction",type:"str",description:"System prompt"},{name:"tools",type:"list",description:"Available tools",default:"[]"},{name:"output_key",type:"str",description:"State key to store output",default:"None"}],tips:["Use output_key to store agent output in shared state","Combine with MCPToolset for external tool access","Supports before_model_callback for request interception"],docUrl:"https://google.github.io/adk-docs/"},Crew:{id:"Crew",name:"Crew",type:"class",shortDescription:"CrewAI team of agents working together",fullDescription:"A Crew assembles multiple CrewAI Agents and Tasks into a coordinated team. The Crew manages execution order (sequential or hierarchical), task delegation, and result aggregation. Think of it as the project manager that coordinates the team.",syntax:`from crewai import Crew, Process

crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, writing_task],
    process=Process.sequential
)`,parameters:[{name:"agents",type:"list[Agent]",description:"The team members"},{name:"tasks",type:"list[Task]",description:"Tasks to complete"},{name:"process",type:"Process",description:"Execution order",default:"Process.sequential"},{name:"verbose",type:"bool",description:"Show agent reasoning",default:"False"}],tips:["Process.sequential runs tasks in order","Process.hierarchical adds a manager agent that delegates","Use crew.kickoff() to start execution"],docUrl:"https://docs.crewai.com/"},"CrewAI-Agent":{id:"CrewAI-Agent",name:"Agent (CrewAI)",type:"class",shortDescription:"CrewAI agent with role and backstory",fullDescription:"A CrewAI Agent represents a team member with a specific role, goal, and backstory. The backstory shapes how the agent approaches tasks. Agents can be given tools and the ability to delegate work to other agents.",syntax:`from crewai import Agent

agent = Agent(
    role="Senior Researcher",
    goal="Find accurate information",
    backstory="You are an expert researcher...",
    tools=[search_tool],
    allow_delegation=False
)`,parameters:[{name:"role",type:"str",description:"The agent's job title/role"},{name:"goal",type:"str",description:"What the agent aims to achieve"},{name:"backstory",type:"str",description:"Background that shapes behavior"},{name:"tools",type:"list",description:"Tools the agent can use",default:"[]"},{name:"allow_delegation",type:"bool",description:"Can delegate to other agents",default:"True"}],tips:["backstory is crucial — it defines the agent's expertise and approach","Set allow_delegation=False for focused, independent agents","The role appears in logs and helps with debugging"],docUrl:"https://docs.crewai.com/"},Process:{id:"Process",name:"Process",type:"class",shortDescription:"CrewAI execution strategy",fullDescription:"Process defines how a CrewAI Crew executes its tasks. Process.sequential runs tasks in order, while Process.hierarchical adds a manager agent that intelligently delegates tasks to the best-suited agents.",syntax:`from crewai import Process

# Sequential: tasks run in order
crew = Crew(process=Process.sequential)

# Hierarchical: manager delegates
crew = Crew(process=Process.hierarchical)`,tips:["Sequential is simpler and more predictable","Hierarchical adds overhead but is better for complex workflows","Sequential is the default process type"],docUrl:"https://docs.crewai.com/"},asyncio:{id:"asyncio",name:"asyncio",type:"module",shortDescription:"Python async concurrency framework",fullDescription:"asyncio is Python's built-in library for writing concurrent code using async/await syntax. In agent systems, it enables parallel execution of multiple LLM calls, tool invocations, or agent workflows without threading.",syntax:"import asyncio",example:`import asyncio

async def run_agents():
    results = await asyncio.gather(
        agent1.ainvoke(query),
        agent2.ainvoke(query),
        agent3.ainvoke(query)
    )
    return results

asyncio.run(run_agents())`,tips:["asyncio.gather() runs multiple async calls concurrently","asyncio.run() starts the event loop from synchronous code","Essential for parallelization patterns (Chapter 3)"],docUrl:"https://docs.python.org/3/library/asyncio.html"},RecursiveCharacterTextSplitter:{id:"RecursiveCharacterTextSplitter",name:"RecursiveCharacterTextSplitter",type:"class",shortDescription:"Splits documents into chunks for RAG",fullDescription:"RecursiveCharacterTextSplitter breaks documents into smaller chunks suitable for embedding and retrieval. It recursively splits by multiple separators (paragraphs, sentences, words) to keep semantically meaningful units together.",syntax:`from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200
)`,parameters:[{name:"chunk_size",type:"int",description:"Maximum characters per chunk",default:"1000"},{name:"chunk_overlap",type:"int",description:"Overlap between adjacent chunks",default:"200"}],tips:["Overlap ensures context isn't lost at chunk boundaries","Smaller chunks = more precise retrieval but less context",'The "recursive" strategy tries paragraph breaks first, then sentences, then words'],docUrl:"https://python.langchain.com/docs/how_to/recursive_text_splitter/"},AgentCard:{id:"AgentCard",name:"AgentCard",type:"class",shortDescription:"A2A agent capability description",fullDescription:"AgentCard is the identity document for an A2A (Agent-to-Agent) protocol agent. It advertises the agent's skills, supported input/output formats, and authentication requirements. Other agents discover capabilities by reading the AgentCard.",syntax:`from a2a import AgentCard, AgentSkill, AgentCapabilities

card = AgentCard(
    name="WeatherBot",
    skills=[weather_skill],
    capabilities=AgentCapabilities(streaming=True)
)`,tips:["Published at /.well-known/agent.json by convention","Skills describe specific capabilities with input/output MIME types","Enables dynamic agent discovery and composition"],docUrl:"https://google.github.io/A2A/"},AgentSkill:{id:"AgentSkill",name:"AgentSkill",type:"class",shortDescription:"A2A skill definition for an agent",fullDescription:"AgentSkill defines a specific capability an A2A agent offers. Each skill has an ID, name, description, and supported input/output MIME types. Skills are listed in the AgentCard for other agents to discover.",syntax:`skill = AgentSkill(
    id="check_weather",
    name="Check Weather",
    description="Get weather for a location",
    tags=["weather", "forecast"]
)`,tips:["Use clear descriptions so other agents know when to call this skill","Tags help with skill discovery and filtering","MIME types define accepted input and output formats"],docUrl:"https://google.github.io/A2A/"},BaseTool:{id:"BaseTool",name:"BaseTool",type:"class",shortDescription:"ADK base class for tool definitions",fullDescription:"BaseTool is the abstract base class for all tools in Google ADK. It provides the interface that before_tool_callback receives when validating tool calls. Custom tools extend BaseTool to define their schema and execution logic.",syntax:"from google.adk.tools.base_tool import BaseTool",tips:["Used in before_tool_callback for type checking","Provides tool.name for identifying which tool is being called","Extend for custom tools with complex validation logic"],docUrl:"https://google.github.io/adk-docs/"},Field:{id:"Field",name:"Field",type:"function",shortDescription:"Pydantic field with metadata and constraints",fullDescription:"Field() configures individual fields in Pydantic BaseModel classes. It adds descriptions (which help LLMs understand the schema), default values, and validation constraints like minimum/maximum values.",syntax:`from pydantic import Field

class MyModel(BaseModel):
    name: str = Field(description="The item name")
    score: float = Field(ge=0.0, le=1.0, description="Quality score")`,parameters:[{name:"description",type:"str",description:"Human-readable field description"},{name:"default",type:"Any",description:"Default value if not provided"},{name:"ge",type:"number",description:"Greater than or equal constraint"},{name:"le",type:"number",description:"Less than or equal constraint"}],tips:["Descriptions help LLMs generate correct structured output","Use ge/le for numeric range constraints","Required fields have no default value"],docUrl:"https://docs.pydantic.dev/latest/concepts/fields/"}};export{e as c};
