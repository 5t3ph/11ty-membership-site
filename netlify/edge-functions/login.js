import { createClient } from "./utils/_deps.js";

import { SUPABASE_URL, SUPABASE_KEY } from "./utils/env.js";
import { setCookie } from "./utils/setCookie.js";

export default async (request, context) => {
  const url = new URL(request.url);
  const accessToken = url.searchParams.get("access_token");
  const expiresAt = url.searchParams.get("expires_at");
  const redirect = url.searchParams.get("redirect");

  // Save to cookie, redirect back to form
  if (accessToken && expiresAt) {
    let authError;
    try {
      // Ensure session belongs to a valid user
      const supabase = await createClient(SUPABASE_URL, SUPABASE_KEY);

      const {
        data: { user },
      } = await supabase.auth.getUser(accessToken);

      if (user.error) {
        authError = user.error.message;
      }
    } catch (e) {
      authError = e;
    }

    if (!authError) {
      setCookie(
        context,
        "_access_token",
        accessToken,
        new Date(expiresAt * 1000)
      );

      return new Response(null, {
        status: 302,
        headers: {
          location: redirect,
          "Cache-Control": "no-cache",
        },
      });
    } else {
      console.log(authError);

      return new Response(null, {
        status: 302,
        headers: {
          location: "/?unauthorized",
          "Cache-Control": "no-cache",
        },
      });
    }
  } else {
    return new Response(null, {
      status: 302,
      headers: {
        location: "/?noop",
        "Cache-Control": "no-cache",
      },
    });
  }
};
