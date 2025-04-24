//Hiệu ứng nút menu ở head

const menuHeader = document.getElementById("menu-header");

menuHeader.addEventListener('click', () => {
    toggleMenu();
});

function toggleMenu() {
    const menu = document.querySelector('.menu');
    const arrow = document.getElementById('arrow');
    menu.classList.toggle('open');
    arrow.classList.toggle('rotate');
}

const menuNav = document.getElementById("menu-nav");
const menu = document.getElementById("menu");
const closeMenuNav = document.getElementById("close-menu-nav");

let menuNavCheck = true;

menuNav.addEventListener('click', () => {
    menuNavCheck = !menuNavCheck;
    menuNav.style.display = menuNavCheck ? "block" : "none";
    menu.style.display = menuNavCheck ? "none" : "block";
    closeMenuNav.style.display = menuNavCheck ? "none" : "block";
});

closeMenuNav.addEventListener('click', () => {
    menuNavCheck = !menuNavCheck;
    menuNav.style.display = menuNavCheck ? "block" : "none";
    menu.style.display = menuNavCheck ? "none" : "block";
    closeMenuNav.style.display = menuNavCheck ? "none" : "block";
});
