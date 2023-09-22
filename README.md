# DesfioBackendModulo02SistemaBancarioB2bIfoodT07
ApiBancaria

##Projeto do Banco Digital - API
Este projeto consiste na criação de uma API RESTful para um Banco Digital, desenvolvido como parte de um projeto piloto para a empresa CUBOS. A API oferece funcionalidades como criação de conta bancária, listagem de contas, atualização de dados do usuário, exclusão de contas, depósito, saque, transferência, consulta de saldo e emissão de extrato bancário.

##Desafio
Construir uma API seguindo o padrão REST que cumpra com os requisitos estabelecidos pela empresa CUBOS. Os dados do banco são imutáveis e são persistidos em memória no objeto existente no arquivo bancodedados.js.

##Estrutura do Projeto
index.js: Arquivo principal
rotas.js: Arquivo de definição de rotas
controladores/: Pasta com os controladores para cada endpoint
bancodedados.js: Arquivo com a estrutura de dados do banco
##Requisitos Obrigatórios
Seguir o padrão REST
Organização do código com responsabilidades bem definidas
Representar valores (dinheiro) em centavos
Evitar códigos duplicados
##Status Code
200 (OK)
201 (Created)
204 (No Content)
400 (Bad Request)
401 (Unauthorized)
403 (Forbidden)
404 (Not Found)
500 (Internal Server Error)
##Endpoints Principais
###Listar contas bancárias
####Endpoint: GET /contas?senha_banco=Cubos123Bank

Verificar se a senha do banco foi informada
Validar se a senha do banco está correta
##Criar conta bancária
###Endpoint: POST /contas

Criar uma nova conta com número único
CPF e E-mail devem ser únicos
Verificar se todos os campos foram informados
Definir saldo inicial como 0
##Atualizar usuário da conta bancária
###Endpoint: PUT /contas/:numeroConta/usuario

Atualizar os dados do usuário de uma conta bancária
##Excluir Conta
###Endpoint: DELETE /contas/:numeroConta

Excluir uma conta bancária se o saldo for 0
##Depositar
###Endpoint: POST /transacoes/depositar

Somar o valor do depósito ao saldo de uma conta válida
Registrar a transação de depósito
##Sacar
###Endpoint: POST /transacoes/sacar

Realizar o saque de um valor de uma determinada conta bancária
Registrar a transação de saque
##Transferir
###Endpoint: POST /transacoes/transferir

Permitir a transferência de recursos de uma conta bancária para outra
Registrar a transação de transferência
##Saldo
###Endpoint: GET /contas/saldo?numero_conta=123&senha=123

Retornar o saldo de uma conta bancária
##Extrato
###Endpoint: GET /contas/extrato?numero_conta=123&senha=123

Listar as transações realizadas de uma conta específica
Retornar a lista de transferências, depósitos e saques da conta em questão
