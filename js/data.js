let Account = {};
const listQuestion = JSON.parse(localStorage.getItem("listQuestion")) || [
    {
        id: 1,
        question: "Câu hỏi 1",
        answer: "Đáp án 1",
    },
    {
        id: 2,
        question: "Câu hỏi 2",
        answer: "Đáp án 2",
    },
    {
        id: 3,
        question: "Câu hỏi 3",
        answer: "Đáp án 3",
    },
];
