let Account = {};
const listQuestion = JSON.parse(localStorage.getItem("listQuestion")) || [
    {
        id: "q001",
        content: "What is the capital of France?", // nội dung câu hỏi
        options: ["Berlin", "Paris", "Madrid", "Rome"], // các lựa chọn cho câu hỏi
        correctAnswer: "Paris", // câu trả lời đúng
    }
];
const listExam = JSON.parse(localStorage.getItem("listExam")) || [
    {
        id: "exam001",
        title: "Geography Test - Level 1",
        questionIds: [], // thêm id câu hỏi vào đây
        durationMinutes: 30, // thời gian làm bài (phút)
        randomize: true // có ngẫu nhiên câu hỏi hay không
    }
];
