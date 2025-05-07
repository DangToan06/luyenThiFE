// http://127.0.0.1:5501/page/doExam.html

const startBtn = document.getElementById("start-btn");

startBtn.addEventListener('click', () => {
    setTimeout(() => {
        location.href = "http://127.0.0.1:5501/page/doExam.html";
    }, 1000);
});