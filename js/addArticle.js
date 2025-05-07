    // js cho phần crud bài viết

document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
  
    const articleList = document.querySelector('#Article tbody');
    const modalAdd = document.querySelector('.modal-add');
    const modalEdit = document.querySelector('.modal-edit');
    const modalDelete = document.querySelector('.modal-delete');
  
    const formAdd = document.querySelector('.modal-form-add');
    const formEdit = document.querySelector('.modal-form-edit');
  
    const btnAddPost = document.querySelector('#Article .btn-add');
    const btnCloseAdd = modalAdd.querySelector('.btn-close');
    const btnCloseEdit = modalEdit.querySelector('.btn-close');
    const btnCloseDelete = modalDelete.querySelector('.btn-close-delete');
    const btnConfirmDelete = modalDelete.querySelector('.btn-confirm-delete');
  
    let articles = JSON.parse(localStorage.getItem('article')) || [];
    let currentEditId = null;
    let currentDeleteId = null;
  
    function formatRelativeDate(dateStr) {
      const now = new Date();
      const date = new Date(dateStr);
      const months = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
      return `${Math.max(0, months)} months ago`;
    }
  
    function renderArticles() {
      articleList.innerHTML = '';
      articles.forEach(article => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${article.id}</td>
          <td>${article.title}</td>
          <td>${formatRelativeDate(article.date)}</td>
          <td>${article.author}</td>
          <td class="action-buttons">
            <button class="btn-edit" data-id="${article.id}">Edit</button>
            <button class="btn-delete" data-id="${article.id}">Delete</button>
          </td>
        `;
        articleList.appendChild(row);
      });
    }
  
    function openModal(modal) {
      modal.classList.remove('hidden');
    }
  
    function closeModal(modal) {
      modal.classList.add('hidden');
    }
  
    navLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        navLinks.forEach(item => item.classList.remove('active'));
        this.classList.add('active');
  
  
        const linkText = this.querySelector('span').textContent.trim();
        let sectionId;
  
        switch (linkText) {
          case 'Dashboard': sectionId = 'Dashboard'; break;
          case 'Students': sectionId = 'Students'; break;
          case 'Exam Question': sectionId = 'Exam-Question'; break;
          case 'Question': sectionId = 'Question'; break;
          case 'Article': sectionId = 'Article'; break;
          default: sectionId = 'Dashboard';
        }
  
        sections.forEach(section => section.classList.add('none'));
        const selectedSection = document.getElementById(sectionId);
        if (selectedSection) {
          selectedSection.classList.remove('none');
          if (sectionId === 'Article') {
            renderArticles();
          }
        }
      });
    });
  
    btnAddPost.addEventListener('click', () => openModal(modalAdd));
    btnCloseAdd.addEventListener('click', () => closeModal(modalAdd));
  
    formAdd.addEventListener('submit', e => {
      e.preventDefault();
      const inputs = formAdd.querySelectorAll('input');
      const [title, content, date, time, author] = [...inputs].map(i => i.value.trim());
  
      const newId = articles.length > 0 ? Math.max(...articles.map(a => a.id)) + 1 : 1;
  
      if (!title || !content || !date || !time || !author) {
        showErrorModal('Vui lòng điền đầy đủ thông tin');
        return;
      }
  
      articles.push({
        id: newId,
        title,
        content,
        date,
        time: `${time} minutes read`,
        author
      });
  
      localStorage.setItem('article', JSON.stringify(articles));
      renderArticles();
      formAdd.reset();
      closeModal(modalAdd);
    });
  
    articleList.addEventListener('click', e => {
      if (e.target.classList.contains('btn-edit')) {
        const id = +e.target.dataset.id;
        const article = articles.find(a => a.id === id);
        if (article) {
          currentEditId = id;
          formEdit.title.value = article.title;
          formEdit.content.value = article.content;
          formEdit.date.value = article.date;
          formEdit.time.value = parseInt(article.time);
          formEdit.author.value = article.author;
          openModal(modalEdit);
        }
      }
  
      if (e.target.classList.contains('btn-delete')) {
        currentDeleteId = +e.target.dataset.id;
        openModal(modalDelete);
      }
    });
  
    formEdit.addEventListener('submit', e => {
      e.preventDefault();
      const article = articles.find(a => a.id === currentEditId);
      const title = formEdit.title.value.trim();
      const content = formEdit.content.value.trim();
      const date = formEdit.date.value;
      const time = formEdit.time.value.trim();
      const author = formEdit.author.value.trim();
  
      if (!title || !content || !date || !time || !author) {
        showErrorModal('Vui lòng điền đầy đủ thông tin');
        return;
      }
  
      if (article) {
  
        article.title = formEdit.title.value.trim();
        article.content = formEdit.content.value.trim();
        article.date = formEdit.date.value;
        article.time = `${formEdit.time.value.trim()} minutes read`;
        article.author = formEdit.author.value.trim();
  
  
        localStorage.setItem('article', JSON.stringify(articles));
        renderArticles();
        closeModal(modalEdit);
      }
    });
  
    btnConfirmDelete.addEventListener('click', () => {
      articles = articles.filter(a => a.id !== currentDeleteId);
      localStorage.setItem('article', JSON.stringify(articles));
      renderArticles();
      closeModal(modalDelete);
    });
  
    btnCloseEdit.addEventListener('click', () => closeModal(modalEdit));
    btnCloseDelete.addEventListener('click', () => closeModal(modalDelete));
  
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
  
  function showErrorModal(message) {
    const errorModal = document.querySelector('.modal-error');
    const notification = document.getElementById('notification');
  
    if (errorModal && notification) {
      notification.textContent = message || 'Vui lòng điền đầy đủ thông tin';
      errorModal.classList.add('show');
  
      setTimeout(() => {
        errorModal.classList.remove('show');
      }, 1500);
    }
  }
  
  