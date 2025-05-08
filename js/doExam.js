let listQues = JSON.parse(localStorage.getItem("listQuestion"));

let currentIndex = 0;
let listSelectedQuestion = [];
let listSelectedAws = [];
// let questions = document.querySelectorAll(".question");
let questionButtons = document.querySelectorAll("#number-question button");

// Chức năng hiện thị câu hỏi user chọn
// function awsChoice() {
//     document.querySelectorAll("#class-answer input[type='radio']").forEach(radio => {

//         radio.addEventListener("change", function () {
//             let allLabels = this.closest("#class-answer").querySelectorAll("label");

//             allLabels.forEach(label => {
//                 label.style.backgroundColor = "";
//                 label.style.fontWeight = "normal";
//                 label.style.color = "";
//             });

//             let selectedLabel = this.closest("label");
//             selectedLabel.style.backgroundColor = " #BC2228";
//             selectedLabel.style.color = " #fff";
//             selectedLabel.style.fontWeight = "500";

//         });
//     });
// }

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
    if (currentIndex < 0) {
        currentIndex = questionButtons.length - 1;
        renderQuestion(currentIndex);
        questionButtons[currentIndex].setAttribute("id", "working-question");
    } else if (currentIndex < questionButtons.length) {
        questionButtons[currentIndex].setAttribute("id", "working-question");
    }
    renderQuestion(currentIndex);

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
        setTimeout(() => {
            addAwsAtLocal()
            location.href = "http://127.0.0.1:5501/page/Endexam.html"
        }, 1000);
    }
}

const timerInterval = setInterval(updateTimer, 1000);
updateTimer();

//Hiển thị câu hỏi

renderQuestion(currentIndex);

function renderQuestion(index) {
    const q = listQues[index];
    let checked;
    html = `
        <p id="question">Câu số ${index + 1}</p>
        <p id="topic">Front-end</p>
        <p id="topic">Lập trình</p>
        <p id="name-question">${q.content}</p>
        <ul id="class-answer">
    `;
    q.options.forEach((opt, i) => {
        const escaped = escapeHTML(opt);

        for (let i = 0; i < listSelectedAws.length; i++) {
            if (listSelectedAws[i].choice === opt) {
                checked = "checked";
                break;
            } else {
                checked = "";
            }
        }

        const style = checked ? 'style="background-color: #BC2228; color: #fff; font-weight: 500;"' : "";

        // listSelectedQuestion.forEach( e => {
        //     choiceAws = e === 
        // });
        // const checked = selectedAnswer === opt ? "checked" : "";

        html += `<label ${style}><input type="radio" name="question${index}" ${checked} value="${escaped}"><span>${escaped}</span></label>`;


    });
    html += `</ul>`;
    document.getElementById("containerQuestion").innerHTML = html;

    awsChoice();


    // console.log(listQues[index]);


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
// let answers = {};
let listAws = [];

// function bindAnswerEvents() {
//     // Mảng tạm lưu các câu đã làm
//     document.querySelectorAll('input[type="radio"]').forEach((radio) => {
//         radio.addEventListener('change', (e) => {
//             questionButtons[currentIndex].setAttribute("class", "question-selected");
//             const selectedValue = e.target.value;
//             listAws.push(listQues[currentIndex])
//             // Lọc ra những câu bị trùng lặp trong mnagr tạm và chuyênr lại về thành mảng
//             listSelectedQuestion = [...new Set(listAws)];
//             listSelectedAws[currentIndex] = selectedValue;
//             console.log(listSelectedQuestion);
//             console.log(listSelectedAws);

//         });
//     });
// }

function bindAnswerEvents() {
    document.querySelectorAll('input[type="radio"]').forEach((radio) => {
      radio.addEventListener('change', (e) => {
        questionButtons[currentIndex].setAttribute("class", "question-selected");

        //Lưu câu hỏi đxa làm
        listAws.push(listQues[currentIndex]);
        listSelectedQuestion = [...new Set(listAws)];

  
        const selectedValue = e.target.value;
        const questionId = listQues[currentIndex].id;
  
        // Kiểm tra xem câu hỏi đã tồn tại trong listSelectedAws chưa
        const existingIndex = listSelectedAws.findIndex(item => item.id === questionId);
  
        if (existingIndex !== -1) {
          // Nếu đã tồn tại thì cập nhật đáp án
          listSelectedAws[existingIndex].choice = selectedValue;
        } else {
          // Nếu chưa có thì thêm mới
          listSelectedAws.push({ id: questionId, choice: selectedValue });
        }
  
        console.log(listSelectedAws);
      });
    });
  }

// Lưu các đáp án vừa làm trên localStorage

function addAwsAtLocal() {
    localStorage.setItem("listSelectedQuestion", JSON.stringify(listSelectedQuestion));
    localStorage.setItem("listSelectedAws", JSON.stringify(listSelectedAws));
}


//nút nộp Bài

const btnSubmit = document.getElementById("internal-article");

btnSubmit.addEventListener('click', () => {
    console.log(questionButtons.length);
    console.log(listSelectedQuestion.length);


    if (listSelectedQuestion.length === questionButtons.length) {
        setTimeout(() => {
            addAwsAtLocal();
            location.href = "http://127.0.0.1:5501/page/Endexam.html"
        }, 1000);
    } else {
        alert("So caau hoir banj lamf khoog du");
    }
});
