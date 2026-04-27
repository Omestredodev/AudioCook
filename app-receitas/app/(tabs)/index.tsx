import { useEffect, useState, useCallback, } from "react";
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, } from "react-native";
import api from "../../services/api";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

// 🔹 Tipo da Receita
type Receita = {
  _id: string;
  titulo: string;
  modoPreparo: string;
  ingredientes: string[];
  imagem: string;
  favorita: boolean;
};

export default function Home() {
const router = useRouter();

  const [receitas, setReceitas] = useState<Receita[]>([]);

  useFocusEffect(
  useCallback(() => {
    async function carregar() {
      try {
        const res = await api.get<Receita[]>("/receitas");
        setReceitas(res.data);
      } catch (error) {
        console.log("Erro ao carregar receitas:", error);
      }
    }

    carregar();
  }, [])
);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Minhas Receitas</Text>

      <FlatList
        data={receitas}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/detalhes?id=${item._id}`)}
          >
            <Image
              source={{ uri: item.imagem }}
              style={styles.imagem}
            />
            <Text style={styles.nome}>{item.titulo}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.vazio}>Nenhuma receita encontrada</Text>
        }
      />
    </View>
  );
}

// 🎨 Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  card: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
  },
  nome: {
    fontSize: 16,
  },
  vazio: {
    textAlign: "center",
    marginTop: 20,
    color: "gray",
  },
  imagem: {
  width: "100%",
  height: 120,
  borderRadius: 10,
  marginBottom: 10,
},
});