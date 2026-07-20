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
        // Before trying to login makes sure to create a new admin user
        // based on .env file user data just for .env use demo
        // in this ServeRest particular case we could just create a random admin user 
        // sending a POST request with an admin user payload
        cy.createAdminTestUser(adminEmail, adminPassword)
        
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
        cy.fixture('invalidCredentials.json').then((invalidData) => {
            cy.request({
                method: 'POST',
                url: endpoint,
                body: {
                    email: invalidData.email,
                    password: invalidData.password
                },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(401)
                expect(response.body.message).to.eq('Email e/ou senha inválidos')
            })
        })
    })
})