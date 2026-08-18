link : https://symphonious-gumdrop-f6a39a.netlify.app/index.html
Versão: 2.0.
Abaixo está em Markdown puro: coloque nesse site -> https://markdownlivepreview.com/


Baixa e preencher.
[Documento_Execucao_Testes(1) (1).docx](https://github.com/user-attachments/files/31189241/Documento_Execucao_Testes.1.1.docx)


Exemplo abaixo :
# Documento de Execução e Registro de Testes

**Projeto:** Sistema de Gerenciamento de Estoque e Usuários  
**Tester:** __________________________________________  
**Data:** ____/____/________  
**Ambiente:** ________________________________________  
**Navegador:** _______________________________________  
**Versão do sistema:** _______________________________

---

## 1. Orientações para o Tester

Execute cada cenário seguindo exatamente as informações apresentadas.

Durante os testes:

- Não altere os dados de entrada definidos no cenário sem registrar a alteração.
- Observe o comportamento da aplicação.
- Registre mensagens apresentadas pelo sistema.
- Verifique se o resultado obtido corresponde ao resultado esperado.
- Caso encontre um comportamento inesperado, descreva-o detalhadamente.
- Registre problemas de lentidão, travamento, redirecionamento, validação ou comportamento inconsistente.
- Sempre que possível, registre o horário em que o teste foi executado.
- Não tente corrigir o problema durante a execução do teste.
- O campo **Resultado do Teste** deve ser preenchido somente após a execução.

---

# 2. Critério de Classificação

| Status | Descrição |
|---|---|
| **APROVADO** | O comportamento observado corresponde ao esperado. |
| **REPROVADO** | O comportamento observado é diferente do esperado ou apresenta algum problema. |
| **BLOQUEADO** | Não foi possível executar o cenário devido a outro problema. |
| **N/A** | Cenário não aplicável ao ambiente utilizado. |

---

# 3. Cadastro

| ID | Cenário | Entrada / Procedimento | Resultado Esperado | Resultado Obtido | Status | Observações |
|---|---|---|---|---|---|---|
| CT01 | Cadastro completo e válido | Preencher todos os campos corretamente | Usuário criado | | | |
| CT02 | CPF vazio | CPF = `""` | Sistema deve apresentar o comportamento esperado para o campo | | | |
| CT03 | Nome social vazio | Nome social = `""` | Sistema deve apresentar o comportamento esperado para o campo | | | |
| CT04 | Endereço incompleto | Complemento="" e Bairro="" | Sistema deve apresentar o comportamento esperado para os campos | | | |
| CT05 | Senha com 5 caracteres | senha = `12345` | Cadastro deve respeitar a regra de senha | | | |
| CT06 | Senha com 6 caracteres | senha = `123456` | Cadastro deve respeitar a regra de senha | | | |
| CT07 | Senha com mais de 6 caracteres | senha = `minhasenha` | Cadastro deve respeitar a regra de senha | | | |
| CT08 | Senha vazia | senha = `""` | Cadastro deve respeitar a obrigatoriedade da senha | | | |
| CT09 | Senhas diferentes | Senha diferente da confirmação | Sistema deve impedir o cadastro | | | |
| CT10 | Usuário duplicado | Utilizar username já existente | Sistema deve impedir duplicidade | | | |
| CT11 | E-mail duplicado | Utilizar e-mail já cadastrado | Sistema deve impedir duplicidade | | | |
| CT12 | Nome muito curto | nome = `Jo` | Sistema deve validar o tamanho do nome | | | |
| CT13 | Nome muito longo | Nome com 101 ou mais caracteres | Sistema deve validar o tamanho do nome | | | |
| CT14 | CEP inválido | cep = `1234` | Sistema deve validar o CEP | | | |
| CT15 | Data futura | birth_date = `2099-01-01` | Sistema deve validar a data informada | | | |

### Observações gerais do módulo de Cadastro

**Observações:**

> 

---

# 4. Login

| ID | Cenário | Entrada / Procedimento | Resultado Esperado | Resultado Obtido | Status | Observações |
|---|---|---|---|---|---|---|
| CT16 | Usuário e senha corretos | `joao123 / 123456` | Login realizado | | | |
| CT17 | Senha incorreta | `joao123 / senhaerrada` | Login deve ser recusado | | | |
| CT18 | Usuário inexistente | `usuario_que_nao_existe / 123` | Login deve ser recusado | | | |
| CT19 | Senha vazia | `joao123 / ""` | Login deve ser recusado | | | |
| CT20 | Usuário vazio | `"" / 123456` | Login deve ser recusado | | | |
| CT21 | Espaços no usuário | `" joao123 " / 123456` | Verificar comportamento do sistema | | | |
| CT22 | Caracteres especiais | `joao@#$! / qualquer` | Login deve respeitar a validação do usuário | | | |
| CT23 | Letras maiúsculas | `JOAO123 / 123456` | Verificar comportamento relacionado ao usuário informado | | | |
| CT24 | Usuário inativo | `pedro99 / pass1234` | Usuário inativo não deve acessar o sistema | | | |
| CT25 | Múltiplas tentativas | Realizar 5 tentativas com senha incorreta | Verificar comportamento do sistema após tentativas consecutivas | | | |

### Observações gerais do módulo de Login

**Observações:**

> 

---

# 5. Administração e CRUD

| ID | Cenário | Entrada / Procedimento | Resultado Esperado | Resultado Obtido | Status | Observações |
|---|---|---|---|---|---|---|
| CT26 | Visualizar usuários | Acessar lista administrativa | Lista deve ser apresentada | | | |
| CT27 | Pesquisar usuário | Digitar nome na busca | Sistema deve apresentar o resultado correspondente | | | |
| CT28 | Criar usuário | Administrador cria novo usuário | Usuário deve ser criado | | | |
| CT29 | Visualizar usuário | Abrir detalhes de um usuário | Dados devem ser apresentados | | | |
| CT30 | Editar usuário | Alterar dados de um usuário | Dados devem ser atualizados | | | |
| CT31 | Excluir usuário | Confirmar exclusão | Usuário deve ser removido | | | |
| CT32 | Editar campos obrigatórios vazios | Deixar campos obrigatórios em branco | Sistema deve realizar a validação | | | |
| CT33 | Excluir ID inexistente | Informar ID inválido | Sistema deve tratar o ID inexistente corretamente | | | |
| CT34 | Excluir usuário administrativo | Tentar excluir usuário administrativo | Sistema deve aplicar as regras de proteção existentes | | | |
| CT35 | Editar sem ID | Acessar tela de edição sem informar ID | Sistema deve apresentar o comportamento correspondente | | | |
| CT36 | Usuário duplicado na edição | Alterar username para um já existente | Sistema deve tratar a duplicidade | | | |

### Observações gerais do módulo Administrativo/CRUD

**Observações:**

> 

---

# 6. Autorização e Acesso

| ID | Cenário | Procedimento | Resultado Esperado | Resultado Obtido | Status | Observações |
|---|---|---|---|---|---|---|
| CT37 | Usuário comum acessando área administrativa | Entrar como `joao123` e tentar acessar a área administrativa | Acesso deve respeitar as permissões do usuário | | | |
| CT38 | Acesso sem autenticação | Abrir dashboard sem realizar login | Sistema deve controlar o acesso | | | |

### Observações gerais de Autorização

**Observações:**

> 

---

# 7. Desempenho e Responsividade

| ID | Cenário | Procedimento | Resultado Esperado | Resultado Obtido | Status | Observações |
|---|---|---|---|---|---|---|
| CT39 | Abrir lista administrativa | Administrador → lista de usuários | Lista deve carregar conforme comportamento esperado | | | |
| CT40 | Abrir detalhes | Administrador → detalhes do usuário | Detalhes devem carregar corretamente | | | |
| CT41 | Tela mobile | Utilizar resolução de 375px | Layout deve se adaptar corretamente | | | |
| CT42 | Campo de senha | Inspecionar o campo de senha | Senha não deve ficar exposta de maneira inadequada | | | |

---

# 8. Registro de Falhas Encontradas

Preencher somente quando um comportamento inesperado for identificado.

## Falha Nº: _______

**ID do teste:** __________________

**Data/Hora:** ___________________

**Tester:** ______________________

### Descrição do problema

> 

### Passos realizados para reproduzir

1. 
2. 
3. 
4. 

### Resultado esperado

> 

### Resultado obtido

> 

### O problema ocorreu novamente ao repetir o teste?

- [ ] Sim
- [ ] Não
- [ ] Parcialmente

### Frequência

- [ ] Sempre
- [ ] Frequentemente
- [ ] Algumas vezes
- [ ] Uma única vez

### Evidência disponível

- [ ] Print
- [ ] Vídeo
- [ ] Log
- [ ] Console do navegador
- [ ] Não disponível

### Observações adicionais

> 

---

# 9. Resumo da Execução

| Informação | Quantidade |
|---|---:|
| Total de cenários executados | |
| Aprovados | |
| Reprovados | |
| Bloqueados | |
| N/A | |
| Total de falhas registradas | |

---

# 10. Classificação das Falhas Encontradas

| Nº | ID do Teste | Descrição resumida | Severidade | Reproduzível? | Evidência |
|---|---|---|---|---|---|
| 01 | | | | | |
| 02 | | | | | |
| 03 | | | | | |
| 04 | | | | | |
| 05 | | | | | |
| 06 | | | | | |
| 07 | | | | | |
| 08 | | | | | |

### Severidade

| Severidade | Descrição |
|---|---|
| **Crítica** | Impede o funcionamento ou compromete seriamente o sistema. |
| **Alta** | Afeta uma funcionalidade importante. |
| **Média** | Afeta uma funcionalidade, mas existe alternativa para continuar o uso. |
| **Baixa** | Problema visual, textual ou de pequeno impacto. |

---

# 11. Avaliação Final do Tester

### O sistema apresentou comportamento consistente durante os testes?

- [ ] Sim
- [ ] Não
- [ ] Parcialmente

### As validações apresentaram comportamento adequado?

- [ ] Sim
- [ ] Não
- [ ] Parcialmente

### O controle de acesso apresentou comportamento adequado?

- [ ] Sim
- [ ] Não
- [ ] Parcialmente

### O sistema apresentou problemas de desempenho?

- [ ] Sim
- [ ] Não
- [ ] Não foi possível avaliar

### O sistema apresentou problemas de responsividade?

- [ ] Sim
- [ ] Não

### Observações finais

> admin
> admin123
> 

> 

> 

---

**Assinatura do Tester:** __________________________________________

**Data:** ____/____/________
