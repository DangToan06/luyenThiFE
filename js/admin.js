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
        if (questions.length === 0) return '1';
        const maxId = Math.max(...questions.map(q => parseInt(q.id, 10)));
        return (maxId + 1).toString();
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

                    openModal('editQuestionModal');
                } else {
                    console.error(`Question with ID ${id} not found in listQuestion`);
                }
            } else if (button.classList.contains('btn-delete')) {
                console.log('Delete button clicked');
                openModal('deleteQuestionModal');

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
                            closeModal('deleteQuestionModal');
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
        const itemsPerPage = 5;
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
                            <button class="btn-edit" data-id="${item.id}"><i class="fa-solid fa-pen-to-square" style="color: #3e1ce9;"></i></button>
                            <button class="btn-delete" data-id="${item.id}"><i class="fa-solid fa-trash" style="color: #ff0000;"></i></button>
                        </td>
                    </tr>`;
                case "Article":
                    return `
                    <tr>
                        <td>${item.id}</td>
                        <td>${item.title}</td>
                        <td>${item.date || 'N/A'}</td>
                        <td>Admin</td>
                        <td class="action-buttons">
                            <button class="btn-edit">Edit</button>
                            <button class="btn-delete">Delete</button>
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
                        init(listArticle, 'Article', 'articleTableBody');
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
            closeModal('addQuestionModal');
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
                closeModal('editQuestionModal');
            }
        });
    }

    // Xử lý nút đóng modal sửa câu hỏi
    const btnCloseEditQuestion = document.querySelector('#editQuestionModal .btn-close');
    if (btnCloseEditQuestion) {
        btnCloseEditQuestion.addEventListener('click', () => {
            console.log('Close button clicked in editQuestionModal'); // Debug
            closeModal('editQuestionModal');
        });
    } else {
        console.error('Không tìm thấy nút đóng modal (Edit Question)');
    }

    // Xử lý nút hủy modal xóa câu hỏi
    const btnCancelDeleteQuestion = document.querySelector('#deleteQuestionModal .btn-close-delete');
    if (btnCancelDeleteQuestion) {
        btnCancelDeleteQuestion.addEventListener('click', () => {
            console.log('Close button clicked in deleteQuestionModal'); // Debug
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
                    acc.nameUser === nameUser || acc.email === email
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
                    status: true
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
        if (user) {
            user.status = !user.status; // Đảo ngược trạng thái
            localStorage.setItem('listAccount', JSON.stringify(listAccount));
            init(listAccount, 'Students', 'userTableBody');
        }
    }
    window.lockuser = lockuser;
});