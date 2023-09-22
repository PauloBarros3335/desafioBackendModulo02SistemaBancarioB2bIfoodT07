const bancoDeDados = require("../../bancodedados");

const depositar = (req, res) => {
  const { numero_conta, valor } = req.body;

  if (!numero_conta || !valor) {
    return res
      .status(400)
      .json({ mensagem: "O número da conta e o valor são obrigatórios." });
  }

  const conta = bancoDeDados.contas.find(
    (conta) => conta.numero === numero_conta
  );

  if (!conta) {
    return res.status(404).json({ mensagem: "Conta não encontrada." });
  }

  conta.saldo += valor;
  bancoDeDados.depositos.push({
    data: new Date(),
    numero_conta: conta.numero,
    valor,
  });

  return res.status(200).json({ mensagem: "Depósito realizado com sucesso." });
};

const sacar = (req, res) => {
  const { numero_conta, valor, senha } = req.body;

  if (!numero_conta || !valor || !senha) {
    return res.status(400).json({
      mensagem: "O número da conta, o valor e a senha são obrigatórios.",
    });
  }

  const conta = bancoDeDados.contas.find(
    (conta) => conta.numero === numero_conta
  );

  if (!conta) {
    return res.status(404).json({ mensagem: "Conta não encontrada." });
  }

  if (conta.usuario.senha !== senha) {
    return res.status(401).json({ mensagem: "Senha incorreta." });
  }

  if (valor <= 0) {
    return res
      .status(400)
      .json({ mensagem: "O valor não pode ser menor ou igual a zero." });
  }

  if (conta.saldo < valor) {
    return res.status(400).json({ mensagem: "Saldo insuficiente." });
  }

  conta.saldo -= valor;
  bancoDeDados.saques.push({
    data: new Date(),
    numero_conta: conta.numero,
    valor,
  });

  res.status(200).json({ mensagem: "Saque realizado com sucesso." });
};

const transferir = (req, res) => {
  const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

  if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
    return res.status(400).json({
      mensagem: "Os números das contas, o valor e a senha são obrigatórios.",
    });
  }

  const contaOrigem = bancoDeDados.contas.find(
    (conta) => conta.numero === numero_conta_origem
  );
  const contaDestino = bancoDeDados.contas.find(
    (conta) => conta.numero === numero_conta_destino
  );

  if (!contaOrigem || !contaDestino) {
    return res
      .status(404)
      .json({ mensagem: "Conta de origem ou destino não encontrada." });
  }

  if (contaOrigem.usuario.senha !== senha) {
    return res.status(401).json({ mensagem: "Senha incorreta." });
  }

  if (valor <= 0) {
    return res
      .status(400)
      .json({ mensagem: "O valor não pode ser menor ou igual a zero." });
  }

  if (contaOrigem.saldo < valor) {
    return res.status(400).json({ mensagem: "Saldo insuficiente." });
  }

  contaOrigem.saldo -= valor;
  contaDestino.saldo += valor;

  bancoDeDados.transferencias.push({
    data: new Date(),
    numero_conta_origem: contaOrigem.numero,
    numero_conta_destino: contaDestino.numero,
    valor,
  });

  res.status(200).json({ mensagem: "Transferência realizada com sucesso." });
};

const consultarSaldo = (req, res) => {
  const { numero_conta, senha } = req.query;

  if (!numero_conta || !senha) {
    return res
      .status(400)
      .json({ mensagem: "O número da conta e a senha são obrigatórios." });
  }

  const conta = bancoDeDados.contas.find(
    (conta) => conta.numero === numero_conta
  );

  if (!conta) {
    return res.status(404).json({ mensagem: "Conta não encontrada." });
  }

  if (conta.usuario.senha !== senha) {
    return res.status(401).json({ mensagem: "Senha incorreta." });
  }

  res.status(200).json({ saldo: conta.saldo });
};

const emitirExtrato = (req, res) => {
  const { numero_conta, senha } = req.query;

  if (!numero_conta || !senha) {
    return res
      .status(400)
      .json({ mensagem: "O número da conta e a senha são obrigatórios." });
  }

  const conta = bancoDeDados.contas.find(
    (conta) => conta.numero === numero_conta
  );

  if (!conta) {
    return res.status(404).json({ mensagem: "Conta não encontrada." });
  }

  if (conta.usuario.senha !== senha) {
    return res.status(401).json({ mensagem: "Senha incorreta." });
  }

  const extrato = {
    depositos: bancoDeDados.depositos.filter(
      (transacao) => transacao.numero_conta === numero_conta
    ),
    saques: bancoDeDados.saques.filter(
      (transacao) => transacao.numero_conta === numero_conta
    ),
    transferenciasEnviadas: bancoDeDados.transferencias.filter(
      (transacao) => transacao.numero_conta_origem === numero_conta
    ),
    transferenciasRecebidas: bancoDeDados.transferencias.filter(
      (transacao) => transacao.numero_conta_destino === numero_conta
    ),
  };

  res.status(200).json(extrato);
};

module.exports = {
  depositar,
  sacar,
  transferir,
  consultarSaldo,
  emitirExtrato,
};
