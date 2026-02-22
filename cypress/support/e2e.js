import './commands'

// Coleta de resultados para o relatório
Cypress.on('test:after:run', (test, runnable) => {
    if (test.state === 'failed') {
        const details = {
            title: test.title,
            fullTitle: test.fullTitle,
            error: test.err.message,
            stack: test.err.stack,
            suite: runnable.parent.title
        }

        // Salvar falha para análise da IA
        cy.writeFile(`cypress/results/fail-${Date.now()}.json`, details)
    }
})

beforeEach(() => {
    // Limpeza ou setup inicial se necessário
})
