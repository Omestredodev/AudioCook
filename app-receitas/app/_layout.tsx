import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      {/* Oculta o cabeçalho padrão para o grupo de abas */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* Telas que abrem por cima do menu inferior */}
      <Stack.Screen name="detalhes" options={{ title: 'Receita' }} />
      <Stack.Screen name="editar" options={{ title: 'Editar Receita' }} />
    </Stack>
  );
}