import { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import api from "../../services/api";

/*
  Tipagem da entidade Receita
*/
type Receita = {
  _id: string;
  titulo: string;
  modoPreparo: string;
  ingredientes: string[];
  imagem: string;
  favorita: boolean;
};

export default function Home() {
  /*
    Estado da lista de receitas
  */
  const [receitas, setReceitas] = useState<Receita[]>([]);

  /*
    Router usado para navegação
  */
  const router = useRouter();

  /*
    Carrega as receitas sempre que a tela recebe foco
  */
  useFocusEffect(
    useCallback(() => {
      async function carregarReceitas() {
        try {
          const res = await api.get<Receita[]>("/receitas");
          setReceitas(res.data);
        } catch (error) {
          console.log("Erro ao carregar receitas:", error);
        }
      }

      carregarReceitas();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>AudioCook</Text>
      <Text style={styles.subtitulo}>Suas receitas salvas</Text>

      <FlatList
        data={receitas}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/detalhes?id=${item._id}`)}
          >
            <Image source={{ uri: item.imagem }} style={styles.imagem} />

            <View style={styles.cardConteudo}>
              <Text style={styles.nome}>{item.titulo}</Text>
              <Text style={styles.info}>
                {item.ingredientes.length} ingredientes
              </Text>
              <Text style={styles.favorito}>
                {item.favorita ? "Favorita" : "Toque para ver detalhes"}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.vazioContainer}>
            <Text style={styles.vazioTitulo}>Nenhuma receita cadastrada</Text>
            <Text style={styles.vazioTexto}>
              Crie sua primeira receita na aba Gravar.
            </Text>
          </View>
        }
      />
    </View>
  );
}

/*
  Estilização da tela inicial
*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f3ee",
    padding: 20,
  },
  titulo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#3d2b1f",
    marginTop: 10,
  },
  subtitulo: {
    fontSize: 16,
    color: "#7a6a5c",
    marginBottom: 20,
  },
  lista: {
    paddingBottom: 30,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
  imagem: {
    width: "100%",
    height: 160,
    backgroundColor: "#ddd",
  },
  cardConteudo: {
    padding: 14,
  },
  nome: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2f241d",
    marginBottom: 6,
  },
  info: {
    fontSize: 14,
    color: "#6f6258",
    marginBottom: 4,
  },
  favorito: {
    fontSize: 13,
    color: "#a86f32",
  },
  vazioContainer: {
    marginTop: 60,
    alignItems: "center",
  },
  vazioTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3d2b1f",
  },
  vazioTexto: {
    marginTop: 8,
    fontSize: 14,
    color: "#7a6a5c",
    textAlign: "center",
  },
});