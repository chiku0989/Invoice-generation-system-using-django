let emp_btn = document.querySelector("#emp-clear-btn");
let admin_btn = document.querySelector("#admin-clear-btn");

emp_btn.addEventListener("click", (e) => {
  document.getElementById("emp-username").value = "";
  document.getElementById("emp-password").value = "";
});

admin_btn.addEventListener("click", (e) => {
  document.getElementById("admin-username").value = "";
  document.getElementById("admin-password").value = "";
});
