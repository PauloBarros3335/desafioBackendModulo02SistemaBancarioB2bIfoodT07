const express = require("express");
const contasController = require("./Controladores/controladores/contasController");
const transacoesController = require("./Controladores/controladores/transacoesController");

const router = express.Router();

router.get("/contas", contasController.listarContas);
router.post("/contas", contasController.criarConta);
router.put(
  "/contas/:numeroConta/usuario",
  contasController.atualizarUsuarioConta
);
router.delete("/contas/:numeroConta", contasController.excluirConta);

router.post("/transacoes/depositar", transacoesController.depositar);
router.post("/transacoes/sacar", transacoesController.sacar);
router.post("/transacoes/transferir", transacoesController.transferir);
router.get("/contas/saldo", transacoesController.consultarSaldo);
router.get("/contas/extrato", transacoesController.emitirExtrato);

module.exports = router;
