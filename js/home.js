// render đề thi từ localStorage
renderExam(listExam);

function renderExam(list) {
    let renderListExam = document.getElementById("list-Exam");

    renderListExam.innerHTML = "";

    list.forEach(element => {
        renderListExam.innerHTML += `
   <div class="exam-card">
        <h3>${element.title}</h3>
        <div class="info">
            <div><i class="fa-solid fa-clock"></i>${element.durationMinutes} phút</div>
            <div><i class="fa-solid fa-book-open"></i> 1 bài thi</div>
        </div>
        <div class="info">
            <div><i class="fa-solid fa-comment-dots"></i>${element.totalQuest} câu hỏi</div>
            <div><i class="fa-solid fa-users"></i>${element.member} học viên</div>
        </div>
        <button class="btn-do-exam">Làm bài</button>
    </div> 
`;
    });

    const btnDoExam = document.querySelectorAll(".btn-do-exam");

    btnDoExam.forEach(enterBtn => {
        enterBtn.addEventListener("click", () => {
            location.href = "http://127.0.0.1:5501/page/exam.html";
        });
    });
}

// Phân trang

const preBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageNumberContainer = document.getElementById("pageNumbers");

const itemsPerPage = 6;
let currentPage = 1;

const totalPages = Math.ceil(listExam.length / itemsPerPage);

function paginate (page){
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageIterm = listExam.slice(start, end);
    renderExam(pageIterm);
}

renderPageNumber()

function renderPageNumber() {
    // const maxVisiblePages = 4;
    // const delta = 2;

    // let rangeStart = Math.max(2, currentPage - delta);
    // let rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    // if (currentPage <= delta + 2) {
    //     rangeStart = 2;
    //     rangeEnd = Math.min(totalPages - 1, maxVisiblePages - 2);
    // }

    // if (currentPage >= totalPages - (delta + 1)) {
    //     rangeStart = Math.max(2, totalPages - (maxVisiblePages - 3));
    //     rangeEnd = totalPages - 1;
    // }

    pageNumberContainer.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.classList.add("pageNumbers");
        if (i === currentPage) button.classList.add("active");

        button.addEventListener("click", () => {
            currentPage = i;
            paginate(currentPage);
            renderPageNumber();
        });

        pageNumberContainer.appendChild(button);
    }
}

preBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        paginate(currentPage);
        renderPageNumber();
    }
});

nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
        currentPage++;
        paginate(currentPage);
        renderPageNumber();
    }
});

paginate(currentPage);
renderPageNumber();

// Chỉnh sửa thông tin người dùng 

const btnAvatar = document.getElementById("avatar");

btnAvatar.addEventListener("click", () => {
    location.href = "http://127.0.0.1:5501/page/editInformation.html";
});