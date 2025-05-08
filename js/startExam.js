const startBtn = document.getElementById("start-btn");

let examInPro = JSON.parse(localStorage.getItem("examInProgress"));

let questionInProgress = [];

startBtn.addEventListener('click', () => {
    setTimeout(() => {
        location.href = "doExam.html";
    }, 500);
});

document.getElementById("logo-head").addEventListener('click', () => {
    homePage();
});

document.getElementById("app-title").textContent = `${examInPro.title}`;

document.getElementById("breadcrumb").textContent = `${examInPro.title}`;

// console.log(examInPro.questionIds);

for (let i = 0; i < examInPro.questionIds.length; i++) {
    for (let j = 0; j < listQuestion.length; j++) {
        if(examInPro.questionIds[i] === listQuestion[j].id){
            questionInProgress.push(listQuestion[j]);
        }   
    }
}

localStorage.setItem("questionInProgress", JSON.stringify(questionInProgress));


