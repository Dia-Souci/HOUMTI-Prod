const signUpButton = document.querySelector("#signup-btn");
const signInButton = document.querySelector("#signin-btn");
const container = document.querySelector(".section--forms");
const signupButtonsScroll = document.querySelectorAll(".signup-scroll");
const signinButtonScroll = document.querySelector(".signin-scroll");
const formSection = document.querySelector(".section--forms");
const navBar = document.querySelector(".nav");
const signupForm = document.querySelector(".signup-form");

const loginButton = document.querySelector("#login-button");

signUpButton.addEventListener("click", () => {
  container.classList.add("signup-mode");
});

signInButton.addEventListener("click", () => {
  container.classList.remove("signup-mode");
});

signinButtonScroll.addEventListener("click", () => {
  container.classList.remove("signup-mode");
  formSection.scrollIntoView({ behavior: "smooth" });
});

signupButtonsScroll.forEach((el) => {
  el.addEventListener("click", (el) => {
    container.classList.add("signup-mode");
    // console.log(el);
    formSection.scrollIntoView({ behavior: "smooth" });
  });
});

///////////////

const toggleButton = document.getElementsByClassName("toggle-button")[0];
const navbarLinks = document.getElementsByClassName("navbar-links")[0];

toggleButton.addEventListener("click", () => {
  navbarLinks.classList.toggle("active");
});

//////////////API//////////

//////////////// AUTH //////////////////////

/////// LOGIN ///////////////

loginButton.addEventListener("click", async (el) => {
  el.preventDefault();
  console.log("login clicked");

  const email = document.querySelector("#signin-email").value;
  const password = document.querySelector("#signin-password").value;

  const loginInfo = {
    email,
    password,
  };

  try {
    const response = await fetch("http://127.0.0.1:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginInfo),
    });

    const userData = await response.json();
    console.log(userData);

    if (userData.status !== "failed") {
      localStorage.setItem("userInfo", JSON.stringify(userData.user));
      window.location.replace("/main-feed");
    }
  } catch (error) {
    console.log("Error in login");
    console.error(error);
  }
});

/////////// REGISTER ////////////
const signupButton = document.querySelector("#signup-button");

signupButton.addEventListener("click", async (el) => {
  el.preventDefault();
  console.log("signup clicked");

  const email = document.querySelector("#signup-email").value;
  const firstname = document.querySelector("#signup-firstname").value;
  const lastname = document.querySelector("#signup-lastname").value;
  const username = document.querySelector("#signup-username").value;
  const ville = document.querySelector("#signup-ville").value;
  const quartier = document.querySelector("#signup-quartier").value;
  const password = document.querySelector("#signup-password").value;

  const fields = [
    email,
    firstname,
    lastname,
    username,
    ville,
    quartier,
    password,
  ];

  // const fieldsValidator = function (fields) {
  //   for (const el of fields) {
  //     if (el == "") return false;
  //   }
  // };

  // const fieldsValidation = fieldsValidator(fields);

  // if (!fieldsValidation) {
  //   signupForm.insertAdjacentHTML(
  //     "afterend",
  //     `<div class="error-message">Veuillez remplir tout le formulaire !<div/>`
  //   );
  //   return;
  // }

  const registerInfo = {
    email,
    password,
    firstname,
    lastname,
    username,
    ville,
    quartier,
  };

  console.log(JSON.stringify(registerInfo));

  try {
    const response = await fetch("http://127.0.0.1:3000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerInfo),
    });

    const userData = await response.json();
    console.log(userData);

    if (userData.status !== "failed") {
      localStorage.setItem("userInfo", JSON.stringify(userData.user));
      window.location.replace("/main-feed");
    }
  } catch (error) {
    console.log("Error in login");
    console.error(error);
  }
});
