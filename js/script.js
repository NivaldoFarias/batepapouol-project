const btn = document.getElementById('login-btn');
btn.addEventListener('click', () => {
  postUser();
})

function postUser(){
  const form = document.querySelector('.login-screen__container');
  const username = form.children[0].value;
  console.log(username);
  //form.submit();
  //POST
}