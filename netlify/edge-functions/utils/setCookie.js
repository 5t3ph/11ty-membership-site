export function setCookie(context, name, value, expiration) {
  context.cookies.set({
    name,
    value,
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    expires: expiration,
  });
}
