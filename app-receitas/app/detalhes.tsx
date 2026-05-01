import { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import api from "../services/api";

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

export default function Detalhes() {
  /*
    Router usado para navegação
  */
  const router = useRouter();

  /*
    Parâmetro recebido via navegação
  */
  const { id } = useLocalSearchParams<{ id: string }>();

  /*
    Estado da receita carregada
  */
  const [receita, setReceita] = useState<Receita | null>(null);

  /*
    Carrega os detalhes da receita pelo ID
  */
  useEffect(() => {
    async function carregarReceita() {
      try {
        const res = await api.get<Receita>(`/receitas/${id}`);
        setReceita(res.data);
      } catch (err) {
        console.log("Erro ao carregar receita:", err);
      }
    }

    if (id) {
      carregarReceita();
    }
  }, [id]);

  /*
    Alterna o estado de favorito
  */
  async function toggleFavorita() {
    if (!receita) return;

    try {
      const res = await api.put(`/receitas/${receita._id}`, {
        favorita: !receita.favorita,
      });

      setReceita(res.data);
    } catch (err) {
      console.log("Erro ao atualizar receita:", err);
    }
  }

  /*
    Confirma e remove a receita
  */
  function deletarReceita() {
    if (!receita) return;

    Alert.alert(
      "Excluir receita",
      "Tem certeza que deseja excluir esta receita?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/receitas/${receita._id}`);
              router.back();
            } catch (err) {
              console.log("Erro ao deletar receita:", err);
            }
          },
        },
      ]
    );
  }

  /*
    Estado de carregamento
  */
  if (!receita) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingTexto}>Carregando receita...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: receita.imagem }} style={styles.imagem} />

      <View style={styles.card}>
        <Text style={styles.titulo}>{receita.titulo}</Text>

        <Text style={styles.subtitulo}>Ingredientes</Text>
        {receita.ingredientes.map((item, index) => (
          <Text key={index} style={styles.itemIngrediente}>
            • {item}
          </Text>
        ))}

        <Text style={styles.subtitulo}>Modo de preparo</Text>
        <Text style={styles.texto}>{receita.modoPreparo}</Text>

        <TouchableOpacity onPress={toggleFavorita} style={styles.botaoFavorito}>
          <Text style={styles.botaoTexto}>
            {receita.favorita ? "Desfavoritar" : "Favoritar"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={deletarReceita} style={styles.botaoExcluir}>
          <Text style={styles.botaoTexto}>Excluir Receita</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/*
  Estilização da tela de detalhes
*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f3ee",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f3ee",
  },
  loadingTexto: {
    fontSize: 16,
    color: "#7a6a5c",
  },
  imagem: {
    width: "100%",
    height: 260,
    backgroundColor: "#ddd",
  },
  card: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 18,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#3d2b1f",
    marginBottom: 18,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3d2b1f",
    marginTop: 15,
    marginBottom: 8,
  },
  itemIngrediente: {
    fontSize: 15,
    color: "#5f5147",
    marginBottom: 4,
  },
  texto: {
    fontSize: 15,
    color: "#5f5147",
    lineHeight: 22,
  },
  botaoFavorito: {
    marginTop: 24,
    padding: 15,
    backgroundColor: "#d89b45",
    borderRadius: 12,
    alignItems: "center",
  },
  botaoExcluir: {
    marginTop: 10,
    padding: 15,
    backgroundColor: "#b84a3a",
    borderRadius: 12,
    alignItems: "center",
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
});