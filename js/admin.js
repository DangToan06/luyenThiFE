function formatRelativeDate(dateStr) {
    const now = new Date();
    const date = new Date(dateStr);
    const months = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
    return `${Math.max(0, months)} months ago`;
}

document.addEventListener('DOMContentLoaded', () => {
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('hidden');
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('hidden');
    }

    // Hàm init cho phân trang
    function init(renderList, nameList, nameId) {
        const itemsPerPage = 5;
        let currentPage = 1;
        const totalItems = renderList.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        const contentList = document.getElementById(nameId);
        const firstPageBtn = document.getElementById(`${nameList}-firstPage`);
        const prevPageBtn = document.getElementById(`${nameList}-prevPage`);
        const nextPageBtn = document.getElementById(`${nameList}-nextPage`);
        const lastPageBtn = document.getElementById(`${nameList}-lastPage`);
        const pageNumbersContainer = document.getElementById(`${nameList}-pageNumbers`);

        function renderContent() {
            contentList.innerHTML = "";
            const start = (currentPage - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const itemsToShow = renderList.slice(start, end);

            itemsToShow.forEach((item) => {
                contentList.innerHTML += generateRow(item, nameList);
            });

            renderPagination();
        }

        function generateRow(item, nameList) {
            switch (nameList) {
                case "Students":
                    return `
                <tr>
                     <td>${item.id}</td>
                     <td>${item.nameUser}</td>
                     <td>${item.email}</td>
                     <td>Student</td>
                     <td class="action-buttons">
                 <button class="btn-delete" onclick="lockuser(${item.id})">
                         ${item.status === true ? 'Lock' : 'Unlock'}
                       </button>
                     </td>
                   </tr>`;
                case "Exam-Question":
                    return `
              <tr>
                <td>${item.id}</td>
                <td>${item.title}</td>
                <td>${item.durationMinutes} minutes</td>
                <td>${item.totalQuest}</td>
                <td class="action-buttons">
                  <button class="btn-edit">Edit</button>
                  <button class="btn-delete">Delete</button>
                </td>
              </tr>`;
                case "Question":
                    return `
              <tr>
                <td>${item.id}</td>
                <td>${item.content}</td>
                <td class="action-buttons">
                  <button class="btn-edit">Edit</button>
                  <button class="btn-delete">Delete</button>
                </td>
              </tr>`;
                case "Article":
                    return `
                  <tr>
                    <td>${item.id}</td>
                    <td>${item.title}</td>
                    <td>${item.date}</td>
                    <td>${item.author}</td>
                    <td class="action-buttons">
                      <button class="btn-edit" data-id="${item.id}"><i class="fa-solid fa-pen-to-square" style="color: #3e1ce9;"></i></button>
                      <button class="btn-delete" data-id="${item.id}"><i class="fa-solid fa-trash" style="color: #ff0000;"></i></button>
                    </td>
                  </tr>`;

                default:
                    return '';
            }
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

            firstPageBtn.onclick = () => { currentPage = 1; renderContent(); };
            prevPageBtn.onclick = () => { if (currentPage > 1) currentPage--; renderContent(); };
            nextPageBtn.onclick = () => { if (currentPage < totalPages) currentPage++; renderContent(); };
            lastPageBtn.onclick = () => { currentPage = totalPages; renderContent(); };
        }

        function updateButtons() {
            firstPageBtn.disabled = currentPage === 1;
            prevPageBtn.disabled = currentPage === 1;
            nextPageBtn.disabled = currentPage === totalPages;
            lastPageBtn.disabled = currentPage === totalPages;
        }

        renderContent();
    }

    // Xử lý nav links
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            navLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');

            const linkText = this.querySelector('span').textContent.trim();
            let sectionId;

            switch (linkText) {
                case 'Dashboard':
                    sectionId = 'Dashboard';
                    break;
                case 'Students':
                    sectionId = 'Students';
                    break;
                case 'Exam Question':
                    sectionId = 'Exam-Question';
                    break;
                case 'Question':
                    sectionId = 'Question';
                    break;
                case 'Article':
                    sectionId = 'Article';
                    break;
                default:
                    sectionId = 'Dashboard';
            }

            sections.forEach(section => section.classList.add('none'));
            const selectedSection = document.getElementById(sectionId);
            if (selectedSection) {
                selectedSection.classList.remove('none');
                switch (linkText) {
                    case 'Students':
                        init(listAccount, 'Students', 'userTableBody');
                        break;
                    case 'Exam Question':
                        init(listExam, 'Exam-Question', 'examTableBody');
                        break;
                    case 'Question':
                        init(listQuestion, 'Question', 'questionTableBody');
                        break;
                    case 'Article':
                        const articles = getArticleList();
                        init(articles, 'Article', 'articleTableBody');

                        break;
                }
            }
        });
    });
    // localStorage.setItem('listArticle', JSON.stringify(listArticle));

    // Xử lý modal cho Article
    const btnOpenModal = document.querySelector('#Article .btn-add');
    const modalArticle = document.querySelector('#Article .modal');
    const btnCloseArticle = modalArticle ? modalArticle.querySelector('.btn-close') : null;

    if (btnOpenModal) {
        btnOpenModal.addEventListener('click', () => {
            if (modalArticle) modalArticle.classList.remove('hidden');
        });
    } else {
        console.error('Không tìm thấy nút mở modal (Article)');
    }

    if (btnCloseArticle) {
        btnCloseArticle.addEventListener('click', () => {
            if (modalArticle) modalArticle.classList.add('hidden');
        });
    } else {
        console.log('Không tìm thấy nút đóng modal (Article)');
    }

    // Xử lý modal cho Question (Thêm câu hỏi)
    const btnOpenModalQuestion = document.querySelector('#Question .btn-add');
    const modalQuestion = document.getElementById('addQuestionModal');
    const btnCloseQuestion = modalQuestion ? modalQuestion.querySelector('.btn-close') : null;

    if (btnOpenModalQuestion) {
        btnOpenModalQuestion.addEventListener('click', () => {
            if (modalQuestion) modalQuestion.classList.remove('hidden');
        });
    } else {
        console.error('Không tìm thấy nút mở modal (Question)');
    }

    if (btnCloseQuestion) {
        btnCloseQuestion.addEventListener('click', () => {
            if (modalQuestion) modalQuestion.classList.add('hidden');
        });
    } else {
        console.error('Không tìm thấy nút đóng modal (Question)');
    }

    // Xử lý form thêm câu hỏi
    const addQuestionForm = document.getElementById('addQuestionForm');
    if (addQuestionForm) {
        addQuestionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('addQuestionId').value;
            const content = document.getElementById('addQuestionText').value;
            const options = [
                document.getElementById('addAnswer1').value,
                document.getElementById('addAnswer2').value,
                document.getElementById('addAnswer3').value,
                document.getElementById('addAnswer4').value
            ];
            const correctAnswer = document.getElementById('addCorrectAnswer').value;

            // Lấy danh sách câu hỏi từ localStorage
            let questions = JSON.parse(localStorage.getItem('listQuestion')) || [];

            // Kiểm tra ID trùng lặp
            if (questions.some(q => q.id === id)) {
                alert('ID câu hỏi đã tồn tại. Vui lòng chọn ID khác.');
                return;
            }

            // Thêm câu hỏi mới
            questions.push({ id, content, options, correctAnswer });
            localStorage.setItem('listQuestion', JSON.stringify(questions));

            // Tải lại bảng với phân trang
            init(questions, 'Question', 'questionTableBody');
            closeModal('addQuestionModal');
            addQuestionForm.reset();
        });
    }

    // Xử lý modal sửa câu hỏi
    document.querySelector('#Question .admin-table').addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-edit')) {
            const row = e.target.closest('tr');
            const id = row.cells[0].textContent;

            // Lấy câu hỏi từ localStorage
            const questions = JSON.parse(localStorage.getItem('listQuestion')) || [];
            const question = questions.find(q => q.id === id);

            if (question) {
                // Điền dữ liệu vào modal sửa
                document.getElementById('editQuestionId').value = question.id;
                document.getElementById('editQuestionText').value = question.content;
                document.getElementById('editAnswer1').value = question.options[0];
                document.getElementById('editAnswer2').value = question.options[1];
                document.getElementById('editAnswer3').value = question.options[2];
                document.getElementById('editAnswer4').value = question.options[3];
                document.getElementById('editCorrectAnswer').value = question.correctAnswer;

                openModal('editQuestionModal');
            }
        }
    });

    // Xử lý nút đóng modal sửa câu hỏi
    const btnCloseEditQuestion = document.querySelector('#editQuestionModal .btn-close');
    if (btnCloseEditQuestion) {
        btnCloseEditQuestion.addEventListener('click', () => {
            closeModal('editQuestionModal');
        });
    } else {
        console.error('Không tìm thấy nút đóng modal (Edit Question)');
    }

    // Xử lý form sửa câu hỏi
    const editQuestionForm = document.getElementById('editQuestionForm');
    if (editQuestionForm) {
        editQuestionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('editQuestionId').value;
            const content = document.getElementById('editQuestionText').value;
            const options = [
                document.getElementById('editAnswer1').value,
                document.getElementById('editAnswer2').value,
                document.getElementById('editAnswer3').value,
                document.getElementById('editAnswer4').value
            ];
            const correctAnswer = document.getElementById('editCorrectAnswer').value;

            // Cập nhật câu hỏi trong localStorage
            let questions = JSON.parse(localStorage.getItem('listQuestion')) || [];
            questions = questions.map(q => q.id === id ? { id, content, options, correctAnswer } : q);
            localStorage.setItem('listQuestion', JSON.stringify(questions));

            // Tải lại bảng với phân trang
            init(questions, 'Question', 'questionTableBody');
            closeModal('editQuestionModal');
        });
    }

    // Xử lý modal xóa câu hỏi
    document.querySelector('#Question .admin-table').addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-delete')) {
            const row = e.target.closest('tr');
            const id = row.cells[0].textContent;

            // Hiển thị ID trong modal xóa
            document.getElementById('deleteQuestionId').textContent = id;
            openModal('deleteQuestionModal');

            // Xử lý xác nhận xóa
            document.getElementById('confirmDelete').onclick = () => {
                // Xóa câu hỏi khỏi localStorage
                let questions = JSON.parse(localStorage.getItem('listQuestion')) || [];
                questions = questions.filter(q => q.id !== id);
                localStorage.setItem('listQuestion', JSON.stringify(questions));

                // Tải lại bảng với phân trang
                init(questions, 'Question', 'questionTableBody');

                // Đóng modal
                closeModal('deleteQuestionModal');
            };
        }
    });

    // Xử lý nút hủy modal xóa câu hỏi
    const btnCancelDeleteQuestion = document.querySelector('#deleteQuestionModal .btn-close');
    if (btnCancelDeleteQuestion) {
        btnCancelDeleteQuestion.addEventListener('click', () => {
            closeModal('deleteQuestionModal');
        });
    } else {
        console.error('Không tìm thấy nút hủy modal (Delete Question)');
    }

    // Xử lý sidebar responsive
    const menuButton = document.getElementById('menu-nav');
    const closeButton = document.getElementById('close-menu-nav');
    const sidebar = document.querySelector('.sidebar');

    if (menuButton && closeButton) {
        menuButton.addEventListener('click', () => {
            sidebar.classList.add('open');
            menuButton.style.display = 'none';
            closeButton.style.display = 'block';
        });

        closeButton.addEventListener('click', () => {
            sidebar.classList.remove('open');
            closeButton.style.display = 'none';
            menuButton.style.display = 'block';
        });
    }

    // Xử lý modal cho Students
    const btnOpenModalStudents = document.querySelector('#Students .btn-add');
    const modalStudents = document.querySelector('#addAccountModal');
    const btnCloseStudents = modalStudents ? modalStudents.querySelector('.btn-close') : null;
    const btnConfirmAdd = modalStudents ? modalStudents.querySelector('#confirmAdd') : null;
    const addAccountForm = modalStudents ? modalStudents.querySelector('#addAccountForm') : null;

    // Mở modal
    if (btnOpenModalStudents) {
        btnOpenModalStudents.addEventListener('click', () => {
            if (modalStudents) {
                modalStudents.classList.remove('hidden');
                addAccountForm?.reset(); // Reset form khi mở modal
            }
        });
    } else {
        console.error('Không tìm thấy nút mở modal (Students)');
    }

    // Đóng modal
    if (btnCloseStudents) {
        btnCloseStudents.addEventListener('click', () => {
            if (modalStudents) modalStudents.classList.add('hidden');
        });
    } else {
        console.error('Không tìm thấy nút đóng modal (Students)');
    }

    // Xử lý thêm tài khoản
    if (btnConfirmAdd && addAccountForm) {
        btnConfirmAdd.addEventListener('click', (e) => {
            e.preventDefault(); // Ngăn hành vi mặc định của nút
            if (addAccountForm.checkValidity()) {
                const formData = new FormData(addAccountForm);
                const nameUser = formData.get('username');
                const email = formData.get('email');
                const password = formData.get('password');


                const isDuplicate = listAccount.some(acc =>
                    acc.username === nameUser || acc.email === email
                );

                if (isDuplicate) {
                    alert('Tên tài khoản hoặc email đã tồn tại!');
                    return;
                }

                // Tạo ID ngẫu nhiên
                function generateRandomId() {
                    const random3Digit = Math.floor(Math.random() * 900) + 100;
                    let checkId = listAccount.some(acc => acc.id === random3Digit);
                    return checkId ? generateRandomId() : random3Digit;
                }

                const newAccount = {
                    id: generateRandomId(),
                    nameUser: nameUser,
                    email: email,
                    password: password
                };

                listAccount.push(newAccount);
                listAccount.reverse();
                localStorage.setItem('listAccount', JSON.stringify(listAccount));
                init(listAccount, 'Students', 'userTableBody');
                // Đóng modal sau khi thêm
                modalStudents.classList.add('hidden');
                addAccountForm.reset(); // Reset form sau khi thêm
            } else {
                addAccountForm.reportValidity(); // Hiển thị thông báo lỗi nếu form không hợp lệ
            }
        });

    }
    function lockuser(id) {
        const user = listAccount.find(acc => acc.id === id);
        console.log(id);
        console.log(user);
        if (user) {
            user.status = !user.status; // Đảo ngược trạng thái
            localStorage.setItem('listAccount', JSON.stringify(listAccount));
            init(listAccount, 'Students', 'userTableBody');
        }
    }
    window.lockuser = lockuser;

    // Mở/đóng modal
    function openModal(modal) { modal.classList.remove('hidden'); }
    function closeModal(modal) { modal.classList.add('hidden'); }

    // Modal
    const modalAdd = document.querySelector('.modal-add');
    const modalEdit = document.querySelector('.modal-edit');
    const modalDelete = document.querySelector('.modal-delete');

    // Form
    const formAdd = document.querySelector('.modal-form-add');
    const formEdit = document.querySelector('.modal-form-edit');

    // Button
    const btnAddPost = document.querySelector('#Article .btn-add');
    const btnCloseAdd = modalAdd.querySelector('.btn-close');
    const btnCloseEdit = modalEdit.querySelector('.btn-close');
    const btnCloseDelete = modalDelete.querySelector('.btn-close-delete');
    const btnConfirmDelete = modalDelete.querySelector('.btn-confirm-delete');

    // ID tạm để chỉnh sửa/xóa
    let currentEditId = null;
    let currentDeleteId = null;

    // Nút mở modal
    btnAddPost.addEventListener('click', () => openModal(modalAdd));
    btnCloseAdd.addEventListener('click', () => closeModal(modalAdd));
    btnCloseEdit.addEventListener('click', () => closeModal(modalEdit));
    btnCloseDelete.addEventListener('click', () => closeModal(modalDelete));

    // Thêm bài viết
    formAdd.addEventListener('submit', e => {
        e.preventDefault();
        const [title, content, time, author] = [...formAdd.querySelectorAll('input')].map(i => i.value.trim());
        const today = new Date().toISOString().split('T')[0];

        if (!title || !content || !time || !author || isNaN(time) || time < 5 || time > 120 || /[a-zA-Z]/.test(time)) {
            showErrorModal('Vui lòng nhập đầy đủ và hợp lệ');
            return;
        }


        const articles = getArticleList();
        const newId = articles.length > 0 ? Math.max(...articles.map(a => a.id)) + 1 : 1;
        articles.unshift({ id: newId, title, content, date: today, time, author });
        closeModal(modalAdd);
        saveArticleList(articles);
        init(articles, 'Article', 'articleTableBody');

    });

    // Sửa & Xóa bằng delegation
    document.getElementById('articleTableBody').addEventListener('click', e => {
        const target = e.target.closest('button');
        if (!target) return;

        const id = +target.dataset.id;
        const list = JSON.parse(localStorage.getItem('listArticle')) || [];
        const article = list.find(a => a.id === id);
        if (!article) return;

        if (target.classList.contains('btn-edit')) {
            currentEditId = id;
            formEdit.title.value = article.title;
            formEdit.content.value = article.content;
            formEdit.date.value = article.date;
            formEdit.time.value = article.time;
            formEdit.author.value = article.author;
            openModal(modalEdit);
        }

        if (target.classList.contains('btn-delete')) {
            currentDeleteId = id;
            openModal(modalDelete);
        }
    });

    // Cập nhật bài viết
    formEdit.addEventListener('submit', e => {
        e.preventDefault();
        const [title, content, date, time, author] = [
            formEdit.title.value.trim(),
            formEdit.content.value.trim(),
            formEdit.date.value,
            formEdit.time.value.trim(),
            formEdit.author.value.trim()
        ];

        if (!title || !content || !date || !time || !author || isNaN(time) || time < 5 || time > 120 || /[a-zA-Z]/.test(time)) {
            showErrorModal('Thông tin không hợp lệ');
            return;
        }

        const articles = getArticleList();
        const index = articles.findIndex(a => a.id === currentEditId);
        if (index !== -1) {
            articles[index] = { id: currentEditId, title, content, date, time, author };
            saveArticleList(articles);
            closeModal(modalEdit);
            init(articles, 'Article', 'articleTableBody');
        }


    });

    // Xóa bài viết
    btnConfirmDelete.addEventListener('click', () => {

        let articles = getArticleList();
        articles = articles.filter(a => a.id !== currentDeleteId);
        saveArticleList(articles);
        closeModal(modalDelete);
        init(articles, 'Article', 'articleTableBody');

    });

});

// document.addEventListener('DOMContentLoaded', () => {

// });


function showErrorModal(message) {
    const errorModal = document.querySelector('.modal-error');
    const notification = document.getElementById('notification');

    if (errorModal && notification) {
        notification.textContent = message || 'Có lỗi xảy ra';
        errorModal.classList.add('show');
        setTimeout(() => {
            errorModal.classList.remove('show');
        }, 1500);
    }
}


function getArticleList() {
    return JSON.parse(localStorage.getItem('listArticle')) || [];
}

function saveArticleList(list) {
    localStorage.setItem('listArticle', JSON.stringify(list));
}
