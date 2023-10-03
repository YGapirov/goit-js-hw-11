// import { selectors } from './index'

import Notiflix from 'notiflix';

import axios from 'axios';


const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '39807884-ce16e485562f7e433cd996b10';

// const result = await axios.get("https://pixabay.com/api/?key=39807884-ce16e485562f7e433cd996b10");

let page = 1;

let currentQuery = '';
//створюємо пошук зображень в бібліотеці
export const fetchImages = async (searchQuery, page) => {
    try {

        // Зберігаємо значення searchQuery в змінну currentQuery
        currentQuery = searchQuery;
        const response = await axios.get(BASE_URL, {
            params: {
                key: API_KEY,
                q: searchQuery,
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: true,
                page: page,
                per_page: 40,
            },
        });
        const data = response.data; //повертає дані з бекенду після успішного запиту
        if (data.hits.length === 0) { //перевірка бібліотеки чи є дані по запиту

            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.", { position: 'center-top', distance: '200px' });
            return;
        }
        const imageListHTML = createImgList(data.hits); //отримуємо з api каталог img
        return imageListHTML; //виводимо в розмітку
    } catch (error) {
        console.error(error);
    }

}


function createImgList(arr) {
    return arr.map(item => `
        <div class="photo-card">
            <a href="${item.largeImageURL}" data-lightbox="image">
                <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
            </a>
            <div class="info">
                <p class="info-item"><b>Likes</b> ${item.likes}</p>
                <p class="info-item"><b>Views</b> ${item.views}</p>
                <p class="info-item"><b>Comments</b> ${item.comments}</p>
                <p class="info-item"><b>Downloads</b> ${item.downloads}</p>
            </div>
        </div>
    `).join('');

    
}

// gallery.insertAdjacentHTML('beforeend', createImgList);
