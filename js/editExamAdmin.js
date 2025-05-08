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
  
    // Hiển thị modal thêm mới
    const addExamBtn = document.querySelector("#Exam-Question .btn-add");
    if (addExamBtn) {
      addExamBtn.addEventListener("click", function () {
        modalTitle.textContent = "Thêm bài thi mới";
        examForm.reset();
        currentExamId = null;
        modal.classList.add("show");
      });
    }
  
    // Đóng modal
    closeBtn.addEventListener("click", function () {
      modal.classList.remove("show");
    });
  
    // Xử lý submit form
    examForm.addEventListener("submit", function (e) {
      e.preventDefault();
  
      const examData = {
        title: examTitle.value,
        durationMinutes: parseInt(examDuration.value),
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
        // Thêm đề thi mới với ID random
        examData.id = generateUniqueExamId();
        listExam.push(examData);
        Swal.fire({
          icon: "success",
          title: "Thành công!",
          text: "Đã thêm đề thi mới thành công!",
        });
      }
  
      // Lưu vào localStorage
      localStorage.setItem("listExam", JSON.stringify(listExam));
  
      // Đóng modal và cập nhật bảng
      modal.classList.remove("show");
      updateExamTable();
    });
  
    // Xử lý nút Edit trong phần Exam Question
    const examSection = document.getElementById("Exam-Question");
    if (examSection) {
      examSection.addEventListener("click", function (e) {
        if (e.target.classList.contains("btn-edit")) {
          const row = e.target.closest("tr");
          const examId = row.querySelector("td:first-child").textContent;
          const exam = listExam.find((exam) => exam.id === examId);
  
          if (exam) {
            currentExamId = exam.id;
            modalTitle.textContent = "Chỉnh sửa bài thi";
            examTitle.value = exam.title;
            examDuration.value = exam.durationMinutes;
            modal.classList.add("show");
          }
        }
      });
    }
  
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
  
    // Hàm cập nhật bảng đề thi
    function updateExamTable() {
      const tbody = document.getElementById("examTableBody");
      if (!tbody) return;
  
      tbody.innerHTML = "";
  
      listExam.forEach((exam) => {
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
  
    // Cập nhật bảng khi trang được tải
    updateExamTable();
  });
  