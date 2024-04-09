const carouselContainer = document.querySelector('.carousel-container');
const carouselSlides = document.querySelectorAll('.carousel-slide');
const prevButton = document.querySelector('.carousel-prev');
const nextButton = document.querySelector('.carousel-next');

let currentIndex = 0;
const slideWidth = carouselSlides[0].clientWidth;

prevButton.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    carouselContainer.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
  }
});

nextButton.addEventListener('click', () => {
  if (currentIndex < carouselSlides.length - 1) {
    currentIndex++;
    carouselContainer.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
  }
});
