const bancoDeDados = require("../../bancodedados");

const listarContas = (req, res) => {
  const senhaBanco = req.query.senha_banco;

  // Verifica se a senha do banco foi informada
  if (!senhaBanco) {
    return res
      .status(400)
      .json({ mensagem: "A senha do banco deve ser informada." });
  }

  // Verifica se a senha do banco está correta
  if (senhaBanco !== bancoDeDados.banco.senha) {
    return res
      .status(401)
      .json({ mensagem: "A senha do banco informada é inválida!" });
  }

  // Retorna a lista de contas bancárias
  const contas = bancoDeDados.contas.map((conta) => ({
    numero: conta.numero,
    saldo: conta.saldo,
    usuario: {
      nome: conta.usuario.nome,
      cpf: conta.usuario.cpf,
      data_nascimento: conta.usuario.data_nascimento,
      telefone: conta.usuario.telefone,
      email: conta.usuario.email,
      senha: conta.usuario.senha,
    },
  }));

  return res.status(200).json(contas);
};

// Inicializa o contador de contas
let contadorDeContas = 1;
const criarConta = (req, res) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

  // Verifica se todos os campos obrigatórios foram fornecidos
  if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
    return res
      .status(400)
      .json({ mensagem: "Todos os campos são obrigatórios." });
  }

  // Verifica se já existe uma conta com o mesmo CPF ou e-mail
  const contaComCpfExistente = bancoDeDados.contas.find(
    (conta) => conta.usuario.cpf === cpf
  );
  const contaComEmailExistente = bancoDeDados.contas.find(
    (conta) => conta.usuario.email === email
  );

  if (contaComCpfExistente || contaComEmailExistente) {
    return res
      .status(400)
      .json({ mensagem: "Já existe uma conta com o CPF ou e-mail informado." });
  }

  // Gera um número único para identificação da conta
  const numeroConta = contadorDeContas++;

  // Cria a nova conta
  const novaConta = {
    numero: numeroConta.toString(),
    saldo: 0,
    usuario: {
      nome,
      cpf,
      data_nascimento,
      telefone,
      email,
      senha,
    },
  };

  // Adiciona a nova conta à lista de contas
  bancoDeDados.contas.push(novaConta);

  return res.status(201).end();
};

const atualizarUsuarioConta = (req, res) => {
  const numeroConta = req.params.numeroConta;
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

  // Verifica se todos os campos obrigatórios foram fornecidos
  if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
    return res
      .status(400)
      .json({ mensagem: "Todos os campos são obrigatórios." });
  }

  // Encontra a conta com o número fornecido
  const conta = bancoDeDados.contas.find(
    (conta) => conta.numero === numeroConta
  );

  // Verifica se a conta existe
  if (!conta) {
    return res.status(404).json({ mensagem: "Conta não encontrada." });
  }

  // Verifica se o CPF ou o e-mail já existem em outras contas
  const isCpfTaken = bancoDeDados.contas.some(
    (conta) => conta.usuario.cpf === cpf && conta.numero !== numeroConta
  );
  const isEmailTaken = bancoDeDados.contas.some(
    (conta) => conta.usuario.email === email && conta.numero !== numeroConta
  );

  if (isCpfTaken || isEmailTaken) {
    return res
      .status(400)
      .json({ mensagem: "O CPF ou e-mail já está cadastrado em outra conta." });
  }

  // Atualiza os dados do usuário da conta
  conta.usuario = {
    nome,
    cpf,
    data_nascimento,
    telefone,
    email,
    senha,
  };

  return res.status(200).end();
};

const excluirConta = (req, res) => {
  const { numeroConta } = req.params;

  const contaIndex = bancoDeDados.contas.findIndex(
    (conta) => conta.numero === numeroConta
  );

  if (contaIndex === -1) {
    return res.status(404).json({ mensagem: "Conta não encontrada." });
  }

  const conta = bancoDeDados.contas[contaIndex];

  if (conta.saldo !== 0) {
    return res
      .status(400)
      .json({ mensagem: "A conta só pode ser removida se o saldo for zero!" });
  }

  bancoDeDados.contas.splice(contaIndex, 1);

  res.status(200).json({ mensagem: "Conta removida com sucesso." });
};

module.exports = {
  listarContas,
  criarConta,
  atualizarUsuarioConta,
  excluirConta,
};
