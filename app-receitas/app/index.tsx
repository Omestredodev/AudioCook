import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const [usuario, setUsuario] = useState<null | object>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      const user = await AsyncStorage.getItem("usuario");
      setUsuario(user ? JSON.parse(user) : null);
      setLoading(false);
    }

    carregar();
  }, []);

  if (loading) return null;

  if (!usuario) {
    return <Redirect href="/login" />;
  }

  return <Redirect href="/(tabs)" />;
}