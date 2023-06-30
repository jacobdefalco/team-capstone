const postBtn = document.querySelector("#post-btn");
const postInput = document.querySelector("#postInput");

window.onload = init;

function init() {
  loadUser().then(() => {
    postBtn.addEventListener("click", () => {
      const postText = postInput.value;
      const { username, password } = userData;
      createPost(username, password, postText);
    });
  });
}

async function setPostCount(count) {
  document.getElementById("postCount").innerHTML = count;
}

function loadUser() {
  fetch(`${apiBaseURL}/api/users/${loginData.username}`, {
    headers: {
      Authorization: "Bearer " + loginData.token,
    },
  })
    .then((response) => response.json())
    .then((userData) => {
      // Find the user data based on the username

      if (userData) {
        // Display elements
        const usernameElement = document.querySelector("#username");
        usernameElement.innerHTML = `<p>@${userData.username}</p>`;

        const fullNameElement = document.querySelector("#full-name");
        fullNameElement.innerHTML = `<p>${userData.fullName}</p>`;

        const bioElement = document.querySelector("#bio");
        bioElement.innerHTML = `<p>${userData.bio}</p>`;

        const userSinceElement = document.querySelector("#user-since");
        userSinceElement.innerHTML = `<p> User since ${new Date(userData.createdAt).toLocaleString()}<p>`;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function createPost(username, password, postText) {
  const postData = {
    username: username,
    password: password,
    text: postText,
  };

  fetch(`${apiBaseURL}/api/users/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + loginData.token,
    },
    body: JSON.stringify(postData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Post created:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}