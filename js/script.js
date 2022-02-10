const sidebar = document.querySelector("aside");
const loginButton = document.getElementById("login-btn");
const sidebarOpenButton = document.getElementById("sidebar-btn");
const sidebarCloseButton = document.getElementById("close-btn");
const sidebarComplete = document.querySelector(".sidebar-complete");

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
function openSidebar() {
  sidebar.style.width = "70vw";
  sidebarComplete.style.width = "30vw";
}
function closeSidebar() {
  sidebar.style.width = "0";
  sidebarComplete.style.width = "0";
}
function btnInit() {
  loginButton.addEventListener("click", () => {
    postUser();
    secondScreen();
  });
  sidebarOpenButton.addEventListener("click", () => {
    if (!sidebarOpenButton.classList.contains("disabled")) {
      openSidebar();
      toggleDisable(sidebarOpenButton);
    }
  });
  sidebarCloseButton.addEventListener("click", () => {
    closeSidebar();
    toggleDisable(sidebarOpenButton);
  });
}
function toggleDisable(element){
  element.classList.toggle('disabled');
}
