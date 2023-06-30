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

  const response = await fetch(
    apiBaseURL + "/api/posts?limit=1000&offset=0",
    options
  );
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
    let likescount;
    var newArray = element.likes.filter(function (element) {
      return element.username == getLoginData().username;
    });

    if (newArray.length > 0) {
      likesElement = "text-danger";
    } else {
      likesElement = "text-secondary";
    }
    if (element.likes.length) {
      likescount = "text-info";
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
      "<button class='btn btn-dark' type='button' id='" +
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
      " <div class='d-flex justify-content-between p-3'> <span class='fw-bold post-text' > <i class='fas fa-user-circle fa-lg mb-1 post-text'></i> " +
      element.username +
      " </span> " +
      actionElement +
      "</div> <div class='d-flex p-3'> <p class='card-text'> " +
      element.text +
      "</p>  </div> <hr > <div class='d-flex justify-content-end '> <i class='fa fa-heart  fa-xl " +
      likesElement +
      "' onclick='likePost(this)' name='likeElement_" +
      element._id +
      "' id='" +
      element._id +
      "' ></i>" +
      "<span class='d-flex flex-row muted-color " +
      likescount +
      "' name='likeCountElement_" +
      element._id +
      "'>" +
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

async function setPostCount(count) {
  document.getElementById("postCount").innerHTML = count;
}

async function deletePost(postId) {
  //get post by Id
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
async function likePost(_this) {
  // alert(_this.id);

  // 1) get existing likes
  // 2) if loggedin user allready have like then call delete like
  // 3) if loggedin user not having likes then call add like

  let postdetails = await getPostById(_this.id);
  let likecounter = false;
  console.log(postdetails);

  var newArray = postdetails.likes.filter(function (element) {
    return element.username == getLoginData().username;
  });
  if (newArray.length >= 1) {
    document
      .querySelector("[name='" + "likeElement_" + _this.id + "']")
      .classList.remove("text-danger");
    document
      .querySelector("[name='" + "likeElement_" + _this.id + "']")
      .classList.add("text-secondary");

    removelike(newArray[0]._id);
  } else {
    document
      .querySelector("[name='" + "likeElement_" + _this.id + "']")
      .classList.remove("text-secondary");
    document
      .querySelector("[name='" + "likeElement_" + _this.id + "']")
      .classList.add("text-danger");

    addlike(_this.id);
  }
}

async function removelike(likeId) {
  // DELETE /api/posts
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getLoginData().token,
    },
  };
  await fetch(apiBaseURL + "/api/likes/" + likeId, options);
  getAllPost();
}

async function addlike(postId) {
  // DELETE /api/posts
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getLoginData().token,
    },
    body: JSON.stringify({ postId: postId }),
  };
  await fetch(apiBaseURL + "/api/likes", options);
  getAllPost();
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
