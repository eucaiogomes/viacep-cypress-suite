Cypress.Commands.add('buscarCEP', (cep) => {
    return cy.request({
        method: 'GET',
        url: `/${cep}/json/`,
        failOnStatusCode: false
    })
})

Cypress.Commands.add('buscarCEPComTempo', (cep) => {
    const inicio = Date.now()
    return cy.request({
        method: 'GET',
        url: `/${cep}/json/`,
        failOnStatusCode: false
    }).then((res) => {
        const fim = Date.now()
        return {
            status: res.status,
            body: res.body,
            duracao: fim - inicio
        }
    })
})

Cypress.Commands.add('saveResult', (suite, testName, status) => {
    const result = {
        suite,
        testName,
        status,
        timestamp: new Date().toISOString()
    }

    // Garantir que o diretório existe (feito no node, mas garantimos aqui via cy.writeFile que cria subdirs)
    const fileName = `cypress/results/res-${Date.now()}-${Math.random().toString(36).substr(2, 5)}.json`
    cy.writeFile(fileName, result)
})

Cypress.Commands.add('validarSchemaCEP', (body, schema) => {
    schema.forEach(campo => {
        expect(body).to.have.property(campo)
    })
})
