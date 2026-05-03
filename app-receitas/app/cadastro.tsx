import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import api from "../services/api";

export default function Cadastro() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function handleCadastro() {
    if (!nome || !email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    try {
      await api.post("/cadastro", { nome, email, senha });

      Alert.alert("Sucesso", "Conta criada!");

      router.replace("/login");
    } catch (err: any) {
        const mensagem =
            err.response?.data?.erro || "Não foi possível cadastrar o usuário.";

        Alert.alert("Erro no cadastro", mensagem);
        }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cadastro</Text>

        <TextInput
        style={styles.input}
        placeholder="Digite seu nome"
        placeholderTextColor="#999"
        value={nome}
        onChangeText={setNome}
        />

        <TextInput
        style={styles.input}
        placeholder="Digite seu e-mail"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        />

        <TextInput
        style={styles.input}
        placeholder="Crie uma senha"
        placeholderTextColor="#999"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
        />

      <TouchableOpacity style={styles.botao} onPress={handleCadastro}>
        <Text style={styles.botaoTexto}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.link}>Já tenho conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f7f3ee",
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  botao: {
    backgroundColor: "#3d7a4f",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    textAlign: "center",
    color: "#3d7a4f",
  },
});