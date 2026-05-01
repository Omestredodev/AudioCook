import { useState } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import api from "../../services/api";

export default function Gravar() {
  /*
    Router usado para navegação após salvar
  */
  const router = useRouter();

  /*
    Estados do formulário
  */
  const [titulo, setTitulo] = useState("");
  const [ingredientes, setIngredientes] = useState("");
  const [modoPreparo, setModoPreparo] = useState("");
  const [imagem, setImagem] = useState("");

  /*
    Salva uma nova receita no backend
  */
  async function salvarReceita() {
    if (!titulo || !ingredientes || !modoPreparo) {
      Alert.alert("Atenção", "Preencha título, ingredientes e modo de preparo.");
      return;
    }

    try {
      await api.post("/receitas", {
        titulo,
        modoPreparo,
        ingredientes: ingredientes.split(",").map((item) => item.trim()),
        imagem: imagem || "https://via.placeholder.com/150",
        favorita: false,
      });

      Alert.alert("Sucesso", "Receita salva com sucesso.");

      setTitulo("");
      setIngredientes("");
      setModoPreparo("");
      setImagem("");

      router.push("/");
    } catch (err) {
      console.log("Erro ao salvar receita:", err);
      Alert.alert("Erro", "Não foi possível salvar a receita.");
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Nova Receita</Text>
      <Text style={styles.subtitulo}>
        Cadastre uma receita para acessar depois no modo cozinha.
      </Text>

      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Bolo de Cenoura"
        value={titulo}
        onChangeText={setTitulo}
      />

      <Text style={styles.label}>Ingredientes</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: cenoura, farinha, ovos"
        value={ingredientes}
        onChangeText={setIngredientes}
      />

      <Text style={styles.label}>Modo de preparo</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Descreva o modo de preparo"
        value={modoPreparo}
        onChangeText={setModoPreparo}
        multiline
      />

      <Text style={styles.label}>Imagem URL</Text>
      <TextInput
        style={styles.input}
        placeholder="Cole o link da imagem"
        value={imagem}
        onChangeText={setImagem}
      />

      <TouchableOpacity style={styles.botao} onPress={salvarReceita}>
        <Text style={styles.botaoTexto}>Salvar Receita</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/*
  Estilização da tela de criação
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