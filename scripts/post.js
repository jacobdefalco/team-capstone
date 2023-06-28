"use strict";
window.onload = init;

function init() {
  // check if user is loggedin
  if (isLoggedIn() === false) {
    window.location.replace("/");
  } else {
    //check if token is expired
    let parsedToken = parseJwt(getLoginData().token);
    if (Date.now() >= parsedToken.exp * 1000) {
      alert("token expired");
      window.location.replace("/");
    } else {
      getAllPost();
    }
  }
}

async function getAllPost() {
  // GET /api/posts
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getLoginData().token,
    },
  };

  const response = await fetch(apiBaseURL + "/api/posts", options);
  const postData = await response.json();

  setPostCount(postData.length);
  renderPost(postData);
}

function renderPost(postData) {
  var formContainer = document.getElementById("postContainer");
  formContainer.innerHTML = "";

  //sort post by created time
  postData.sort(function (a, b) {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  postData.forEach((element) => {
    var div = document.createElement("div");
    div.id = element._id;
    div.className = "bg-post m-4 p-4";

    let likesElement;
    if (element.likes.length) {
      likesElement = "text-danger";
    } else {
      likesElement = "text-secondary";
    }
    var date = new Date(element.createdAt);

    let actionElement =
      "<div class='d-flex flex-row mt-1 ellipsis'>" +
      "<small class='m-1'>" +
      date.toLocaleString() +
      "</small>" +
      "<div class='dropdown' id='" +
      element._id +
      "'>" +
      "<button class='btn btn-light' type='button' id='" +
      element._id +
      "' data-bs-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>" +
      "  <i class='fa fa-ellipsis-h '></i>" +
      " </button>" +
      "<div class='dropdown-menu' aria-labelledby='dropdownMenuButton'>" +
      //   "  <a class='dropdown-item' href='#'>Edit</a>" +
      "  <a class='dropdown-item' id='" +
      element._id +
      "'  onclick='deletePost(this)'>Delete</a>" +
      "</div>" +
      " </div>" +
      "</div>";

    div.innerHTML +=
      " <div class='d-flex justify-content-between p-3'> <span class='fw-bold text-info'> <i class='fas fa-user-circle fa-lg mb-1'></i> " +
      element.username +
      " </span> " +
      actionElement +
      "</div> <div class='d-flex p-3'> <p class='card-text'> " +
      element.text +
      "</p>  </div> <hr > <div class='d-flex justify-content-end '> <i class='fa fa-heart  fa-xl " +
      likesElement +
      "' onclick='likePost(this)'></i>" +
      "<span class='d-flex flex-row muted-color'>" +
      element.likes.length +
      "  Likes</span> </div>";

    formContainer.appendChild(div);
  });
}

async function addPost() {
  // POST /api/posts
  let post = document.getElementById("postInput").value;

  if (post && !(post.trim() == "")) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getLoginData().token,
      },
      body: JSON.stringify({ text: post }),
    };
    await fetch(apiBaseURL + "/api/posts", options);
    getAllPost();
  } else {
    alert("Please Post something");
  }
  document.getElementById("postInput").value = "";
}

// async function setPostCount(count) {
//   document.getElementById("postCount").innerHTML = count;
// }

async function deletePost(postId) {
  let postdetails = await getPostById(postId.id);
  //delete only id user trying to delete his own post
  if (postdetails.username == getLoginData().username) {
    // DELETE /api/posts
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getLoginData().token,
      },
    };
    await fetch(apiBaseURL + "/api/posts/" + postId.id, options);
    getAllPost();
  } else {
    alert("You are not allowed to delete others post");
  }
}

async function setPostCount(count) {
  document.getElementById("postCount").innerHTML = count;
}

async function getPostById(postId) {
  // GET /api/posts
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getLoginData().token,
    },
  };

  const response = await fetch(apiBaseURL + "/api/posts/" + postId, options);
  const postData = await response.json();

  return postData;
}
function likePost(_this) {
  alert("Like functionality not available");
}

//Method to parse JWT Token
function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}