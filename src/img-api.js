import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '39807884-ce16e485562f7e433cd996b10';

export const fetchImages = async (searchQuery, page) => {
    const {data} = await axios.get(BASE_URL, {
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
    
    return data;
    
}
