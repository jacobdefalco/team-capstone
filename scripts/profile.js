"use strict";
const postBtn = document.querySelector("#post-btn");

// Create functions to grab the current time
const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getCurrentTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

if (isLoggedIn()) {
  const loginData = getLoginData();

  fetch(`${apiBaseURL}/api/users/${loginData.username}`, {
    headers: {
      Authorization: "Bearer " + loginData.token,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // Find the user data based on the username
      const userData = data.find((users) => users.username === loginData.username);

      if (userData) {
        // Display elements
        const usernameElement = document.querySelector("#username");
        usernameElement.innerHTML = `<p>@${userData.username}</p>`;

        const textContentElement = document.querySelector("#post-text");
        textContentElement.innerText = "";

        const timeElement = document.querySelector("#time");
        timeElement.innerHTML = `<p>${getCurrentTime()}</p>`;

        const dateElement = document.querySelector("#date");
        dateElement.innerHTML = `<p>${getCurrentDate()}</p>`;
        

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

        postBtn.addEventListener("click", () => {
          const postText = textContentElement.value;
          const { username, password } = userData;
          createPost(username, password, postText);
        });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
