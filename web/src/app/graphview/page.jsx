"use client";

import Link from 'next/link';
import GraphViewer from '../../features/GraphViewer/components/GraphViewer.jsx'

export default function Home() {
  return (
    <main class="flex min-h-screen flex-col items-center p-24 font-mono">
      <div class="flex">
        <p class="text-4xl p-16 font-bold">Document Authenticity Verifier</p>
      </div>
      <div class="w-full">
        <GraphViewer></GraphViewer>
      </div>
    </main>
  );
}
