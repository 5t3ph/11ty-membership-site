import {
  EleventyEdge,
  precompiledAppData,
} from "./_generated/eleventy-edge-app.js";

import { createClient } from "./utils/_deps.js";

import { SUPABASE_URL, SUPABASE_KEY } from "./utils/env.js";

export default async (request, context) => {
  const accessToken = context.cookies.get("_access_token");
  let isUser = false;

  try {
    let authError;
    if (accessToken) {
      // Check if session belongs to a valid user
      const supabase = await createClient(SUPABASE_URL, SUPABASE_KEY);
      const {
        data: { user },
      } = await supabase.auth.getUser(accessToken);

      try {
        if (user.error) {
          authError = user.error.message;
        }
      } catch (e) {
        authError = e;
      }

      if (authError) {
        console.log(authError);
      } else {
        isUser = true;
      }
    }
  } catch (e) {
    console.log("ERROR", { e });
  }

  try {
    let edge = new EleventyEdge("edge", {
      request,
      context,
      precompiled: precompiledAppData,
      cookies: [],
    });

    edge.config((eleventyConfig) => {
      eleventyConfig.addGlobalData("isUser", isUser);
    });

    return await edge.handleResponse();
  } catch (e) {
    console.log("ERROR", { e });
    return context.next(e);
  }
};
