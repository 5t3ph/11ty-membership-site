const user = _supabase.auth.getUser();

const redirectUser = async () => {
  window.user = true;

  const url = new URL(window.location);
  const redirect = url.searchParams.get("redirect");

  // Set by supabase after user validation
  const userData = await _supabase.auth.getSession();

  if (userData && userData.data.session) {
    window.location = `${window.location.origin}/access/?access_token=${userData.data.session.access_token}&expires_at=${userData.data.session.expires_at}&redirect=${redirect}`;
  } else {
    document.getElementById("error-message").innerHTML =
      'This link may have expired, please return to <a href="/">the home page</a> to login again.';
  }
};

if (user) {
  redirectUser();
} else {
  _supabase.auth.onAuthStateChange((event) => {
    if (event == "SIGNED_IN") {
      redirectUser();
    }
  });
}
