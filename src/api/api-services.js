import axios from 'axios';
const API_KEY = '31783345-18b5ac2b353c5eba4d5cdf805';
axios.defaults.baseURL = 'https://pixabay.com/api';

const fetchImages = async (query, currentPage) => {
  const { data } = await axios.get(
    `/?q=${query}&page=${currentPage}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`,
  );

  return data;
};

export default fetchImages;
