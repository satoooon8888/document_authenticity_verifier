"use client";

import GraphView from "../../../components/GraphView.jsx";
import UrlForm from "../../../components/UrlForm.jsx";

import { walkWholeClaimMap, detectClaimIdFromUrl } from "@document-authenticity-verifier/core";

import { useState } from "react";

export default function GraphViewer() {
  const [walkResult, setWalkResult] = useState({});
  const callback = async (url) => {
    if (!url) return;
    if (!new URL(url).pathname.endsWith(".json")) {
      url = await detectClaimIdFromUrl(url);
    }
    const result = await walkWholeClaimMap(url);
    setWalkResult(result);
  };
  return (
    <div class="w-full">
      <UrlForm action={callback} submitMessage="Show Graph"></UrlForm>
      <GraphView walkResult={walkResult}></GraphView>
    </div>
  );
}
