import path from "node:path";
import { promises as fs } from "node:fs";

/**
 * Widget definition type
 * Each widget represents an interactive UI component that can be rendered in the AI chat
 */
export type PizzazWidget = {
  id: string; // Unique identifier, used as the tool name
  title: string; // Human-friendly title displayed in the UI
  description?: string; // Human-friendly description
  templateUri: string; // URI identifying the HTML template resource
  invoking: string; // Status message shown while the tool is being invoked
  invoked: string; // Status message shown after the tool completes
  html: string; // The actual HTML markup with CSS/JS links for the widget
  responseText: string; // Text response returned to the model after tool execution
  requestSchema: any;
};

/**
 * Widget registry - defines all available interactive widgets
 * Each widget has:
 * - A unique ID (becomes the tool name the AI can call)
 * - HTML template with links to hosted CSS/JS assets
 * - Metadata for status messages during invocation
 */


async function getInlineJs(filename: string) {
  const jsPath = path.join("../assets", filename);
  let code = await fs.readFile(jsPath, "utf8");

  // prevent accidental </script> termination
  return code.replace(/<\/script/g, "<\\/script");
}

const quizaurusJs = await getInlineJs('quizaurus-2d2b.js')

const toolDefaultInputSchema = {
  type: "object",
  properties: {
    pizzaTopping: {
      type: "string",
      description: "Topping to mention when rendering the widget."
    }
  },
  required: ["pizzaTopping"],
  additionalProperties: false
} as const;

const questionsSchema = {
  type: "object",
  properties: {
    topic: { type: "string", description: "Topic to quiz on (e.g., 'World War II')." },
    numQuestions: { type: "integer", minimum: 1, maximum: 20, default: 8 },
    difficulty: { type: "string", enum: ["easy", "medium", "hard"], default: "medium" },
    questions: {
      type: "array",
      description: "Optional. If omitted, the assistant should generate them.",
      items: {
        type: "object",
        required: ["question", "options", "correctIndex"],
        properties: {
          question: { type: "string" },
          options: { type: "array", minItems: 2, items: { type: "string" } },
          correctIndex: { type: "integer" },
          explanation: { type: "string", description: "1–2 sentences explaining the answer." }
        }
      }
    }
  },
  required: ["topic"]
}


export const STATIC_DOMAIN = 'https://brenda-unharped-superoratorically.ngrok-free.dev'
export const widgets: PizzazWidget[] = [
  {
    id: "quizaurus-test-1",
    title: "Show question",
    templateUri: "ui://widget/quizaurus-test-1.html", // Custom URI scheme for widget templates
    invoking: "Rendering a question",
    invoked: "Serving a question",
    html: `
<div id="quizaurus-root"></div>
<link rel="stylesheet" href="${STATIC_DOMAIN}/assets/quizaurus-2d2b.css">
<script type="module">
${quizaurusJs}
</script>
    `.trim(),
    requestSchema: toolDefaultInputSchema,
    responseText: "Rendering a question!"
  },
  {
    id: "quizaurus-make-quiz-1",
    title: "Make an interactive quiz",
    description: `
Create and render an interactive multiple-choice quiz.

If only "topic" is provided, first generate high-quality multiple-choice questions
(see the inputSchema for the exact shape) and pass them in the "questions" field
when invoking this tool. Prefer 5–10 questions unless "numQuestions" is specified.
Include exactly one correct answer per question via "correctIndex" and provide a brief "explanation".
  `.trim(),
    templateUri: "ui://widget/quizaurus-make-quiz-1.html",
    invoking: "Rendering a quiz",
    invoked: "Rendered a quiz",
    html: `
<div id="quizaurus-root"></div>
<link rel="stylesheet" href="${STATIC_DOMAIN}/assets/quizaurus-2d2b.css">
<script type="module">
${quizaurusJs}
</script>
    `.trim(),
    requestSchema: questionsSchema,
    responseText: "Rendered a quiz!"
  },
  {
    id: "pizza-map",
    title: "Show Pizza Map",
    templateUri: "ui://widget/pizza-map.html", // Custom URI scheme for widget templates
    invoking: "Hand-tossing a map",
    invoked: "Served a fresh map",
    html: `
<div id="pizzaz-root"></div>
<link rel="stylesheet" href="https://persistent.oaistatic.com/ecosystem-built-assets/pizzaz-0038.css">
<script type="module" src="https://persistent.oaistatic.com/ecosystem-built-assets/pizzaz-0038.js"></script>
    `.trim(),
    requestSchema: toolDefaultInputSchema,
    responseText: "Rendered a pizza map!"
  },
  {
    id: "pizza-carousel",
    title: "Show Pizza Carousel",
    templateUri: "ui://widget/pizza-carousel.html",
    invoking: "Carousel some spots",
    invoked: "Served a fresh carousel",
    html: `
<div id="pizzaz-carousel-root"></div>
<link rel="stylesheet" href="https://persistent.oaistatic.com/ecosystem-built-assets/pizzaz-carousel-0038.css">
<script type="module" src="https://persistent.oaistatic.com/ecosystem-built-assets/pizzaz-carousel-0038.js"></script>
    `.trim(),
    requestSchema: toolDefaultInputSchema,
    responseText: "Rendered a pizza carousel!"
  },
  {
    id: "pizza-albums",
    title: "Show Pizza Album",
    templateUri: "ui://widget/pizza-albums.html",
    invoking: "Hand-tossing an album",
    invoked: "Served a fresh album",
    html: `
<div id="pizzaz-albums-root"></div>
<link rel="stylesheet" href="https://persistent.oaistatic.com/ecosystem-built-assets/pizzaz-albums-0038.css">
<script type="module" src="https://persistent.oaistatic.com/ecosystem-built-assets/pizzaz-albums-0038.js"></script>
    `.trim(),
    requestSchema: toolDefaultInputSchema,
    responseText: "Rendered a pizza album!"
  },
  {
    id: "pizza-list",
    title: "Show Pizza List",
    templateUri: "ui://widget/pizza-list.html",
    invoking: "Hand-tossing a list",
    invoked: "Served a fresh list",
    html: `
<div id="pizzaz-list-root"></div>
<link rel="stylesheet" href="https://persistent.oaistatic.com/ecosystem-built-assets/pizzaz-list-0038.css">
<script type="module" src="https://persistent.oaistatic.com/ecosystem-built-assets/pizzaz-list-0038.js"></script>
    `.trim(),
    requestSchema: toolDefaultInputSchema,
    responseText: "Rendered a pizza list!"
  },
  {
    id: "pizza-video",
    title: "Show Pizza Video",
    templateUri: "ui://widget/pizza-video.html",
    invoking: "Hand-tossing a video",
    invoked: "Served a fresh video",
    html: `
<div id="pizzaz-video-root"></div>
<link rel="stylesheet" href="https://persistent.oaistatic.com/ecosystem-built-assets/pizzaz-video-0038.css">
<script type="module" src="https://persistent.oaistatic.com/ecosystem-built-assets/pizzaz-video-0038.js"></script>
    `.trim(),
    requestSchema: toolDefaultInputSchema,
    responseText: "Rendered a pizza video!"
  }
];

/**
 * Index widgets by ID and URI for fast lookups
 * - widgetsById: Used when handling tool calls (lookup by tool name)
 * - widgetsByUri: Used when serving resources (lookup by template URI)
 */
export const widgetsById = new Map<string, PizzazWidget>();
export const widgetsByUri = new Map<string, PizzazWidget>();

widgets.forEach((widget) => {
  widgetsById.set(widget.id, widget);
  widgetsByUri.set(widget.templateUri, widget);
});
