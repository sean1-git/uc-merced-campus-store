// Keep host bindings here so the API’s session and checkout rules are shared
// with the Node runtime.
import { handleApi, secureResponse } from "./api.mjs";
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/"))
      return secureResponse(await handleApi(request, env));
    const response = await env.ASSETS.fetch(request);
    const result = secureResponse(response);
    // Revalidate update metadata so long-lived caches cannot hide a new release.
    if (url.pathname === "/sw.js" || url.pathname.endsWith(".webmanifest"))
      result.headers.set("Cache-Control", "no-cache");
    return result;
  },
};
