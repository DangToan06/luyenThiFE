document.addEventListener("DOMContentLoaded", function () {
  // Tạo HTML cho modal và thêm vào body
  const modalHTML = `
    <div class="modal-exam" id="examModal">
      <div class="modal-exam-content">
        <h3 id="modalTitle">Thêm bài thi mới</h3>
        <form id="examForm" class="modal-exam-form">
          <div class="form-group">
            <label for="examTitle">Title:</label>
            <input type="text" id="examTitle" placeholder="Tên đề thi" required>
          </div>
          <div class="form-group">
            <label for="examDuration">Duration:</label>
            <input type="number" id="examDuration" placeholder="Thời gian" required>
          </div>
          <div class="form-group">
            <label for="questionSearch">Tìm kiếm câu hỏi:</label>
            <input type="text" id="questionSearch" placeholder="Nhập ID hoặc bất kì nội dung câu hỏi để tìm">
            <div id="searchResults" class="search-results"></div>
            <div class="search-actions">
              <button type="button" class="btn-select-all">Chọn tất cả</button>
              <button type="button" class="btn-deselect-all">Bỏ chọn tất cả</button>
            </div>
          </div>
          <div class="form-group">
            <label>Câu hỏi đã chọn: <span id="selectedCount">0</span> câu</label>
            <div id="selectedQuestions" class="selected-questions"></div>
          </div>
          <div class="modal-exam-actions">
            <button type="submit" class="btn-save-exam">Lưu</button>
            <button type="button" class="btn-close-exam">Đóng</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Lấy các phần tử cần dùng
  const modal = document.getElementById("examModal");
  const modalTitle = document.getElementById("modalTitle");
  const examForm = document.getElementById("examForm");
  const examTitle = document.getElementById("examTitle");
  const examDuration = document.getElementById("examDuration");
  const closeBtn = modal.querySelector(".btn-close-exam");
  const questionSearch = document.getElementById("questionSearch");
  const searchResults = document.getElementById("searchResults");
  const selectedQuestions = document.getElementById("selectedQuestions");
  const selectedCount = document.getElementById("selectedCount");
  const examSearch = document.getElementById("searchExam");
  const contentList = document.getElementById("examTableBody");
  const firstPageBtn = document.getElementById("Exam-Question-firstPage");
  const prevPageBtn = document.getElementById("Exam-Question-prevPage");
  const nextPageBtn = document.getElementById("Exam-Question-nextPage");
  const lastPageBtn = document.getElementById("Exam-Question-lastPage");
  const pageNumbersContainer = document.getElementById(
    "Exam-Question-pageNumbers"
  );

  // Biến trạng thái
  let currentExamId = null;
  let selectedQuestionIds = [];
  let currentSearchResults = [];
  let currentPage = 1;
  const itemsPerPage = 5; // Đồng bộ với admin.js

  // Tạo ID đề thi ngẫu nhiên
  function generateUniqueExamId() {
    let newId;
    do {
      newId =
        "exam" + String(Math.floor(Math.random() * 1000)).padStart(3, "0");
    } while (listExam.some((exam) => exam.id === newId));
    return newId;
  }

  // Tìm kiếm câu hỏi
  function searchQuestions(query) {
    if (!query) {
      searchResults.innerHTML = "";
      currentSearchResults = [];
      return;
    }
    currentSearchResults = listQuestion.filter(
      (q) =>
        (q.id.toLowerCase().includes(query.toLowerCase()) ||
          q.content.toLowerCase().includes(query.toLowerCase())) &&
        !selectedQuestionIds.includes(q.id)
    );
    updateSearchResults();
  }

  // Cập nhật danh sách kết quả tìm kiếm
  function updateSearchResults() {
    searchResults.innerHTML = currentSearchResults
      .map(
        (q) => `
      <div class="search-result-item" data-id="${q.id}">
        <div class="checkbox-wrapper">
          <input type="checkbox" class="question-checkbox" data-id="${q.id}" id="checkbox-${q.id}">
          <label for="checkbox-${q.id}" class="checkbox-label"></label>
        </div>
        <span class="question-text">${q.id}: ${q.content}</span>
      </div>
    `
      )
      .join("");
  }

  // Cập nhật danh sách câu hỏi đã chọn
  function updateSelectedQuestions() {
    selectedQuestions.innerHTML = selectedQuestionIds
      .map((id) => {
        const question = listQuestion.find((q) => q.id === id);
        return question
          ? `<div class="selected-question-item">${id}: ${question.content}</div>`
          : "";
      })
      .join("");
    selectedCount.textContent = selectedQuestionIds.length;
  }

  // Logic phân trang
  function renderContent(renderList) {
    contentList.innerHTML = "";
    const totalItems = renderList.length;
    const start = (currentPage - 1) * itemsPerPage;
    const end = Math.min(start + itemsPerPage, totalItems);
    const itemsToShow = renderList.slice(start, end);

    itemsToShow.forEach((item) => {
      contentList.innerHTML += `
        <tr>
          <td>${item.id}</td>
          <td>${item.title}</td>
          <td>${item.durationMinutes} phút</td>
          <td>${item.totalQuest}</td>
          <td class="action-buttons">
            <button class="btn-edit" data-id="${item.id}"><i class="fa-solid fa-pen-to-square" style="color: #3e1ce9;"></i></button>
                  <button class="btn-delete" data-id="${item.id}"><i class="fa-solid fa-trash" style="color: #ff0000;"></i></button>
          </td>
        </tr>`;
    });

    renderPagination(renderList);
  }

  function renderPagination(renderList) {
    const totalItems = renderList.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    pageNumbersContainer.innerHTML = "";
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    if (startPage > 1) {
      pageNumbersContainer.innerHTML += `<button class="page-button" data-page="1">1</button>`;
      if (startPage > 2) pageNumbersContainer.innerHTML += `<span>...</span>`;
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbersContainer.innerHTML += `
        <button class="page-button ${
          i === currentPage ? "active" : ""
        }" data-page="${i}">${i}</button>`;
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1)
        pageNumbersContainer.innerHTML += `<span>...</span>`;
      pageNumbersContainer.innerHTML += `<button class="page-button" data-page="${totalPages}">${totalPages}</button>`;
    }

    setupPaginationEvents(renderList);
    updateButtons(totalPages);
  }

  function setupPaginationEvents(renderList) {
    const pageButtons = pageNumbersContainer.querySelectorAll(".page-button");
    pageButtons.forEach((button) => {
      button.addEventListener("click", () => {
        currentPage = parseInt(button.dataset.page);
        renderContent(renderList);
      });
    });

    firstPageBtn.onclick = () => {
      currentPage = 1;
      renderContent(renderList);
    };
    prevPageBtn.onclick = () => {
      if (currentPage > 1) currentPage--;
      renderContent(renderList);
    };
    nextPageBtn.onclick = () => {
      if (currentPage < Math.ceil(renderList.length / itemsPerPage))
        currentPage++;
      renderContent(renderList);
    };
    lastPageBtn.onclick = () => {
      currentPage = Math.ceil(renderList.length / itemsPerPage);
      renderContent(renderList);
    };
  }

  function updateButtons(totalPages) {
    firstPageBtn.disabled = currentPage === 1;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
    lastPageBtn.disabled = currentPage === totalPages;
  }

  // Hàm cập nhật bảng
  function updateExamTable(renderList = listExam) {
    currentPage = 1; // Đặt về trang 1
    renderContent(renderList);
  }

  // Sự kiện tìm kiếm câu hỏi
  questionSearch.addEventListener("input", (e) =>
    searchQuestions(e.target.value)
  );

  // Chọn tất cả kết quả tìm kiếm
  document.querySelector(".btn-select-all").addEventListener("click", () => {
    searchResults.querySelectorAll(".question-checkbox").forEach((checkbox) => {
      if (!checkbox.checked) {
        checkbox.checked = true;
        const id = checkbox.dataset.id;
        if (!selectedQuestionIds.includes(id)) selectedQuestionIds.push(id);
      }
    });
    updateSelectedQuestions();
  });

  // Bỏ chọn tất cả
  document.querySelector(".btn-deselect-all").addEventListener("click", () => {
    searchResults
      .querySelectorAll(".question-checkbox")
      .forEach((cb) => (cb.checked = false));
    selectedQuestionIds = [];
    updateSelectedQuestions();
  });

  // Thêm hoặc gỡ câu hỏi khỏi danh sách đã chọn
  searchResults.addEventListener("change", (e) => {
    if (e.target.classList.contains("question-checkbox")) {
      const id = e.target.dataset.id;
      if (e.target.checked) {
        if (!selectedQuestionIds.includes(id)) selectedQuestionIds.push(id);
      } else {
        selectedQuestionIds = selectedQuestionIds.filter((qid) => qid !== id);
      }
      updateSelectedQuestions();
    }
  });

  // Thêm xử lý sự kiện cho bảng Exam Question
  const examTable = document.querySelector("#Exam-Question .admin-table");
  if (examTable) {
    examTable.addEventListener("click", async (e) => {
      const target = e.target.closest("button");
      if (!target) return;

      const row = target.closest("tr");
      if (!row) return;

      const examId = row.cells[0].textContent;
      const exam = listExam.find((ex) => ex.id === examId);

      if (target.classList.contains("btn-edit")) {
        if (exam) {
          currentExamId = exam.id;
          modalTitle.textContent = "Chỉnh sửa bài thi";
          examTitle.value = exam.title;
          examDuration.value = exam.durationMinutes;
          selectedQuestionIds = [...exam.questionIds];
          updateSelectedQuestions();
          modal.classList.add("show");
        }
      } else if (target.classList.contains("btn-delete")) {
        try {
          const result = await Swal.fire({
            title: "Xác nhận xóa?",
            text: "Nếu bạn chọn xóa thì không thể hoàn tác!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
          });

          if (result.isConfirmed) {
            const index = listExam.findIndex((exam) => exam.id === examId);
            if (index !== -1) {
              listExam.splice(index, 1);
              localStorage.setItem("listExam", JSON.stringify(listExam));
              examSearch.value = "";
              updateExamTable();
              Swal.fire("Đã xóa!", "Đề thi đã được xóa.", "success");
            }
          }
        } catch (error) {
          console.error("Lỗi khi xóa đề thi:", error);
          Swal.fire("Lỗi!", "Không thể xóa đề thi.", "error");
        }
      }
    });
  }

  // Thêm xử lý sự kiện cho nút Add New Exam
  const addExamBtn = document.querySelector("#Exam-Question .btn-add");
  if (addExamBtn) {
    addExamBtn.addEventListener("click", () => {
      modalTitle.textContent = "Thêm bài thi mới";
      examForm.reset();
      currentExamId = null;
      selectedQuestionIds = [];
      updateSelectedQuestions();
      modal.classList.add("show");
    });
  }

  // Thêm xử lý sự kiện cho nút đóng modal
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("show");
    });
  }

  // Thêm xử lý sự kiện cho form lưu đề thi
  if (examForm) {
    examForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      try {
        const title = examTitle.value.trim();
        const duration = parseInt(examDuration.value);

        if (isNaN(duration) || duration <= 0) {
          await Swal.fire("Lỗi!", "Thời gian phải lớn hơn 00 phút.", "error");
          return;
        }

        const isTitleDuplicate = listExam.some(
          (exam) =>
            exam.title.toLowerCase() === title.toLowerCase() &&
            exam.id !== currentExamId
        );
        if (isTitleDuplicate) {
          await Swal.fire(
            "Lỗi!",
            "Tên đề thi đã tồn tại. Vui lòng chọn tên khác.",
            "error"
          );
          return;
        }

        const examData = {
          title: title,
          durationMinutes: duration,
          questionIds: selectedQuestionIds,
          randomize: true,
          member: 0,
          totalQuest: selectedQuestionIds.length,
        };

        if (currentExamId) {
          const index = listExam.findIndex((exam) => exam.id === currentExamId);
          if (index !== -1) {
            listExam[index] = { ...listExam[index], ...examData };
            await Swal.fire(
              "Thành công!",
              "Đã cập nhật và chỉnh sửa đề thi!",
              "success"
            );
          }
        } else {
          examData.id = generateUniqueExamId();
          listExam.unshift(examData);
          await Swal.fire("Thành công!", "Đã thêm đề thi mới!", "success");
        }

        localStorage.setItem("listExam", JSON.stringify(listExam));
        examSearch.value = "";
        updateExamTable();
        modal.classList.remove("show");
      } catch (error) {
        console.error("Lỗi khi lưu đề thi:", error);
        Swal.fire("Lỗi!", "Không thể lưu đề thi.", "error");
      }
    });
  }

  // Tìm kiếm đề thi
  examSearch.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    const filteredExams = listExam.filter(
      (exam) =>
        exam.id.toLowerCase().includes(query) ||
        exam.title.toLowerCase().includes(query)
    );
    currentPage = 1; // Đặt về trang 1 khi tìm kiếm
    renderContent(filteredExams);
  });

  // Khởi tạo bảng ban đầu
  updateExamTable();
});
