import { View, Text, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function Perfil() {
  const router = useRouter();

  async function logout() {
    await AsyncStorage.removeItem("usuario");

    Alert.alert("Logout", "Você saiu da conta");

    router.replace("/login");
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>Perfil</Text>

      <TouchableOpacity onPress={logout}>
        <Text style={{ marginTop: 20, color: "red" }}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}