const sidebar = document.querySelector("aside");
const loginButton = document.getElementById("login-btn");
const openSidebarButton = document.getElementById("sidebar-btn");
const closeSidebarButton = document.getElementById("close-btn");
const sidebarComplete = document.querySelector(".sidebar-complete");
const mainGen = document.querySelector("main");
let allMessages = [];
let interval = null;
let nLoads = 0;

btnInit();
//window.onload = loadUpdate();

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
  allMessages = response.data;

  renderAllMessages();
  /* renderAllUsers(); */
}
function renderAllMessages() {
  for (let i = 0; i < allMessages.length; i++) {
    if (allMessages[i].type === "status") {
      mainGen.innerHTML += `
      <p class="user-statuslog">
        <span>(${allMessages[i].time})</span> <strong>${allMessages[i].from}</strong> ${allMessages[i].text}
      </p>`;
    } else if (allMessages[i].type === "private_message") {
      mainGen.innerHTML += `
      <p class="user-privatemsg">
        <span>(${allMessages[i].time})</span> <strong>${allMessages[i].from}</strong> reservadamente para
        <strong>${allMessages[i].to}</strong>: ${allMessages[i].text}
      </p>`;
    } else if (allMessages[i].type === "message") {
      mainGen.innerHTML += `
      <p class="user-text">
        <span>(${allMessages[i].time})</span> <strong>${allMessages[i].from}</strong> para
        <strong>${allMessages[i].to}</strong>: ${allMessages[i].text}
      </p>`;
    }
  }
  nLoads++;

  const childElementTmp = mainGen.lastChild;
  console.log(`
    prevLastElement = ${childElementTmp.innerText}
  `);
  scrollDownLastMsg(childElementTmp);
}
function scrollDownLastMsg(prevLastElement) {
  const lastElement = mainGen.lastChild;
  console.log(`
    lastElement = ${lastElement.innerText}
    prevLastElement = ${prevLastElement.innerText}
  `);

  if (lastElement !== prevLastElement ||
      nLoads === 1
  ){
    lastElement.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}
function loadUpdate() {
  interval = setInterval(getData, 3000);
}
