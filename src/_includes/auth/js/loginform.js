const loginForm = document.getElementById("login");
const loginFields = document.getElementById("login-fields");
const loginMessage = document.getElementById("login-message");
const loginSubmit = loginForm.querySelector("button");

const loginUser = (email) => {
  _supabase.auth
    .signInWithOtp({
      email,
      options: {
        emailRedirectTo:
          window.location.origin + "/session/?redirect=" + window.location.href,
      },
    })
    .then((response) => {
      loginFields.remove();

      if (!response.error) {
        loginMessage.innerText =
          'Check your email for your "magic link" to continue your login.';
      } else {
        loginMessage.innerText =
          'Oops! You recently tried to login. Please check your email for your "magic link". Or, try again in a minute.';
      }

      loginMessage.setAttribute("tabindex", "-1");
      loginMessage.focus();
    });
};

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Disable clicks but not the button to prevent losing screen reader/keyboard focus
  loginSubmit.classList.add("disabled");
  loginSubmit.addEventListener("click", (e) => e.preventDefault);

  const email = document.getElementById("email").value;
  loginUser(email);
});
