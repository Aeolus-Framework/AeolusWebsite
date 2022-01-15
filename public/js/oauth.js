async function onSignInGoogle(googleUser) {
    const origin = window.location.origin;
    const token = googleUser.getAuthResponse().id_token;

    const redirect = `${origin}/oauth/google/signin?token=${token}`;
    window.location = redirect;
  }
  
  function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log("User signed out.");
    });
}