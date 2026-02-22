describe('❌ CEPs Inválidos e Formato Errado', () => {
    let data

    before(() => {
        cy.fixture('data').then((f) => { data = f })
    })

    // ──────────────────────────────────────────
    // CEPs inexistentes (formato correto mas não existem)
    // ──────────────────────────────────────────
    context('CEP Inexistente', () => {
        it('deve retornar campo "erro: true" para CEP 00000-000', () => {
            cy.buscarCEP('00000000').then((res) => {
                expect(res.status).to.eq(200)
                expect(res.body).to.have.property('erro', true)
                cy.saveResult('CEPs Inválidos', 'CEP 00000000 retorna erro: true', 'passed')
            })
        })

        it('deve retornar campo "erro: true" para CEP 99999-999', () => {
            cy.buscarCEP('99999999').then((res) => {
                expect(res.status).to.eq(200)
                expect(res.body).to.have.property('erro', true)
                cy.saveResult('CEPs Inválidos', 'CEP 99999999 retorna erro: true', 'passed')
            })
        })

        it('deve retornar apenas o campo "erro" quando CEP não existe', () => {
            cy.buscarCEP('00000000').then((res) => {
                expect(Object.keys(res.body)).to.deep.eq(['erro'])
                cy.saveResult('CEPs Inválidos', 'Resposta de CEP inexistente contém apenas "erro"', 'passed')
            })
        })

        it('todos os CEPs inválidos do fixture devem retornar erro', () => {
            data.cepsInvalidos.forEach((cep) => {
                cy.buscarCEP(cep).then((res) => {
                    expect(res.body).to.have.property('erro', true)
                })
            })
            cy.saveResult('CEPs Inválidos', 'Todos os CEPs inválidos do fixture retornam erro', 'passed')
        })
    })

    // ──────────────────────────────────────────
    // CEPs com formato errado
    // ──────────────────────────────────────────
    context('Formato Errado', () => {
        it('deve retornar status 400 para CEP con menos de 8 dígitos', () => {
            cy.buscarCEP('1234').then((res) => {
                expect(res.status).to.eq(400)
                cy.saveResult('CEPs Formato Errado', 'CEP com 4 dígitos retorna status 400', 'passed')
            })
        })

        it('deve retornar status 400 para CEP com mais de 8 dígitos', () => {
            cy.buscarCEP('123456789').then((res) => {
                expect(res.status).to.eq(400)
                cy.saveResult('CEPs Formato Errado', 'CEP com 9 dígitos retorna status 400', 'passed')
            })
        })

        it('deve retornar status 400 para CEP com letras', () => {
            cy.buscarCEP('abcdefgh').then((res) => {
                expect(res.status).to.eq(400)
                cy.saveResult('CEPs Formato Errado', 'CEP com letras retorna status 400', 'passed')
            })
        })

        it('deve retornar status 400 para CEP com caractere especial', () => {
            cy.buscarCEP('0101010!').then((res) => {
                expect(res.status).to.eq(400)
                cy.saveResult('CEPs Formato Errado', 'CEP com caractere especial retorna status 400', 'passed')
            })
        })

        it('deve retornar status 400 para CEP vazio', () => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('BASE_URL') || 'https://viacep.com.br/ws'}/ /json/`,
                failOnStatusCode: false,
            }).then((res) => {
                expect(res.status).to.eq(400)
                cy.saveResult('CEPs Formato Errado', 'CEP vazio retorna status 400', 'passed')
            })
        })

        it('todos os CEPs com formato errado do fixture retornam status 400', () => {
            data.cepsFormatoErrado.forEach((cep) => {
                cy.buscarCEP(cep).then((res) => {
                    expect(res.status).to.eq(400)
                })
            })
            cy.saveResult('CEPs Formato Errado', 'Todos os CEPs com formato errado retornam 400', 'passed')
        })
    })
})
