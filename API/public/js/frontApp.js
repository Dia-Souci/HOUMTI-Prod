"use strict";

const createModal = document.querySelector(".create-modal");
const overlay = document.querySelector(".overlay");
const postButtons = document.querySelectorAll(".post-button");
const modalTabMenu = document.querySelector(".post-options-tabs");
const modalTabs = document.querySelectorAll(".post-tab");
const createPostContent = document.querySelectorAll(".create-post");
const notificationsModal = document.querySelector(".notifications-modal");
const notificationsButton = document.querySelector(".notifications-button");
const notificationsCount = document.querySelector(
  ".notifications-button__badge"
);
const notificationsContainer = document.querySelector(".notifications-cards");

const postsContainer = document.querySelector(".posts-container");
const profileCard = document.querySelector(".profile-info-card--content");
const profileName = document.querySelector("#profile-name");
const cityTitle = document.querySelector("#city-title");
const submitPost = document.querySelector(".submit-post");
const postInput = document.querySelector(".post-input");

const createServiceButton = document.querySelector("#create-service-button");
const createEventButton = document.querySelector("#create-event-button");
const createPollButton = document.querySelector("#create-poll-button");
const createPostImageButton = document.querySelector(
  "#create-post-image-button"
);
const signoutButton = document.querySelector("#signout-button");

// display and close create modal
console.log(modalTabMenu);

const openModal = function () {
  createModal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  createModal.classList.add("hidden");
  overlay.classList.add("hidden");
};

let closeModalButton;

postButtons.forEach((el) =>
  el.addEventListener("click", () => {
    closeModalButton = document.querySelector(".close-modal-button");
    closeModalButton.addEventListener("click", closeModal);

    openModal();
  })
);

overlay.addEventListener("click", closeModal);

//tabbed content in the create modal
modalTabMenu.addEventListener("click", (e) => {
  const clicked = e.target.closest(".post-tab");

  if (!clicked) return;

  createPostContent.forEach((el) => el.classList.add("hidden"));
  modalTabs.forEach((el) => el.classList.remove("tab--active"));

  clicked.classList.add("tab--active");
  document
    .querySelector(`.post-content-${clicked.dataset.tab}`)
    .classList.remove("hidden");
});

const userObject = JSON.parse(localStorage.getItem("userInfo"));
// const userObject = userObjectV1.user;
console.log(userObject);

//Notifications modal
const openNotificationsModal = function () {
  notificationsModal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeNotificationsModal = function () {
  notificationsModal.classList.add("hidden");
  overlay.classList.add("hidden");
};

const resetNotificationsCount = function () {
  notificationsCount.textContent = 0;
  notificationsCount.style.opacity = 0;
};

let closeNotificationsModalButton;

notificationsButton.addEventListener("click", async () => {
  closeNotificationsModalButton = document.querySelector(
    ".close-notifications-modal-button"
  );
  closeNotificationsModalButton.addEventListener(
    "click",
    closeNotificationsModal
  );

  const response = await fetch(
    `http://127.0.0.1:3000/api/notifications/switch/${userObject._id}`,
    {
      method: "PUT",
    }
  );

  resetNotificationsCount();
  openNotificationsModal();
});

overlay.addEventListener("click", closeNotificationsModal);

/////////////////////////////////// API //////////////

// const userObject = JSON.parse(localStorage.getItem("userInfo"));
// // const userObject = userObjectV1.user;
// console.log(userObject);

///////////////////////// DISPLAY USER INFO AND PROFILE PICTURE ////////////////////////

const profilePictures = document.querySelectorAll(".profile-picture-user");
const profileCardName = document.querySelector(".profile-name-user");
const profileCardCity = document.querySelector(".city-quartier-user");

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

////Upload ///

// const uploadFile = (file) => {
//   // add file to FormData object
//   const fd = new FormData();
//   fd.append("image", file);

//   // send `POST` request
//   fetch("http://127.0.0.1:3000/api/posts/upload", {
//     method: "POST",
//     body: fd,
//   })
//     .then((res) => res.json())
//     .then((json) => console.log(json))
//     .catch((err) => console.error(err));
// };

const uploadFile = async function (file) {
  const fd = new FormData();
  fd.append("image", file);
  const response = await fetch("http://127.0.0.1:3000/api/posts/upload", {
    method: "POST",
    body: fd,
  });

  const data = await response.json();
  return data.file;
};

// select file input
const input = document.getElementById("post-file");

// add event listener
let imagePath;
input.addEventListener("change", async () => {
  imagePath = await uploadFile(input.files[0]);
  console.log(imagePath);
});

/// Notifications /////
const getNotifications = async function (userId) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/notifications/${userId}`,
      {
        method: "GET",
        headers: {
          mode: "no-cors",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error happened in getPostsDataByCity");
    console.error(error);
  }
};

const displayNotifications = async function () {
  //get notifs
  let notifications = await getNotifications(userObject._id);
  notifications = notifications[0].elements;
  console.log(notifications);
  //badge
  let notificationsNotSeenCount = 0;
  let notificationsCards = "";
  for (const notif of notifications) {
    notificationsCards += `
    <div class="notification-card">
       ${notif.content}
    </div>`;
    if (!notif.seen) {
      notificationsNotSeenCount++;
    }
  }

  notificationsContainer.insertAdjacentHTML("afterbegin", notificationsCards);
  notificationsButton.querySelector(
    ".notifications-button__badge"
  ).textContent = notificationsNotSeenCount;

  //modal
};

displayNotifications();

////// DISPLAY POSTS//////////

const getPostsDataByCity = async function (city) {
  try {
    const response = await fetch(
      `http://127.0.0.1:3000/api/posts/posts-city/${city}`,
      {
        method: "GET",
        headers: {
          mode: "no-cors",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error happened in getPostsDataByCity");
    console.error(error);
  }
};

const checkLiked = function (post) {
  let likeActive;
  if (post.likes.includes(userObject._id)) {
    likeActive = "like--active";
  } else {
    likeActive = "";
  }

  return likeActive;
};
const checkInterested = function (post) {
  let interestedActive;
  if (post.interested.includes(userObject._id)) {
    interestedActive = "interested--active";
  } else {
    interestedActive = "";
  }

  return interestedActive;
};

const checkParticipation = function (post) {
  let participationIconClass;
  let participationButtonClass;
  if (post.participant.includes(userObject._id)) {
    participationButtonClass = "btn-cancel";
    participationIconClass = "fa-times-circle";
    return [participationButtonClass, participationIconClass];
  } else {
    participationButtonClass = "";
    participationIconClass = "fa-calendar-alt";
    return [participationButtonClass, participationIconClass];
  }
};

const checkVoted = function (post) {
  let votedIconClass = "fa-poll";
  let votedButtonClass = "";
  for (const voteObj of post.voters) {
    if (Object.values(voteObj).includes(userObject._id)) {
      votedButtonClass = "btn-cancel";
      votedIconClass = "fa-times-circle";
      return [votedButtonClass, votedIconClass, voteObj.option];
    }
  }

  return [votedButtonClass, votedIconClass];
};

const displaySimplePost = function (post, user) {
  console.log("logged in displaySimplePosts", post, user);
  //Like Active
  const likeActive = checkLiked(post);
  const interestedActive = checkInterested(post);

  //Interested Active
  const postHtml = `<div class="feed-card post" data-postid="${post._id}">
  <div class="post-header">
    <img
      class="profile-picture"
      src="${userPicture}"
      alt="profile-picture"
    />
    <div class="post-info">
      <h3 class="post-info--name">${user.firstname} ${user.lastname}</h3>
      <div class="post-info--city">
        <i class="fas fa-map-marker-alt"></i> ${post.postville} - ${post.postquartier}
      </div>
    </div>
  </div>

  <div class="post-content">
    <p class="post-content--text">
      ${post.desc}
    </p>

    
  </div>

  <div class="feedback">
    <div class="like-button">
       <i class="far fa-thumbs-up ${likeActive}"></i>
        <span class="likes-num">${post.likes.length}</span>
    </div>
    <div class="interested-button">
       <i class="far fa-star ${interestedActive}"></i>
       <span class="interested-num">${post.interested.length}</span>
    </div>
    <div class="comment-button">
        <i class="far fa-comment"></i>
        <span class="comments-num">${post.comments.length}</span>
    </div>

    <input type="text" placeholder="Laissez un commentaire" />
    <i class="far fa-paper-plane comment-submit"></i>
  </div>
</div>`;

  postsContainer.insertAdjacentHTML("afterbegin", postHtml);
};

const displayEvent = function (post, user) {
  console.log("logged in displayEvent", post, user);
  const likeActive = checkLiked(post);
  const interestedActive = checkInterested(post);
  const eventActive = checkParticipation(post);

  const eventHtml = `<div class="feed-card post event" data-postid="${
    post._id
  }">
  <div class="post-header">
    <img
      class="profile-picture"
      src="${userPicture}"
      alt="profile-picture"
    />
    <div class="post-info">
      <h3 class="post-info--name">${user.firstname} ${user.lastname}</h3>
      <div class="post-info--city">
        <i class="fas fa-map-marker-alt"></i> ${user.ville} - ${user.quartier}
      </div>
    </div>
  </div>

  <div class="post-content event-content">
    <h3 class="event-title">${post.title}</h3>
    <p class="post-content--text event-poll--text">
      ${post.desc}
    </p>
    <div class="event-details-container">
      <div class="event-details">
        <h4 class="details-header">Détails</h4>
        <div class="event-place">
          <i class="fas fa-map-marker-alt"></i>
          <span class="event-place--address"
            >${post.adresse}</span
          >
        </div>
        <div class="event-date">
          <i class="far fa-calendar-alt"></i>

          <span class="event-date--day">${new Date(post.date).getUTCDate()}.${
    new Date(post.date).getUTCMonth() + 1
  }.${new Date(post.date).getUTCFullYear()}</span>
        </div>
        <div class="event-time">
          <i class="far fa-clock"></i>

          <span class="event-time--time">${post.time}</span>
        </div>
        <div class="participants">
          <i class="fas fa-users"></i>
          <span class="participants-number"> ${post.participant.length}</span>
          Participants
        </div>
      </div>
      <div class="date-card">
        <span class="date-card--day">${new Date(post.date).getUTCDate()}</span>
        <span class="date-card--month">${
          new Date(post.date).toDateString().split(" ")[1]
        }</span>
      </div>
    </div>

    <div class="event-participation">
      <button class="btn btn-participate ${eventActive[0]}">
        <i class="far ${eventActive[1]}"></i> Participer
      </button>
    </div>
  </div>

  <div class="feedback">
    <div class="like-button">
    <i class="far fa-thumbs-up ${likeActive}"></i>

      <span class="likes-num">${post.likes.length}</span>
    </div>
    <div class="interested-button">
      <i class="far fa-star ${interestedActive}"></i>

      <span class="interested-num">${post.interested.length}</span>
    </div>
    <div class="comment-button">
      <i class="far fa-comment"></i>
      <span class="comments-num">${post.comments.length}</span>
    </div>

    <input type="text" placeholder="Laissez un commentaire" />
    <i class="far fa-paper-plane comment-submit"></i>
  </div>
</div>`;

  postsContainer.insertAdjacentHTML("afterbegin", eventHtml);
};

const displayPoll = function (post, user) {
  console.log("logged in displayPoll", post, user);
  const likeActive = checkLiked(post);
  const interestedActive = checkInterested(post);
  const votedActive = checkVoted(post);
  console.log(votedActive);

  let idCount = 1;

  const pollArea = function (options) {
    let checked = "";

    let pollAreaOptions = `<div class="poll-area">`;
    options.forEach(function (option) {
      if (votedActive[2] == option) {
        checked = "checked";
      } else {
        checked = "";
      }
      pollAreaOptions += `
      <div class="poll-option">
      <div class="poll-option--vote">
        <input type="radio" name="poll" class="opt-${idCount}"  value="${option}"  ${checked} />
        <label for="opt-${idCount}">${option}</label>
      </div>

      <div class="percentage"></div>
    </div>`;
      idCount++;
    });
    pollAreaOptions += `</div>`;
    return pollAreaOptions;
  };
  const pollHtml =
    `<div class="feed-card post poll" data-postid="${post._id}">
  <div class="post-header">
    <img
      class="profile-picture"
      src="${userPicture}"
      alt="profile-picture"
    />
    <div class="post-info">
      <h3 class="post-info--name">${user.firstname} ${user.lastname}</h3>
      <div class="post-info--city">
        <i class="fas fa-map-marker-alt"></i> ${user.ville} - ${user.quartier}
      </div>
    </div>
  </div>

  <div class="post-content poll-content">
    <h3 class="poll-title">${post.title}</h3>
    <p class="post-content--text event-poll--text">
      ${post.desc}
    </p>` +
    pollArea(post.options) +
    `<div class="poll-submission">
      <button class="btn btn-poll ${votedActive[0]}">
        <i class="fas ${votedActive[1]}"></i> Votez maintenant
      </button>
    </div>
  </div>

  <div class="feedback">
    <div class="like-button">
    <i class="far fa-thumbs-up ${likeActive}"></i>

      <span class="likes-num">${post.likes.length}</span>
    </div>
    <div class="interested-button">
      <i class="far fa-star ${interestedActive}"></i>

      <span class="interested-num">${post.interested.length}</span>
    </div>
    <div class="comment-button">
      <i class="far fa-comment"></i>
      <span class="comments-num">${post.comments.length}</span>
    </div>

    <input type="text" placeholder="Laissez un commentaire" />
    <i class="far fa-paper-plane comment-submit"></i>
  </div>
</div>`;
  postsContainer.insertAdjacentHTML("afterbegin", pollHtml);
};

const displayService = function (post, user) {
  console.log("logged in from displayService", post, user);
  const likeActive = checkLiked(post);
  const interestedActive = checkInterested(post);
  const eventActive = checkParticipation(post);

  const serviceHtml = `<div class="feed-card post service" data-postid="${post._id}"s>
  <div class="post-header">
    <img
      class="profile-picture"
      src="${userPicture}"
      alt="profile-picture"
    />
    <div class="post-info">
      <h3 class="post-info--name">${user.firstname} ${user.lastname}</h3>
      <div class="post-info--city">
        <i class="fas fa-map-marker-alt"></i> ${user.ville} - ${user.quartier}
      </div>
    </div>
  </div>

  <div class="post-content service-content">
    <h3 class="event-title">${post.title}</h3>
    <p class="post-content--text service--text">
      ${post.desc}
    </p>
    
    <div class="event-details-container">
      <div class="service-details">
        <h4 class="details-header">Contact</h4>
        <div class="service-phone">
          <i class="fas fa-phone"></i>

          <span class="service-phone--content">${post.contact}</span>
        </div>
        <div class="participants">
          <i class="fas fa-users"></i>
          <span class="participants-number">${post.participant.length}</span>
          Demandes 
        </div>
        
      </div>
      
    </div>

    <div class="service-demand">
      <button class="btn btn-participate ${eventActive[0]}">
        <i class="fas ${eventActive[1]}"></i> Demander ce service
      </button>
    </div>
  </div>

  <div class="feedback">
    <div class="like-button">
    <i class="far fa-thumbs-up ${likeActive}"></i>

      <span class="likes-num">${post.likes.length}</span>
    </div>
    <div class="interested-button">
      <i class="far fa-star ${interestedActive}"></i>

      <span class="interested-num">${post.interested.length}</span>
    </div>
    <div class="comment-button">
      <i class="far fa-comment"></i>
      <span class="comments-num">${post.comments.length}</span>
    </div>

    <input type="text" placeholder="Laissez un commentaire" />
    <i class="far fa-paper-plane comment-submit"></i>
  </div>
</div>`;

  postsContainer.insertAdjacentHTML("afterbegin", serviceHtml);
};

const displayImagePost = function (post, user) {
  const likeActive = checkLiked(post);
  const interestedActive = checkInterested(post);

  const imagePostHtml = `<div class="feed-card post" data-postid="${post._id}">
  <div class="post-header">
    <img
      class="profile-picture"
      src="${userPicture}"
      alt="profile-picture"
    />
    <div class="post-info">
      <h3 class="post-info--name">${user.firstname} ${user.lastname}</h3>
      <div class="post-info--city">
        <i class="fas fa-map-marker-alt"></i> ${user.ville} - ${user.quartier}
      </div>
    </div>
  </div>

  <div class="post-content">
    <p class="post-content--text">
      ${post.desc}
    </p>

    <img
      class="post-image"
      src="./images/${post.img}"
      alt="city-image"
    />
  </div>

  <div class="feedback">
    <div class="like-button">
       <i class="far fa-thumbs-up ${likeActive}"></i>
        <span class="likes-num">${post.likes.length}</span>
    </div>
    <div class="interested-button">
       <i class="far fa-star ${interestedActive}"></i>
       <span class="interested-num">${post.interested.length}</span>
    </div>
    <div class="comment-button">
        <i class="far fa-comment"></i>
        <span class="comments-num">${post.comments.length}</span>
    </div>

    <input type="text" placeholder="Laissez un commentaire" />
    <i class="far fa-paper-plane comment-submit"></i>
  </div>
</div>`;
  postsContainer.insertAdjacentHTML("afterbegin", imagePostHtml);
};

const getUserInfo = async function (userId) {
  const response = await fetch(
    `http://127.0.0.1:3000/api/users/user-id/${userId}`,
    {
      method: "GET",
      headers: {
        mode: "no-cors",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );

  const data = await response.json();
  return data;
};

const displayTemplates = async function (dataPromise) {
  try {
    const data = await dataPromise;
    data.forEach(async (post) => {
      const user = await getUserInfo(post.userId);

      if (post.type === "post") {
        displaySimplePost(post, user);
      } else if (post.type === "event") {
        displayEvent(post, user);
      } else if (post.type === "poll") {
        displayPoll(post, user);
      } else if (post.type === "service") {
        displayService(post, user);
      } else if (post.type === "image") {
        displayImagePost(post, user);
      }
    });
  } catch (error) {
    console.log("Error happened in displayTemplates function");
    console.error(error);
  }
};

const babezPosts = getPostsDataByCity(userObject.ville);
displayTemplates(babezPosts);

////////////////////// CREATE ////////////////////
const createPostReq = async function (postInfo) {
  const response = await fetch("http://127.0.0.1:3000/api/posts/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postInfo),
  });

  const data = await response.json();
  console.log("data received createPostReq", data);
  return data;
};

createServiceButton.addEventListener("click", async (el) => {
  console.log("create service clicked");
  const serviceTitle = document.querySelector("#service-title");
  const serviceDescription = document.querySelector("#service-description");
  const serviceContact = document.querySelector("#service-contact");

  const fields = [serviceTitle, serviceDescription, serviceContact];

  const postInfo = {
    userId: userObject._id, //Local Storage
    title: serviceTitle.value,
    desc: serviceDescription.value,
    contact: serviceContact.value,
    postville: userObject.ville, //Local Storage
    postquartier: userObject.quartier, //Local Storage
    type: "service",
  };

  const postInfoResponse = await createPostReq(postInfo);
  const user = await getUserInfo(postInfoResponse.userId);

  displayService(postInfoResponse, user);

  fields.forEach((el) => {
    el.value = "";
  });
});

createEventButton.addEventListener("click", async (el) => {
  console.log("create event clicked");
  const eventTitle = document.querySelector("#event-title");
  const eventDescription = document.querySelector("#event-description");
  const eventAdresse = document.querySelector("#event-adresse");
  const eventDay = document.querySelector("#event-day");
  const eventMonth = document.querySelector("#event-month");
  const eventYear = document.querySelector("#event-year");
  const eventHour = document.querySelector("#event-hour");
  const eventminute = document.querySelector("#event-minute");

  const fields = [
    eventTitle,
    eventDescription,
    eventAdresse,
    eventDay,
    eventMonth,
    eventYear,
    eventHour,
    eventminute,
  ];

  const eventTime = eventHour.value + ":" + eventminute.value;
  const eventDate = new Date(
    eventYear.value * 1,
    eventMonth.value * 1 - 1,
    eventDay.value * 1
  );

  const postInfo = {
    userId: userObject._id, //Local Storage
    title: eventTitle.value,
    desc: eventDescription.value,
    adresse: eventAdresse.value,
    time: eventTime,
    date: eventDate,
    postville: userObject.ville, //Local Storage
    postquartier: userObject.quartier, //Local Storage
    type: "event",
  };

  const postInfoResponse = await createPostReq(postInfo);
  const user = await getUserInfo(postInfoResponse.userId);

  displayEvent(postInfoResponse, user);

  fields.forEach((el) => {
    el.value = "";
  });
});

createPollButton.addEventListener("click", async (el) => {
  console.log("create poll clicked");
  const pollTitle = document.querySelector("#poll-title");
  const pollDescription = document.querySelector("#poll-description");
  const pollOption1 = document.querySelector("#poll-option-1");
  const pollOption2 = document.querySelector("#poll-option-2");
  const pollOption3 = document.querySelector("#poll-option-3");
  const pollOption4 = document.querySelector("#poll-option-4");

  const fields = [
    pollOption1,
    pollOption2,
    pollOption3,
    pollOption4,
    pollTitle,
    pollDescription,
  ];

  const options = [
    pollOption1.value,
    pollOption2.value,
    pollOption3.value,
    pollOption4.value,
  ];

  if (pollOption1.value == "" || pollOption2.value == "") {
    alert("options one and two must be specified");
    return;
  }

  const optionsFiltered = options.filter((el) => el !== "");

  const postInfo = {
    userId: userObject._id, //Local Storage
    title: pollTitle.value,
    desc: pollDescription.value,
    options: optionsFiltered,
    postville: userObject.ville, //Local Storage
    postquartier: userObject.quartier, //Local Storage
    type: "poll",
  };

  const postInfoResponse = await createPostReq(postInfo);
  const user = await getUserInfo(postInfoResponse.userId);

  displayPoll(postInfoResponse, user);

  fields.forEach((el) => {
    el.value = "";
  });
});

createPostImageButton.addEventListener("click", async (el) => {
  console.log("create post/image clicked");
  const postDescription = document.querySelector("#post-description");
  const postFile = document.querySelector("#post-file");

  const fields = [postDescription, postFile];

  if (postDescription.valu == "") {
    alert("Merci de remplir les champs");
    return;
  }

  if (postFile.files.length == 0) {
    const postInfo = {
      userId: userObject._id, //Local Storage
      desc: postDescription.value,
      postville: userObject.ville, //Local Storage
      postquartier: userObject.quartier, //Local Storage
      type: "post",
    };

    const postInfoResponse = await createPostReq(postInfo);
    const user = await getUserInfo(postInfoResponse.userId);

    displaySimplePost(postInfoResponse, user);
  } else {
    const postInfo = {
      userId: userObject._id, //Local Storage
      desc: postDescription.value,
      postville: userObject.ville, //Local Storage
      postquartier: userObject.quartier, //Local Storage
      img: imagePath,
      type: "image",
    };

    const postInfoResponse = await createPostReq(postInfo);
    const user = await getUserInfo(postInfoResponse.userId);
    displayImagePost(postInfoResponse, user);
  }

  fields.forEach((el) => {
    el.value = "";
  });
});

/////// SIGNOUT ////
signoutButton.addEventListener("click", (el) => {
  console.log("Signout clicked");
  localStorage.clear();
  window.location.replace("/login");
});

/////// Like //////
setTimeout(function () {
  const likeButtons = document.getElementsByClassName("like-button");
  console.log(likeButtons);
  // const feedback = document.querySelectorAll(".feedback");
  // console.log(feedback);
  for (let el of likeButtons) {
    console.log(el);
    el.addEventListener("click", async () => {
      const postId = el.closest(".feed-card").dataset.postid;
      const response = await fetch(
        `http://localhost:3000/api/posts/like/${postId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: userObject._id }),
        }
      );

      const data = await response.json();
      console.log(data);
      if (data == "Liked") {
        if (!el.querySelector("i").classList.contains("like--active")) {
          el.querySelector("i").classList.add("like--active");
        }
        const likesCount = el.querySelector(".likes-num").textContent * 1 + 1;
        el.querySelector(".likes-num").textContent = likesCount;
      } else if (data == "UnLiked") {
        if (el.querySelector("i").classList.contains("like--active")) {
          el.querySelector("i").classList.remove("like--active");
        }
        const likesCount = el.querySelector(".likes-num").textContent * 1 - 1;
        el.querySelector(".likes-num").textContent = likesCount;
      }
    });
  }
}, 1000);

///// Interested ////

setTimeout(function () {
  const interestedButtons =
    document.getElementsByClassName("interested-button");
  console.log(interestedButtons);
  // const feedback = document.querySelectorAll(".feedback");
  // console.log(feedback);
  for (let el of interestedButtons) {
    console.log(el);
    el.addEventListener("click", async () => {
      const postId = el.closest(".feed-card").dataset.postid;
      const response = await fetch(
        `http://localhost:3000/api/posts/interest/${postId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: userObject._id }),
        }
      );

      const data = await response.json();
      console.log(data);
      if (data == "intersted") {
        if (!el.querySelector("i").classList.contains("interested--active")) {
          el.querySelector("i").classList.add("interested--active");
        }
        const interestedCount =
          el.querySelector(".interested-num").textContent * 1 + 1;
        el.querySelector(".interested-num").textContent = interestedCount;
      } else if (data == "unintersted") {
        if (el.querySelector("i").classList.contains("interested--active")) {
          el.querySelector("i").classList.remove("interested--active");
        }
        const interestedCount =
          el.querySelector(".interested-num").textContent * 1 - 1;
        el.querySelector(".interested-num").textContent = interestedCount;
      }
    });
  }
}, 1000);

//Participate
setTimeout(function () {
  const participateButtons = document.getElementsByClassName("btn-participate");
  console.log(participateButtons);
  // const feedback = document.querySelectorAll(".feedback");
  // console.log(feedback);
  for (let el of participateButtons) {
    console.log(el);
    el.addEventListener("click", async () => {
      const postId = el.closest(".feed-card").dataset.postid;
      const response = await fetch(
        `http://localhost:3000/api/posts/participate/${postId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: userObject._id }),
        }
      );

      const data = await response.json();
      console.log(data);
      if (data == "participating") {
        if (!el.querySelector("i").classList.contains("fa-times-circle")) {
          el.querySelector("i").classList.add("fa-times-circle");
          el.querySelector("i").classList.remove("fa-calendar-alt");
          el.classList.add("btn-cancel");
        }
        const participantsCount =
          el.closest(".feed-card").querySelector(".participants-number")
            .textContent *
            1 +
          1;
        el
          .closest(".feed-card")
          .querySelector(".participants-number").textContent =
          participantsCount;
      } else if (data == "not participating") {
        if (el.querySelector("i").classList.contains("fa-times-circle")) {
          el.querySelector("i").classList.remove("fa-times-circle");
          el.querySelector("i").classList.add("fa-calendar-alt");
          el.classList.remove("btn-cancel");
        }
        const participantsCount =
          el.closest(".feed-card").querySelector(".participants-number")
            .textContent *
            1 -
          1;
        el
          .closest(".feed-card")
          .querySelector(".participants-number").textContent =
          participantsCount;
      }
    });
  }
}, 1000);

//Demand

setTimeout(function () {
  const demandButtons = document.getElementsByClassName("btn-demand");
  console.log(demandButtons);
  // const feedback = document.querySelectorAll(".feedback");
  // console.log(feedback);
  for (let el of demandButtons) {
    console.log(el);
    el.addEventListener("click", async () => {
      const postId = el.closest(".feed-card").dataset.postid;
      const response = await fetch(
        `http://localhost:3000/api/posts/participate/${postId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: userObject._id }),
        }
      );

      const data = await response.json();
      console.log(data);
      if (data == "participating") {
        if (!el.querySelector("i").classList.contains("fa-times-circle")) {
          el.querySelector("i").classList.add("fa-times-circle");
          el.querySelector("i").classList.remove("fa-concierge-bell");
          el.classList.add("btn-cancel");
        }
        const participantsCount =
          el.closest(".feed-card").querySelector(".participants-number")
            .textContent *
            1 +
          1;
        el
          .closest(".feed-card")
          .querySelector(".participants-number").textContent =
          participantsCount;
      } else if (data == "not participating") {
        if (el.querySelector("i").classList.contains("fa-times-circle")) {
          el.querySelector("i").classList.remove("fa-times-circle");
          el.querySelector("i").classList.add("fa-concierge-bell");
          el.classList.remove("btn-cancel");
        }
        const participantsCount =
          el.closest(".feed-card").querySelector(".participants-number")
            .textContent *
            1 -
          1;
        el
          .closest(".feed-card")
          .querySelector(".participants-number").textContent =
          participantsCount;
      }
    });
  }
}, 1000);

//Comment
setTimeout(function () {
  const commentButtons = document.getElementsByClassName("comment-submit");
  console.log(commentButtons);
  // const feedback = document.querySelectorAll(".feedback");
  // console.log(feedback);
  for (let el of commentButtons) {
    console.log(el);
    el.addEventListener("click", async () => {
      const postId = el.closest(".feed-card").dataset.postid;
      const commentContent = el
        .closest(".feedback")
        .querySelector("input").value;
      console.log("this is the input", commentContent);
      if (commentContent !== "") {
        const response = await fetch(
          `http://localhost:3000/api/posts/comment/${postId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: userObject._id,
              comment: commentContent,
            }),
          }
        );

        const data = await response.json();
        console.log(data);
        if (data == "Commented") {
          el.closest(".feedback").querySelector("input").value = "";
          const commentsCount =
            el.closest(".feedback").querySelector(".comments-num").textContent *
              1 +
            1;
          el.closest(".feedback").querySelector(".comments-num").textContent =
            commentsCount;
        } else {
        }
      }
    });
  }
}, 1000);

//Vote
setTimeout(function () {
  const voteButtons = document.getElementsByClassName("btn-poll");
  console.log(voteButtons);
  // const feedback = document.querySelectorAll(".feedback");
  // console.log(feedback);
  for (let el of voteButtons) {
    console.log(el);
    el.addEventListener("click", async () => {
      const postId = el.closest(".feed-card").dataset.postid;
      const checked = el
        .closest(".feed-card")
        .querySelector('input[name="poll"]:checked');

      let option;
      if (checked) {
        option = checked.value;
        console.log(option);
      } else {
        return;
      }

      let option1 = el.closest(".feed-card").querySelector(".opt-1").value;
      let option2 = el.closest(".feed-card").querySelector(".opt-2").value;
      let option3 = el.closest(".feed-card").querySelector(".opt-3");
      if (option3) option3 = option3.value;
      let option4 = el.closest(".feed-card").querySelector(".opt-4");
      if (option4) option4 = option4.value;

      let option1Count = 0;
      let option2Count = 0;
      let option3Count = 0;
      let option4Count = 0;

      //get post to calculate votes
      const responsePost = await fetch(
        `http://localhost:3000/api/posts/post/${postId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const postCalculate = await responsePost.json();
      console.log(postCalculate);
      for (const voteObj of postCalculate.voters) {
        if (Object.values(voteObj).includes(option1)) option1Count++;
        if (Object.values(voteObj).includes(option2)) option2Count++;
        if (Object.values(voteObj).includes(option3)) option3Count++;
        if (Object.values(voteObj).includes(option4)) option4Count++;
      }

      // const option = el
      //   .closest(".feed-card")
      //   .querySelector('input[name="poll"]:checked').value;
      const response = await fetch(
        `http://localhost:3000/api/posts/vote/${postId}/${option}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: userObject._id }),
        }
      );

      const data = await response.json();
      console.log(data);
      if (data == "voted") {
        if (!el.querySelector("i").classList.contains("fa-times-circle")) {
          el.querySelector("i").classList.add("fa-times-circle");
          el.querySelector("i").classList.remove("fa-poll");
          el.classList.add("btn-cancel");
        }

        if (option1 == option) option1Count++;
        if (option2 == option) option2Count++;
        if (option3 == option) option3Count++;
        if (option4 == option) option4Count++;

        el
          .closest(".feed-card")
          .querySelector(".opt-1")
          .closest(".poll-option")
          .querySelector(".percentage").textContent = option1Count;
        el
          .closest(".feed-card")
          .querySelector(".opt-2")
          .closest(".poll-option")
          .querySelector(".percentage").textContent = option2Count;

        const percentage3 = el.closest(".feed-card").querySelector(".opt-3");
        if (percentage3)
          percentage3
            .closest(".poll-option")
            .querySelector(".percentage").textContent = option3Count;

        const percentage4 = el.closest(".feed-card").querySelector(".opt-4");
        if (percentage4)
          percentage4
            .closest(".poll-option")
            .querySelector(".percentage").textContent = option4Count;
      } else if (data == "unvoted") {
        if (el.querySelector("i").classList.contains("fa-times-circle")) {
          el.querySelector("i").classList.remove("fa-times-circle");
          el.querySelector("i").classList.add("fa-poll");
          el.classList.remove("btn-cancel");
        }

        el
          .closest(".feed-card")
          .querySelector(".opt-1")
          .closest(".poll-option")
          .querySelector(".percentage").textContent = "";
        el
          .closest(".feed-card")
          .querySelector(".opt-2")
          .closest(".poll-option")
          .querySelector(".percentage").textContent = "";

        const percentage3 = el.closest(".feed-card").querySelector(".opt-3");
        if (percentage3)
          percentage3
            .closest(".poll-option")
            .querySelector(".percentage").textContent = "";

        const percentage4 = el.closest(".feed-card").querySelector(".opt-4");
        if (percentage4)
          percentage4
            .closest(".poll-option")
            .querySelector(".percentage").textContent = "";

        checked.checked = false;
      }
    });
  }
}, 1000);

// Consulter les commentaires

setTimeout(function () {
  const commentButtons = document.querySelectorAll(".comment-button");
  for (let el of commentButtons) {
    console.log(el);
    el.addEventListener("click", async () => {
      const postId = el.closest(".feed-card").dataset.postid;
      localStorage.setItem("postId", postId);
      window.location.replace("/post-template");
    });
  }
}, 1000);
