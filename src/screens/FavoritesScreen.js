import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useFavorites } from '../context/FavoritesContext';

export default function FavoritesScreen() {
  const { favorites, removeFavorite } = useFavorites(); // Acessando o contexto de favoritos

  const renderItem = ({ item }) => (
    <View style={styles.movieCard}>
      <Image source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }} style={styles.poster} />
      <View style={styles.movieInfo}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.releaseDate}>Lançamento: {new Date(item.release_date).toLocaleDateString()}</Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeFavorite(item.id)} // Remover filme dos favoritos
        >
          <Text style={styles.buttonText}>Remover dos Favoritos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <Text style={styles.noFavoritesText}>Você ainda não tem filmes favoritos.</Text>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  movieCard: {
    flexDirection: 'row',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  movieInfo: {
    marginLeft: 15,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  releaseDate: {
    fontSize: 14,
    color: '#666',
  },
  removeButton: {
    marginTop: 10,
    paddingVertical: 5,
    backgroundColor: '#ff6363',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  noFavoritesText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
  },
});
