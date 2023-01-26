import { setCookie } from "./utils/setCookie.js";

export default async (_request, context) => {
  // Remove _access_token cookie
  setCookie(context, "_access_token", "", new Date(Date.now()));

  // Redirect to home page
  return new Response(null, {
    status: 302,
    headers: {
      location: "/",
      "Cache-Control": "no-cache",
    },
  });
};
