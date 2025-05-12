// render đề thi từ localStorage
init(listExam);

function init(renderListd) {
    const itemsPerPage = 6;
    let currentPage = 1;
    const totalItems = renderListd.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const contentList = document.getElementById("list-Exam");

    const firstPageBtn = document.getElementById("firstPage");
    const prevPageBtn = document.getElementById("prevPage");
    const nextPageBtn = document.getElementById("nextPage");
    const lastPageBtn = document.getElementById("lastPage");
    const pageNumbersContainer = document.getElementById("pageNumbers");

    function renderContent() {
        contentList.innerHTML = "";
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const itemsToShow = renderListd.slice(start, end);

        itemsToShow.forEach((item) => {
            contentList.innerHTML += `
                <div class="exam-card">
                    <h3>${item.title}</h3>
                    <div class="info">
                        <div><i class="fa-solid fa-clock"></i> ${item.durationMinutes} phút</div>
                        <div><i class="fa-solid fa-book-open"></i> 1 bài thi</div>
                    </div>
                    <div class="info">
                        <div><i class="fa-solid fa-comment-dots"></i> ${item.totalQuest} câu hỏi</div>
                        <div><i class="fa-solid fa-users"></i> ${item.member} học viên</div>
                    </div>
                    <button class="btn-do-exam">Làm bài</button>
                </div>`;
        });

        const btnDoExam = document.querySelectorAll(".btn-do-exam");
        btnDoExam.forEach((btn, idx) => {
            btn.addEventListener("click", () => {
                const exam = itemsToShow[idx];
                localStorage.setItem("examInProgress", JSON.stringify(exam));
                location.href = "exam.html";
            });
        });

        renderPagination();
    }

    function renderPagination() {
        pageNumbersContainer.innerHTML = "";
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);

        if (startPage > 1) {
            pageNumbersContainer.innerHTML += `<button class="page-button" data-page="1">1</button>`;
            if (startPage > 2) pageNumbersContainer.innerHTML += `<span>...</span>`;
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbersContainer.innerHTML += `
                <button class="page-button ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) pageNumbersContainer.innerHTML += `<span>...</span>`;
            pageNumbersContainer.innerHTML += `<button class="page-button" data-page="${totalPages}">${totalPages}</button>`;
        }

        setupPaginationEvents();
        updateButtons();
    }

    function setupPaginationEvents() {
        const pageButtons = pageNumbersContainer.querySelectorAll(".page-button");
        pageButtons.forEach(button => {
            button.addEventListener("click", () => {
                currentPage = parseInt(button.dataset.page);
                renderContent();
            });
        });

        if (firstPageBtn) firstPageBtn.onclick = () => { currentPage = 1; renderContent(); };
        if (prevPageBtn) prevPageBtn.onclick = () => { if (currentPage > 1) currentPage--; renderContent(); };
        if (nextPageBtn) nextPageBtn.onclick = () => { if (currentPage < totalPages) currentPage++; renderContent(); };
        if (lastPageBtn) lastPageBtn.onclick = () => { currentPage = totalPages; renderContent(); };
    }

    function updateButtons() {
        if (firstPageBtn) firstPageBtn.disabled = currentPage === 1;
        if (prevPageBtn) prevPageBtn.disabled = currentPage === 1;
        if (nextPageBtn) nextPageBtn.disabled = currentPage === totalPages;
        if (lastPageBtn) lastPageBtn.disabled = currentPage === totalPages;
    }

    renderContent();
}
// Chỉnh sửa thông tin người dùng 

// const btnAvatar = document.getElementById("avatar");

// btnAvatar.addEventListener("click", () => {
//     location.href = "editInformation.html";
// });

function searchExamQuestions() {
    let searchInput = document.getElementById("searchExam").value.toLowerCase();
    console.log(searchInput);
    let filteredList = listExam.filter(exam => {
        return exam.title.toLowerCase().includes(searchInput);
    });
    init(filteredList);
}

// function getTimeAgo(dateStr) {
//     const now = new Date();
//     const postDate = new Date(dateStr);
//     const diffTime = now - postDate;
//     const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30));

//     if (diffMonths < 0) {
//         return `Còn ${Math.abs(diffMonths)} tháng nữa`;
//     }

//     return `${diffMonths} tháng trước`;
// }

function renderArticles() {
    const listPostElement = document.querySelector(".list-post");
    const lastFourArticles = listArticle.slice(-4);
    listPostElement.innerHTML = "";
    lastFourArticles.forEach(article => {
        const li = document.createElement("li");
        li.classList.add("item-post");

        li.innerHTML = `
            <h4>${article.title}</h4>
            <p>${article.content}</p>
            <div class="time-minutes">
                <i class="fa-solid fa-clock"></i>
                <span>${getTimeAgo(article.date)}</span>
                <i class="fas fa-book-open"></i>
                <span>${article.time} phút đọc </span>
            </div>
        `;

        listPostElement.appendChild(li);
    });
}
renderArticles()
function getTimeAgo(dateString) {
    const now = new Date();
    const articleDate = new Date(dateString);
    const diffMs = now - articleDate;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffYears > 0) {
        return `${diffYears} năm trước`;
    } else if (diffMonths > 0) {
        return `${diffMonths} tháng trước`;
    } else if (diffDays > 0) {
        return `${diffDays} ngày trước`;
    } else if (diffHours > 0) {
        return `${diffHours} giờ trước`;
    } else if (diffMinutes > 0) {
        return `${diffMinutes} phút trước`;
    } else {
        return `Vừa xong`;
    }
}

