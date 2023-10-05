
import { fetchImages } from './img-api';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

let currentPage = 1; // Початкова сторінка
const imagesPerPage = 40; // Кількість зображень на сторінці
let totalHits = 0;
let searchQuery;
let lightbox = new SimpleLightbox('.gallery a', {
    caption: true, 
    captionsData: 'alt',   
    captionDelay: 250,   
  });

export const selectors = {
    searchForm: document.getElementById('search-form'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more'),
}

selectors.loadMoreBtn.style.display = 'none';

selectors.searchForm.addEventListener('submit', onFormSubmit);
selectors.loadMoreBtn.addEventListener('click', onLoadMore);

async function onFormSubmit(evt) {
    evt.preventDefault();
    selectors.loadMoreBtn.style.display = 'none';
    currentPage = 1;
    searchQuery = selectors.searchForm.searchQuery.value.trim(); // Отримуємо значення з поля вводу
    
    if (!searchQuery) {
        Notiflix.Notify.failure("Please enter a search query.", { position: 'center-top', distance: '200px' });
        return;
    }

    // Очищаємо галерею перед новим пошуком
    selectors.gallery.innerHTML = '';
    const { hits, totalHits: updatedTotalHits } = await fetchImages(searchQuery, currentPage); // Оновлення totalHits

    // Оновлюємо значення totalHits
    totalHits = updatedTotalHits;
        
    const imgListHTML = createImgList(hits);
    
    if (!totalHits) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.", { position: 'center-top', distance: '200px'});
        return;
    }
    // Вставляємо розмітку зображень в галерею
    selectors.gallery.insertAdjacentHTML('beforeend', imgListHTML);

    if (totalHits > 0) {
        selectors.loadMoreBtn.style.display = 'block';
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    } 

    if (currentPage === Math.ceil(totalHits / imagesPerPage)) {
        selectors.loadMoreBtn.style.display = 'none';
        Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");

    }
    
    lightbox.refresh();
}

async function onLoadMore() {
     
    currentPage++; // Збільшуємо номер сторінки
    const searchQuery = selectors.searchForm.searchQuery.value.trim();
    const { hits } = await fetchImages(searchQuery, currentPage);
    
    const additionalImagesHTML = createImgList(hits);

        selectors.gallery.insertAdjacentHTML('beforeend', additionalImagesHTML);
        lightbox.refresh();

        // SLOW SCROLL
        const { height: cardHeight } = document
            .querySelector(".gallery")
            .firstElementChild.getBoundingClientRect();

        window.scrollBy({
            top: cardHeight * 2,
            behavior: "smooth",
        });

        const displayedImagesCount = selectors.gallery.querySelectorAll('.photo-card').length; //відслідковуємо скільки фото вже відображено для load more

        if (displayedImagesCount >= totalHits) {
            selectors.loadMoreBtn.style.display = 'none';
            Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
        } 
        
    } 
       
function createImgList(arr) {
    const imgListHTML = arr.map(item => `
        <div class="photo-card">
            <a href="${item.largeImageURL}" data-lightbox="image">
                <img src="${item.webformatURL}" width="500" alt="${item.tags}" loading="lazy" />
            </a>
            <div class="info">
                <p class="info-item"><b>Likes</b> ${item.likes}</p>
                <p class="info-item"><b>Views</b> ${item.views}</p>
                <p class="info-item"><b>Comments</b> ${item.comments}</p>
                <p class="info-item"><b>Downloads</b> ${item.downloads}</p>
            </div>
        </div>
    `).join('');

    return imgListHTML;
}

// btn TOP
const btnUp = {
    el: document.querySelector('.btn-up'),
    show() {
      this.el.classList.remove('btn-up_hide');
    },
    hide() {
      this.el.classList.add('btn-up_hide');
    },
    addEventListener() {      
      window.addEventListener('scroll', () => {        
        const scrollY = window.scrollY || document.documentElement.scrollTop;        
        scrollY > 400 ? this.show() : this.hide();
      });
      
      document.querySelector('.btn-up').onclick = () => {        
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      }
    }
  }
  
  btnUp.addEventListener();