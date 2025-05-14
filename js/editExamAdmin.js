document.addEventListener("DOMContentLoaded", function () {
  // Tạo HTML cho modal và thêm vào body
  const modalHTML = `
    <div class="modal-exam" id="examModal">
      <div class="modal-exam-content">
        <h3 id="modalTitle">Thêm bài thi mới</h3>
        <form id="examForm" class="modal-exam-form">
          <div class="form-group">
            <label for="examTitle">Tên đề thi:</label>
            <input type="text" id="examTitle" placeholder="Tên đề thi" required>
          </div>
          <div class="form-group">
            <label for="examDuration">Thời Gian làm bài:</label>
            <input type="number" id="examDuration" placeholder="Thời gian" required>
          </div>
          <div class="form-group">
            <label for="questionSearch">Tìm kiếm câu hỏi:</label>
            <input type="text" id="questionSearch" placeholder="Nhập ID hoặc nội dung câu hỏi">
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

  // Lấy các phần tử DOM và kiểm tra sự tồn tại
  const modal = document.getElementById("examModal");
  if (!modal) return;

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
  const itemsPerPage = 3;

  // Tạo ID đề thi ngẫu nhiên
  function generateUniqueExamId() {
    while (true) {
      const randomNum = Math.floor(Math.random() * 1000);
      const newId = "exam" + String(randomNum).padStart(3, "0"); // Tạo ID bài thi bằng cách chuyển thành chuỗi, thêm ký tự vào đầu chuỗi
      if (!listExam || !listExam.some((exam) => exam.id === newId)) {
        // Kiểm tra ID chưa tồn tại
        return newId;
      }
    }
  }

  // Tìm kiếm câu hỏi
  function searchQuestions(query) {
    if (!query || !searchResults) {
      if (searchResults) searchResults.innerHTML = "";
      currentSearchResults = [];
      return;
    }
    query = query.toLowerCase();
    currentSearchResults = (listQuestion || []).filter((q) => {
      let isSelected = selectedQuestionIds.some((id) => id === q.id); // Kiểm tra xem ID của câu hỏi hiện tại (q.id) có nằm trong mảng selectedQuestionIds không
      return (
        !isSelected &&
        (q.id.toLowerCase().indexOf(query) !== -1 ||
          q.content.toLowerCase().indexOf(query) !== -1)
      );
    });
    updateSearchResults();
  }

  // Cập nhật danh sách kết quả tìm kiếm
  function updateSearchResults() {
    if (!searchResults) return;
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
    if (!selectedQuestions || !selectedCount) return;
    selectedQuestions.innerHTML = selectedQuestionIds
      .map((id) => {
        const question = (listQuestion || []).find((q) => q.id === id);
        return question
          ? `<div class="selected-question-item">${id}: ${question.content}</div>`
          : "";
      })
      .join("");
    selectedCount.textContent = selectedQuestionIds.length;
  }

  // Hiển thị bảng nội dung
  function renderContent(renderList) {
    if (!contentList) return;
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

  // Hiển thị phân trang
  function renderPagination(renderList) {
    if (!pageNumbersContainer) return;
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

  // Thiết lập sự kiện phân trang
  function setupPaginationEvents(renderList) {
    if (!pageNumbersContainer) return;
    const pageButtons = pageNumbersContainer.querySelectorAll(".page-button");
    pageButtons.forEach((button) => {
      button.addEventListener("click", () => {
        currentPage = parseInt(button.dataset.page);
        renderContent(renderList);
      });
    });

    if (firstPageBtn) {
      firstPageBtn.onclick = () => {
        currentPage = 1;
        renderContent(renderList);
      };
    }
    if (prevPageBtn) {
      prevPageBtn.onclick = () => {
        if (currentPage > 1) {
          currentPage--;
          renderContent(renderList);
        }
      };
    }
    if (nextPageBtn) {
      nextPageBtn.onclick = () => {
        if (currentPage < Math.ceil(renderList.length / itemsPerPage)) {
          currentPage++;
          renderContent(renderList);
        }
      };
    }
    if (lastPageBtn) {
      lastPageBtn.onclick = () => {
        currentPage = Math.ceil(renderList.length / itemsPerPage);
        renderContent(renderList);
      };
    }
  }

  // Cập nhật trạng thái nút phân trang
  function updateButtons(totalPages) {
    if (firstPageBtn) firstPageBtn.disabled = currentPage === 1;
    if (prevPageBtn) prevPageBtn.disabled = currentPage === 1;
    if (nextPageBtn) nextPageBtn.disabled = currentPage === totalPages;
    if (lastPageBtn) lastPageBtn.disabled = currentPage === totalPages;
  }

  // Cập nhật bảng
  function updateExamTable(renderList = listExam) {
    currentPage = 1;
    renderContent(renderList || []);
  }

  // Sự kiện tìm kiếm câu hỏi
  if (questionSearch) {
    questionSearch.addEventListener("input", () =>
      searchQuestions(questionSearch.value)
    );
  }

  // Chọn tất cả kết quả tìm kiếm
  const selectAllBtn = document.querySelector(".btn-select-all");
  if (selectAllBtn) {
    selectAllBtn.addEventListener("click", () => {
      if (!searchResults) return;
      const checkboxes = searchResults.querySelectorAll(".question-checkbox");
      checkboxes.forEach((checkbox) => {
        if (!checkbox.checked) {
          checkbox.checked = true;
          const id = checkbox.dataset.id;
          if (!selectedQuestionIds.some((qid) => qid === id)) {
            selectedQuestionIds.push(id);
          }
        }
      });
      updateSelectedQuestions();
    });
  }

  // Bỏ chọn tất cả
  const deselectAllBtn = document.querySelector(".btn-deselect-all");
  if (deselectAllBtn) {
    deselectAllBtn.addEventListener("click", () => {
      if (!searchResults) return;
      searchResults.querySelectorAll(".question-checkbox").forEach((cb) => {
        cb.checked = false;
      });
      selectedQuestionIds = [];
      updateSelectedQuestions();
    });
  }

  // Thêm hoặc bỏ câu hỏi đã chọn
  if (searchResults) {
    searchResults.addEventListener("change", (e) => {
      if (e.target.className === "question-checkbox") {
        const id = e.target.dataset.id;
        if (e.target.checked) {
          if (!selectedQuestionIds.some((qid) => qid === id)) {
            selectedQuestionIds.push(id);
          }
        } else {
          selectedQuestionIds = selectedQuestionIds.filter((qid) => qid !== id);
        }
        updateSelectedQuestions();
      }
    });
  }

  // Xử lý sự kiện cho bảng
  const examTable = document.querySelector("#Exam-Question .admin-table");
  if (examTable) {
    examTable.addEventListener("click", async (e) => {
      const button = e.target.closest("button");
      if (!button) return;

      const row = button.closest("tr");
      if (!row) return;

      const examId = row.cells[0].textContent;
      const exam = (listExam || []).find((ex) => ex.id === examId);

      if (button.className === "btn-edit") {
        if (exam && modal && modalTitle && examTitle && examDuration) {
          currentExamId = exam.id;
          modalTitle.textContent = "Chỉnh sửa bài thi";
          examTitle.value = exam.title;
          examDuration.value = exam.durationMinutes;
          selectedQuestionIds = [...exam.questionIds];
          updateSelectedQuestions();
          modal.classList.add("show");
        }
      } else if (button.className === "btn-delete") {
        try {
          const result = await Swal.fire({
            title: "Xác nhận xóa?",
            text: "Nếu bạn chọn xóa thì không thể hoàn tác!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
          });

          if (result.isConfirmed && listExam) {
            const index = listExam.findIndex((exam) => exam.id === examId);
            if (index !== -1) {
              listExam.splice(index, 1);
              localStorage.setItem("listExam", JSON.stringify(listExam));
              if (examSearch) examSearch.value = "";
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

  // Sự kiện nút thêm đề thi
  const addExamBtn = document.querySelector("#Exam-Question .btn-add");
  if (addExamBtn) {
    addExamBtn.addEventListener("click", () => {
      if (modal && modalTitle && examForm) {
        modalTitle.textContent = "Thêm bài thi mới";
        examForm.reset();
        currentExamId = null;
        selectedQuestionIds = [];
        updateSelectedQuestions();
        modal.classList.add("show");
      }
    });
  }

  // Sự kiện đóng modal
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      if (modal) modal.classList.remove("show");
    });
  }

  // Xử lý lưu đề thi
  if (examForm) {
    examForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const title = examTitle ? examTitle.value.trim() : ""; // Lấy tiêu đề đề thi, loại bỏ khoảng trắng đầu/cuối nếu có
      const duration = examDuration ? parseInt(examDuration.value) : 0;

      // Kiểm tra thời gian hợp lệ
      if (isNaN(duration) || duration <= 0) {
        await Swal.fire("Lỗi!", "Thời gian phải lớn hơn 0 phút.", "error");
        return;
      }

      // Kiểm tra tên đề thi trùng
      const isTitleDuplicate = (listExam || []).some((exam) => {
        return (
          exam.title.toLowerCase() === title.toLowerCase() &&
          exam.id !== currentExamId
        );
      });

      if (isTitleDuplicate) {
        await Swal.fire("Lỗi!", "Tên đề thi đã tồn tại.", "error");
        return;
      }

      // Tạo dữ liệu đề thi
      const examData = {
        title: title,
        durationMinutes: duration,
        questionIds: selectedQuestionIds,
        randomize: true,
        member: 0,
        totalQuest: selectedQuestionIds.length,
      };

      // Cập nhật nếu đang sửa đề thi
      if (currentExamId && listExam) {
        const index = listExam.findIndex((exam) => exam.id === currentExamId);
        if (index !== -1) {
          listExam[index] = { id: currentExamId, ...examData };
          await Swal.fire("Thành công!", "Đã cập nhật đề thi!", "success");
        }
      }
      // Thêm mới đề thi
      else if (listExam) {
        examData.id = generateUniqueExamId();
        listExam.unshift(examData);
        await Swal.fire("Thành công!", "Đã thêm đề thi mới!", "success");
      }

      // Lưu vào localStorage
      if (listExam) {
        localStorage.setItem("listExam", JSON.stringify(listExam));
      }

      // Reset giao diện
      if (examSearch) {
        examSearch.value = "";
      }

      updateExamTable();

      if (modal) {
        modal.classList.remove("show");
      }
    });
  }

  // Tìm kiếm đề thi
  if (examSearch) {
    examSearch.addEventListener("input", () => {
      const query = examSearch.value.toLowerCase();
      const filteredExams = (listExam || []).filter(
        (exam) =>
          exam.id.toLowerCase().indexOf(query) !== -1 ||
          exam.title.toLowerCase().indexOf(query) !== -1
      );
      currentPage = 1;
      renderContent(filteredExams);
    });
  }

  // Khởi tạo bảng
  updateExamTable();
});
