"use client";

import JsonViewer from "../features/JsonViewer/components/JsonViewer.jsx";

export default function Home() {
  return (
    <main class="flex min-h-screen flex-col items-center p-24 font-mono">
      <div class="flex">
        <p class="text-4xl p-16 font-bold">Document Authenticity Verifier</p>
      </div>
      <JsonViewer></JsonViewer>
    </main>
  );
}
