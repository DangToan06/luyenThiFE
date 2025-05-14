const { functions } = require("lodash");

function homePage() {
    window.location.href = "home.html";
}
function signOut() {
    window.location.href = "/index.html";
}
function signOutAdmin() {
    window.location.href = "/page/loginadmin.html";
}
function forgotpassword() {
    window.location.href = "/page/forgotPassword.html"; 
}