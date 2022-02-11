const sidebar = document.querySelector("aside");
const loginButton = document.getElementById("login-btn");
const openSidebarButton = document.getElementById("sidebar-btn");
const closeSidebarButton = document.getElementById("close-btn");
const sidebarComplete = document.querySelector(".sidebar-complete");
const mainGen = document.querySelector("main");
let tmpMessages = null;
let allMessages = [];
let newMessages = [];
let interval = null;
let firstLoad = true;
let lastMsgTime = null;
let indexOfLstMsg = null;

btnInit();

function postUser() {
  const form = document.querySelector(".login-screen__container");
  const username = form.children[0].value;
  console.log(username);
  //form.submit();
  //POST
}
function secondScreen() {
  const loginScreen = document.querySelector(".login-screen");
  const secondScreen = Array.from(document.querySelectorAll(".hidden"));

  loginScreen.classList.add("hidden");
  secondScreen.forEach((element) => {
    element.classList.remove("hidden");
  });
}
function btnInit() {
  loginButton.addEventListener("click", () => {
    postUser();
    getData();
    secondScreen();
    loadUpdate();
  });

  openSidebarButton.addEventListener("click", () => {
    if (!openSidebarButton.classList.contains("disabled")) {
      openSidebar();
      toggleDisable(openSidebarButton);
    }
  });
  closeSidebarButton.addEventListener("click", () => {
    closeSidebar();
    toggleDisable(openSidebarButton);
  });
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

  console.log("Enviou a requisição");
}
function loadData(response) {
  //tmpMessages = allMessages;
  allMessages = response.data;

  renderMessages();
  /* renderAllUsers(); */
}
function renderMessages() {
  if (firstLoad) {
    if (allMessages[0].type === "status") {
      mainGen.innerHTML = `
        <p class="user-statuslog">
          <span>(${allMessages[0].time})</span>
          <strong>${allMessages[0].from}</strong> ${allMessages[0].text}
        </p>`;
    } else if (allMessages[0].type === "private_message") {
      mainGen.innerHTML = `
        <p class="user-privatemsg">
          <span>(${allMessages[0].time})</span> <strong>${allMessages[0].from}</strong> reservadamente para
          <strong>${allMessages[0].to}</strong>: ${allMessages[0].text}
        </p>`;
    } else if (allMessages[0].type === "message") {
      mainGen.innerHTML = `
        <p class="user-text">
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
  console.log(` ANTES
    newMessages.length = ${newMessages.length}, 
    lastMsgTime = ${lastMsgTime}
  `);
  newMessages.forEach(LOADMESSAGES); //declaration: refer to line 94
  lastMsgTime = newMessages[newMessages.length - 1].time;
  newMessages = [];
  console.log(` DEPOIS
    newMessages.length = ${newMessages.length}, 
    lastMsgTime = ${lastMsgTime}
  `);

  const lastElement = mainGen.lastChild;
  lastElement.scrollIntoView({ behavior: "smooth", block: "center" });
}
function loadUpdate() {
  interval = setInterval(getData, 3000);
}
const LOADMESSAGES = (element) => {
  const msgCollection = document.querySelectorAll("main p");
  const index = msgCollection.length - 1;

  if (element.type === "status") {
    msgCollection[index].insertAdjacentHTML(
      "afterend",
      `
        <p class="user-statuslog">
          <span>(${element.time})</span>
          <strong>${element.from}</strong> ${element.text}
        </p>`
    );
  } else if (element.type === "private_message") {
    msgCollection[index].insertAdjacentHTML(
      "afterend",
      `
        <p class="user-privatemsg">
          <span>(${element.time})</span> <strong>${element.from}</strong> reservadamente para
          <strong>${element.to}</strong>: ${element.text}
        </p>`
    );
  } else if (element.type === "message") {
    msgCollection[index].insertAdjacentHTML(
      "afterend",
      `
        <p class="user-text">
          <span>(${element.time})</span> <strong>${element.from}</strong> para
          <strong>${element.to}</strong>: ${element.text}
        </p>`
    );
  }
};

//lstELement = allMessages.lastElement;
//console.log(beasts.indexOf(lstElement.time));
