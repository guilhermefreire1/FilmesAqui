import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { getPopularMovies, searchMovies } from '../services/movieAPI';
import { useTheme } from '../context/ThemeContext'; // Importando o contexto de tema
import Icon from 'react-native-vector-icons/FontAwesome';

export default function HomeScreen({ navigation }) {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const { isDarkMode } = useTheme(); // Acessa o estado do tema

  // Função para buscar filmes conforme o usuário digita
  const handleSearch = async (searchQuery) => {
    setQuery(searchQuery);
    if (searchQuery.trim() === '') {
      setMovies([]); // Limpa os resultados se o campo estiver vazio
      return;
    }

    setLoading(true);
    try {
      const results = await searchMovies(searchQuery); // Busca filmes na API
      setMovies(results);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Buscar filmes populares ao carregar a página
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const results = await getPopularMovies();
        setMovies(results);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const renderMovie = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('Details', { movieId: item.id })}>
      <View style={styles.card}>
        <Image source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }} style={styles.poster} />
        <View style={styles.info}>
          <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>{item.title}</Text>
          <Text style={[styles.date, { color: isDarkMode ? '#aaa' : '#666' }]}>{item.release_date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Função para voltar para a tela inicial
  const goBackToHome = () => {
    setQuery(''); // Limpa o campo de busca
    setMovies([]); // Limpa os resultados de busca
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }], // Redefine a navegação para a tela inicial
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#fff' }]}>
      {/* Barra de pesquisa */}
      <TextInput
        style={[
          styles.search,
          {
            backgroundColor: isDarkMode ? '#333' : '#fff',
            color: isDarkMode ? '#fff' : '#000',
            borderColor: isDarkMode ? '#555' : '#ccc',
          },
        ]}
        placeholder="Buscar filmes..."
        placeholderTextColor={isDarkMode ? '#aaa' : '#666'}
        value={query}
        onChangeText={handleSearch} // Dispara a busca conforme o usuário digita
      />

      {/* Botão de Favoritos na lateral */}
      <TouchableOpacity
        style={[
          styles.favoritesButton,
          { backgroundColor: isDarkMode ? '#ff6363' : '#ff6363' },
        ]}
        onPress={() => navigation.navigate('Favorites')}
      >
        <Icon name="heart" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Botão de Voltar para a Home */}
      {query.trim() !== '' && (
        <TouchableOpacity onPress={goBackToHome} style={styles.backButton}>
          <View style={styles.backButtonContent}>
            <Icon name="arrow-left" size={20} color="#fff" />
            <Text style={styles.backButtonText}>Voltar</Text>
          </View>
        </TouchableOpacity>
      )}

      {loading ? (
        <Text style={[styles.loading, { color: isDarkMode ? '#fff' : '#000' }]}>Carregando...</Text>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMovie}
          ListEmptyComponent={<Text style={[styles.empty, { color: isDarkMode ? '#aaa' : '#666' }]}>Nenhum resultado encontrado.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  search: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  card: { flexDirection: 'row', marginBottom: 10 },
  poster: { width: 80, height: 120, borderRadius: 8 },
  info: { marginLeft: 10, justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: 'bold' },
  date: { fontSize: 14 },
  loading: { fontSize: 18, textAlign: 'center' },
  empty: { fontSize: 18, textAlign: 'center' },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff6363',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  backButtonContent: { flexDirection: 'row', alignItems: 'center' },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  favoritesButton: {
    position: 'absolute',
    top: 80,
    right: 20,
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
});
