import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
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
    Router para navegação
  */
    const router = useRouter();

  /*
    Parâmetro recebido via navegação
    Ex: /detalhes?id=123
  */
  const { id } = useLocalSearchParams<{ id: string }>();

  /*
    Estado da receita carregada
  */
  const [receita, setReceita] = useState<Receita | null>(null);

  /*
    Carregamento da receita via endpoint específico (GET por ID)
    Mais eficiente que buscar todas e filtrar
  */
  useEffect(() => {
    async function carregar() {
      try {
        const res = await api.get<Receita>(`/receitas/${id}`);
        setReceita(res.data);
      } catch (err) {
        console.log("Erro ao carregar receita:", err);
      }
    }

    if (id) {
      carregar();
    }
  }, [id]);

  /*
    Estado de carregamento
  */
  if (!receita) {
    return <Text style={{ padding: 20 }}>Carregando...</Text>;
  }

  /*
    Alterna o estado de favorito
    Atualiza no backend e sincroniza com a tela
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
  Remove a receita do banco e retorna para a tela anterior
  */
  async function deletarReceita() {
    if (!receita) return;

    try {
      await api.delete(`/receitas/${receita._id}`);

      // volta para a tela anterior
      router.back();
    } catch (err) {
      console.log("Erro ao deletar receita:", err);
    }
  }

  /*
    Renderização da tela
  */
  return (
    <ScrollView style={styles.container}>
      {/* Imagem da receita */}
      <Image source={{ uri: receita.imagem }} style={styles.imagem} />

      {/* Título */}
      <Text style={styles.titulo}>{receita.titulo}</Text>

      {/* Ingredientes */}
      <Text style={styles.subtitulo}>Ingredientes:</Text>
      {receita.ingredientes.map((item, index) => (
        <Text key={index}>• {item}</Text>
      ))}

      {/* Modo de preparo */}
      <Text style={styles.subtitulo}>Modo de preparo:</Text>
      <Text>{receita.modoPreparo}</Text>

      {/* Botão de favoritar */}
      <TouchableOpacity onPress={toggleFavorita} style={styles.botao}>
        <Text style={styles.botaoTexto}>
          {receita.favorita ? "Desfavoritar" : "Favoritar"}
        </Text>
      </TouchableOpacity>

      {/* Botão de excluir */}
      <TouchableOpacity onPress={deletarReceita} style={styles.botaoExcluir}>
        <Text style={styles.botaoTexto}>Excluir Receita</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/*
  Estilização da tela
*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  imagem: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
  },
  botao: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#ffd700",
    borderRadius: 10,
    alignItems: "center",
  },
  botaoTexto: {
    fontWeight: "bold",
  },
  botaoExcluir: {
  marginTop: 10,
  padding: 15,
  backgroundColor: "#ff4d4d",
  borderRadius: 10,
  alignItems: "center",
},
});