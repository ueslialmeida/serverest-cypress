describe('Auth Tests - POST /login', () => {
    const endpoint = `${Cypress.expose('apiUrl')}/login`
    let adminEmail
    let adminPassword

    before(() => {
        cy.env(['ADMIN_EMAIL', 'ADMIN_PASSWORD']).then(({ADMIN_EMAIL, ADMIN_PASSWORD}) => {
            adminEmail = ADMIN_EMAIL
            adminPassword = ADMIN_PASSWORD
        })
    })

    it('should login successfully (status 200)', () => {
        cy.request({
            method: 'POST',
            url: endpoint,
            body: {
                email: adminEmail,
                password: adminPassword
            }
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.message).to.eq('Login realizado com sucesso')
            expect(response.body).to.have.property('authorization')
            expect(response.body.authorization).to.be.a('string')
        })
    })

    it('should return an error when providing invalid credentials (status 401)', () => {
        cy.request({
            method: 'POST',
            url: endpoint,
            body: {
                email: 'invalid@mail.com',
                password: 'wrongpass'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(401)
            expect(response.body.message).to.eq('Email e/ou senha inválidos')
        })
    })
})