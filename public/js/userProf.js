let editProfileButton = document.getElementById("editProfileButton");
// do i have to do validation here also?
editProfileButton.onclick = (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const opassword = document.getElementById("oldpassword").value;
  const npassword = document.getElementById("newpassword").value;
  const age = document.getElementById("age").value;
  if (name === "" || opassword === "" || npassword === "" || age === "") {
    // if(opassword === npassword) {
    // } else {
    //   window.alert('Passwords do not match'); // do whatever
    // }
    window.alert("Please fill all the fields"); // do whatever
  } else if (parseInt(age) < 13) {
    window.alert("Age should be 13+"); // do whatever
  }
  else {
    editProfileButton.form.submit();
    console.log(name, opassword, npassword, age);
  }
};
