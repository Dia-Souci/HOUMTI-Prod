"use strict";

const userObject = JSON.parse(localStorage.getItem("userInfo"));
const postId = localStorage.getItem("postId");
console.log(userObject, postId);

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

////// DISPLAY POSTS//////////

const getPostById = async function (postId) {
  try {
    const response = await fetch(
      `http://127.0.0.1:3000/api/posts/post/${postId}`,
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
    console.log("Error happened in getPostsDataById");
    console.error(error);
  }
};

const commentsTemplate = async function (postInfo) {
  console.log("postInfo", postInfo);
  let comments = "";
  for (const comment of postInfo.comments) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/users/user-id/${comment.userId}`,
        {
          method: "GET",
          headers: {
            mode: "no-cors",
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const userInfo = await response.json();
      const profilePicture = userInfo.profilePicture
        ? `./images/` + userInfo.profilePicture
        : `./images/default.png`;

      console.log("userInfo from comments template", userInfo);

      comments += `
      <div class="comment-card">
      <img
        class="profile-picture commenter-profile-image"
        src="${profilePicture}"
        alt="profile-picture"
      />

      <div class="comment-info">
        <div class="commenter">${userInfo.firstname} ${userInfo.lastname}</div>
        <div class="comment-content">${comment.content}</div>
      </div>
    </div>`;
    } catch (error) {
      console.log("Error happened when getting user in commentsTemplate");
      console.error(error);
    }
  }
  return comments;
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

const displaySimplePost = async function (post, user) {
  // console.log("logged in displaySimplePosts", post, user);
  //Like Active
  const likeActive = checkLiked(post);
  const interestedActive = checkInterested(post);

  const comments = await commentsTemplate(post);
  console.log(comments);

  //Interested Active
  const postHtml =
    `<div class="feed-card post" data-postid="${post._id}">
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

  <div class="comments"> ` +
    comments +
    `

  </div>
</div>`;

  postsContainer.insertAdjacentHTML("afterbegin", postHtml);
};

const displayEvent = async function (post, user) {
  console.log("logged in displayEvent", post, user);
  const comments = await commentsTemplate(post);
  const likeActive = checkLiked(post);
  const interestedActive = checkInterested(post);
  const eventActive = checkParticipation(post);

  const eventHtml =
    `<div class="feed-card post event" data-postid="${post._id}">
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

  <div class="comments"> ` +
    comments +
    `

  </div>
</div>`;

  postsContainer.insertAdjacentHTML("afterbegin", eventHtml);
};

const displayPoll = async function (post, user) {
  console.log("logged in displayPoll", post, user);
  const comments = await commentsTemplate(post);
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
    <i class="far fa-paper-plane comment-submit"></i>
  </div>

  <div class="comments"> ` +
    comments +
    `

  </div>
</div>`;
  postsContainer.insertAdjacentHTML("afterbegin", pollHtml);
};

const displayService = async function (post, user) {
  console.log("logged in from displayService", post, user);
  const comments = await commentsTemplate(post);
  const likeActive = checkLiked(post);
  const interestedActive = checkInterested(post);
  const eventActive = checkParticipation(post);

  const serviceHtml =
    `<div class="feed-card post service" data-postid="${post._id}"s>
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

  <div class="comments"> ` +
    comments +
    `

  </div>
</div>`;

  postsContainer.insertAdjacentHTML("afterbegin", serviceHtml);
};

const displayImagePost = async function (post, user) {
  const comments = await commentsTemplate(post);
  const likeActive = checkLiked(post);
  const interestedActive = checkInterested(post);

  const imagePostHtml =
    `<div class="feed-card post" data-postid="${post._id}">
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

  <div class="comments"> ` +
    comments +
    `

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
    const post = await dataPromise;

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
  } catch (error) {
    console.log("Error happened in displayTemplates function");
    console.error(error);
  }
};

const post = getPostById(postId);
displayTemplates(post);
