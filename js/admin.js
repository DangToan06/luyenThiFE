document.addEventListener('DOMContentLoaded', () => {
    // Xử lý nav links
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
  
    navLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        navLinks.forEach(item => item.classList.remove('active'));
        this.classList.add('active');
  
        const linkText = this.querySelector('span').textContent.trim();
        let sectionId;
  
        switch (linkText) {
          case 'Dashboard':
            sectionId = 'Dashboard';
            break;
          case 'Students':
            sectionId = 'Students';
            break;
          case 'Exam Question':
            sectionId = 'Exam-Question';
            break;
          case 'Question':
            sectionId = 'Question';
            break;
          case 'Article':
            sectionId = 'Article';
            break;
          default:
            sectionId = 'Dashboard';
        }
  
        sections.forEach(section => section.classList.add('none'));
        const selectedSection = document.getElementById(sectionId);
        if (selectedSection) {
          selectedSection.classList.remove('none');
        }
      });
    });

    const btnOpenModal = document.querySelector('#Article .btn-add');
    const modal = document.querySelector('.modal');
    const btnClose = modal ? modal.querySelector('.btn-close') : null;
  
    if (btnOpenModal) {
      btnOpenModal.addEventListener('click', () => {
        if (modal) modal.classList.remove('hidden');
      });
    } else {
      console.error('Không tìm thấy nút mở modal (Article)');
    }
  
    if (btnClose) {
      btnClose.addEventListener('click', () => {
        if (modal) modal.classList.add('hidden');
      });
    } else {
      console.error('Không tìm thấy nút đóng modal (Article)');
    }
  
    // Xử lý modal cho Question
    const btnOpenModalQuestion = document.querySelector('#Question .btn-add');
    const modalQuestion = document.querySelectorAll('.modal')[1];
    const btnCloseQuestion = modalQuestion ? modalQuestion.querySelector('.btn-close') : null;
  
    if (btnOpenModalQuestion) {
      btnOpenModalQuestion.addEventListener('click', () => {
        if (modalQuestion) modalQuestion.classList.remove('hidden');
      });
    } else {
      console.error('Không tìm thấy nút mở modal (Question)');
    }
  
    if (btnCloseQuestion) {
      btnCloseQuestion.addEventListener('click', () => {
        if (modalQuestion) modalQuestion.classList.add('hidden');
      });
    } else {
      console.error('Không tìm thấy nút đóng modal (Question)');
    }
  
    // Xử lý sidebar responsive
    const menuButton = document.getElementById('menu-nav');
    const closeButton = document.getElementById('close-menu-nav');
    const sidebar = document.querySelector('.sidebar');
  
    if (menuButton && closeButton) {
      menuButton.addEventListener('click', () => {
        sidebar.classList.add('open');
        menuButton.style.display = 'none';
        closeButton.style.display = 'block';
      });
  
      closeButton.addEventListener('click', () => {
        sidebar.classList.remove('open');
        closeButton.style.display = 'none';
        menuButton.style.display = 'block';
      });
    }
  });