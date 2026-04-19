const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔗 MONGODB
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("MongoDB conectado 🚀"))
.catch(err => console.log("Erro MongoDB:", err));

// 🧠 USER MODEL
const User = mongoose.model("User", {
  email: String,
  password: String
});

// 🏠 HOME
app.get("/", (req, res) => {
  res.send("Block Jogos API ONLINE 🚀");
});

// 📝 REGISTER
app.post("/register", async (req, res) => {
  try {
    const hashed = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      email: req.body.email,
      password: hashed
    });

    await user.save();
    res.json({ message: "Usuário criado 🚀" });

  } catch (err) {
    res.json({ error: err.message });
  }
});

// 🔐 LOGIN
app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({ error: "Usuário não existe" });
    }

    const ok = await bcrypt.compare(req.body.password, user.password);

    if (!ok) {
      return res.status(400).json({ error: "Senha errada" });
    }

    const token = jwt.sign({ id: user._id }, "block-secret", {
      expiresIn: "2h"
    });

    res.json({
      message: "Login OK 🚀",
      token
    });

  } catch (err) {
    res.json({ error: err.message });
  }
});

// 🎮 DASHBOARD TESTE
app.get("/dashboard", (req, res) => {
  res.send("Dashboard Block Jogos 🚀");
});

// 🚀 START SERVER (OBRIGATÓRIO NO RENDER)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});