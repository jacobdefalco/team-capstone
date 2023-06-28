"use strict";

const userGreeting = document.querySelector("#user-greeting-div");
const logoutButton = document.querySelector("#logout-btn");

const loginData = getLoginData();

if (isLoggedIn()) {
  userGreeting.innerHTML = `Logged in as ${loginData.username}`;
} else {
  userGreeting.innerHTML = "Please Log In";
}
