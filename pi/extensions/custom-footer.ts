import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { truncateToWidth, visibleWidth } from "@mariozechner/pi-tui";

// Track thinking level across renders
let currentThinkingLevel = "off";

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
        const filled = Math.round(pct / 10);
        const bar = "#".repeat(filled) + "-".repeat(10 - filled);

        // Get and format context window size
        const contextWindow = ctx.model?.contextWindow ?? usage?.total ?? 0;
        const formattedContext = fmtContext(contextWindow);

        const left = theme.fg("dim", ` ${model} (${thinkingLevel})`);
        const right = theme.fg("dim", `[${bar}] ${Math.round(pct)}% (${formattedContext}) `);
        const pad = " ".repeat(Math.max(1, width - visibleWidth(left) - visibleWidth(right)));

        return [truncateToWidth(left + pad + right, width)];
      },
    }));
  });
}
