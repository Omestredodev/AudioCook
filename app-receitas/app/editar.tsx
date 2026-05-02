import { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
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

export default function Editar() {
  /*
    Router usado para voltar após salvar
  */
  const router = useRouter();

  /*
    ID recebido pela rota
  */
  const { id } = useLocalSearchParams<{ id: string }>();

  /*
    Estados do formulário
  */
  const [titulo, setTitulo] = useState("");
  const [ingredientes, setIngredientes] = useState("");
  const [modoPreparo, setModoPreparo] = useState("");
  const [imagem, setImagem] = useState("");

  /*
    Carrega os dados atuais da receita
  */
  useEffect(() => {
    async function carregarReceita() {
      try {
        const res = await api.get<Receita>(`/receitas/${id}`);

        setTitulo(res.data.titulo);
        setIngredientes(res.data.ingredientes.join(", "));
        setModoPreparo(res.data.modoPreparo);
        setImagem(res.data.imagem);
      } catch (err) {
        console.log("Erro ao carregar receita para edição:", err);
        Alert.alert("Erro", "Não foi possível carregar a receita.");
      }
    }

    if (id) {
      carregarReceita();
    }
  }, [id]);

  /*
    Atualiza a receita no backend
  */
  async function salvarEdicao() {
    if (!titulo || !ingredientes || !modoPreparo) {
      Alert.alert("Atenção", "Preencha título, ingredientes e modo de preparo.");
      return;
    }

    try {
      await api.put(`/receitas/${id}`, {
        titulo,
        ingredientes: ingredientes.split(",").map((item) => item.trim()),
        modoPreparo,
        imagem: imagem || "https://via.placeholder.com/150",
      });

      Alert.alert("Sucesso", "Receita atualizada com sucesso.");
      router.back();
    } catch (err) {
      console.log("Erro ao atualizar receita:", err);
      Alert.alert("Erro", "Não foi possível atualizar a receita.");
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Editar Receita</Text>
      <Text style={styles.subtitulo}>
        Atualize as informações da receita selecionada.
      </Text>

      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        value={titulo}
        onChangeText={setTitulo}
        placeholder="Título da receita"
      />

      <Text style={styles.label}>Ingredientes</Text>
      <TextInput
        style={styles.input}
        value={ingredientes}
        onChangeText={setIngredientes}
        placeholder="Ex: farinha, ovos, leite"
      />

      <Text style={styles.label}>Modo de preparo</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={modoPreparo}
        onChangeText={setModoPreparo}
        placeholder="Modo de preparo"
        multiline
      />

      <Text style={styles.label}>Imagem URL</Text>
      <TextInput
        style={styles.input}
        value={imagem}
        onChangeText={setImagem}
        placeholder="URL da imagem"
      />

      <TouchableOpacity style={styles.botao} onPress={salvarEdicao}>
        <Text style={styles.botaoTexto}>Salvar Alterações</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/*
  Estilização da tela de edição
*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f3ee",
    padding: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#3d2b1f",
    marginTop: 10,
  },
  subtitulo: {
    fontSize: 15,
    color: "#7a6a5c",
    marginTop: 6,
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    color: "#3d2b1f",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d8cfc5",
    borderRadius: 12,
    padding: 14,
    backgroundColor: "#fff",
    fontSize: 15,
  },
  textArea: {
    height: 130,
    textAlignVertical: "top",
  },
  botao: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "#3d7a4f",
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 30,
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
});