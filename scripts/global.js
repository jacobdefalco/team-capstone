"use strict";

const userGreeting = document.querySelector("#user-greeting-div");

const loginData = getLoginData();

if (isLoggedIn()) {
  userGreeting.innerHTML = `Logged in as ${loginData.username}`;
}
