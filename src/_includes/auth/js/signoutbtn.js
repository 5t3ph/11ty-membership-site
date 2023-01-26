const signOut = document.getElementById("signout");

signOut.addEventListener("click", async () => await _supabase.auth.signOut());

_supabase.auth.onAuthStateChange((event) => {
  if (event == "SIGNED_OUT") {
    window.location = "/signout/";
  }
});
