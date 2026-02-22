describe('📐 Schema e ⚡ Performance', () => {
    let data

    before(() => {
        cy.fixture('data').then((f) => { data = f })
    })

    // ──────────────────────────────────────────
    // Validação de Schema
    // ──────────────────────────────────────────
    context('Validação de Schema', () => {
        it('resposta deve conter todos os 10 campos obrigatórios', () => {
            cy.buscarCEP('01310100').then((res) => {
                cy.validarSchemaCEP(res.body, data.schemaObrigatorio)
                cy.saveResult('Schema', 'Resposta contém todos os 10 campos obrigatórios', 'passed')
            })
        })

        it('campo "cep" deve ser string', () => {
            cy.buscarCEP('01310100').then((res) => {
                expect(res.body.cep).to.be.a('string')
                cy.saveResult('Schema', 'Campo "cep" é do tipo string', 'passed')
            })
        })

        it('campo "uf" deve ter exatamente 2 caracteres', () => {
            cy.buscarCEP('01310100').then((res) => {
                expect(res.body.uf).to.have.length(2)
                cy.saveResult('Schema', 'Campo "uf" tem exatamente 2 caracteres', 'passed')
            })
        })

        it('campo "uf" deve ser uma UF brasileira válida', () => {
            cy.buscarCEP('01310100').then((res) => {
                expect(data.ufsValidas).to.include(res.body.uf)
                cy.saveResult('Schema', 'Campo "uf" é uma UF brasileira válida', 'passed')
            })
        })

        it('campo "localidade" não deve ser vazio para CEP válido', () => {
            cy.buscarCEP('01310100').then((res) => {
                expect(res.body.localidade).to.be.a('string').and.not.empty
                cy.saveResult('Schema', 'Campo "localidade" não está vazio', 'passed')
            })
        })

        it('campo "ibge" deve ter entre 6 e 7 dígitos', () => {
            cy.buscarCEP('01310100').then((res) => {
                expect(res.body.ibge.length).to.be.within(6, 7)
                cy.saveResult('Schema', 'Campo "ibge" tem 6 ou 7 dígitos', 'passed')
            })
        })

        it('campo "ddd" deve ter exatamente 2 dígitos', () => {
            cy.buscarCEP('01310100').then((res) => {
                expect(res.body.ddd).to.have.length(2)
                cy.saveResult('Schema', 'Campo "ddd" tem exatamente 2 dígitos', 'passed')
            })
        })

        it('schema deve ser consistente em múltiplos CEPs', () => {
            const ceps = ['01310100', '20040020', '80010010']
            ceps.forEach((cep) => {
                cy.buscarCEP(cep).then((res) => {
                    cy.validarSchemaCEP(res.body, data.schemaObrigatorio)
                })
            })
            cy.saveResult('Schema', 'Schema é consistente em múltiplos CEPs', 'passed')
        })
    })

    // ──────────────────────────────────────────
    // Tempo de Resposta
    // ──────────────────────────────────────────
    context('Tempo de Resposta', () => {
        it('deve responder em menos de 2 segundos para CEP válido', () => {
            cy.buscarCEPComTempo('01310100').then(({ duracao }) => {
                expect(duracao).to.be.lessThan(2000)
                cy.saveResult('Performance', `CEP válido respondeu em ${duracao}ms (< 2000ms)`, 'passed')
            })
        })

        it('deve responder em menos de 2 segundos para CEP inválido', () => {
            cy.buscarCEPComTempo('00000000').then(({ duracao }) => {
                expect(duracao).to.be.lessThan(2000)
                cy.saveResult('Performance', `CEP inválido respondeu em ${duracao}ms (< 2000ms)`, 'passed')
            })
        })

        it('deve responder em menos de 1 segundo para formato errado (erro rápido)', () => {
            cy.buscarCEPComTempo('1234').then(({ duracao }) => {
                expect(duracao).to.be.lessThan(1000)
                cy.saveResult('Performance', `Formato errado respondeu em ${duracao}ms (< 1000ms)`, 'passed')
            })
        })

        it('tempo de resposta deve ser consistente em 3 chamadas seguidas', () => {
            const tempos = []
                ;['01310100', '20040020', '80010010'].forEach((cep) => {
                    cy.buscarCEPComTempo(cep).then(({ duracao }) => {
                        tempos.push(duracao)
                        expect(duracao).to.be.lessThan(3000)
                    })
                })
            cy.saveResult('Performance', 'Tempo consistente em 3 chamadas seguidas (< 3000ms cada)', 'passed')
        })
    })
})
