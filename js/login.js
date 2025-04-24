//KIỂM TRA TRÊN LOCAL CÓ MẢNG LƯU DANH SÁCH TÀI KHOẢN CHƯA NẾU CHƯA CÓ THÌ THÊM VÀO
let listAccount = [];
if (!localStorage.getItem("listAccount")) {
    localStorage.setItem("listAccount", JSON.stringify(listAccount));
} else {
    listAccount = JSON.parse(localStorage.getItem("listAccount"));
}

// Animation chuyển trang giữa đăng nhập và đăng ký
const loginSection = document.getElementById("login");
const signUpSection = document.getElementById("sign-up");
const linkToSignUp = document.getElementById("link-to-sign-up");
const linkToLogin = document.getElementById("link-to-login");
document.addEventListener("DOMContentLoaded", function () {
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
linkToSignUp.addEventListener("click", function () {
    signUpSection.style.display = "flex";
    adjustSectionHeight(signUpSection);
    setTimeout(() => {
        loginSection.classList.add("slide-out");
        signUpSection.classList.add("slide-in");
    }, 10);
});
linkToLogin.addEventListener("click", function () {
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


// VALID ĐĂNG KÝ
const btnSignUp = document.getElementById("btn-sign-up");

btnSignUp.addEventListener("click", () => {
    let inputNameSignUpValue = document.getElementById("input-name-sign-up").value;
    let inputDateSignUpValue = document.getElementById("input-date-sign-up").value;
    let inputEmailSignUpValue = document.getElementById("input-email-sign-up").value;
    let inputPasswdSignUpValue = document.getElementById("input-passwd-sign-up").value;
    let inputRepasswdSignUpValue = document.getElementById("input-repasswd-sign-up").value;
    let checkboxSignUpValue = document.getElementById("checkbox-sign-up").checked;

    if (!validBlank(inputNameSignUpValue, inputDateSignUpValue, inputEmailSignUpValue, inputPasswdSignUpValue, inputRepasswdSignUpValue, checkboxSignUpValue)) {
        console.log("input is not blank");
    } else if (!isValidEmail(inputEmailSignUpValue)) {
        console.log("email format is incorrect");
    } else if (!isValidPasswd(inputPasswdSignUpValue)) {
        console.log("password must be 8 characters");
    } else if (!isRePasswd(inputPasswdSignUpValue, inputRepasswdSignUpValue)) {
        console.log("Password does not match");
    } else if (existEmail(inputEmailSignUpValue)) {
        console.log("Email exist");
    } else {
        console.log("create account success");
        Account.nameUser = inputNameSignUpValue;
        Account.date = inputDateSignUpValue;
        Account.email = inputEmailSignUpValue;
        Account.password = inputPasswdSignUpValue;
        listAccount.push(Account);
        localStorage.setItem("listAccount", JSON.stringify(listAccount));
        generateOTP();
        window.location.href = "page/otp.html";
    }
});

function validBlank(name, date, email, passwd, repasswd, checkboxSignUpValue) {
    if (name.length === 0 ||
        date.length === 0 ||
        email.length === 0 ||
        passwd.length === 0 ||
        repasswd.length === 0 ||
        checkboxSignUpValue === false
    ) {
        return false;
    }
    return true;
}

function isValidEmail(email) {
    const regex = /^[a-zA-z0-9._%+-]+@[a-zA-Z0-9.]+\.(com)$/;
    return regex.test(email);
}


function isValidPasswd(passwd) {
    if (passwd.length < 8) {
        return false;
    }
    return true;
}

function isRePasswd(passwd, repasswd) {
    if (passwd === repasswd) {
        return true;
    }
    return false;
}

function existEmail(email) {
    return listAccount.some(account => account.email === email);
}

//Ẩn hiện passwd

const togglePassword = document.getElementById('toggle-password-sign-up');
const passwordInput = document.getElementById('input-passwd-sign-up');

togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type');

    if (type === 'password') {
        passwordInput.setAttribute('type', 'text');
        togglePassword.classList.remove('fa-eye');
        togglePassword.classList.add('fa-eye-slash');
    } else {
        passwordInput.setAttribute('type', 'password');
        togglePassword.classList.remove('fa-eye-slash');
        togglePassword.classList.add('fa-eye');
    }
});

const toggleRePassword = document.getElementById('toggle-preassword');
const rePasswordInput = document.getElementById('input-repasswd-sign-up');

toggleRePassword.addEventListener('click', () => {
    const type = rePasswordInput.getAttribute('type');

    if (type === 'password') {
        rePasswordInput.setAttribute('type', 'text');
        toggleRePassword.classList.remove('fa-eye');
        toggleRePassword.classList.add('fa-eye-slash');
    } else {
        rePasswordInput.setAttribute('type', 'password');
        toggleRePassword.classList.remove('fa-eye-slash');
        toggleRePassword.classList.add('fa-eye');
    }
});



//VALID TRANG ĐĂNG NHẬP 

const btnLogin = document.getElementById("btn-login");

btnLogin.addEventListener('click', () => {
    let adminEmail = "quangvippro@gmail.com";
    let adminPasswd = "quangvippro123";
    let inputPasswdSignInValue = document.getElementById("input-passwd-sign-in").value;
    let inputNameSignInValue = document.getElementById("input-name-sign-in").value;
    if (inputNameSignInValue === adminEmail && inputPasswdSignInValue === adminPasswd) {
        console.log("login as admin");
        window.location.href = "page/adminPage.html";
        //////////////////////////////////////////////////////////////////////////////////////
        return;
    }
    if(!searchAccInList(inputNameSignInValue, inputPasswdSignInValue)){
        console.log("email or password incorrect");      
    }else{
        console.log("login as user");
        window.location.href = "page/home.html";
    }

});

function searchAccInList(name, passwd){
    for (let i = 0; i < listAccount.length; i++) {
        if(name === listAccount[i].email && passwd === listAccount[i].password){
            return true;
        }
    }
    return false;
}

//ẩn hiện password

const togglePasswordLogin = document.getElementById('toggle-password');
const passwordInputLogin = document.getElementById('input-passwd-sign-in');

togglePasswordLogin.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInputLogin.type = isPassword ? 'text' : 'password';
    togglePasswordLogin.classList.toggle('fa-eye');
    togglePasswordLogin.classList.toggle('fa-eye-slash');
});