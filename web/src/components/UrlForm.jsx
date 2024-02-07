"use client";

import { useState } from "react";

export default function UrlForm({ action, submitMessage }) {
  const [url, setUrl] = useState("");

  const performAction = async (event) => {
    await action(url);
  };

  return (
    <div class="flex w-full rtl justify-center">
      <input
        class="bg-white w-2/5 p-2"
        type="text"
        placeholder="https://"
        onChange={(event) => setUrl(event.target.value)}
      >
      </input>
      <span class="ps-4">
        <button
          class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={performAction}
        >
          {submitMessage}
        </button>
      </span>
    </div>
  );
}
