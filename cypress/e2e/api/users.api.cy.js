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

describe('Users Tests - PUT /usuarios/{_id}', () => {
    const endpoint = `${Cypress.expose('apiUrl')}/usuarios`

    it('should update a user successfully (status 200)', () => {
        const newUser = {
            nome: faker.internet.displayName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            administrador: 'true'
        }

        // Insert a new user to avoid missing data errors
        cy.request({
            method: 'POST',
            url: endpoint,
            body: newUser
        }).then((response) => {
            // Get the data to perform a PUT request for update
            const userId = response.body._id

            cy.request({
                method: 'PUT',
                url: `${endpoint}/${userId}`,
                body: {
                    nome: 'John Doe',
                    email: faker.internet.email(),
                    password: 'newpass',
                    administrador: 'false'
                }
            }).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.message).to.eq('Registro alterado com sucesso')
            })
        })
    })

    it('should create a new user if editing an unexistent user (status 201)', () => {
        const userData = {
            nome: faker.internet.displayName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            administrador: 'true'
        }
        const unexistentId = '1LxuEsZMZMev0VBV'

        cy.request({
            method: 'PUT',
            url: `${endpoint}/${unexistentId}`,
            body: userData
        }).then((response) => {
            expect(response.status).to.eq(201)
            expect(response.body.message).to.eq('Cadastro realizado com sucesso')
            expect(response.body).to.have.property('_id')
        })
    })

    it('should not allow to update a user with existing email (status 400)', () => {
        const newUserA = {
            nome: faker.internet.displayName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            administrador: 'true'
        }

        const newUserB = {
            nome: faker.internet.displayName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            administrador: 'true'
        }

        // Create the user A to avoid missing data errors
        cy.request({
            method: 'POST',
            url: endpoint,
            body: newUserA
        }).then((responseA) => {
            // Create the user B to avoid missing data errors
            cy.request({
                method: 'POST',
                url: endpoint,
                body: newUserB
            }).then((responseB) => {
                const userBId = responseB.body._id

                // Try to update user B using user A data (email is the main data)
                cy.request({
                    method: 'PUT',
                    url: `${endpoint}/${userBId}`,
                    body: newUserA,
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
        const newUser = {
            nome: faker.internet.displayName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            administrador: 'true'
        }

        // Creates a new user to avoid missing error data
        cy.request({
            method: 'POST',
            url: endpoint,
            body: newUser
        }).then((response) => {
            const userId = response.body._id

            // Deletes the user
            cy.request({
                method: 'DELETE',
                url: `${endpoint}/${userId}`
            }).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.message).to.eq('Registro excluído com sucesso')
            })
        })
    })

    it('should return a message that record was not deleted when user ID does not exist (status 200)', () => {
        const unexistentId = '1LxuEsZMZMev0VBV'

        cy.request({
            method: 'DELETE',
            url: `${endpoint}/${unexistentId}`
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.message).to.eq('Nenhum registro excluído')
        })
    })

    it('should not delete a user that has a shopping cart (status 400)', () => {
        let userId
        let authToken
        const newUser = {
            nome: faker.internet.displayName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            administrador: 'true'
        }

        const newProduct = {
            nome: faker.commerce.productName(),
            preco: 150,
            descricao: faker.commerce.productDescription(),
            quantidade: 42
        }

        // Creates a new user
        cy.request({
            method: 'POST',
            url: endpoint,
            body: newUser
        }).then((responseUser) => {
            userId = responseUser.body._id

            // Login as the new user (admin)
            cy.request({
                method: 'POST',
                url: `${Cypress.expose('apiUrl')}/login`,
                body: {
                    email: newUser.email,
                    password: newUser.password
                }
            }).then((responseLogin) => {
                authToken = responseLogin.body.authorization

                // Creates a product
                cy.request({
                    method: 'POST',
                    url: `${Cypress.expose('apiUrl')}/produtos`,
                    headers: { Authorization: authToken },
                    body: newProduct
                }).then((responseProduct) => {
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
                        cy.request({
                            method: 'DELETE',
                            url: `${endpoint}/${userId}`,
                            failOnStatusCode: false
                        }).then((response) => {
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