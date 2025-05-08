document.addEventListener("DOMContentLoaded", function () {
  const modalHTML = `
        <div class="modal-exam" id="examModal">
            <div class="modal-exam-content">
                <h3 id="modalTitle">Thêm bài thi mới</h3>
                <form class="modal-exam-form" id="examForm">
                    <div class="form-group">
                        <label for="examTitle">Title:</label>
                        <input type="text" id="examTitle" placeholder="Tên đề thi" required>
                    </div>
                    <div class="form-group">
                        <label for="examDuration">Duration:</label>
                        <input type="number" id="examDuration" placeholder="Thời gian" required>
                    </div>
                    <div class="form-group">
                        <label for="examQuestions">Questions:</label>
                        <div class="question-list" id="questionList">
                            <!-- Danh sách câu hỏi sẽ được thêm vào đây -->
                        </div>
                        <button type="button" class="btn-add-question" id="addQuestionBtn">Thêm câu hỏi</button>
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

  // Khởi tạo các biến
  const modal = document.getElementById("examModal");
  const modalTitle = document.getElementById("modalTitle");
  const examForm = document.getElementById("examForm");
  const examTitle = document.getElementById("examTitle");
  const examDuration = document.getElementById("examDuration");
  const closeBtn = modal.querySelector(".btn-close-exam");
  const searchInput = document.getElementById("searchExam");
  const questionList = document.getElementById("questionList");
  const addQuestionBtn = document.getElementById("addQuestionBtn");
  let currentExamId = null;

  // Hàm tạo ID random không trùng
  function generateUniqueExamId() {
    let newId;
    do {
      const randomNum = Math.floor(Math.random() * 1000); // từ 000 đến 999
      const randomStr = randomNum.toString().padStart(3, "0");
      newId = "exam" + randomStr;
    } while (listExam.some((exam) => exam.id === newId));
    return newId;
  }

  // Hàm tìm kiếm bài thi
  function searchExams(keyword) {
    const filteredExams = listExam.filter(exam => 
      exam.title.toLowerCase().includes(keyword.toLowerCase()) ||
      exam.id.toLowerCase().includes(keyword.toLowerCase())
    );
    updateExamTable(filteredExams);
  }

  // Thêm sự kiện tìm kiếm
  searchInput.addEventListener("input", function(e) {
    searchExams(e.target.value);
  });

  // Hàm hiển thị danh sách câu hỏi
  function displayQuestions(questionIds) {
    questionList.innerHTML = "";
    questionIds.forEach(id => {
      const question = listQuestion.find(q => q.id === id);
      if (question) {
        const questionItem = document.createElement("div");
        questionItem.className = "question-item";
        questionItem.innerHTML = `
          <span>${question.content}</span>
          <button type="button" class="btn-remove-question" data-id="${id}">Xóa</button>
        `;
        questionList.appendChild(questionItem);
      }
    });
  }

  // Thêm sự kiện cho nút thêm câu hỏi
  addQuestionBtn.addEventListener("click", function() {
    const availableQuestions = listQuestion.filter(q => 
      !currentExamId || !listExam.find(e => e.id === currentExamId)?.questionIds.includes(q.id)
    );

    if (availableQuestions.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Thông báo",
        text: "Không còn câu hỏi nào để thêm!",
      });
      return;
    }

    const questionOptions = availableQuestions.map(q => ({
      text: q.content,
      value: q.id
    }));

    Swal.fire({
      title: "Chọn câu hỏi",
      input: "select",
      inputOptions: Object.fromEntries(
        questionOptions.map(q => [q.value, q.text])
      ),
      showCancelButton: true,
      confirmButtonText: "Thêm",
      cancelButtonText: "Hủy"
    }).then((result) => {
      if (result.isConfirmed) {
        const exam = listExam.find(e => e.id === currentExamId);
        if (exam) {
          exam.questionIds.push(result.value);
          displayQuestions(exam.questionIds);
          exam.totalQuest = exam.questionIds.length;
          localStorage.setItem("listExam", JSON.stringify(listExam));
          updateExamTable();
        }
      }
    });
  });

  // Thêm sự kiện xóa câu hỏi
  questionList.addEventListener("click", function(e) {
    if (e.target.classList.contains("btn-remove-question")) {
      const questionId = e.target.dataset.id;
      const exam = listExam.find(e => e.id === currentExamId);
      if (exam) {
        exam.questionIds = exam.questionIds.filter(id => id !== questionId);
        exam.totalQuest = exam.questionIds.length;
        displayQuestions(exam.questionIds);
        localStorage.setItem("listExam", JSON.stringify(listExam));
        updateExamTable();
      }
    }
  });

  // Cập nhật hàm hiển thị modal chỉnh sửa
  function showEditModal(exam) {
    currentExamId = exam.id;
    modalTitle.textContent = "Chỉnh sửa bài thi";
    examTitle.value = exam.title;
    examDuration.value = exam.durationMinutes;
    displayQuestions(exam.questionIds);
    modal.classList.add("show");
  }

  // Cập nhật hàm hiển thị modal thêm mới
  function showAddModal() {
    currentExamId = null;
    modalTitle.textContent = "Thêm bài thi mới";
    examForm.reset();
    questionList.innerHTML = "";
    modal.classList.add("show");
  }

  // Cập nhật hàm cập nhật bảng
  function updateExamTable(exams = listExam) {
    const tbody = document.getElementById("examTableBody");
    if (!tbody) return;

    tbody.innerHTML = "";

    exams.forEach((exam) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${exam.id}</td>
                <td>${exam.title}</td>
                <td>${exam.durationMinutes} phút</td>
                <td>${exam.totalQuest}</td>
                <td class="action-buttons">
                    <button class="btn-edit">Edit</button>
                    <button class="btn-delete">Delete</button>
                </td>
            `;
      tbody.appendChild(row);
    });
  }

  // Cập nhật các sự kiện
  const addExamBtn = document.querySelector("#Exam-Question .btn-add");
  if (addExamBtn) {
    addExamBtn.addEventListener("click", showAddModal);
  }

  closeBtn.addEventListener("click", function () {
    modal.classList.remove("show");
  });

  const examSection = document.getElementById("Exam-Question");
  if (examSection) {
    examSection.addEventListener("click", function (e) {
      if (e.target.classList.contains("btn-edit")) {
        const row = e.target.closest("tr");
        const examId = row.querySelector("td:first-child").textContent;
        const exam = listExam.find((exam) => exam.id === examId);
        if (exam) {
          showEditModal(exam);
        }
      }
    });
  }

  examForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = examTitle.value.trim();
    const duration = parseInt(examDuration.value.trim());

    if (!title || isNaN(duration)) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Vui lòng nhập đầy đủ tiêu đề và thời gian làm bài.",
      });
      return;
    }

    const examData = {
      title: title,
      durationMinutes: duration,
      questionIds: [],
      randomize: true,
      member: 0,
      totalQuest: 0,
    };

    if (currentExamId) {
      // Cập nhật đề thi
      const examIndex = listExam.findIndex((exam) => exam.id === currentExamId);
      if (examIndex !== -1) {
        listExam[examIndex] = {
          ...listExam[examIndex],
          title: examData.title,
          durationMinutes: examData.durationMinutes,
        };
        Swal.fire({
          icon: "success",
          title: "Thành công!",
          text: "Đã cập nhật đề thi thành công!",
        });
      }
    } else {
      examData.id = generateUniqueExamId();
      listExam.unshift(examData);
      Swal.fire({
        icon: "success",
        title: "Thành công!",
        text: "Đã thêm đề thi mới thành công!",
      });
    }

    localStorage.setItem("listExam", JSON.stringify(listExam));
    modal.classList.remove("show");
    updateExamTable();
  });

  // Xử lý nút Delete trong phần Exam Question
  if (examSection) {
    examSection.addEventListener("click", function (e) {
      if (e.target.classList.contains("btn-delete")) {
        const row = e.target.closest("tr");
        const examId = row.querySelector("td:first-child").textContent;

        Swal.fire({
          title: "Xác nhận xóa?",
          text: "Bạn không thể hoàn tác sau khi xóa!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Xóa",
          cancelButtonText: "Hủy",
        }).then((result) => {
          if (result.isConfirmed) {
            const examIndex = listExam.findIndex((exam) => exam.id === examId);
            if (examIndex !== -1) {
              listExam.splice(examIndex, 1);
              localStorage.setItem("listExam", JSON.stringify(listExam));
              updateExamTable();
              Swal.fire("Đã xóa!", "Đề thi đã được xóa thành công.", "success");
            }
          }
        });
      }
    });
  }

  // Cập nhật bảng khi trang được tải
  updateExamTable();
});
