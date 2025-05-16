function formatRelativeDate(dateStr) {
    const now = new Date();
    const date = new Date(dateStr);
    const months = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
    return `${Math.max(0, months)} months ago`;
}

document.addEventListener('DOMContentLoaded', () => {
    // Hàm mở modal
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            console.log(`Modal ${modalId} opened`); // Debug
        } else {
            console.error(`Modal with ID ${modalId} not found`);
        }
    }

    // Hàm đóng modal
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
            console.log(`Modal ${modalId} closed`); // Debug
        } else {
            console.error(`Modal with ID ${modalId} not found`);
        }
    }

    // Hàm tạo ID tự động cho câu hỏi
    function generateQuestionId(questions) {
        let newId;
        let existingIds = new Set(questions.map(q => q.id));
        do {
            const randomNum = Math.floor(Math.random() * 900) + 100; // Tạo số ngẫu nhiên từ 100 đến 999
            newId = `q${randomNum}`;
        } while (existingIds.has(newId)); // Lặp đến khi tạo ra ID chưa bị trùng
        return newId;
    }

    // Hàm gắn sự kiện cho bảng Question
    function setupQuestionTableEvents() {
        const table = document.querySelector('#Question .admin-table');
        if (!table) {
            console.error('Table #Question .admin-table not found');
            return;
        }

        table.addEventListener('click', (e) => {
            console.log('Click detected:', e.target); // Debug
            const button = e.target.closest('button');
            if (!button) return;

            const row = button.closest('tr');
            if (!row) {
                console.error('Row not found for button');
                return;
            }
            const id = row.cells[0].textContent;

            if (button.classList.contains('btn-edit')) {
                console.log('Edit button clicked'); // Debug
                console.log('Editing question ID:', id); // Debug

                // Lấy câu hỏi từ listQuestion
                const question = listQuestion.find(q => q.id === id);

                if (question) {
                    console.log('Question found:', question); // Debug
                    // Điền dữ liệu vào modal sửa
                    const editQuestionText = document.getElementById('editQuestionText');
                    const editAnswer1 = document.getElementById('editAnswer1');
                    const editAnswer2 = document.getElementById('editAnswer2');
                    const editAnswer3 = document.getElementById('editAnswer3');
                    const editAnswer4 = document.getElementById('editAnswer4');
                    const editCorrectAnswer = document.getElementById('editCorrectAnswer');
                    const editQuestionId = document.getElementById('editQuestionId');

                    if (!editQuestionText || !editAnswer1 || !editAnswer2 || !editAnswer3 || !editAnswer4 || !editCorrectAnswer || !editQuestionId) {
                        console.error('One or more form elements not found in editQuestionModal');
                        return;
                    }

                    editQuestionText.value = question.content || '';
                    editAnswer1.value = question.options && question.options[0] ? question.options[0] : '';
                    editAnswer2.value = question.options && question.options[1] ? question.options[1] : '';
                    editAnswer3.value = question.options && question.options[2] ? question.options[2] : '';
                    editAnswer4.value = question.options && question.options[3] ? question.options[3] : '';
                    editCorrectAnswer.value = question.correctAnswer || '';
                    editQuestionId.value = question.id; // Lưu ID vào input ẩn để sử dụng khi submit

                    openModalQues('editQuestionModal');
                } else {
                    console.error(`Question with ID ${id} not found in listQuestion`);
                }
            } else if (button.classList.contains('btn-delete')) {
                console.log('Delete button clicked');
                openModalQues('deleteQuestionModal');

                // Xử lý xác nhận xóa
                const confirmDelete = document.getElementById('confirmDelete');
                if (confirmDelete) {
                    confirmDelete.onclick = () => {
                        // Xóa câu hỏi khỏi listQuestion
                        const index = listQuestion.findIndex(q => q.id === id);
                        if (index !== -1) {
                            listQuestion.splice(index, 1);
                            localStorage.setItem('listQuestion', JSON.stringify(listQuestion));

                            // Tải lại bảng với phân trang
                            init(listQuestion, 'Question', 'questionTableBody');

                            // Đóng modal
                            closeModalQues('deleteQuestionModal');
                        }
                    };
                } else {
                    console.error('Element #confirmDelete not found');
                }
            }
        });
    }

    // Hàm init cho phân trang
    function init(renderList, nameList, nameId) {
        const itemsPerPage = 3;
        let currentPage = 1;
        const totalItems = renderList.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        const contentList = document.getElementById(nameId);
        if (!contentList) {
            console.error(`Content list with ID ${nameId} not found`);
            return;
        }

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
            // Gắn lại sự kiện cho bảng Question
            if (nameList === 'Question') {
                setupQuestionTableEvents();
            }
        }
        function generateRow(item, nameList) {
            switch (nameList) {
                case "Students":
                    return `
                    <tr>
                        <td>${item.id}</td>
                        <td>${item.nameUser}</td>
                        <td>${item.email}</td>
                        <td>Sinh viên</td>
                        <td class="action-buttons">
                            <button class="btn-delete" onclick="lockuser(${item.id})">
                                 ${item.status === true ? '<i class="fa-solid fa-lock-open"></i>' : '<i class="fa-solid fa-lock"></i>'}
                            </button>
                        </td>
                        <td class="action-buttons">
                            <button class="btn-delete" onclick="seeDetails(${item.id})">
                                <i class="fa-solid fa-eye"></i>
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
                            <button class="btn-edit" data-id="${item.id}"><i class="fa-solid fa-pen-to-square" style="color: #3e1ce9;"></i></button>
                            <button class="btn-delete" data-id="${item.id}"><i class="fa-solid fa-trash" style="color: #ff0000;"></i></button>
                        </td>
                    </tr>`;
                case "Question":
                    return `
                    <tr>
                        <td>${item.id}</td>
                        <td>${item.content}</td>
                        <td class="action-buttons">
                            <button class="btn-edit" data-id="${item.id}"><i class="fa-solid fa-pen-to-square" style="color: #3e1ce9;"></i></button>
                            <button class="btn-delete" data-id="${item.id}"><i class="fa-solid fa-trash" style="color: #ff0000;"></i></button>
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
                case 'Bảng điều khiển':
                    sectionId = 'Dashboard';
                    break;
                case 'Sinh viên':
                    sectionId = 'Students';
                    break;
                case 'Bài thi':
                    sectionId = 'Exam-Question';
                    break;
                case 'Câu hỏi':
                    sectionId = 'Question';
                    break;
                case 'Bài viết':
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
                    case 'Sinh viên':
                        init(listAccount, 'Students', 'userTableBody');
                        break;
                    case 'Bài thi':
                        init(listExam, 'Exam-Question', 'examTableBody');
                        break;
                    case 'Câu hỏi':
                        init(listQuestion, 'Question', 'questionTableBody');
                        break;
                    case 'Bài viết':
                        const articles = getArticleList();
                        init(articles, 'Article', 'articleTableBody');

                        break;
                }
            }
        });
    });

    // Xử lý modal cho Article
    const btnOpenModalArticle = document.querySelector('#Article .btn-add');
    const modalArticle = document.querySelector('#Article .modal-add');
    const btnCloseArticle = modalArticle ? modalArticle.querySelector('.btn-close') : null;

    if (btnOpenModalArticle) {
        btnOpenModalArticle.addEventListener('click', () => {
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
            const content = document.getElementById('addQuestionText').value;
            const options = [
                document.getElementById('addAnswer1').value,
                document.getElementById('addAnswer2').value,
                document.getElementById('addAnswer3').value,
                document.getElementById('addAnswer4').value
            ];
            const correctAnswer = document.getElementById('addCorrectAnswer').value;

            // Tạo ID tự động
            const id = generateQuestionId(listQuestion);

            // Thêm câu hỏi mới vào listQuestion
            listQuestion.push({ id, content, options, correctAnswer });
            localStorage.setItem('listQuestion', JSON.stringify(listQuestion));

            // Tải lại bảng với phân trang
            init(listQuestion, 'Question', 'questionTableBody');
            closeModalQues('addQuestionModal');
            addQuestionForm.reset();
        });
    }

    // Xử lý form sửa câu hỏi
    const editQuestionForm = document.getElementById('editQuestionForm');
    if (editQuestionForm) {
        editQuestionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('editQuestionId').value; // Lấy ID từ input ẩn
            const content = document.getElementById('editQuestionText').value;
            const options = [
                document.getElementById('editAnswer1').value,
                document.getElementById('editAnswer2').value,
                document.getElementById('editAnswer3').value,
                document.getElementById('editAnswer4').value
            ];
            const correctAnswer = document.getElementById('editCorrectAnswer').value;

            // Cập nhật câu hỏi trong listQuestion
            const index = listQuestion.findIndex(q => q.id === id);
            if (index !== -1) {
                listQuestion[index] = { id, content, options, correctAnswer };
                localStorage.setItem('listQuestion', JSON.stringify(listQuestion));

                // Tải lại bảng với phân trang
                init(listQuestion, 'Question', 'questionTableBody');
                closeModalQues('editQuestionModal');
            }
        });
    }

    // Xử lý nút đóng modal sửa câu hỏi
    const btnCloseEditQuestion = document.querySelector('#editQuestionModal .btn-close');
    if (btnCloseEditQuestion) {
        btnCloseEditQuestion.addEventListener('click', () => {
            console.log('Close button clicked in editQuestionModal'); // Debug
            closeModalQues('editQuestionModal');
        });
    } else {
        console.error('Không tìm thấy nút đóng modal (Edit Question)');
    }

    // Xử lý nút hủy modal xóa câu hỏi
    const btnCancelDeleteQuestion = document.querySelector('#deleteQuestionModal .btn-close-delete');
    if (btnCancelDeleteQuestion) {
        btnCancelDeleteQuestion.addEventListener('click', () => {
            console.log('Close button clicked in deleteQuestionModal'); // Debug
            closeModalQues('deleteQuestionModal');
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
                addAccountForm?.reset();
            }
        });
    } else {
        console.log('Không tìm thấy nút mở modal (Students)');
    }

    // Đóng modal
    if (btnCloseStudents) {
        btnCloseStudents.addEventListener('click', () => {
            if (modalStudents) modalStudents.classList.add('hidden');
        });
    } else {
        console.log('Không tìm thấy nút đóng modal (Students)');
    }

    // Xử lý thêm tài khoản
    if (btnConfirmAdd && addAccountForm) {
        btnConfirmAdd.addEventListener('click', (e) => {
            e.preventDefault();
            if (addAccountForm.checkValidity()) {
                const formData = new FormData(addAccountForm);
                const nameUser = formData.get('username');
                const email = formData.get('email');
                const password = formData.get('password');

                const isDuplicate = listAccount.some(acc => acc.email === email
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
                    password: password,
                    status: true,
                    history: [],
                };

                listAccount.push(newAccount);
                listAccount.reverse();
                localStorage.setItem('listAccount', JSON.stringify(listAccount));
                
                // Cập nhật member trong listExam
                const listExam = JSON.parse(localStorage.getItem('listExam')) || [];
                listExam.forEach(exam => {
                    exam.member = listAccount.length;
                });
                localStorage.setItem('listExam', JSON.stringify(listExam));
                
                init(listAccount, 'Students', 'userTableBody');
                modalStudents.classList.add('hidden');
                addAccountForm.reset();
            } else {
                addAccountForm.reportValidity();
            }
        });
    }

    function lockuser(id) {
        const user = listAccount.find(acc => acc.id === id);
        Swal.fire({
            title: "Có chắc muốn khóa hay mở khóa tài khản này",
            showDenyButton: true,
            // showCancelButton: true,
            confirmButtonText: "Đồng ý",
            denyButtonText: `Không`
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire("Thay đổi trạng thái tài khoản thành công!", "", "success");
                if (user) {
                    user.status = !user.status; // Đảo ngược trạng thái
                    localStorage.setItem('listAccount', JSON.stringify(listAccount));
                    
                    // Cập nhật member trong listExam
                    const listExam = JSON.parse(localStorage.getItem('listExam')) || [];
                    listExam.forEach(exam => {
                        exam.member = listAccount.length;
                    });
                    localStorage.setItem('listExam', JSON.stringify(listExam));
                    
                    init(listAccount, 'Students', 'userTableBody');
                }
            } else if (result.isDenied) {
                Swal.fire("Thay đổi trạng thái tài khoản không thành công!", "", "info");
            }
        });
    }
    window.lockuser = lockuser;

    // Mở/đóng modal
    function openModalQues(modal) { document.getElementById(modal).classList.remove('hidden'); }
    function closeModalQues(modal) { document.getElementById(modal).classList.add('hidden'); }

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

function seeDetails(id) {
    let user = listAccount.find(acc => acc.id === id);
    console.log(user);
    let modalDetails = document.getElementById('seeDetails');
    modalDetails.classList.remove('hidden');
    let detailsContent = document.getElementById('pointExam');
    detailsContent.innerHTML="";
    let btn = document.getElementById('closeDetails');
    btn.addEventListener('click', () => {
        modalDetails.classList.add('hidden');
    });
    let infoUser = document.getElementById('infoStudent');
    infoUser.innerHTML = `
        <p style="font-weight: 640;">Tên: ${user.nameUser}</p>
        <p style="font-weight: 640;">Ngày sinh: ${user.date}</p>
        <p style="font-weight: 640;">email: ${user.email}</p>
    `;
    user.history.forEach((item, index) => {
        detailsContent.innerHTML += `
        <tr>
            <td>${item.examName}</td>
            <td>${item.time}</td>
            <td>${item.morningExam.score}</td>
            <td>${item.afternoonExam.score}</td>
        </tr>`;
    });
}