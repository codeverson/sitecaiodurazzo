import { useMemo } from "react";
import fretboardHtmlSource from "../../v1/fretboard.html?raw";
import tabMakerHtmlSource from "../../v1/tab-maker.html?raw";

export type NativeToolId = "fretboard" | "tabmaker";

function prepareToolHtml(toolId: NativeToolId) {
  const source = toolId === "fretboard" ? fretboardHtmlSource : tabMakerHtmlSource;

  return source
    .replace(/<a class="nav-link"[\s\S]*?<\/a>/g, "")
    .replace(/<a href="index\.html">← Ducarazzo Fretboard<\/a>/g, "")
    .replace(/\s+\|\s*<\/footer>/g, "</footer>");
}

export default function ToolEmbedFrame({
  toolId,
  title,
  className,
}: {
  toolId: NativeToolId;
  title: string;
  className?: string;
}) {
  const srcDoc = useMemo(() => prepareToolHtml(toolId), [toolId]);

  return (
    <iframe
      key={toolId}
      title={title}
      srcDoc={srcDoc}
      className={className}
      loading="lazy"
    />
  );
}
