"use strict";

const userObject = JSON.parse(localStorage.getItem("userInfo"));
console.log(userObject);

const profilePictures = document.querySelectorAll(".profile-picture-user");
const profileCardName = document.querySelector(".myprofile-name");
const profileCardCity = document.querySelector(".quartier");
const postsContainer = document.querySelector(".myprofile-banner-container");
const signoutButton = document.querySelector("#signout-button");

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

////// DISPLAY POSTS//////////

const getPostsDataByUser = async function (user) {
  try {
    const response = await fetch(
      `http://127.0.0.1:3000/api/posts//posts-user/${user}`,
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
    console.log("Error happened in getPostsDataByUser");
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
    <i class="far fa-paper-plane"></i>
  </div>
</div>`;

  postsContainer.insertAdjacentHTML("afterend", postHtml);
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
    <i class="far fa-paper-plane"></i>
  </div>
</div>`;

  postsContainer.insertAdjacentHTML("afterend", eventHtml);
};

const displayPoll = function (post, user) {
  console.log("logged in displayPoll", post, user);
  const likeActive = checkLiked(post);
  const interestedActive = checkInterested(post);

  const pollArea = function (options) {
    let pollAreaOptions = `<div class="poll-area">`;
    options.forEach(function (option) {
      pollAreaOptions += `
      <div class="poll-option">
      <div class="poll-option--vote">
        <input type="radio" name="poll" id="opt-2" />
        <label for="opt-2">${option}</label>
      </div>

      <div class="percentage"></div>
    </div>`;
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
      <button class="btn btn-poll">
        <i class="fas fa-poll"></i> Votez maintenant
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
    <i class="far fa-paper-plane"></i>
  </div>
</div>`;
  postsContainer.insertAdjacentHTML("afterend", pollHtml);
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
    <i class="far fa-paper-plane"></i>
  </div>
</div>`;

  postsContainer.insertAdjacentHTML("afterend", serviceHtml);
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
    <i class="far fa-paper-plane"></i>
  </div>
</div>`;
  postsContainer.insertAdjacentHTML("afterend", imagePostHtml);
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

const babezPosts = getPostsDataByUser(userObject._id);
displayTemplates(babezPosts);

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
