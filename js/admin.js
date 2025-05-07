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
                  <button class="btn-delete">Lock</button>
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
              init(listArticle, 'Article', 'articleTableBody');
              break;
          }
        }
      });
    });
    // localStorage.setItem('listAccount', JSON.stringify(listArticle));
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
  });