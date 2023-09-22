const express = require("express");
const app = express();
const port = 3000;

const rotas = require("./rotas");

app.use(express.json());
app.use(rotas);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
