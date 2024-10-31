const menuItems = document.getElementsByClassName('nav__link');
for (let item of menuItems) {
    console.log(item.className);
    if (item.href == document.location.href) {
        item.classList.remove('nav__link');
        item.classList.add('nav__link_active');
        break
    }
}
