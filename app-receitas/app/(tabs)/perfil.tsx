import { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../services/api";

/*
  Tipagem do usuário salvo localmente
*/
type Usuario = {
  _id: string;
  nome: string;
  email: string;
};

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

export default function Perfil() {
  /*
    Router usado para redirecionar após logout
  */
  const router = useRouter();

  /*
    Estados da tela
  */
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [totalReceitas, setTotalReceitas] = useState(0);
  const [totalFavoritas, setTotalFavoritas] = useState(0);

  /*
    Carrega dados do usuário e estatísticas sempre que a tela recebe foco
  */
  useFocusEffect(
    useCallback(() => {
      async function carregarPerfil() {
        try {
          const usuarioSalvo = await AsyncStorage.getItem("usuario");

          if (usuarioSalvo) {
            setUsuario(JSON.parse(usuarioSalvo));
          }

          const res = await api.get<Receita[]>("/receitas");

          setTotalReceitas(res.data.length);
          setTotalFavoritas(res.data.filter((r) => r.favorita).length);
        } catch (err) {
          console.log("Erro ao carregar perfil:", err);
        }
      }

      carregarPerfil();
    }, [])
  );

  /*
    Remove usuário salvo e retorna para tela de login
  */
  async function logout() {
    await AsyncStorage.removeItem("usuario");

    Alert.alert("Logout", "Você saiu da conta.");

    router.replace("/login");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Perfil</Text>
      <Text style={styles.subtitulo}>Informações da sua conta e uso do app</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nome</Text>
        <Text style={styles.valor}>{usuario?.nome || "Usuário"}</Text>

        <Text style={styles.label}>E-mail</Text>
        <Text style={styles.valor}>{usuario?.email || "Não informado"}</Text>
      </View>

      <View style={styles.estatisticas}>
        <View style={styles.caixa}>
          <Text style={styles.numero}>{totalReceitas}</Text>
          <Text style={styles.descricao}>Receitas</Text>
        </View>

        <View style={styles.caixa}>
          <Text style={styles.numero}>{totalFavoritas}</Text>
          <Text style={styles.descricao}>Favoritas</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.botaoSair} onPress={logout}>
        <Text style={styles.botaoTexto}>Sair da Conta</Text>
      </TouchableOpacity>
    </View>
  );
}

/*
  Estilização da tela de perfil
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
  label: {
    fontSize: 13,
    color: "#7a6a5c",
    marginTop: 8,
  },
  valor: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#3d2b1f",
    marginTop: 2,
  },
  estatisticas: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  caixa: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  numero: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#3d7a4f",
  },
  descricao: {
    fontSize: 14,
    color: "#7a6a5c",
    marginTop: 4,
  },
  botaoSair: {
    marginTop: 10,
    padding: 16,
    backgroundColor: "#b84a3a",
    borderRadius: 12,
    alignItems: "center",
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
});