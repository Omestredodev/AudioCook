import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Biblioteca de ícones que já vem no Expo

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#FF6347' }}> {/* Cor laranja de comida */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Receitas',
          tabBarIcon: ({ color }) => <Ionicons name="restaurant" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="gravar"
        options={{
          title: 'Gravar',
          tabBarIcon: ({ color }) => <Ionicons name="mic" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favoritos"
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ color }) => <Ionicons name="heart" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}