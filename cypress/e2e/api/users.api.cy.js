import { faker } from '@faker-js/faker'

describe('Users Tests - GET /usuarios', () => {
    const endpoint = `${Cypress.expose('apiUrl')}/usuarios`

    it('should list all users (status 200)', () => {
        cy.request({
            method: 'GET',
            url: endpoint,
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property('quantidade')
            expect(response.body.quantidade).to.be.a('number')
            expect(response.body).to.have.property('usuarios')
            expect(response.body.usuarios).to.be.a('array')

            if (response.body.usuarios.length > 0) {
                const firstUser = response.body.usuarios[0]
                expect(firstUser).to.have.all.keys('nome', 'email', 'password', 'administrador', '_id')
            }
        })
    })

    it('should return admin users', () => {
        cy.request({
            method: 'GET',
            url: endpoint,
            qs: {
                administrador : 'true'
            }
        }).then((response) => {
            expect(response.status).to.eq(200)

            response.body.usuarios.forEach(user => {
                expect(user.administrador).to.eq('true')
            });
        })
    })

    it('should filter user by name and email', () => {
        cy.request({
            method: 'GET',
            url: endpoint,
            qs: {
                nome: 'Fulano da Silva',
                email: 'fulano@qa.com'
            }
        }).then((response) => {
            expect(response.status).to.eq(200)

            response.body.usuarios.forEach(user => {
                expect(user.nome).to.eq('Fulano da Silva')
                expect(user.email).to.eq('fulano@qa.com')
            });
        })
    })

    it('should filter a user by valid ID', () => {
        cy.request({
            method: 'GET',
            url: endpoint,
            qs: {
                _id: '0uxuPY0cbmQhpEz1'
            }
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.usuarios[0]._id).to.eq('0uxuPY0cbmQhpEz1')
        })
    })

    it('should list specific user data if it exists (status 200)', () => {
        cy.request({
            method: 'GET',
            url: `${endpoint}/0uxuPY0cbmQhpEz1`,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.have.all.keys('nome', 'email', 'password', 'administrador', '_id')
        })
    })

    it('should return an error message if user does not exist (status 400)', () => {
        cy.request({
            method: 'GET',
            url: `${endpoint}/0uxuPY0cbmQhpEzi`,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(400)
            expect(response.body.message).to.eq('Usuário não encontrado')
        })
    })
})

describe('Users Tests - POST /usuarios', () => {
    const endpoint = `${Cypress.expose('apiUrl')}/usuarios`

    it('should create a user successfully (status 201)', () => {
        const newUser = {
            nome: faker.internet.displayName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            administrador: 'true'
        }

        cy.request({
            method: 'POST',
            url: endpoint,
            body: newUser
        }).then((response) => {
            expect(response.status).to.eq(201)
            expect(response.body.message).to.eq('Cadastro realizado com sucesso')
            expect(response.body).to.have.property('_id')
            expect(response.body._id).to.be.a('string')
        })
    })

    it('should not create a user with duplicate email (status 400)', () => {
        const existingUser = {
            nome: faker.internet.displayName(),
            email: 'fulano@qa.com',
            password: faker.internet.password(),
            administrador: 'true'
        }

        cy.request({
            method: 'POST',
            url: endpoint,
            body: existingUser,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(400)
            expect(response.body.message).to.eq('Este email já está sendo usado')
        })
    })

    it('should not create users with invalid data', () => {
        const invalidUser = {
            nome: '',
            email: '',
            password: '',
            administrador: ''
        }

        cy.request({
            method: 'POST',
            url: endpoint,
            body: invalidUser,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(400)
            expect(response.body.nome).to.eq('nome não pode ficar em branco')
            expect(response.body.email).to.eq('email não pode ficar em branco')
            expect(response.body.password).to.eq('password não pode ficar em branco')
            expect(response.body.administrador).to.eq("administrador deve ser 'true' ou 'false'")
        })
    })
})