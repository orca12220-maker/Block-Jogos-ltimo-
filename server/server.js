const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexão MongoDB
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("MongoDB conectado 🚀"))
.catch((err) => console.log("Erro MongoDB:", err));

// Rota teste
app.get("/", (req, res) => {
  res.send("API da loja rodando 🚀");
});

// Rotas (se tiver)
app.use("/products", require("./routes/productRoutes"));

// Porta do Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});