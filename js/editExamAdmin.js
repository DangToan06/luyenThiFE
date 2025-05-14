document.addEventListener("DOMContentLoaded", function () {
  // Tạo HTML cho modal và thêm vào body
  const modalHTML =
    '<div class="modal-exam" id="examModal">' +
    '<div class="modal-exam-content">' +
    '<h3 id="modalTitle">Thêm bài thi mới</h3>' +
    '<form id="examForm" class="modal-exam-form">' +
    '<div class="form-group">' +
    '<label for="examTitle">Tên đề thi:</label>' +
    '<input type="text" id="examTitle" placeholder="Tên đề thi" required>' +
    "</div>" +
    '<div class="form-group">' +
    '<label for="examDuration">Thời Gian làm bài:</label>' +
    '<input type="number" id="examDuration" placeholder="Thời gian" required>' +
    "</div>" +
    '<div class="form-group">' +
    '<label for="questionSearch">Tìm kiếm câu hỏi ca sáng:</label>' +
    '<input type="text" id="questionSearch" placeholder="Nhập ID hoặc nội dung câu hỏi">' +
    '<div id="searchResults" class="search-results"></div>' +
    '<div class="search-actions">' +
    '<button type="button" class="btn-select-all">Chọn tất cả</button>' +
    '<button type="button" class="btn-deselect-all">Bỏ chọn tất cả</button>' +
    "</div>" +
    "</div>" +
    '<div class="form-group">' +
    '<label>Câu hỏi ca sáng đã chọn: <span id="selectedCount">0</span> câu</label>' +
    '<div id="selectedQuestions" class="selected-questions"></div>' +
    "</div>" +
    '<div class="form-group">' +
    '<label for="questionSearch2">Tìm kiếm câu hỏi ca chiều:</label>' +
    '<input type="text" id="questionSearch2" placeholder="Nhập ID hoặc nội dung câu hỏi">' +
    '<div id="searchResults2" class="search-results"></div>' +
    '<div class="search-actions">' +
    '<button type="button" class="btn-select-all2">Chọn tất cả</button>' +
    '<button type="button" class="btn-deselect-all2">Bỏ chọn tất cả</button>' +
    "</div>" +
    "</div>" +
    '<div class="form-group">' +
    '<label>Câu hỏi ca chiều đã chọn: <span id="selectedCount2">0</span> câu</label>' +
    '<div id="selectedQuestions2" class="selected-questions"></div>' +
    "</div>" +
    '<div class="modal-exam-actions">' +
    '<button type="submit" class="btn-save-exam">Lưu</button>' +
    '<button type="button" class="btn-close-exam">Đóng</button>' +
    "</div>" +
    "</form>" +
    "</div>" +
    "</div>";
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = modalHTML;
  document.body.appendChild(tempDiv.firstChild);

  // Lấy các phần tử DOM và kiểm tra sự tồn tại
  const modal = document.getElementById("examModal");
  if (!modal) return;

  const modalTitle = document.getElementById("modalTitle");
  const examForm = document.getElementById("examForm");
  const examTitle = document.getElementById("examTitle");
  const examDuration = document.getElementById("examDuration");
  const closeBtn = modal.getElementsByClassName("btn-close-exam")[0];
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
  let currentPage = 1; // Trang hiện tại trong phân trang
  const itemsPerPage = 3;
  let selectedQuestionIds2 = [];
  let currentSearchResults2 = [];

  // Khởi tạo listExam và listQuestion nếu chưa có
  if (typeof listExam === "undefined") {
    listExam = JSON.parse(localStorage.getItem("listExam")) || [];
  }
  if (typeof listQuestion === "undefined") {
    listQuestion = JSON.parse(localStorage.getItem("listQuestion")) || [];
  }

  // Thêm hàm cập nhật member cho listExam
  function updateExamMembers() {
    // Lấy số lượng tài khoản từ listAccount
    const memberCount = listAccount.length;
    
    // Cập nhật member cho tất cả các đề thi
    listExam.forEach(exam => {
      exam.member = memberCount;
    });
    
    // Lưu lại vào localStorage
    localStorage.setItem("listExam", JSON.stringify(listExam));
  }

  // Gọi hàm cập nhật khi trang được tải
  updateExamMembers();

  // Tạo ID đề thi ngẫu nhiên
  function generateUniqueExamId() {
    while (true) {
      const randomNum = Math.floor(Math.random() * 1000);
      const newId = "exam" + String(randomNum).padStart(3, "0");
      let isUnique = true;
      if (listExam) {
        for (let i = 0; i < listExam.length; i++) {
          if (listExam[i].id === newId) {
            isUnique = false;
            break;
          }
        }
      }
      if (isUnique) return newId;
    }
  }

  // Tìm kiếm câu hỏi ca sáng
  function searchQuestions(query) {
    if (!query || !searchResults) {
      if (searchResults) searchResults.innerHTML = "";
      currentSearchResults = [];
      return;
    }
    query = query.toLowerCase();
    currentSearchResults = (listQuestion || []).filter(function (q) {
      let isSelected = selectedQuestionIds.some(function (id) {
        return id === q.id;
      });
      return (
        !isSelected &&
        (q.id.toLowerCase().indexOf(query) !== -1 ||
          q.content.toLowerCase().indexOf(query) !== -1)
      );
    });
    updateSearchResults();
  }

  // Cập nhật danh sách kết quả tìm kiếm ca sáng
  function updateSearchResults() {
    if (!searchResults) return;
    searchResults.innerHTML = currentSearchResults
      .map(function (q) {
        return (
          '<div class="search-result-item" data-id="' +
          q.id +
          '">' +
          '<div class="checkbox-wrapper">' +
          '<input type="checkbox" class="question-checkbox" data-id="' +
          q.id +
          '" id="checkbox-' +
          q.id +
          '">' +
          '<label for="checkbox-' +
          q.id +
          '" class="checkbox-label"></label>' +
          "</div>" +
          '<span class="question-text">' +
          q.id +
          ": " +
          q.content +
          "</span>" +
          "</div>"
        );
      })
      .join("");
  }

  // Cập nhật danh sách câu hỏi đã chọn ca sáng
  function updateSelectedQuestions() {
    if (!selectedQuestions || !selectedCount) return;
    let html = "";
    for (let i = 0; i < selectedQuestionIds.length; i++) {
      let id = selectedQuestionIds[i];
      let question = null;
      for (let j = 0; j < (listQuestion || []).length; j++) {
        if (listQuestion[j].id === id) {
          question = listQuestion[j];
          break;
        }
      }
      if (question) {
        html +=
          '<div class="selected-question-item">' +
          id +
          ": " +
          question.content +
          "</div>";
      }
    }
    selectedQuestions.innerHTML = html;
    selectedCount.textContent = selectedQuestionIds.length;
  }

  // Tìm kiếm câu hỏi ca chiều
  function searchQuestions2(query) {
    if (!query || !searchResults2) {
      if (searchResults2) searchResults2.innerHTML = "";
      currentSearchResults2 = [];
      return;
    }
    query = query.toLowerCase();
    currentSearchResults2 = (listQuestion || []).filter(function (q) {
      let isSelected = selectedQuestionIds2.some(function (id) {
        return id === q.id;
      });
      return (
        !isSelected &&
        (q.id.toLowerCase().indexOf(query) !== -1 ||
          q.content.toLowerCase().indexOf(query) !== -1)
      );
    });
    updateSearchResults2();
  }

  // Cập nhật danh sách kết quả tìm kiếm ca chiều
  function updateSearchResults2() {
    if (!searchResults2) return;
    searchResults2.innerHTML = currentSearchResults2
      .map(function (q) {
        return (
          '<div class="search-result-item" data-id="' +
          q.id +
          '">' +
          '<div class="checkbox-wrapper">' +
          '<input type="checkbox" class="question-checkbox" data-id="' +
          q.id +
          '" id="checkbox2-' +
          q.id +
          '">' +
          '<label for="checkbox2-' +
          q.id +
          '" class="checkbox-label"></label>' +
          "</div>" +
          '<span class="question-text">' +
          q.id +
          ": " +
          q.content +
          "</span>" +
          "</div>"
        );
      })
      .join("");
  }

  // Cập nhật danh sách câu hỏi đã chọn ca chiều
  function updateSelectedQuestions2() {
    if (!selectedQuestions2 || !selectedCount2) return;
    let html = "";
    for (let i = 0; i < selectedQuestionIds2.length; i++) {
      let id = selectedQuestionIds2[i];
      let question = null;
      for (let j = 0; j < (listQuestion || []).length; j++) {
        if (listQuestion[j].id === id) {
          question = listQuestion[j];
          break;
        }
      }
      if (question) {
        html +=
          '<div class="selected-question-item">' +
          id +
          ": " +
          question.content +
          "</div>";
      }
    }
    selectedQuestions2.innerHTML = html;
    selectedCount2.textContent = selectedQuestionIds2.length;
  }

  // Hiển thị bảng nội dung
  function renderContent(renderList) {
    if (!contentList) return;
    contentList.innerHTML = "";
    const totalItems = renderList.length;
    const start = (currentPage - 1) * itemsPerPage;
    const end = Math.min(start + itemsPerPage, totalItems);
    let html = "";
    for (let i = start; i < end && i < totalItems; i++) {
      let item = renderList[i];
      html +=
        "<tr>" +
        "<td>" +
        item.id +
        "</td>" +
        "<td>" +
        item.title +
        "</td>" +
        "<td>" +
        item.durationMinutes +
        " phút</td>" +
        "<td>" +
        item.totalQuest +
        "</td>" +
        '<td class="action-buttons">' +
        '<button class="btn-edit" data-id="' +
        item.id +
        '"><i class="fa-solid fa-pen-to-square" style="color: #3e1ce9;"></i></button>' +
        '<button class="btn-delete" data-id="' +
        item.id +
        '"><i class="fa-solid fa-trash" style="color: #ff0000;"></i></button>' +
        "</td>" +
        "</tr>";
    }
    contentList.innerHTML = html;
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
    let html = "";
    if (startPage > 1) {
      html += '<button class="page-button" data-page="1">1</button>';
      if (startPage > 2) html += "<span>...</span>";
    }
    for (let i = startPage; i <= endPage; i++) {
      html +=
        '<button class="page-button ' +
        (i === currentPage ? "active" : "") +
        '" data-page="' +
        i +
        '">' +
        i +
        "</button>";
    }
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) html += "<span>...</span>";
      html +=
        '<button class="page-button" data-page="' +
        totalPages +
        '">' +
        totalPages +
        "</button>";
    }
    pageNumbersContainer.innerHTML = html;
    setupPaginationEvents(renderList);
    updateButtons(totalPages);
  }

  // Thiết lập sự kiện phân trang
  function setupPaginationEvents(renderList) {
    if (!pageNumbersContainer) return;
    const pageButtons =
      pageNumbersContainer.getElementsByClassName("page-button");
    for (let i = 0; i < pageButtons.length; i++) {
      pageButtons[i].addEventListener("click", function () {
        currentPage = parseInt(this.getAttribute("data-page"));
        renderContent(renderList);
      });
    }
    if (firstPageBtn) {
      firstPageBtn.onclick = function () {
        currentPage = 1;
        renderContent(renderList);
      };
    }
    if (prevPageBtn) {
      prevPageBtn.onclick = function () {
        if (currentPage > 1) {
          currentPage--;
          renderContent(renderList);
        }
      };
    }
    if (nextPageBtn) {
      nextPageBtn.onclick = function () {
        if (currentPage < Math.ceil(renderList.length / itemsPerPage)) {
          currentPage++;
          renderContent(renderList);
        }
      };
    }
    if (lastPageBtn) {
      lastPageBtn.onclick = function () {
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
  function updateExamTable(renderList) {
    if (!renderList) renderList = listExam;
    currentPage = 1;
    renderContent(renderList);
  }

  // Sự kiện tìm kiếm câu hỏi ca sáng
  if (questionSearch) {
    // Tắt autocomplete của trình duyệt
    questionSearch.setAttribute("autocomplete", "off");
    questionSearch.addEventListener("input", function () {
      searchQuestions(questionSearch.value);
    });
    // Khi focus vào input sẽ hiển thị tất cả câu hỏi chưa chọn
    questionSearch.addEventListener("focus", function () {
      // Hiển thị tất cả câu hỏi chưa chọn
      currentSearchResults = (listQuestion || []).filter(function (q) {
        let isSelected = selectedQuestionIds.some(function (id) {
          return id === q.id;
        });
        return !isSelected;
      });
      updateSearchResults();
    });
  }

  // Chọn tất cả kết quả tìm kiếm ca sáng
  const selectAllBtn = document.getElementsByClassName("btn-select-all")[0];
  if (selectAllBtn) {
    selectAllBtn.addEventListener("click", function () {
      if (!searchResults) return;
      const checkboxes =
        searchResults.getElementsByClassName("question-checkbox");
      for (let i = 0; i < checkboxes.length; i++) {
        if (!checkboxes[i].checked) {
          checkboxes[i].checked = true;
          let id = checkboxes[i].getAttribute("data-id");
          if (
            !selectedQuestionIds.some(function (qid) {
              return qid === id;
            })
          ) {
            selectedQuestionIds.push(id);
          }
        }
      }
      updateSelectedQuestions();
    });
  }

  // Bỏ chọn tất cả ca sáng
  const deselectAllBtn = document.getElementsByClassName("btn-deselect-all")[0];
  if (deselectAllBtn) {
    deselectAllBtn.addEventListener("click", function () {
      if (!searchResults) return;
      const checkboxes =
        searchResults.getElementsByClassName("question-checkbox");
      for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
      }
      selectedQuestionIds = [];
      updateSelectedQuestions();
    });
  }

  // Thêm hoặc bỏ câu hỏi đã chọn ca sáng
  if (searchResults) {
    searchResults.addEventListener("change", function (e) {
      if (e.target.className === "question-checkbox") {
        let id = e.target.getAttribute("data-id");
        if (e.target.checked) {
          if (
            !selectedQuestionIds.some(function (qid) {
              return qid === id;
            })
          ) {
            selectedQuestionIds.push(id);
          }
        } else {
          let newArray = [];
          for (let i = 0; i < selectedQuestionIds.length; i++) {
            if (selectedQuestionIds[i] !== id) {
              newArray.push(selectedQuestionIds[i]);
            }
          }
          selectedQuestionIds = newArray;
        }
        updateSelectedQuestions();
      }
    });
  }

  // Xử lý sự kiện cho bảng
  const examTable = document.querySelector("#Exam-Question .admin-table");
  if (examTable) {
    examTable.addEventListener("click", async function (e) {
      let button = e.target;
      if (button.tagName !== "BUTTON") {
        button = button.parentElement;
        if (button.tagName !== "BUTTON") return;
      }
      let row = button;
      for (let i = 0; i < 3; i++) {
        row = row.parentElement;
        if (row.tagName === "TR") break;
      }
      if (row.tagName !== "TR") return;
      const examId = row.cells[0].textContent;
      let exam = null;
      for (let i = 0; i < (listExam || []).length; i++) {
        if (listExam[i].id === examId) {
          exam = listExam[i];
          break;
        }
      }
      if (button.className === "btn-edit") {
        if (exam && modal && modalTitle && examTitle && examDuration) {
          currentExamId = exam.id;
          modalTitle.textContent = "Chỉnh sửa bài thi";
          examTitle.value = exam.title;
          examDuration.value = exam.durationMinutes;
          selectedQuestionIds = [];
          for (let i = 0; i < exam.questionIds.length; i++) {
            selectedQuestionIds.push(exam.questionIds[i]);
          }
          selectedQuestionIds2 = [];
          for (let i = 0; i < exam.questionIds2.length; i++) {
            selectedQuestionIds2.push(exam.questionIds2[i]);
          }
          updateSelectedQuestions();
          updateSelectedQuestions2();
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
            let index = -1;
            for (let i = 0; i < listExam.length; i++) {
              if (listExam[i].id === examId) {
                index = i;
                break;
              }
            }
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
    addExamBtn.addEventListener("click", function () {
      if (modal && modalTitle && examForm) {
        modalTitle.textContent = "Thêm bài thi mới";
        examForm.reset();
        currentExamId = null;
        selectedQuestionIds = [];
        selectedQuestionIds2 = [];
        updateSelectedQuestions();
        updateSelectedQuestions2();
        modal.classList.add("show");
      }
    });
  }

  // Sự kiện đóng modal
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      if (modal) modal.classList.remove("show"); // Xóa class show khỏi modal, tức ẩn
    });
  }

  // Xử lý lưu đề thi
  if (examForm) {
    examForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const title = examTitle ? examTitle.value.trim() : "";
      const duration = examDuration ? parseInt(examDuration.value) : 0;
      if (isNaN(duration) || duration <= 0) {
        await Swal.fire("Lỗi!", "Thời gian phải lớn hơn 0 phút.", "error");
        return;
      }
      let isTitleDuplicate = false;
      for (let i = 0; i < (listExam || []).length; i++) {
        if (
          listExam[i].title.toLowerCase() === title.toLowerCase() &&
          listExam[i].id !== currentExamId
        ) {
          isTitleDuplicate = true;
          break;
        }
      }
      if (isTitleDuplicate) {
        await Swal.fire("Lỗi!", "Tên đề thi đã tồn tại.", "error");
        return;
      }
      const examData = {
        title: title,
        durationMinutes: duration,
        questionIds: selectedQuestionIds,
        questionIds2: selectedQuestionIds2,
        randomize: true,
        member: listAccount.length, // Cập nhật member từ số lượng tài khoản
        totalQuest: selectedQuestionIds.length + selectedQuestionIds2.length,
      };
      if (currentExamId && listExam) {
        let index = -1;
        for (let i = 0; i < listExam.length; i++) {
          if (listExam[i].id === currentExamId) {
            index = i;
            break;
          }
        }
        if (index !== -1) {
          listExam[index] = { id: currentExamId };
          for (let key in examData) {
            listExam[index][key] = examData[key];
          }
          await Swal.fire("Thành công!", "Đã cập nhật đề thi!", "success");
        }
      } else if (listExam) {
        examData.id = generateUniqueExamId();
        listExam.unshift(examData);
        await Swal.fire("Thành công!", "Đã thêm đề thi mới!", "success");
      }
      if (listExam) {
        localStorage.setItem("listExam", JSON.stringify(listExam));
      }
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
    examSearch.addEventListener("input", function () {
      const query = examSearch.value.toLowerCase();
      const filteredExams = (listExam || []).filter(function (exam) {
        return (
          exam.id.toLowerCase().indexOf(query) !== -1 ||
          exam.title.toLowerCase().indexOf(query) !== -1
        );
      });
      currentPage = 1;
      renderContent(filteredExams);
    });
  }

  // Sự kiện tìm kiếm ca chiều
  const questionSearch2 = document.getElementById("questionSearch2");
  if (questionSearch2) {
    // Tắt autocomplete của trình duyệt
    questionSearch2.setAttribute("autocomplete", "off");
    questionSearch2.addEventListener("input", function () {
      searchQuestions2(questionSearch2.value);
    });
    // Khi focus vào input sẽ hiển thị tất cả câu hỏi chưa chọn
    questionSearch2.addEventListener("focus", function () {
      currentSearchResults2 = (listQuestion || []).filter(function (q) {
        let isSelected = selectedQuestionIds2.some(function (id) {
          return id === q.id;
        });
        return !isSelected;
      });
      updateSearchResults2();
    });
  }

  // Chọn tất cả ca chiều
  const selectAllBtn2 = document.getElementsByClassName("btn-select-all2")[0];
  if (selectAllBtn2) {
    selectAllBtn2.addEventListener("click", function () {
      if (!searchResults2) return;
      const checkboxes =
        searchResults2.getElementsByClassName("question-checkbox");
      for (let i = 0; i < checkboxes.length; i++) {
        if (!checkboxes[i].checked) {
          checkboxes[i].checked = true;
          let id = checkboxes[i].getAttribute("data-id");
          if (
            !selectedQuestionIds2.some(function (qid) {
              return qid === id;
            })
          ) {
            selectedQuestionIds2.push(id);
          }
        }
      }
      updateSelectedQuestions2();
    });
  }

  // Bỏ chọn tất cả ca chiều
  const deselectAllBtn2 =
    document.getElementsByClassName("btn-deselect-all2")[0];
  if (deselectAllBtn2) {
    deselectAllBtn2.addEventListener("click", function () {
      if (!searchResults2) return;
      const checkboxes =
        searchResults2.getElementsByClassName("question-checkbox");
      for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
      }
      selectedQuestionIds2 = [];
      updateSelectedQuestions2();
    });
  }

  // Thêm hoặc bỏ câu hỏi đã chọn ca chiều
  if (searchResults2) {
    searchResults2.addEventListener("change", function (e) {
      if (e.target.className === "question-checkbox") {
        let id = e.target.getAttribute("data-id");
        if (e.target.checked) {
          if (
            !selectedQuestionIds2.some(function (qid) {
              return qid === id;
            })
          ) {
            selectedQuestionIds2.push(id);
          }
        } else {
          let newArray = [];
          for (let i = 0; i < selectedQuestionIds2.length; i++) {
            if (selectedQuestionIds2[i] !== id) {
              newArray.push(selectedQuestionIds2[i]);
            }
          }
          selectedQuestionIds2 = newArray;
        }
        updateSelectedQuestions2();
      }
    });
  }

  // Khởi tạo bảng
  updateExamTable();
});
