const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const SECRET = "block-secret";

// 🔗 MongoDB
mongoose.connect("mongodb+srv://Pedro:Orca1234@cluster0.lk9kiqy.mongodb.net/blockjogos?retryWrites=true&w=majority");

mongoose.connection.on("connected", () => {
  console.log("MongoDB conectado 🚀");
});

// 🧠 USER MODEL
const User = mongoose.model("User", {
  username: String,
  password: String
});

// 🏠 HOME (LOGIN)
app.get("/", (req, res) => {
  res.send(`
    <html>
      <body style="font-family:sans-serif;text-align:center;background:#111;color:white">
        <h1>Block Jogos LOGIN</h1>

        <form method="POST" action="/login">
          <input name="username" placeholder="usuário"><br><br>
          <input name="password" type="password" placeholder="senha"><br><br>
          <button type="submit">Entrar</button>
        </form>
      </body>
    </html>
  `);
});

// 🔐 REGISTER
app.post("/register", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json({ message: "Usuário criado" });
});

// 🔐 LOGIN
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: "Usuário não existe" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: "Senha errada" });

  const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "2h" });

  res.send(`
    <h2>Logado com sucesso 🚀</h2>
    <p>Token: ${token}</p>
    <a href="/">voltar</a>
  `);
});

// 🎮 DASHBOARD
app.get("/dashboard", (req, res) => {
  res.send(`
    <h1>Dashboard Block Jogos 🚀</h1>
    <p>Você está logado</p>
  `);
});

// 🚀 START SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});