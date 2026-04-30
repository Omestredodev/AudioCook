import { useState } from "react";
import {
  View,
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
    Router usado para navegar após salvar a receita
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
    Salva a receita no backend
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

      Alert.alert("Sucesso", "Receita salva com sucesso!");

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
  Estilização da tela
*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  botao: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#2e7d32",
    borderRadius: 10,
    alignItems: "center",
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
});