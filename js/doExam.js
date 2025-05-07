let listQues = JSON.parse(localStorage.getItem("listQuestion"));

let currentIndex = 0;

// let questions = document.querySelectorAll(".question");
let questionButtons = document.querySelectorAll("#number-question button");

// Chức năng hiện thị câu hỏi user chọn
function awsChoice() {
    document.querySelectorAll("#class-answer input[type='radio']").forEach(radio => {
        radio.addEventListener("change", function () {
            let allLabels = this.closest("#class-answer").querySelectorAll("label");

            allLabels.forEach(label => {
                label.style.backgroundColor = "";
                label.style.fontWeight = "normal";
                label.style.color = "";
            });

            let selectedLabel = this.closest("label");
            selectedLabel.style.backgroundColor = " #BC2228";
            selectedLabel.style.color = " #fff";
            selectedLabel.style.fontWeight = "500";
        });
    });
}

document.getElementById("next-question").addEventListener("click", () => {
    // questionButtons[currentIndex].setAttribute("id", "question-did");
    questionButtons[currentIndex].removeAttribute("id");
    currentIndex++;
    renderQuestion(currentIndex);
    if (currentIndex < questionButtons.length) {
        questionButtons[currentIndex].setAttribute("id", "working-question");
    } else {
        currentIndex = 0;
        renderQuestion(currentIndex);
        questionButtons[currentIndex].setAttribute("id", "working-question");
    }
});

document.getElementById("prev-question").addEventListener("click", () => {
    // questionButtons[currentIndex].setAttribute("id", "question-did");
    questionButtons[currentIndex].removeAttribute("id");
    currentIndex--;
    renderQuestion(currentIndex);
    if (currentIndex < 0) {
        currentIndex = questionButtons.length - 1;
        renderQuestion(currentIndex);
        questionButtons[currentIndex].setAttribute("id", "working-question");
    } else if (currentIndex < questionButtons.length) {
        questionButtons[currentIndex].setAttribute("id", "working-question");
    }
});

//Đếm thời gian

let totalTime = 25 * 60;

function updateTimer() {
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    document.getElementById("time").innerHTML =
        `<i class="fa-regular fa-clock" style="color: #ab1f24;"></i> ${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    if (totalTime > 0) {
        totalTime--;
    } else {
        clearInterval(timerInterval);
        alert("Hết giờ! Bài thi sẽ được nộp tự động.");
    }
}

const timerInterval = setInterval(updateTimer, 1000);
updateTimer();

//Hiển thị câu hỏi

renderQuestion(currentIndex);

function renderQuestion(index) {
    const q = listQues[index];
    html = `
        <p id="question">Câu số ${index + 1}</p>
        <p id="topic">Front-end</p>
        <p id="topic">Lập trình</p>
        <p id="name-question">${q.content}</p>
        <ul id="class-answer">
    `;
    q.options.forEach((opt, i) => {
        const escaped = escapeHTML(opt);
        html += `<label><input type="radio" name="question${index}" value="${escaped}"><span>${escaped}</span></label>`;
    });
    html += `</ul>`;
    document.getElementById("containerQuestion").innerHTML = html;
    awsChoice();
    bindAnswerEvents();
}

function escapeHTML(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}



//Lưu kết quả người dùng
let answers = {};

function bindAnswerEvents() {
  document.querySelectorAll('input[type="radio"]').forEach((radio) => {
    radio.addEventListener('change', (e) => {
      const questionDiv = e.target.closest('.question');
      const questionId = questionDiv.getAttribute('data-id');
      const selectedValue = e.target.value;
      questionButtons[currentIndex].setAttribute("class", "question-selected");
      answers[questionId] = selectedValue;
    });
  });
}



//nút nộp Bài

const btnSubmit = document.getElementById("internal-article");

btnSubmit.addEventListener('click', () => {
    setTimeout(() => {
        location.href = "http://127.0.0.1:5501/page/Endexam.html"
    }, 1000);
});
