const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();

/*
  MIDDLEWARES
  - cors: permite acesso externo (app no celular)
  - json: permite receber dados em JSON no body
*/
app.use(cors());
app.use(express.json());

/*
  CONEXÃO COM MONGODB
  A aplicação só inicia após conexão bem-sucedida
*/
mongoose
  .connect(
    "mongodb://Gomes:meste@ac-qhu8sax-shard-00-00.4yg3jxn.mongodb.net:27017,ac-qhu8sax-shard-00-01.4yg3jxn.mongodb.net:27017,ac-qhu8sax-shard-00-02.4yg3jxn.mongodb.net:27017/receitas?ssl=true&replicaSet=atlas-13m5se-shard-0&authSource=admin&retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("MongoDB conectado");

    app.listen(3000, () => {
      console.log("Servidor rodando na porta 3000");
    });
  })
  .catch((err) => {
    console.log("Erro ao conectar no MongoDB:", err);
  });

/*
  MODEL - Estrutura da coleção "receitas"
*/
const Receita = mongoose.model("Receita", {
  titulo: String,
  modoPreparo: String,
  ingredientes: [String],
  imagem: String,
  favorita: Boolean,
});

/*
  MODEL - Estrutura da coleção "usuarios"
*/
const Usuario = mongoose.model("Usuario", {
  nome: String,
  email: String,
  senha: String,
});

/*
  ROTAS DA API
*/

/*
  AUTH - Cadastro de usuário
*/
app.post("/cadastro", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    const usuarioExistente = await Usuario.findOne({ email });

    if (usuarioExistente) {
      return res.status(400).send({ erro: "E-mail já cadastrado" });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const usuario = new Usuario({
      nome,
      email,
      senha: senhaCriptografada,
    });

    await usuario.save();

    res.send({
      _id: usuario._id,
      nome: usuario.nome,
      email: usuario.email,
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

/*
  AUTH - Login de usuário
*/
app.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(400).send({ erro: "Usuário não encontrado" });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(400).send({ erro: "Senha inválida" });
    }

    res.send({
      _id: usuario._id,
      nome: usuario.nome,
      email: usuario.email,
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

/*
  CREATE - Criar nova receita
*/
app.post("/receitas", async (req, res) => {
  try {
    const receita = new Receita(req.body);
    await receita.save();
    res.send(receita);
  } catch (err) {
    res.status(500).send(err);
  }
});

/*
  READ - Listar todas as receitas
*/
app.get("/receitas", async (req, res) => {
  try {
    const receitas = await Receita.find();
    res.send(receitas);
  } catch (err) {
    res.status(500).send(err);
  }
});

/*
  READ - Buscar receita por ID
*/
app.get("/receitas/:id", async (req, res) => {
  try {
    const receita = await Receita.findById(req.params.id);

    if (!receita) {
      return res.status(404).send({ erro: "Receita não encontrada" });
    }

    res.send(receita);
  } catch (err) {
    res.status(500).send(err);
  }
});

/*
  UPDATE - Atualizar receita (ex: favoritar)
*/
app.put("/receitas/:id", async (req, res) => {
  try {
    const receita = await Receita.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // retorna o documento atualizado
    );

    if (!receita) {
      return res.status(404).send({ erro: "Receita não encontrada" });
    }

    res.send(receita);
  } catch (err) {
    res.status(500).send(err);
  }
});

/*
  DELETE - Remover receita
*/
app.delete("/receitas/:id", async (req, res) => {
  try {
    const receita = await Receita.findByIdAndDelete(req.params.id);

    if (!receita) {
      return res.status(404).send({ erro: "Receita não encontrada" });
    }

    res.send({ ok: true });
  } catch (err) {
    res.status(500).send(err);
  }
});