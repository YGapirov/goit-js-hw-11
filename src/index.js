import { fetchImages } from './img-api';
// import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


let currentPage = 1; // Початкова сторінка
const imagesPerPage = 40; // Кількість зображень на сторінці
let totalLoadedImagesCount = 0; // Лічильник завантажених зображень

export const selectors = {
    searchForm: document.getElementById('search-form'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more'),
    }

selectors.loadMoreBtn.style.display = 'none';
 
selectors.searchForm.addEventListener('submit', onSearch);

function onSearch(evt) {
    evt.preventDefault();
    selectors.loadMoreBtn.style.display = 'none';
    
    fetchAndDisplayImages();

}

async function fetchAndDisplayImages() {
    const searchQuery = selectors.searchForm.searchQuery.value.trim(); // Отримуємо значення з поля вводу
    const imageListHTML = await fetchImages(searchQuery, currentPage);

    if (imageListHTML) {
        selectors.gallery.innerHTML = imageListHTML;
        const lightbox = new SimpleLightbox('.gallery a');
        selectors.loadMoreBtn.style.display = 'block';

        lightbox.refresh();
    }
}

selectors.loadMoreBtn.addEventListener('click', onLoadMore);

async function onLoadMore() {
    currentPage++; // Збільшуємо номер сторінки
    const searchQuery = selectors.searchForm.searchQuery.value.trim();
    const additionalImagesHTML = await fetchImages(searchQuery, currentPage);

    if (additionalImagesHTML) {
        selectors.gallery.innerHTML += additionalImagesHTML; // Додаємо нові зображення до вже існуючих
        const lightbox = new SimpleLightbox('.gallery a');
        lightbox.refresh();

        // Прокручуємо сторінку плавно після завантаження нових зображень
        const { height: cardHeight } = document
            .querySelector(".gallery")
            .firstElementChild.getBoundingClientRect();
        
        window.scrollBy({
            top: cardHeight * 2,
            behavior: "smooth",
        });

    }
}
selectors.loadMoreBtn.addEventListener('click', onLoadMore);