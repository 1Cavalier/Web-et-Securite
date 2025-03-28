document.addEventListener("DOMContentLoaded", function () {
  // Check if user is authenticated
  checkAuth();

  // Setup event listeners
  if (document.getElementById("signup-form")) {
    document
      .getElementById("signup-form")
      .addEventListener("submit", handleSignup);
  }
  if (document.getElementById("login-form")) {
    document
      .getElementById("login-form")
      .addEventListener("submit", handleLogin);
  }
  if (document.getElementById("logout")) {
    document.getElementById("logout").addEventListener("click", handleLogout);
  }

  // Handle email confirmation if on confirmation page
  if (window.location.pathname.includes("Confirmation-email.html")) {
    handleEmailConfirmation();
  }
});

async function checkAuth() {
  const session = await supabaseClient.auth.getSession();
  if (session && session.data.session) {
    const verified = session.data.session.user.user_metadata.email_verified;
    if (
      verified &&
      (window.location.pathname.includes("Connexion.html") ||
        window.location.pathname.includes("Inscription.html") ||
        window.location.pathname.includes("Confirmation-email.html"))
    ) {
      window.location.href = "index.html";
    }
  }
}

// Login Function
async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const loginButton = document.querySelector("#login-form button");

  // Vérification des champs vides
  if (!email || !password) {
    showError("Veuillez remplir tous les champs");
    return;
  }

  try {
    loginButton.disabled = true;
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    showSuccess("Connexion réussie..! Redirection en cours..");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);
  } catch (error) {
    loginButton.disabled = false;
    console.log(error);
    if (error.message.includes("not confirmed")) {
      showError(
        "Votre adresse e-mail n'a pas été confirmée. Veuillez vérifier votre boîte de réception."
      );
      return;
    }
    showError("Email ou mot de passe incorrect");
  }
}

// Signup Function
async function handleSignup(event) {
  event.preventDefault();

  const prenom = document.getElementById("prenom").value.trim().toLowerCase();
  const nom = document.getElementById("nom").value.trim().toUpperCase();
  
  // Capitalize first letter of prenom
  const prenomCapitalized = prenom.charAt(0).toUpperCase() + prenom.slice(1);
  
  const fullname = `${prenomCapitalized} ${nom}`;
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("telephone").value;
  const password = document.getElementById("motdepasse").value;

  const signupButton = document.querySelector("#signup-form button");

  try {
    signupButton.disabled = true;
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: { fullname, phone },
        emailRedirectTo:
          "https://web-et-securite.vercel.app/Confirmation-email.html",
      },
    });

    if (error) throw error;

    console.log(data);

    showSuccess(
      "Inscription réussie..! Veuillez vérifier votre boîte de réception pour confirmer votre adresse e-mail."
    );
    setTimeout(() => {
      window.location.href = "Connexion.html";
    }, 5000);
  } catch (error) {
    showError("Une erreur s'est produite lors de l'inscription");
    console.log(error);
    signupButton.disabled = false;
  }
}

async function handleEmailConfirmation() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const type = params.get("type");

  console.log("token", token, "type", type);

  if (type === "email_confirmation" && token) {
    try {
      const { error } = await supabaseClient.auth.verifyOtp({
        token: token,
        type: "email_confirmation",
      });

      if (error) throw error;
    } catch (error) {
      console.log(error);
    }
  }
}

function showError(message) {
  const errorDiv = document.getElementById("error-message");
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.display = "block";
    setTimeout(() => {
      errorDiv.textContent = "";
      errorDiv.style.display = "none";
    }, 5000);
  }
}

function showSuccess(message) {
  const errorDiv = document.getElementById("error-message");
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.display = "block";
    errorDiv.style.color = "green";
    setTimeout(() => {
      errorDiv.textContent = "";
      errorDiv.style.display = "none";
    }, 5000);
  }
}
