const sidebarContainer = document.querySelector("aside");
const sidebar = document.querySelector(".sidebar");
const loginBtn = document.getElementById("login-btn");
const openSidebarBtn = document.getElementById("sidebar-btn");
const closeSidebarBtn = document.getElementById("close-btn");
const postMessageBtn = document.getElementById("post-message-btn");
const loginEnterKey = document.getElementById("enter-key-login");
const messageEnterKey = document.getElementById("enter-key-message");
const mainGen = document.querySelector("main");
const inputRef = document.querySelector(".input-container p");
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
let firstLoad = true;
let contactOptions = null;
let visibilityOptions = null;
let selectedUser = null;
let selectedVisibility = null;
let interval = null;
let lastMsgTime = null;
let indexOfLstMsg = null;

btnInit();

function btnInit() {
  loginBtn.addEventListener("click", () => {
    postUser();
  });
  openSidebarBtn.addEventListener("click", () => {
    if (!openSidebarBtn.classList.contains("disabled")) {
      toggleSidebar(true);
      toggleDisable(openSidebarBtn);
    }
  });
  closeSidebarBtn.addEventListener("click", () => {
    toggleSidebar(false);
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
function secondScreen() {
  const loginScreen = document.querySelector(".login-screen");
  const secondScreen = Array.from(document.querySelectorAll(".hidden"));

  loginScreen.classList.add("hidden");
  secondScreen.forEach((element) => {
    element.classList.remove("hidden");
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
function responseProcess() {
  secondScreen();
  getData();
  loadUpdate();
  getOnlineUsers();
  btnInitVisibility();
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
  if (error.response.status === 400) {
    alert(`
      Este nome já existe ou é inválido!
      Por favor, tente novamente.`);
  }
  if (error.response.status === 404) {
    alert(`ERRO 404`);
  }
}
function toggleSidebar(value) {
  if (value) {
    sidebarContainer.style.width = "100vw";
    sidebar.style.width = "70%";
  } else {
    sidebarContainer.style.width = "0";
    sidebar.style.width = "0";
  }
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
        <p class="user-${allMessages[0].type}" data-identifier="message">
          <span>(${allMessages[0].time})</span> <strong>${allMessages[0].from}</strong> reservadamente para
          <strong>${allMessages[0].to}</strong>: ${allMessages[0].text}
        </p>`;
    } else if (allMessages[0].type === "message") {
      mainGen.innerHTML = `
        <p class="user-${allMessages[0].type}" data-identifier="message">
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

  newMessages.forEach(LOADMESSAGES); //declaration set on script end
  lastMsgTime = newMessages[newMessages.length - 1].time;
  newMessages = [];

  const lastElement = mainGen.lastChild;
  lastElement.scrollIntoView({ behavior: "smooth", block: "center" });
}
function loadUpdate() {
  interval = setInterval(getData, 3000);
}
function postMessage() {
  loadMessage();

  const request = axios.post(
    "https://mock-api.driven.com.br/api/v4/uol/messages",
    userInputMsg
  );
  request.then(updateMessageProcess);
  request.catch(errorProcess);
}
function loadMessage() {
  userInputMsg.text = document.querySelector("footer input").value;
  userInputMsg.from = username.name;

  if (
    selectedUser !== null &&
    selectedVisibility !== null &&
    selectedUser.children[1].innerHTML !== "Todos" &&
    selectedVisibility.children[1].innerHTML === "Privado"
  ) {
    userInputMsg.type = "private_message";
    userInputMsg.to = `${selectedUser.children[1].innerHTML}`;
  } else {
    userInputMsg.type = "message";
    userInputMsg.to = "Todos";
  }
  updateInputContainer();
}
function updateMessageProcess() {
  console.log(`MESSAGE SENT`);
  document.querySelector("footer input").value = "";
  getData();
}
function getOnlineUsers() {
  const request = axios.get(
    "https://mock-api.driven.com.br/api/v4/uol/participants"
  );

  request.then(listOnlineUsers);
  request.catch(errorProcess);
}
function listOnlineUsers(response) {
  const contactSelection = document.getElementById("contact-selection");
  onlineUsers = response.data;
  contactSelection.innerHTML = `
    <div class="opt">
      <ion-icon name="people"></ion-icon>
      <p>Todos</p>
      <span id="online-users-tracker">${onlineUsers.length} online</span>
    </div>
  `;

  onlineUsers.forEach((element) => {
    const usersCollection = document.querySelectorAll(
      "#contact-selection .opt"
    );
    const index = usersCollection.length - 1;

    usersCollection[index].insertAdjacentHTML(
      "afterend",
      `
        <div class="opt" data-identifier="participant">
          <ion-icon name="person-circle-outline"></ion-icon>
          <p>${element.name}</p>
          <span class="hidden-absolute">&#10003;</span>
        </div>
      `
    );
  });
  btnInitContacts();
}
function btnInitContacts() {
  contactOptions = document.querySelectorAll("#contact-selection .opt");
  contactOptions.forEach((element) => {
    element.addEventListener("click", () => {
      selectUser(element);
    });
  });
}
function btnInitVisibility() {
  visibilityOptions = document.querySelectorAll("#visibility-selection .opt");
  visibilityOptions.forEach((element) => {
    element.addEventListener("click", () => {
      selectVisibility(element);
    });
  });
}
function selectUser(element) {
  if (!selectedUser) {
    selectedUser = element;
    toggleSelect(element);
  } else if (selectedUser == element) {
    selectedUser = null;
    toggleSelect(element);
  } else {
    toggleSelect(selectedUser);
    selectedUser = element;
    toggleSelect(element);
  }
  if (selectedVisibility !== null && selectedUser !== null) {
    loadMessage();
  }
}
function toggleSelect(element) {
  element.classList.toggle("selected");
}
function selectVisibility(element) {
  if (!selectedVisibility) {
    selectedVisibility = element;
    toggleSelect(element);
  } else if (selectedVisibility == element) {
    selectedVisibility = null;
    toggleSelect(element);
  } else {
    toggleSelect(selectedVisibility);
    selectedVisibility = element;
    toggleSelect(element);
  }

  if (selectedVisibility !== null && selectedUser !== null) {
    loadMessage();
  }
}
function updateInputContainer() {
  let inputType = null;

  if (userInputMsg.to === "Todos") {
    inputType = `publicamente`;
  } else {
    inputType = `reservadamente`;
  }
  inputRef.innerHTML = `Enviando para ${userInputMsg.to} (${inputType})`;
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
  } else if (
    element.type === "private_message" &&
    (element.to === username ||
      element.to === userInputMsg.to)
  ) {
    msgCollection[index].insertAdjacentHTML(
      "afterend",
      `
        <p class="user-${element.type}" data-identifier="message">
          <span>(${element.time})</span> <strong>${element.from}</strong> reservadamente para
          <strong>${element.to}</strong>: ${element.text}
        </p>`
    );
  } else if (element.type === "message") {
    msgCollection[index].insertAdjacentHTML(
      "afterend",
      `
        <p class="user-${element.type}" data-identifier="message">
          <span>(${element.time})</span> <strong>${element.from}</strong> para
          <strong>${element.to}</strong>: ${element.text}
        </p>`
    );
  }
};
