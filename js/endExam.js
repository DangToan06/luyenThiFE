let listQuesDo = JSON.parse(localStorage.getItem("listSelectedQuestion"));
let listSelectedAws = JSON.parse(localStorage.getItem("listSelectedAws"));
let questionTrue = 0;

searchTrueQues()

function searchTrueQues() {
    listQuesDo.forEach((element, i) => {
        // Tìm đối tượng đã chọn theo ID
        const answerObj = listSelectedAws.find(ans => ans.id === element.id);
        element.options.forEach(opt => {
            // Nếu người dùng đã chọn câu này và đáp án là option hiện tại
            if (answerObj && answerObj.choice === opt) {
                if (opt === element.correctAnswer) {
                    questionTrue++;
                }
            }
        });
    });
}

//Tính điểm bài làm
totalResult = Math.floor((100 / (listQuesDo.length)) * questionTrue);
document.getElementById("totalResu").textContent = `Kết Quả ${totalResult}/100`;
// localStorage.setItem("totalExam", JSON.stringify(totalResult));


// xem kết quả đúng sai

document.getElementById("btn-check-result").addEventListener('click', () => {
    location.href = "checkResult.html";
});

let btnShowTotal = document.getElementById("btn-show-total");
let btnShowResult = document.getElementById("btn-show-result");
let showTotal = document.getElementById('show-total');
let showResult = document.getElementById("show-result");

btnShowTotal.addEventListener('click', () => {
    btnShowResult.classList.remove("active");
    btnShowTotal.classList.add("active");
    showTotal.style.display = "block";
    showResult.style.display = "none";
});

btnShowResult.addEventListener('click', () => {
    btnShowResult.classList.add("active");
    btnShowTotal.classList.remove("active");
    showTotal.style.display = "none";
    showResult.style.display = "block";
});

//Biểu đồ tính điểm

function drawCircle(score, total) {
    const canvas = document.getElementById("scoreCanvas");
    const ctx = canvas.getContext("2d");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 60;
    const startAngle = -0.5 * Math.PI;
    const percent = score / total;
    const endAngle = startAngle + 2 * Math.PI * percent;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "#eee";
    ctx.lineWidth = 10;
    ctx.stroke();

    // Foreground progress
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.strokeStyle = "#BC2228"; // màu đỏ
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.stroke();

    document.getElementById("scoreText").textContent = `${score}/${total}`;
}

drawCircle(totalResult, 100);

// Nút quay lại trang chủ
document.getElementById("go-home-page").addEventListener('click', () => {
    homePage()
});

//Nút làm lại bài kiểm tra
document.getElementById("retake-th-exam").addEventListener('click', () => {
    location.href = "doExam.html";
});