import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Linking, ScrollView } from 'react-native';
import { useFavorites } from '../context/FavoritesContext';
import { useTheme } from '../context/ThemeContext';
import { getMovieDetails, getMovieVideos } from '../services/movieAPI';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function DetailsScreen({ route }) {
  const { movieId } = route.params;
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { isDarkMode } = useTheme();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trailerUrl, setTrailerUrl] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const movieData = await getMovieDetails(movieId);
        setMovie(movieData);

        const videos = await getMovieVideos(movieId);
        const trailer = videos.find((video) => video.type === 'Trailer' && video.site === 'YouTube');
        if (trailer) {
          setTrailerUrl(trailer.key);
        }
      } catch {
        alert('Erro ao carregar os dados do filme.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [movieId]);

  const openTrailer = () => {
    if (trailerUrl) {
      const youtubeUrl = `https://www.youtube.com/watch?v=${trailerUrl}`;
      Linking.openURL(youtubeUrl);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating / 2);
    const emptyStars = 5 - fullStars;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Icon key={`full-${i}`} name="star" size={20} color="#ffdf00" />);
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Icon key={`empty-${i}`} name="star-o" size={20} color="#ffdf00" />);
    }

    return stars;
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#fff' }]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#fff' }]}>
        <Text style={[styles.errorText, { color: isDarkMode ? '#fff' : '#000' }]}>Filme não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#fff' }]}>
      <Image source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }} style={styles.poster} />
      <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>{movie.title}</Text>
      <Text style={[styles.releaseDate, { color: isDarkMode ? '#ccc' : '#666' }]}>Lançamento: {new Date(movie.release_date).toLocaleDateString()}</Text>
      <Text style={[styles.genres, { color: isDarkMode ? '#ccc' : '#666' }]}>
        Gêneros: {movie.genres.map(genre => genre.name).join(', ')}
      </Text>
      <Text style={[styles.rating, { color: isDarkMode ? '#ccc' : '#666' }]}>
        Avaliação: {renderStars(movie.vote_average || 0)}
      </Text>
      <Text style={[styles.overview, { color: isDarkMode ? '#ccc' : '#333' }]}>{movie.overview}</Text>

      <TouchableOpacity style={[styles.trailerButton, { backgroundColor: isDarkMode ? '#ff6347' : '#ff6347' }]} onPress={openTrailer}>
        <Text style={[styles.buttonText, { color: isDarkMode ? '#fff' : '#fff' }]}>Ver Trailer</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.favoriteButton,
          {
            backgroundColor: isFavorite(movie.id) ? '#ff6363' : '#ffdf00',
          },
        ]}
        onPress={() => {
          if (isFavorite(movie.id)) {
            removeFavorite(movie.id);
          } else {
            addFavorite(movie);
          }
        }}
      >
        <Text style={[styles.buttonText, { color: isDarkMode ? '#fff' : '#fff' }]}>
          {isFavorite(movie.id) ? 'Remover dos Favoritos' : 'Favoritar'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  poster: { width: '100%', height: 300, borderRadius: 10, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  releaseDate: { fontSize: 16, textAlign: 'center', marginBottom: 10 },
  genres: { fontSize: 16, textAlign: 'center', marginBottom: 10 },
  rating: { fontSize: 16, textAlign: 'center', marginBottom: 10 },
  overview: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  trailerButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginVertical: 15,
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
  },
  favoriteButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginVertical: 15,
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
  },
  buttonText: { fontSize: 16 },
  errorText: { textAlign: 'center', marginTop: 20 },
});
