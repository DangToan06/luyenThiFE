// valid Đăng ký

// const btnSignUp = document.getElementById("btn-sign-up");

// btnSignUp.addEventListener("click", () =>{
//     let inputNameSignUpValue = document.getElementById("input-name-sign-up").value;
//     let inputDateSignUpValue = document.getElementById("input-date-sign-up").value;
//     let inputEmailSignUpValue = document.getElementById("input-email-sign-up").value;
//     let inputPasswdSignUpValue = document.getElementById("input-passwd-sign-up").value;
//     let inputRepasswdSignUpValue = document.getElementById("input-repasswd-sign-up").value;
//     let checkboxSignUpValue = document.getElementById("checkbox-sign-up").checked;
    

//     if(!validBlank(inputNameSignUpValue, inputDateSignUpValue, inputEmailSignUpValue, inputPasswdSignUpValue, inputRepasswdSignUpValue, checkboxSignUpValue)){
//         alert("email is not blank");
//     }else if(){
//         alert("t");
//     }

// });

// function validBlank(name, date, email, passwd, repasswd){
//     if(name.length === 0 ||
//         date.length === 0 ||
//         email.length === 0 ||
//         passwd.length === 0 ||
//         repasswd.length === 0
//     ){
//         return false;
//     }
//     return true;
// }

// function checkPasswd(passwd, repasswd){
    
// }
// Lấy các phần tử DOM cần thiết
const loginSection = document.getElementById("login");
const signUpSection = document.getElementById("sign-up");
const linkToSignUp = document.getElementById("link-to-sign-up");
const linkToLogin = document.getElementById("link-to-login");
document.addEventListener("DOMContentLoaded", function() {
    loginSection.style.display = "flex";
    signUpSection.style.display = "none"; 
    adjustSectionHeight(loginSection);
});
function adjustSectionHeight(section) {
    const container = section.querySelector(".container");
    const form = container.firstElementChild; 
    const formHeight = form.offsetHeight;
    section.style.minHeight = formHeight + "px";
}
linkToSignUp.addEventListener("click", function() {
    signUpSection.style.display = "flex";
    adjustSectionHeight(signUpSection);
    setTimeout(() => {
        loginSection.classList.add("slide-out");
        signUpSection.classList.add("slide-in");
    }, 10);
});
linkToLogin.addEventListener("click", function() {
    loginSection.classList.remove("slide-out");
    signUpSection.classList.remove("slide-in");
    adjustSectionHeight(loginSection);
    setTimeout(() => {
        if (!signUpSection.classList.contains("slide-in")) {
            signUpSection.style.display = "none";
        }
    }, 500); 
});

function handleResponsiveLayout() {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
        adjustSectionHeight(loginSection);
        if (signUpSection.style.display !== 'none') {
            adjustSectionHeight(signUpSection);
        }
    }
}
window.addEventListener('resize', handleResponsiveLayout);
handleResponsiveLayout();
