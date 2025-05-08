const startBtn = document.getElementById("start-btn");

startBtn.addEventListener('click', () => {
    setTimeout(() => {
        location.href = "doExam.html";
    }, 500);
});
