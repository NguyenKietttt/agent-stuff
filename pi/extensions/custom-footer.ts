import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import type { AssistantMessage } from "@earendil-works/pi-ai";
import { truncateToWidth, visibleWidth } from "@mariozechner/pi-tui";

// Track thinking level across renders
let currentThinkingLevel = "off";

// Track running cost
let currentCost = 0;

// Format cost (e.g., $0.05, $1.23)
const fmtCost = (n: number) => `$${n.toFixed(2)}`;

// Format context window size (e.g., 200k, 1M)
const fmtContext = (n: number) =>
  n >= 1000000
    ? `${(n / 1000000).toFixed(n >= 10000000 ? 0 : 1).replace(/\.0$/, '')}M`
    : n >= 1000
      ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, '')}K`
      : `${n}`;

export default function (pi: ExtensionAPI) {
  // Listen for thinking level changes
  pi.on("thinking_level_select", async (event, _ctx) => {
    currentThinkingLevel = event.level;
  });

  // Track cost from assistant messages
  pi.on("message_end", async (event, _ctx) => {
    const msg = event.message as AssistantMessage;
    if (msg.usage?.cost?.total) {
      currentCost += msg.usage.cost.total;
    }
  });

  pi.on("session_start", async (_event, ctx) => {
    // Initialize thinking level from pi on session start
    currentThinkingLevel = pi.getThinkingLevel?.() ?? "off";
    ctx.ui.setFooter((_tui, theme, _footerData) => ({
      dispose: () => { },
      invalidate() { },
      render(width: number): string[] {
        const model = ctx.model?.id || "no-model";
        const thinkingLevel = currentThinkingLevel || "n/a";
        const usage = ctx.getContextUsage();
        const pct = (usage && usage.percent !== null) ? usage.percent : 0;
        // Get and format context window size
        const contextWindow = ctx.model?.contextWindow ?? usage?.total ?? 0;
        const formattedContext = fmtContext(contextWindow);

        const costStr = fmtCost(currentCost);

        const left = theme.fg("dim", ` ${model} (${thinkingLevel})`);
        const middle = theme.fg("dim", `${Math.round(pct)}% (${formattedContext})`);
        const right = theme.fg("dim", ` ${costStr}`);
        const separator = theme.fg("dim", " | ");

        const content = [left, separator, middle, separator, right].join("");

        return [truncateToWidth(content, width)];
      },
    }));
  });
}
