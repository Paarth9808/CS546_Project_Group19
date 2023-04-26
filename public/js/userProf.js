let editProfileButton = document.getElementById("editProfileButton");

editProfileButton.onclick = () => {
  const name = document.getElementById("name").value;
  // const email = document.getElementById('email').value
  const password = document.getElementById("password").value;
  const age = document.getElementById("age").value;
  if(name === "" || password === "" || age === ""){
    this.form.submit();
  } else {
    console.log(name, password, age);
  }
};