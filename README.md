# 📮 ViaCEP — Cypress Test Suite

Suite completa de testes automatizados para a [API ViaCEP](https://viacep.com.br), com análise inteligente de falhas via **Grok AI** e relatório HTML interativo.

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
│   └── generate-report.js            # Relatório HTML + Grok AI
├── report/                            # Relatórios gerados (git ignored)
├── cypress.config.js
└── package.json
```

---

## 🚀 Como executar

```bash
npm install

# Configurar chave Grok (opcional)
export GROK_API_KEY=sua_chave_aqui

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

## 🤖 Grok AI

Falhas capturadas automaticamente e enviadas para diagnóstico via API xAI.
Obtenha sua chave em: [console.x.ai](https://console.x.ai)

---

## 🛠️ Tecnologias

- [Cypress 13](https://www.cypress.io/)
- [ViaCEP API](https://viacep.com.br)
- [Grok AI — xAI](https://x.ai)
- [Node.js](https://nodejs.org/)
"# viacep-cypress-suite" 
