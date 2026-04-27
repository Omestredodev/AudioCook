import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import api from "../../services/api";
import { useRouter, useFocusEffect } from "expo-router";

/*
  Tipagem da Receita
*/
type Receita = {
  _id: string;
  titulo: string;
  modoPreparo: string;
  ingredientes: string[];
  imagem: string;
  favorita: boolean;
};

export default function Favoritos() {
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const router = useRouter();

  /*
    Carrega apenas receitas favoritas
  */
  useFocusEffect(
    useCallback(() => {
      async function carregarFavoritos() {
        try {
          const res = await api.get<Receita[]>("/receitas");
          const favoritas = res.data.filter((r) => r.favorita);
          setReceitas(favoritas);
        } catch (err) {
          console.log("Erro ao carregar favoritos:", err);
        }
      }

      carregarFavoritos();
    }, [])
  );
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Receitas Favoritas</Text>

      <FlatList
        data={receitas}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/detalhes?id=${item._id}`)}
          >
            <Image source={{ uri: item.imagem }} style={styles.imagem} />
            <Text style={styles.nome}>{item.titulo}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.vazio}>Nenhuma receita favoritada</Text>
        }
      />
    </View>
  );
}

/*
  Estilos
*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  card: {
    marginBottom: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 10,
  },
  imagem: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  nome: {
    fontSize: 16,
  },
  vazio: {
    textAlign: "center",
    marginTop: 20,
    color: "gray",
  },
});