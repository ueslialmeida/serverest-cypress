import { faker } from '@faker-js/faker'
import { generateUserPayload, generateProductPayload } from '../../support/utils'

describe('Users Tests - GET /usuarios', () => {
    const endpoint = `${Cypress.expose('apiUrl')}/usuarios`

    it('should list all users (status 200)', () => {
        cy.request('GET', endpoint).then((response) => {
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
        cy.request({ method: 'GET', url: endpoint, qs: { administrador: 'true' } }).then((response) => {
            expect(response.status).to.eq(200)

            response.body.usuarios.forEach(user => {
                expect(user.administrador).to.eq('true')
            });
        })
    })

    it('should filter user by name and email', () => {
        const testUser = generateUserPayload()

        cy.request('POST', endpoint, testUser).then(() => {
            cy.request({
                method: 'GET',
                url: endpoint,
                qs: { nome: testUser.nome, email: testUser.email }
            }).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.usuarios[0].nome).to.eq(testUser.nome)
                expect(response.body.usuarios[0].email).to.eq(testUser.email)
            })
        })
    })

    it('should filter a user by valid ID', () => {
        const testUser = generateUserPayload()

        cy.request('POST', endpoint, testUser).then((responsePost) => {
            const userId = responsePost.body._id

            cy.request({ method: 'GET', url: endpoint, qs: { _id: userId } }).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.usuarios[0]._id).to.eq(userId)
            })
        })
    })

    it('should list specific user data if it exists (status 200)', () => {
        const testUser = generateUserPayload()

        cy.request('POST', endpoint, testUser).then((responsePost) => {
            const userId = responsePost.body._id

            cy.request('GET', `${endpoint}/${userId}`).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.have.all.keys('nome', 'email', 'password', 'administrador', '_id')
            })
        })
    })

    it('should return an error message if user does not exist (status 400)', () => {
        const nonexistentId = '1LxuEsZMZMev0VBV'
        
        cy.request({ method: 'GET', url: `${endpoint}/${nonexistentId}`, failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eq(400)
            expect(response.body.message).to.eq('Usuário não encontrado')
        })
    })
})

describe('Users Tests - POST /usuarios', () => {
    const endpoint = `${Cypress.expose('apiUrl')}/usuarios`

    it('should create a user successfully (status 201)', () => {
        cy.request('POST', endpoint, generateUserPayload()).then((response) => {
            expect(response.status).to.eq(201)
            expect(response.body.message).to.eq('Cadastro realizado com sucesso')
            expect(response.body).to.have.property('_id')
            expect(response.body._id).to.be.a('string')
        })
    })

    it('should not create a user with duplicate email (status 400)', () => {
        const testUser = generateUserPayload()

        cy.request('POST', endpoint, testUser).then(() => {
            cy.request({
                method: 'POST',
                url: endpoint,
                body: testUser,
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(400)
                expect(response.body.message).to.eq('Este email já está sendo usado')
            })
        })
    })

    it('should not create users with invalid data', () => {
        const invalidUser = { nome: '', email: '', password: '', administrador: '' }

        cy.request({ method: 'POST', url: endpoint, body: invalidUser, failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eq(400)
            expect(response.body.nome).to.eq('nome não pode ficar em branco')
            expect(response.body.email).to.eq('email não pode ficar em branco')
            expect(response.body.password).to.eq('password não pode ficar em branco')
            expect(response.body.administrador).to.eq("administrador deve ser 'true' ou 'false'")
        })
    })
})

describe('Users Tests - PUT /usuarios/{_id}', () => {
    const endpoint = `${Cypress.expose('apiUrl')}/usuarios`

    it('should update a user successfully (status 200)', () => {
        cy.request('POST', endpoint, generateUserPayload()).then((responsePost) => {
            // Get the data to perform a PUT request for update
            const userId = responsePost.body._id

            cy.request('PUT', `${endpoint}/${userId}`, generateUserPayload()).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.message).to.eq('Registro alterado com sucesso')
            })
        })
    })

    it('should create a new user if editing an unexistent user (status 201)', () => {
        const nonexistentId = '1LxuEsZMZMev0VBV'

        cy.request('PUT', `${endpoint}/${nonexistentId}`, generateUserPayload()).then((response) => {
            expect(response.status).to.eq(201)
            expect(response.body.message).to.eq('Cadastro realizado com sucesso')
            expect(response.body).to.have.property('_id')
        })
    })

    it('should not allow to update a user with existing email (status 400)', () => {
        const userA = generateUserPayload()
        const userB = generateUserPayload()

        // Create the user A to avoid missing data errors
        cy.request('POST', endpoint, userA).then(() => {
            cy.request('POST', endpoint, userB).then((responseB) => {
                const userBId = responseB.body._id

                cy.request({
                    method: 'PUT',
                    url: `${endpoint}/${userBId}`,
                    body: userA,
                    failOnStatusCode: false
                }).then((response) => {
                    expect(response.status).to.eq(400)
                    expect(response.body.message).to.eq('Este email já está sendo usado')
                })
            })
        })
    })
})

describe('Users Tests - DELETE /usuarios/{_id}', () => {
    const endpoint = `${Cypress.expose('apiUrl')}/usuarios`

    it('should delete a user successfully (status 200)', () => {
        cy.request('POST', endpoint, generateUserPayload('true')).then((response) => {
            const userId = response.body._id

            // Deletes the user
            cy.request('DELETE', `${endpoint}/${userId}`).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.message).to.eq('Registro excluído com sucesso')
            })
        })
    })

    it('should return a message that record was not deleted when user ID does not exist (status 200)', () => {
        const nonexistentId = '1LxuEsZMZMev0VBV'
        
        cy.request('DELETE', `${endpoint}/${nonexistentId}`).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.message).to.eq('Nenhum registro excluído')
        })
    })

    it('should not delete a user that has a shopping cart (status 400)', () => {
        // let userId
        // let authToken
        const newUser = generateUserPayload('true')
        const newProduct = generateProductPayload()

        // Creates a new user to avoid missing data errors
        cy.request('POST', endpoint, newUser).then((responseUser) => {
            const userId = responseUser.body._id

            // Login as the new user (admin)
            cy.request('POST', `${Cypress.expose('apiUrl')}/login`, { email: newUser.email, password: newUser.password }).then((responseLogin) => {
                const authToken = responseLogin.body.authorization

                // Creates a product
                cy.request({ method: 'POST', url: `${Cypress.expose('apiUrl')}/produtos`, headers: { Authorization: authToken }, body: newProduct }).then((responseProduct) => {
                    const productId = responseProduct.body._id

                    // Creates a shopping cart for the logged in user
                    cy.request({
                        method: 'POST',
                        url: `${Cypress.expose('apiUrl')}/carrinhos`,
                        headers: { Authorization: authToken },
                        body: {
                            produtos: [
                                {
                                    idProduto: productId,
                                    quantidade: 1
                                }
                            ]
                        }
                    }).then((responseCart) => {
                        // Try deleting the user
                        cy.request({ method: 'DELETE', url: `${endpoint}/${userId}`, failOnStatusCode: false }).then((response) => {
                            expect(response.status).to.eq(400)
                            expect(response.body.message).to.eq('Não é permitido excluir usuário com carrinho cadastrado')
                            expect(response.body).to.have.property('idCarrinho')
                        })
                    })
                })
            })
        })
    })
})