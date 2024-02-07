"use client";

import Link from 'next/link';
import BlackButton from '../components/BlackButton.jsx';

export default function Home() {
  return (
    <main class="flex min-h-screen flex-col items-center p-24 font-mono">
      <div class="flex">
        <p class="text-4xl p-16 font-bold">Document Authenticity Verifier</p>
      </div>
      <div class="flex rtl justify-center">
        <div class="p-4">
          <BlackButton><Link href="/jsonview">JSON View</Link></BlackButton>
        </div>
        <div class="p-4">
          <BlackButton><Link href="/graphview">Graph View</Link></BlackButton>
        </div>
      </div>
    </main>
  );
}
