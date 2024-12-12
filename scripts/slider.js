document.addEventListener("DOMContentLoaded", () => {
    const swiper = new Swiper('.swiper-container', {
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        slidesPerView: 3,
        spaceBetween: 20,
        touchStartPreventDefault: false,
        simulateTouch: true,
        preventClicks: true,
        preventClicksPropagation: true,
        allowTouchMove: true,
    });

    // Обработчики для кастомных кнопок
    document.querySelector('#custom-next').addEventListener('click', () => {
        swiper.slideNext();
    });

    document.querySelector('#custom-prev').addEventListener('click', () => {
        swiper.slidePrev();
    });
});
