import axios from 'axios';

const API_KEY = '090f4b479cc5231142ba19615a21dd73';
const BASE_URL = 'https://api.themoviedb.org/3';

// Função para pegar os filmes populares
export const getPopularMovies = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR`);
    return response.data.results;
  } catch (error) {
    console.error('Erro ao buscar filmes populares:', error);
    throw error;
  }
};

// Função de busca de filmes
export const searchMovies = async (query) => {
  if (!query) {
    return []; // Retorna uma lista vazia se não houver consulta
  }

  try {
    const response = await axios.get(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${query}`);
    return response.data.results;
  } catch (error) {
    console.error('Erro ao buscar filmes:', error);
    throw error;
  }
};

// Função para pegar detalhes do filme
export const getMovieDetails = async (movieId) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=pt-BR`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar detalhes do filme:', error);
    throw error;
  }
};

// Função para pegar vídeos do filme
export const getMovieVideos = async (movieId) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}/videos`, {
      params: { api_key: API_KEY, language: 'pt-BR' },
    });
    return response.data.results;
  } catch (error) {
    console.error('Erro ao buscar vídeos do filme:', error);
    throw error;
  }
};
