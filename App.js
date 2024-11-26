import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Switch } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';  // Certifique-se de que está importando corretamente
import { FavoritesProvider } from './src/context/FavoritesContext'; // Certifique-se que está importando corretamente
import HomeScreen from './src/screens/HomeScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import FavoritesScreen from './src/screens/FavoritesScreen'; // Certifique-se de importar a tela de favoritos

const Stack = createStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <NavigationContainer>
          <MainStack />
        </NavigationContainer>
      </FavoritesProvider>
    </ThemeProvider>
  );
}

function MainStack() {
  const { isDarkMode, toggleTheme } = useTheme();  // Acessa o tema atual e a função para alternar o tema

  return (
    <Stack.Navigator>
      {/* Tela Home */}
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Filmes Aqui',
          headerStyle: {
            backgroundColor: isDarkMode ? '#121212' : '#fff', // Cor do fundo do cabeçalho
          },
          headerTintColor: isDarkMode ? '#fff' : '#000', // Cor do texto do cabeçalho
          headerRight: () => (
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}  // Alterna o tema
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
            />
          ),
        }}
      />
      {/* Tela de Detalhes */}
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
      />
      {/* Tela de Favoritos */}
      <Stack.Screen
        name="Favorites"
        component={FavoritesScreen}
      />
    </Stack.Navigator>
  );
}
