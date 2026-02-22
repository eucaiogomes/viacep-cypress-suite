describe('✅ CEPs Válidos', () => {
    let data

    before(() => {
        cy.fixture('data').then((f) => { data = f })
    })

    context('Resposta e Status', () => {
        it('deve retornar status 200 para CEP válido', () => {
            cy.buscarCEP('01310100').then((res) => {
                expect(res.status).to.eq(200)
                cy.saveResult('CEPs Válidos', 'Status 200 para CEP válido', 'passed')
            })
        })

        it('não deve conter o campo "erro" na resposta de CEP válido', () => {
            cy.buscarCEP('01310100').then((res) => {
                expect(res.body).to.not.have.property('erro')
                cy.saveResult('CEPs Válidos', 'Resposta não contém campo "erro"', 'passed')
            })
        })

        it('deve retornar Content-Type application/json', () => {
            cy.buscarCEP('01310100').then((res) => {
                expect(res.headers['content-type']).to.include('application/json')
                cy.saveResult('CEPs Válidos', 'Content-Type é application/json', 'passed')
            })
        })
    })

    context('Dados Retornados', () => {
        it('deve retornar logradouro, bairro, localidade e UF para CEP da Av. Paulista', () => {
            cy.buscarCEP('01310100').then((res) => {
                const { logradouro, bairro, localidade, uf } = res.body
                expect(logradouro).to.include('Paulista')
                expect(bairro).to.not.be.empty
                expect(localidade).to.eq('São Paulo')
                expect(uf).to.eq('SP')
                cy.saveResult('CEPs Válidos', 'Dados do CEP 01310100 estão corretos', 'passed')
            })
        })

        it('deve retornar UF válida para todos os CEPs de teste', () => {
            cy.fixture('data').then((data) => {
                data.cepsValidos.forEach(({ cep, esperado }) => {
                    cy.buscarCEP(cep).then((res) => {
                        expect(data.ufsValidas).to.include(res.body.uf)
                        if (esperado.uf) expect(res.body.uf).to.eq(esperado.uf)
                        if (esperado.localidade) expect(res.body.localidade).to.eq(esperado.localidade)
                    })
                })
                cy.saveResult('CEPs Válidos', 'UF válida para todos os CEPs de teste', 'passed')
            })
        })

        it('CEP retornado deve bater com o CEP buscado (normalizado)', () => {
            cy.buscarCEP('01310100').then((res) => {
                const cepRetornado = res.body.cep.replace('-', '')
                expect(cepRetornado).to.eq('01310100')
                cy.saveResult('CEPs Válidos', 'CEP retornado bate com o buscado', 'passed')
            })
        })

        it('CEP deve ser retornado com máscara no formato 00000-000', () => {
            cy.buscarCEP('01310100').then((res) => {
                expect(res.body.cep).to.match(/^\d{5}-\d{3}$/)
                cy.saveResult('CEPs Válidos', 'CEP retornado tem formato 00000-000', 'passed')
            })
        })

        it('campo DDD deve ser numérico e ter 2 dígitos', () => {
            cy.buscarCEP('01310100').then((res) => {
                expect(res.body.ddd).to.match(/^\d{2}$/)
                cy.saveResult('CEPs Válidos', 'DDD tem formato correto (2 dígitos)', 'passed')
            })
        })

        it('campo IBGE deve ser numérico', () => {
            cy.buscarCEP('01310100').then((res) => {
                expect(res.body.ibge).to.match(/^\d+$/)
                cy.saveResult('CEPs Válidos', 'Código IBGE é numérico', 'passed')
            })
        })

        it('deve retornar dados corretos para CEP do Rio de Janeiro', () => {
            cy.buscarCEP('20040020').then((res) => {
                expect(res.body.localidade).to.eq('Rio de Janeiro')
                expect(res.body.uf).to.eq('RJ')
                cy.saveResult('CEPs Válidos', 'Dados do CEP do Rio de Janeiro estão corretos', 'passed')
            })
        })

        it('deve retornar dados corretos para CEP de Blumenau SC', () => {
            cy.buscarCEP('89010100').then((res) => {
                expect(res.body.localidade).to.eq('Blumenau')
                expect(res.body.uf).to.eq('SC')
                cy.saveResult('CEPs Válidos', 'Dados do CEP de Blumenau estão corretos', 'passed')
            })
        })
    })

    context('CEP com Hífen', () => {
        it('deve aceitar CEP com hífen e retornar dados corretos', () => {
            cy.buscarCEP('01310-100').then((res) => {
                expect(res.status).to.eq(200)
                expect(res.body).to.not.have.property('erro')
                cy.saveResult('CEPs Válidos', 'CEP com hífen é aceito normalmente', 'passed')
            })
        })
    })
})
