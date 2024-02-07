// import { DOMParser } from 'deno-dom';

const detectClaimIdFromHtml = (html) => {
  // const document = new DOMParser().parseFromString(html, "text/html");
  // const meta = document.querySelector("meta[name=claim]");
  // if (meta === null) {
  //   throw Error("No claims detected");
  // }
  // const claimId = meta.getAttribute("content");
  // if (claimId === null) {
  //   throw Error("No claims detected");
  // }

  const matches = /<meta +name="claim" +content="(.*?)">/.exec(html);
  if (matches === null) {
    throw Error("No claims detected");
  }
  const claimId = matches[1];
  return claimId;
}

const detectClaimIdFromUrl = async (url) => {
  const html = await fetch(url).then(r => r.text());
  return detectClaimIdFromHtml(html);
}

export { detectClaimIdFromHtml, detectClaimIdFromUrl };
