"use client";

import JsonView from "../../../components/JsonView.jsx";
import UrlForm from "../../../components/UrlForm.jsx";

import { fetchClaim } from "@document-authenticity-verifier/core";

import { useState } from "react";

export default function JsonViewer() {
  const [json, setJson] = useState("(no result)");
  const displayJson = async (url) => {
    const jsonResponse = await fetchClaim(url);
    setJson(jsonResponse);
  };
  return (
    <div class="w-full">
      <UrlForm action={displayJson}></UrlForm>
      <JsonView json={json}></JsonView>
    </div>
  );
}
