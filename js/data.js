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
        id: "q101",
        content: "HTML là viết tắt của cụm từ nào?",
        options: ["Hyper Trainer Marking Language", "Hyper Text Markup Language", "Hyper Text Marketing Language", "Hyper Tool Markup Language"],
        correctAnswer: "Hyper Text Markup Language",
    },
    {
        id: "q102",
        content: "Thẻ HTML nào dùng để xuống dòng?",
        options: ["<lb>", "<br>", "<break>", "<line>"],
        correctAnswer: "<br>",
    },
    {
        id: "q103",
        content: "Thẻ nào dùng để tạo liên kết trong HTML?",
        options: ["<a>", "<link>", "<href>", "<url>"],
        correctAnswer: "<a>",
    },
    {
        id: "q104",
        content: "Thuộc tính nào trong CSS dùng để điều chỉnh cỡ chữ?",
        options: ["font-style", "text-size", "font-size", "text-style"],
        correctAnswer: "font-size",
    },
    {
        id: "q105",
        content: "CSS là viết tắt của cụm từ nào?",
        options: ["Computer Style Sheets", "Colorful Style Sheets", "Cascading Style Sheets", "Creative Style Sheets"],
        correctAnswer: "Cascading Style Sheets",
    },
    {
        id: "q106",
        content: "Thẻ HTML nào dùng để khai báo CSS nội tuyến?",
        options: ["<style>", "<css>", "<script>", "<design>"],
        correctAnswer: "<style>",
    },
    {
        id: "q107",
        content: "Thuộc tính nào trong CSS dùng để đổi màu nền?",
        options: ["color", "background-color", "bgcolor", "text-color"],
        correctAnswer: "background-color",
    },
    {
        id: "q108",
        content: "JavaScript được sử dụng để làm gì trên trang web?",
        options: ["Tạo hiệu ứng động", "Thiết kế bố cục", "Tạo cơ sở dữ liệu", "Thêm nội dung văn bản"],
        correctAnswer: "Tạo hiệu ứng động",
    },
    {
        id: "q109",
        content: "Câu lệnh nào dùng để hiển thị hộp thoại cảnh báo trong JavaScript?",
        options: ["alert()", "prompt()", "confirm()", "show()"],
        correctAnswer: "alert()",
    },
    {
        id: "q110",
        content: "Trong HTML, thẻ nào dùng để tạo đoạn văn?",
        options: ["<h1>", "<div>", "<p>", "<span>"],
        correctAnswer: "<p>",
    },
    {
        id: "q111",
        content: "Trong JavaScript, từ khóa nào được dùng để khai báo hàm?",
        options: ["function", "var", "let", "const"],
        correctAnswer: "function",
    },
    {
        id: "q112",
        content: "Thẻ nào được dùng để chèn hình ảnh trong HTML?",
        options: ["<img>", "<image>", "<src>", "<pic>"],
        correctAnswer: "<img>",
    },
    {
        id: "q113",
        content: "Cặp thẻ nào dùng để tạo danh sách không thứ tự trong HTML?",
        options: ["<ul></ul>", "<ol></ol>", "<li></li>", "<list></list>"],
        correctAnswer: "<ul></ul>",
    },
    {
        id: "q114",
        content: "Thuộc tính nào của CSS dùng để thay đổi màu chữ?",
        options: ["text-color", "font-color", "color", "background-color"],
        correctAnswer: "color",
    },
    {
        id: "q115",
        content: "Câu lệnh nào dùng để lặp lại một đoạn mã trong JavaScript?",
        options: ["if", "for", "switch", "case"],
        correctAnswer: "for",
    },
    {
        id: "q116",
        content: "Sự kiện nào được gọi khi người dùng nhấn nút chuột?",
        options: ["onchange", "onclick", "onhover", "onsubmit"],
        correctAnswer: "onclick",
    },
    {
        id: "q117",
        content: "Trong CSS, thuộc tính nào dùng để tạo khoảng cách giữa các phần tử trong một container?",
        options: ["padding", "margin", "border", "height"],
        correctAnswer: "margin",
    },
    {
        id: "q118",
        content: "JavaScript thường được chèn trong cặp thẻ nào?",
        options: ["<javascript>", "<js>", "<script>", "<code>"],
        correctAnswer: "<script>",
    },
    {
        id: "q119",
        content: "Hàm nào dùng để lấy phần tử theo ID trong JavaScript?",
        options: ["getElementByClassName", "querySelectorAll", "getElementById", "getElementsByName"],
        correctAnswer: "getElementById",
    },
    {
        id: "q120",
        content: "Thuộc tính nào trong CSS dùng để bo tròn các góc của phần tử?",
        options: ["border-style", "border-color", "border-radius", "corner-round"],
        correctAnswer: "border-radius",
    },
    {
        id: "q201",
        content: "Thẻ nào được dùng để tạo tiêu đề trong HTML?",
        options: ["<title>", "<head>", "<h1> đến <h6>", "<p>"],
        correctAnswer: "<h1> đến <h6>",
    },
    {
        id: "q202",
        content: "Thuộc tính nào trong CSS dùng để tạo viền cho phần tử?",
        options: ["outline", "border", "box", "frame"],
        correctAnswer: "border",
    },
    {
        id: "q203",
        content: "Từ khóa nào dùng để khai báo biến trong JavaScript?",
        options: ["int", "let", "define", "create"],
        correctAnswer: "let",
    },
    {
        id: "q204",
        content: "Đâu là công dụng của CSS?",
        options: ["Tạo hiệu ứng động", "Thay đổi bố cục trang", "Thiết kế giao diện đẹp hơn", "Tất cả các ý trên đều đúng"],
        correctAnswer: "Tất cả các ý trên đều đúng",
    },
    {
        id: "q205",
        content: "Thẻ nào dùng để tạo một biểu mẫu (form) trong HTML?",
        options: ["<input>", "<form>", "<label>", "<fieldset>"],
        correctAnswer: "<form>",
    },
    {
        id: "q206",
        content: "Cách nào để áp dụng CSS vào HTML?",
        options: ["Viết trực tiếp trong thẻ", "Dùng thẻ <style>", "Dùng file .css ngoài", "Tất cả các cách trên đều đúng"],
        correctAnswer: "Tất cả các cách trên đều đúng",
    },
    {
        id: "q207",
        content: "Lệnh nào dùng để kiểm tra điều kiện trong JavaScript?",
        options: ["switch", "loop", "if", "check"],
        correctAnswer: "if",
    },
    {
        id: "q208",
        content: "Thẻ nào trong HTML dùng để nhúng video?",
        options: ["<media>", "<movie>", "<video>", "<stream>"],
        correctAnswer: "<video>",
    },
    {
        id: "q209",
        content: "Cặp thẻ nào được dùng để tạo bảng trong HTML?",
        options: ["<table></table>", "<grid></grid>", "<div></div>", "<section></section>"],
        correctAnswer: "<table></table>",
    },
    {
        id: "q210",
        content: "Thuộc tính nào trong CSS giúp căn giữa phần tử theo chiều ngang?",
        options: ["margin: auto", "text-align: center", "center: true", "align: middle"],
        correctAnswer: "margin: auto",
    },
    {
        id: "q211",
        content: "Trong JavaScript, lệnh nào dùng để lặp qua mảng?",
        options: ["for", "forEach", "while", "Tất cả các lệnh trên đều dùng được"],
        correctAnswer: "Tất cả các lệnh trên đều dùng được",
    },
    {
        id: "q212",
        content: "Đâu là một bộ chọn hợp lệ trong CSS?",
        options: [".box", "#main", "div", "Cả 3 đáp án trên"],
        correctAnswer: "Cả 3 đáp án trên",
    },
    {
        id: "q213",
        content: "Thẻ nào dùng để hiển thị văn bản in đậm trong HTML?",
        options: ["<strong>", "<bold>", "<b>", "Cả <strong> và <b>"],
        correctAnswer: "Cả <strong> và <b>",
    },
    {
        id: "q214",
        content: "Hàm nào trong JavaScript dùng để chuyển chuỗi sang số nguyên?",
        options: ["parseString()", "stringToInt()", "parseInt()", "Number()"],
        correctAnswer: "parseInt()",
    },
    {
        id: "q215",
        content: "Trong JavaScript, từ khóa nào được dùng để khai báo biến không thể thay đổi giá trị?",
        options: ["let", "var", "const", "function"],
        correctAnswer: "const",
    },
    {
        id: "q216",
        content: "Thuộc tính nào trong CSS dùng để tạo bóng cho phần tử?",
        options: ["box-shadow", "text-shadow", "shadow", "Cả hai đáp án đầu"],
        correctAnswer: "Cả hai đáp án đầu",
    },
    {
        id: "q217",
        content: "Sự kiện nào xảy ra khi người dùng thay đổi giá trị trong input?",
        options: ["onclick", "onchange", "oninput", "onsubmit"],
        correctAnswer: "onchange",
    },
    {
        id: "q218",
        content: "Thuộc tính nào trong HTML được dùng để đặt văn bản thay thế cho ảnh?",
        options: ["alt", "title", "src", "text"],
        correctAnswer: "alt",
    },
    {
        id: "q219",
        content: "Lệnh nào dùng để kiểm tra độ dài của một chuỗi trong JavaScript?",
        options: ["length()", "size()", "length", "count()"],
        correctAnswer: "length",
    },
    {
        id: "q220",
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
const listArticle = JSON.parse(localStorage.getItem("listArticle")) || [
    {
        id: "art001",
        title: "Bài viết số 1",
        date: "2025-05-15",
        content: "Nội dung bài viết số 1",
    }
];

// localStorage.setItem("listExam", JSON.stringify(listExam))