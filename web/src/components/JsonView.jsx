import hljs from "highlight.js/lib/core";
import jsonLang from "highlight.js/lib/languages/json";
import "highlight.js/styles/github.css";

hljs.registerLanguage("json", jsonLang);

export default function JsonView({ json }) {
  const rendered = hljs.highlight(
    JSON.stringify(json, undefined, 2),
    { language: "json" },
  ).value;
  return (
    <div class="w-full p-16">
      <div class="bg-white rounded p-8">
        <pre><code dangerouslySetInnerHTML={{
          __html: rendered,
        }}></code></pre>
      </div>
    </div>
  );
}
