const sidebar = document.querySelector("aside");
const loginBtn = document.getElementById("login-btn");
const openSidebarBtn = document.getElementById("sidebar-btn");
const closeSidebarBtn = document.getElementById("close-btn");
const postMessageBtn = document.getElementById("post-message-btn");
const loginEnterKey = document.getElementById("enter-key-login");
const messageEnterKey = document.getElementById("enter-key-message");
const mainGen = document.querySelector("main");
const username = { name: null };
const userInputMsg = {
  from: "",
  to: "",
  text: "",
  type: "",
};
let allMessages = [];
let newMessages = [];
let onlineUsers = [];
let interval = null;
let firstLoad = true;
let lastMsgTime = null;
let indexOfLstMsg = null;

btnInit();

function secondScreen() {
  const loginScreen = document.querySelector(".login-screen");
  const secondScreen = Array.from(document.querySelectorAll(".hidden"));

  loginScreen.classList.add("hidden");
  secondScreen.forEach((element) => {
    element.classList.remove("hidden");
  });
}
function btnInit() {
  loginBtn.addEventListener("click", () => {
    postUser();
  });
  openSidebarBtn.addEventListener("click", () => {
    if (!openSidebarBtn.classList.contains("disabled")) {
      openSidebar();
      toggleDisable(openSidebarBtn);
    }
  });
  closeSidebarBtn.addEventListener("click", () => {
    closeSidebar();
    toggleDisable(openSidebarBtn);
  });
  postMessageBtn.addEventListener("click", () => {
    postMessage();
  });
  loginEnterKey.addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.key === "Enter") {
      loginBtn.click();
    }
  });
  messageEnterKey.addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.key === "Enter") {
      postMessageBtn.click();
    }
  });
}
function postUser() {
  username.name = document.querySelector(
    ".login-screen__container input"
  ).value;
  const request = axios.post(
    "https://mock-api.driven.com.br/api/v4/uol/participants",
    username
  );

  request.then(responseProcess);
  request.catch(errorProcess);
}
function responseProcess(response) {
  console.log(`STATUS CODE: ${response}`);

  secondScreen();
  getData();
  loadUpdate();
  setInterval(getOnlineUsers, 10000);
  setInterval(statusUpdate, 5000);
}
function statusUpdate() {
  const request = axios.post(
    "https://mock-api.driven.com.br/api/v4/uol/status",
    username
  );
  request.then(updateResponseProcess);
  request.catch(errorProcess);
}
function updateResponseProcess() {
  console.log(`STATUS UPDATE SUCCESSFUL`);
}
function errorProcess(error) {
  console.log(error);
  alert(`
        !!ERROR ${error}!!
    Por favor insira outro nome
  `);
}
function openSidebar() {
  sidebar.style.width = "70vw";
  document.body.style.backgroundColor = "rgba(0,0,0,.6)";
}
function closeSidebar() {
  sidebar.style.width = "0";
  document.body.style.backgroundColor = "rgba(243, 243, 243, 1)";
}
function toggleDisable(element) {
  element.classList.toggle("disabled");
}
function getData() {
  const promise = axios.get(
    "https://mock-api.driven.com.br/api/v4/uol/messages"
  );
  promise.then(loadData);
}
function loadData(response) {
  allMessages = response.data;

  renderMessages();
}
function renderMessages() {
  if (firstLoad) {
    if (allMessages[0].type === "status") {
      mainGen.innerHTML = `
        <p class="user-${allMessages[0].type}">
          <span>(${allMessages[0].time})</span>
          <strong>${allMessages[0].from}</strong> ${allMessages[0].text}
        </p>`;
    } else if (allMessages[0].type === "private_message") {
      mainGen.innerHTML = `
        <p class="user-${allMessages[0].type}">
          <span>(${allMessages[0].time})</span> <strong>${allMessages[0].from}</strong> reservadamente para
          <strong>${allMessages[0].to}</strong>: ${allMessages[0].text}
        </p>`;
    } else if (allMessages[0].type === "message") {
      mainGen.innerHTML = `
        <p class="user-${allMessages[0].type}">
          <span>(${allMessages[0].time})</span> <strong>${allMessages[0].from}</strong> para
          <strong>${allMessages[0].to}</strong>: ${allMessages[0].text}
        </p>`;
    }
    allMessages.splice(0, 1);
    /* only prints all data once, and splices array, thus insertAdjacentHTML will not exhibit errors */

    allMessages.forEach(LOADMESSAGES); //declaration: refer to line 94
    lastMsgTime = allMessages[allMessages.length - 1].time;
    firstLoad = false;
  } else {
    getNewMessages();
  }
}
function getNewMessages() {
  if (!(allMessages[allMessages.length - 1].time === lastMsgTime)) {
    for (let i = allMessages.length - 1; i > 0; i--) {
      if (allMessages[i].time === lastMsgTime) {
        indexOfLstMsg = i;
        break;
      }
    }
    newMessages = allMessages.splice(
      indexOfLstMsg + 1,
      allMessages.length - indexOfLstMsg
    );
    renderNewMessages();
  }
}
function renderNewMessages() {
  console.log(`MESSAGES LOADED SUCCESSFULLY`);

  newMessages.forEach(LOADMESSAGES); //declaration: refer to line 94
  lastMsgTime = newMessages[newMessages.length - 1].time;
  newMessages = [];

  const lastElement = mainGen.lastChild;
  lastElement.scrollIntoView({ behavior: "smooth", block: "center" });
}
function loadUpdate() {
  interval = setInterval(getData, 3000);
}
function postMessage() {
  userInputMsg.text = document.querySelector("footer input").value;
  userInputMsg.from = username.name;
  userInputMsg.to = "Todos";
  userInputMsg.type = "message";

  const request = axios.post(
    "https://mock-api.driven.com.br/api/v4/uol/messages",
    userInputMsg
  );
  request.then(updateMessageProcess);
  request.catch(errorProcess);
}
function updateMessageProcess() {
  console.log(`MESSAGE SENT`);
  document.querySelector("footer input").value = "";
}
function getOnlineUsers() {
  const request = axios.get(
    "https://mock-api.driven.com.br/api/v4/uol/participants"
  );

  request.then(listOnlineUsers);
  request.catch(errorProcess);
}
function listOnlineUsers(response) {
  let nUserNames = [];
  onlineUsers = response.data;

  for (let i = 0; i < onlineUsers.length; i++) {
    nUserNames.push(onlineUsers[i].name);
  }

  console.log(`LIST OF USERS LOADED SUCCESSFULLY
    CURRENTLY ONLINE: ${onlineUsers.length}, 
    ${nUserNames}`);
}
const LOADMESSAGES = (element) => {
  const msgCollection = document.querySelectorAll("main p");
  const index = msgCollection.length - 1;

  if (element.type === "status") {
    msgCollection[index].insertAdjacentHTML(
      "afterend",
      `
        <p class="user-${element.type}">
          <span>(${element.time})</span>
          <strong>${element.from}</strong> ${element.text}
        </p>`
    );
  } else if (element.type === "private_message") {
    msgCollection[index].insertAdjacentHTML(
      "afterend",
      `
        <p class="user-${element.type}">
          <span>(${element.time})</span> <strong>${element.from}</strong> reservadamente para
          <strong>${element.to}</strong>: ${element.text}
        </p>`
    );
  } else if (element.type === "message") {
    msgCollection[index].insertAdjacentHTML(
      "afterend",
      `
        <p class="user-${element.type}">
          <span>(${element.time})</span> <strong>${element.from}</strong> para
          <strong>${element.to}</strong>: ${element.text}
        </p>`
    );
  }
};
