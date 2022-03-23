"use strict";

const profileForm = document.querySelector(".edit-profile-container");
const passwordForm = document.querySelector(".change-password");
const citysForm = document.querySelector(".change-city");
const tabsContent = document.querySelectorAll(".tab-content");

const tabsContainer = document.querySelector(".options-tabs");
const tabs = document.querySelectorAll(".options-tab");
(".options-tab");

// Settings slider

tabsContainer.addEventListener("click", (e) => {
  const clicked = e.target.closest(".options-tab");

  if (!clicked) return;

  tabsContent.forEach((el) => {
    el.classList.add("hidden");
  });

  tabs.forEach((el) => el.classList.remove("tab--active"));

  clicked.classList.add("tab--active");

  document
    .querySelector(`.settings-tab-${clicked.dataset.tab}`)
    .classList.remove("hidden");
});

//// GET USER ///////////
const userObject = JSON.parse(localStorage.getItem("userInfo"));

/// Upload image //////////
const editProfile = document.querySelector(".edit-icon");
const fileInput = document.querySelector("#post-file-profile");

editProfile.addEventListener("click", (el) => {
  console.log("edit profile clicked");
  fileInput.click();
});

const uploadFile = async function (file) {
  console.log("uploadFile is called in settings");
  const fd = new FormData();
  fd.append("image", file);
  const response = await fetch("http://127.0.0.1:3000/api/posts/upload", {
    method: "POST",
    body: fd,
  });

  const data = await response.json();
  return data.file;
};

// add event listener
let imagePath;
fileInput.addEventListener("change", async () => {
  console.log("here inside file input");
  imagePath = await uploadFile(fileInput.files[0]);
  console.log(imagePath);

  const modification = {
    userId: userObject._id,
    profilePicture: imagePath,
  };

  const response = await fetch(
    `http://localhost:3000/api/users/update/${userObject._id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(modification),
    }
  );

  const data = await response.json();
  console.log(data);
  localStorage.setItem("userInfo", JSON.stringify(data));
  // location.reload();
});

///////////////////////// DISPLAY USER INFO AND PROFILE PICTURE ////////////////////////

const profilePictures = document.querySelectorAll(".profile-picture-user");
const profileCardName = document.querySelector(".profile-name-user");
const profileCardCity = document.querySelector(".city-quartier-user");
const postsContainer = document.querySelector(".posts-container");

const userPicture = userObject.profilePicture
  ? `./images/` + userObject.profilePicture
  : `./images/default.png`;

console.log(userPicture);

profilePictures.forEach((el) => {
  el.src = userPicture;
});

profileCardName.textContent = userObject.firstname + ` ` + userObject.lastname;
profileCardCity.textContent =
  ` ` + userObject.ville + `-` + userObject.quartier;

//////////// MODIFICATION ///////////////

//Submit Buttons
const submitModifierProfil = document.querySelector("#submit-modifier-profil");
const submitModifierPassword = document.querySelector(
  "#submit-changer-password"
);
const submitModifierVille = document.querySelector("#submit-changer-quartier");

//modifier profil
let firstnameInput = document.querySelector("#firstname-user");
let lastnameInput = document.querySelector("#lastname-user");
let emailChangerProfil = document.querySelector("#email-user");
let passwordInputChangerProfil = document.querySelector(
  "#password-user-modifier-profil"
);

firstnameInput.value = userObject.firstname;
lastnameInput.value = userObject.lastname;
emailChangerProfil.value = userObject.email;

//change password

const emailChangerPassword = document.querySelector(
  "#email-user-change-password"
);
const oldPassword = document.querySelector("#old-password-user");
const newPassword = document.querySelector("#new-password-user");
const confirmNewPassword = document.querySelector("#confirm-password-user");

//changer quartier

let emailChangerQuartier = document.querySelector(
  "#email-user-change-quartier"
);
let newQuartier = document.querySelector("#quartier-user-change");
let newVille = document.querySelector("#ville-user-change");
let passwordInputChangerQuartier = document.querySelector(
  "#password-user-modifier-quartier"
);

newQuartier.value = userObject.quartier;
newVille.value = userObject.ville;

//////////// API ///////////

//Modifier Profil

submitModifierProfil.addEventListener("click", async (e) => {
  e.preventDefault();

  if (passwordInputChangerProfil.value == userObject.password) {
    if (
      firstnameInput.value &&
      lastnameInput.value &&
      emailChangerProfil.value
    ) {
      const modification = {
        userId: userObject._id,
        firstname: firstnameInput.value,
        lastname: lastnameInput.value,
        email: emailChangerProfil.value,
      };
      console.log(modification);

      const response = await fetch(
        `http://localhost:3000/api/users/update/${userObject._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(modification),
        }
      );

      const data = await response.json();
      console.log(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      location.reload();
    }
  } else {
    console.log("mot de passe faux");
  }
});

//Changer mot de passe

submitModifierPassword.addEventListener("click", async (e) => {
  e.preventDefault();
  if (oldPassword.value == userObject.password) {
    if (newPassword.value && confirmNewPassword.value) {
      if (newPassword.value == confirmNewPassword.value) {
        const modification = {
          userId: userObject._id,
          password: newPassword.value,
        };
        console.log(modification);

        const response = await fetch(
          `http://localhost:3000/api/users/update/${userObject._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(modification),
          }
        );

        const data = await response.json();
        console.log(data);
        localStorage.setItem("userInfo", JSON.stringify(data));
        // alert("succes");
        location.reload();
      } else {
        // alert("erreur dans la confirmation");
      }
    } else {
      // alert("remplir les champs");
    }
  } else {
    alert("mot de passe faux");
  }
});

//Changer ville quartier

submitModifierVille.addEventListener("click", async (e) => {
  e.preventDefault();

  if (passwordInputChangerQuartier.value == userObject.password) {
    if (newQuartier.value && newVille.value) {
      const modification = {
        userId: userObject._id,
        quartier: newQuartier.value,
        ville: newVille.value,
      };
      console.log(modification);

      const response = await fetch(
        `http://localhost:3000/api/users/update/${userObject._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(modification),
        }
      );

      const data = await response.json();
      console.log(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      location.reload();
    }
  } else {
    console.log("mot de passe faux");
  }
});
