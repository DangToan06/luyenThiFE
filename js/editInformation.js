let accNow = JSON.parse(localStorage.getItem("AccountNow"));
let listAcc = JSON.parse(localStorage.getItem("listAccount"));

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'flex';
}
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

//Hiển thị tên tài khoản hiện tại

let boxName = document.getElementById("form-row");
let editInfoModal = document.getElementById("editInfo");

boxName.innerHTML = "";
editInfoModal.innerHTML = "";

boxName.innerHTML = `
        <div class="form-group">
          <label for="lastName">Họ và Tên</label>
          <input type="text" id="lastName" value="${accNow.nameUser}" disabled />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" value="${accNow.email}" disabled />
        </div>
        <div class="form-group">
          <label for="birthday">Ngày sinh</label>
          <input type="date" id="birthday" value="${accNow.date}" disabled />
        </div>
    `;

editInfoModal.innerHTML = `
    <div class="form-group">
          <label for="editLastName">Họ và Tên</label>
          <input type="text" id="editName" value="${accNow.nameUser}" class="box-input-edit" />
        </div>
        <div class="form-group">
          <label for="editFirstName">email</label>
          <input type="email" id="editEmail" value="${accNow.email}" class="box-input-edit" />
        </div>
        <div class="form-group">
          <label for="editBirthday">Ngày sinh</label>
          <input type="date" id="editBirthday" value="${accNow.date}" class="box-input-edit" />
        </div>
`;

//Đổi passwd và thông Tin 

//1.1 đổi thông tin
const btnEdit = document.getElementById("btnEdit");

btnEdit.addEventListener("click", () => {
    let editLastNameValue = document.getElementById("editName").value;
    let editEmailValue = document.getElementById("editEmail").value;
    let editBirthdayValue = document.getElementById("editBirthday").value;
    accNow.nameUser = editLastNameValue;
    accNow.email = editEmailValue;
    accNow.date = editBirthdayValue;

    listAcc.forEach(element => {
        if(element.id === accNow.id){
            element.nameUser = editLastNameValue;
            element.email = editEmailValue;
            element.date =  editBirthdayValue;
        }
    });
    localStorage.setItem("listAccount", JSON.stringify(listAcc));
    localStorage.setItem("AccountNow", JSON.stringify(accNow));
    closeModal("editInfoModal");
    location.reload();
});

// Đổi passwd
const btnChangePass = document.getElementById("btnChangePass");


btnChangePass.addEventListener("click", () => {
    let currentPasswordValue = document.getElementById("currentPassword").value;
    let newPasswordValue = document.getElementById("newPassword").value;
    let confirmPasswordVlaue = document.getElementById("confirmPassword").value;

    accNow.password = newPasswordValue;

    listAcc.forEach(element => {
        if(element.id === accNow.id){
            element.password = newPasswordValue;
        }
    });
    localStorage.setItem("listAccount", JSON.stringify(listAcc));
    localStorage.setItem("AccountNow", JSON.stringify(accNow));
    closeModal("passwordModal");
    location.reload();
});