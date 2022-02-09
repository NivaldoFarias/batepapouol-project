const sidebar = document.querySelector('aside');
const loginButton = document.getElementById("login-btn");
const sidebarButton = document.getElementById("sidebar-btn");

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
function toggleSidebar() {
  if (sidebar.style.width === "0") {
    sidebar.style.width = "250px";
  }
  else {
    sidebar.style.width = "0";
  }
}
function btnInit(){
  loginButton.addEventListener("click", () => {
    postUser();
    secondScreen();
  });
  sidebarButton.addEventListener("click", () => {
    toggleSidebar();
  });
}
