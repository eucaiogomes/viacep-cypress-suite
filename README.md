# 📮 ViaCEP — Cypress Test Suite

Suite completa de testes automatizados para a [API ViaCEP](https://viacep.com.br), com relatório HTML interativo.

<img width="1103" height="711" alt="image" src="https://github.com/user-attachments/assets/2e41ef70-b86b-4010-9ac4-2c0886e61565" />


---

## 📁 Estrutura

```
viacep-cypress/
├── cypress/
│   ├── e2e/
│   │   ├── 01-cep-valido.cy.js        # CEPs válidos — dados, formato, múltiplas cidades
│   │   ├── 02-cep-invalido.cy.js      # CEPs inválidos e formato errado
│   │   └── 03-schema-performance.cy.js # Validação de schema + tempo de resposta
│   ├── fixtures/
│   │   └── data.json                  # CEPs de teste e schema esperado
│   └── support/
│       ├── commands.js                # Comandos customizados
│       └── e2e.js                     # Setup global + coleta de falhas
├── scripts/
│   └── generate-report.js            # Gerador de relatório HTML
├── report/                            # Relatórios gerados (git ignored)
├── cypress.config.js
└── package.json
```

---

## 🚀 Como executar

```bash
npm install

# Rodar tudo e gerar relatório
npm run test:full

# Só os testes
npm test

# Interface visual
npm run test:open
```

---

## ✅ Cobertura

| Suite | Cenários |
|-------|----------|
| ✅ CEPs Válidos | Status 200, dados corretos, múltiplas cidades, CEP com hífen, DDD, IBGE |
| ❌ CEPs Inválidos | campo `erro: true`, CEP inexistente, resposta mínima |
| ⚠️ Formato Errado | Status 400 para letras, dígitos a mais/menos, caracteres especiais |
| 📐 Schema | 10 campos obrigatórios, tipos, UF válida, consistência entre CEPs |
| ⚡ Performance | Tempo < 2s para válidos, < 1s para formato errado |

---

## 🛠️ Tecnologias

- [Cypress 13](https://www.cypress.io/)
- [ViaCEP API](https://viacep.com.br)
- [Node.js](https://nodejs.org/)
"# viacep-cypress-suite" 
