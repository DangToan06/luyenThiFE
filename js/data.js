const listAccount = JSON.parse(localStorage.getItem("listAccount")) || [
    {
        id: 1,
        nameUser: "toàn",
        date: "2025-05-15",
        email: "toan@gmail.com",
        password: "11111111",
        status: false,
        avata: "https://i.pinimg.com/474x/95/2f/a5/952fa53028d4770ddea0333d27550f8f.jpg"
    },
    {
        id: 2,
        nameUser: "quang",
        date: "2025-05-15",
        email: "quangngu@gmail.com",
        password: "22222222",
        status: true,
        avata: "https://i.pinimg.com/474x/95/2f/a5/952fa53028d4770ddea0333d27550f8f.jpg"
    },
    {
        id: 3,
        nameUser: "quangbeo",
        date: "2025-05-15",
        email: "quangbeo@gmail.com",
        password: "33333333",
        status: true,
        avata: "https://i.pinimg.com/474x/95/2f/a5/952fa53028d4770ddea0333d27550f8f.jpg"
    }
];



const listQuestion = JSON.parse(localStorage.getItem("listQuestion")) || [
    {
        id: "1",
        content: "HTML là viết tắt của cụm từ nào?",
        options: ["Hyper Trainer Marking Language", "Hyper Text Markup Language", "Hyper Text Marketing Language", "Hyper Tool Markup Language"],
        correctAnswer: "Hyper Text Markup Language",
    },
    {
        id: "2",
        content: "Thẻ HTML nào dùng để xuống dòng?",
        options: ["<lb>", "<br>", "<break>", "<line>"],
        correctAnswer: "<br>",
    },
    {
        id: "3",
        content: "Thẻ nào dùng để tạo liên kết trong HTML?",
        options: ["<a>", "<link>", "<href>", "<url>"],
        correctAnswer: "<a>",
    },
    {
        id: "4",
        content: "Thuộc tính nào trong CSS dùng để điều chỉnh cỡ chữ?",
        options: ["font-style", "text-size", "font-size", "text-style"],
        correctAnswer: "font-size",
    },
    {
        id: "5",
        content: "CSS là viết tắt của cụm từ nào?",
        options: ["Computer Style Sheets", "Colorful Style Sheets", "Cascading Style Sheets", "Creative Style Sheets"],
        correctAnswer: "Cascading Style Sheets",
    },
    {
        id: "6",
        content: "Thẻ HTML nào dùng để khai báo CSS nội tuyến?",
        options: ["<style>", "<css>", "<script>", "<design>"],
        correctAnswer: "<style>",
    },
    {
        id: "7",
        content: "Thuộc tính nào trong CSS dùng để đổi màu nền?",
        options: ["color", "background-color", "bgcolor", "text-color"],
        correctAnswer: "background-color",
    },
    {
        id: "8",
        content: "JavaScript được sử dụng để làm gì trên trang web?",
        options: ["Tạo hiệu ứng động", "Thiết kế bố cục", "Tạo cơ sở dữ liệu", "Thêm nội dung văn bản"],
        correctAnswer: "Tạo hiệu ứng động",
    },
    {
        id: "9",
        content: "Câu lệnh nào dùng để hiển thị hộp thoại cảnh báo trong JavaScript?",
        options: ["alert()", "prompt()", "confirm()", "show()"],
        correctAnswer: "alert()",
    },
    {
        id: "10",
        content: "Trong HTML, thẻ nào dùng để tạo đoạn văn?",
        options: ["<h1>", "<div>", "<p>", "<span>"],
        correctAnswer: "<p>",
    },
    {
        id: "11",
        content: "Trong JavaScript, từ khóa nào được dùng để khai báo hàm?",
        options: ["function", "var", "let", "const"],
        correctAnswer: "function",
    },
    {
        id: "12",
        content: "Thẻ nào được dùng để chèn hình ảnh trong HTML?",
        options: ["<img>", "<image>", "<src>", "<pic>"],
        correctAnswer: "<img>",
    },
    {
        id: "13",
        content: "Cặp thẻ nào dùng để tạo danh sách không thứ tự trong HTML?",
        options: ["<ul></ul>", "<ol></ol>", "<li></li>", "<list></list>"],
        correctAnswer: "<ul></ul>",
    },
    {
        id: "14",
        content: "Thuộc tính nào của CSS dùng để thay đổi màu chữ?",
        options: ["text-color", "font-color", "color", "background-color"],
        correctAnswer: "color",
    },
    {
        id: "15",
        content: "Câu lệnh nào dùng để lặp lại một đoạn mã trong JavaScript?",
        options: ["if", "for", "switch", "case"],
        correctAnswer: "for",
    },
    {
        id: "16",
        content: "Sự kiện nào được gọi khi người dùng nhấn nút chuột?",
        options: ["onchange", "onclick", "onhover", "onsubmit"],
        correctAnswer: "onclick",
    },
    {
        id: "17",
        content: "Trong CSS, thuộc tính nào dùng để tạo khoảng cách giữa các phần tử trong một container?",
        options: ["padding", "margin", "border", "height"],
        correctAnswer: "margin",
    },
    {
        id: "18",
        content: "JavaScript thường được chèn trong cặp thẻ nào?",
        options: ["<javascript>", "<js>", "<script>", "<code>"],
        correctAnswer: "<script>",
    },
    {
        id: "19",
        content: "Hàm nào dùng để lấy phần tử theo ID trong JavaScript?",
        options: ["getElementByClassName", "querySelectorAll", "getElementById", "getElementsByName"],
        correctAnswer: "getElementById",
    },
    {
        id: "20",
        content: "Thuộc tính nào trong CSS dùng để bo tròn các góc của phần tử?",
        options: ["border-style", "border-color", "border-radius", "corner-round"],
        correctAnswer: "border-radius",
    },
    {
        id: "21",
        content: "Thẻ nào được dùng để tạo tiêu đề trong HTML?",
        options: ["<title>", "<head>", "<h1> đến <h6>", "<p>"],
        correctAnswer: "<h1> đến <h6>",
    },
    {
        id: "22",
        content: "Thuộc tính nào trong CSS dùng để tạo viền cho phần tử?",
        options: ["outline", "border", "box", "frame"],
        correctAnswer: "border",
    },
    {
        id: "23",
        content: "Từ khóa nào dùng để khai báo biến trong JavaScript?",
        options: ["int", "let", "define", "create"],
        correctAnswer: "let",
    },
    {
        id: "24",
        content: "Đâu là công dụng của CSS?",
        options: ["Tạo hiệu ứng động", "Thay đổi bố cục trang", "Thiết kế giao diện đẹp hơn", "Tất cả các ý trên đều đúng"],
        correctAnswer: "Tất cả các ý trên đều đúng",
    },
    {
        id: "25",
        content: "Thẻ nào dùng để tạo một biểu mẫu (form) trong HTML?",
        options: ["<input>", "<form>", "<label>", "<fieldset>"],
        correctAnswer: "<form>",
    },
    {
        id: "26",
        content: "Cách nào để áp dụng CSS vào HTML?",
        options: ["Viết trực tiếp trong thẻ", "Dùng thẻ <style>", "Dùng file .css ngoài", "Tất cả các cách trên đều đúng"],
        correctAnswer: "Tất cả các cách trên đều đúng",
    },
    {
        id: "27",
        content: "Lệnh nào dùng để kiểm tra điều kiện trong JavaScript?",
        options: ["switch", "loop", "if", "check"],
        correctAnswer: "if",
    },
    {
        id: "28",
        content: "Thẻ nào trong HTML dùng để nhúng video?",
        options: ["<media>", "<movie>", "<video>", "<stream>"],
        correctAnswer: "<video>",
    },
    {
        id: "29",
        content: "Cặp thẻ nào được dùng để tạo bảng trong HTML?",
        options: ["<table></table>", "<grid></grid>", "<div></div>", "<section></section>"],
        correctAnswer: "<table></table>",
    },
    {
        id: "30",
        content: "Thuộc tính nào trong CSS giúp căn giữa phần tử theo chiều ngang?",
        options: ["margin: auto", "text-align: center", "center: true", "align: middle"],
        correctAnswer: "margin: auto",
    },
    {
        id: "31",
        content: "Trong JavaScript, lệnh nào dùng để lặp qua mảng?",
        options: ["for", "forEach", "while", "Tất cả các lệnh trên đều dùng được"],
        correctAnswer: "Tất cả các lệnh trên đều dùng được",
    },
    {
        id: "32",
        content: "Đâu là một bộ chọn hợp lệ trong CSS?",
        options: [".box", "#main", "div", "Cả 3 đáp án trên"],
        correctAnswer: "Cả 3 đáp án trên",
    },
    {
        id: "33",
        content: "Thẻ nào dùng để hiển thị văn bản in đậm trong HTML?",
        options: ["<strong>", "<bold>", "<b>", "Cả <strong> và <b>"],
        correctAnswer: "Cả <strong> và <b>",
    },
    {
        id: "34",
        content: "Hàm nào trong JavaScript dùng để chuyển chuỗi sang số nguyên?",
        options: ["parseString()", "stringToInt()", "parseInt()", "Number()"],
        correctAnswer: "parseInt()",
    },
    {
        id: "35",
        content: "Trong JavaScript, từ khóa nào được dùng để khai báo biến không thể thay đổi giá trị?",
        options: ["let", "var", "const", "function"],
        correctAnswer: "const",
    },
    {
        id: "36",
        content: "Thuộc tính nào trong CSS dùng để tạo bóng cho phần tử?",
        options: ["box-shadow", "text-shadow", "shadow", "Cả hai đáp án đầu"],
        correctAnswer: "Cả hai đáp án đầu",
    },
    {
        id: "37",
        content: "Sự kiện nào xảy ra khi người dùng thay đổi giá trị trong input?",
        options: ["onclick", "onchange", "oninput", "onsubmit"],
        correctAnswer: "onchange",
    },
    {
        id: "38",
        content: "Thuộc tính nào trong HTML được dùng để đặt văn bản thay thế cho ảnh?",
        options: ["alt", "title", "src", "text"],
        correctAnswer: "alt",
    },
    {
        id: "39",
        content: "Lệnh nào dùng để kiểm tra độ dài của một chuỗi trong JavaScript?",
        options: ["length()", "size()", "length", "count()"],
        correctAnswer: "length",
    },
    {
        id: "40",
        content: "Câu lệnh nào dùng để in ra console trong JavaScript?",
        options: ["print()", "console.print()", "log()", "console.log()"],
        correctAnswer: "console.log()",
    }
];

const listExam = JSON.parse(localStorage.getItem("listExam")) || [
    {
        id: "exam001",
        title: "Đề thi số 1",
        questionIds: [
            "q101",
            "q102",
            "q103",
            "q104",
            "q105",
            "q106",
            "q107",
            "q108",
            "q109",
            "q101"
        ], // thêm id câu hỏi vào đây
        durationMinutes: 30, // thời gian làm bài (phút)
        randomize: true, // có ngẫu nhiên câu hỏi hay không
        member: 1024, // tổng số học viên 
        totalQuest: 10, // tổng số câu hỏi có trong đề thi
    },
    {
        id: "exam002",
        title: "Đề thi số 2",
        questionIds: [
            "q111",
            "q112",
            "q113",
            "q114",
            "q115",
            "q116",
            "q117",
            "q118",
            "q119",
            "q120"
        ],
        durationMinutes: 30,
        randomize: true,
        member: 1024,
        totalQuest: 10,
    },
    {
        id: "exam003",
        title: "Đề thi số 3",
        questionIds: [
            "q201",
            "q202",
            "q203",
            "q204",
            "q205",
            "q206",
            "q207",
            "q208",
            "q209",
            "q201"
        ],
        durationMinutes: 30,
        randomize: true,
        member: 1024,
        totalQuest: 20,
    },
    {
        id: "exam004",
        title: "Đề thi số 4",
        questionIds: [
            "q211",
            "q212",
            "q213",
            "q214",
            "q215",
            "q216",
            "q217",
            "q218",
            "q219",
            "q220"
        ],
        durationMinutes: 30,
        randomize: true,
        member: 1024,
        totalQuest: 20,
    },
    {
        id: "exam005",
        title: "Đề thi số 5",
        questionIds: [],
        durationMinutes: 30,
        randomize: true,
        member: 1024,
        totalQuest: 10,
    },
    {
        id: "exam006",
        title: "Đề thi số 6",
        questionIds: [],
        durationMinutes: 30,
        randomize: true,
        member: 1024,
        totalQuest: 10,
    },
    {
        id: "exam007",
        title: "Đề thi số 7",
        questionIds: [],
        durationMinutes: 30,
        randomize: true,
        member: 1024,
        totalQuest: 10,
    }
];
const listArticle = [
    {
        id: 1,
        title: "Authentication & Authorization",
        date: "2025-05-15",
        content: "Chào bạn! Nếu bạn đã là học viên khóa Pro của Rikkei Academy...",
        author: "Admin",
        time: "10"
    },
    {
        id: 2,
        title: "ReactJS Best Practices",
        date: "2025-05-10",
        content: "Các best practices trong ReactJS giúp bạn viết code tốt hơn...",
        author: "Admin",
        time: "15"
    }
];

// localStorage.setItem("listExam", JSON.stringify(listExam))
