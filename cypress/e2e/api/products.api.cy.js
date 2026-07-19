import { faker } from '@faker-js/faker'

describe('Products tests - /produtos', () => {
    const endpoint = `${Cypress.expose('apiUrl')}/produtos`
    let authToken

    before(() => {
        const adminUser = {
            nome: faker.internet.displayName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            administrador: 'true'
        }

        cy.request({
            method: 'POST',
            url: `${Cypress.expose('apiUrl')}/usuarios`,
            body: adminUser
        }).then(() => {
            // Login with the new admin user
            cy.request({
                method: 'POST',
                url: `${Cypress.expose('apiUrl')}/login`,
                body: {
                    email: adminUser.email,
                    password: adminUser.password
                }
            }).then((response) => {
                authToken = response.body.authorization
            })
        })
    })

    it('should create a product successfully (status 201)', () => {
        const newProduct = {
            nome: faker.commerce.productName(),
            preco: 150,
            descricao: faker.commerce.productDescription(),
            quantidade: 42
        }

        cy.request({
            method: 'POST',
            url: endpoint,
            headers: { Authorization: authToken },
            body: newProduct
        }).then((response) => {
            expect(response.status).to.eq(201)
            expect(response.body.message).to.eq('Cadastro realizado com sucesso')
            expect(response.body).to.have.property('_id')
        })
    })

    it('should list product by ID (status 200)', () => {
        const newProduct = {
            nome: faker.commerce.productName(),
            preco: 150,
            descricao: faker.commerce.productDescription(),
            quantidade: 42
        }

        cy.request({
            method: 'POST',
            url: endpoint,
            headers: { Authorization: authToken },
            body: newProduct
        }).then((responsePost) => {
            const productId = responsePost.body._id

            cy.request({
                method: 'GET',
                url:`${endpoint}/${productId}`
            }).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.nome).to.eq(newProduct.nome)
                expect(response.body.preco).to.eq(newProduct.preco)
            })
        })
    })

    it('should not create product with duplicated name (status 400)', () => {
        const newProduct = {
            nome: faker.commerce.productName(),
            preco: 150,
            descricao: faker.commerce.productDescription(),
            quantidade: 42
        }

        cy.request({
            method: 'POST',
            url: endpoint,
            headers: { Authorization: authToken },
            body: newProduct
        }).then(() => {
            // Try creating the same product again
            cy.request({
                method: 'POST',
                url: endpoint,
                headers: { Authorization: authToken },
                body: newProduct,
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(400)
                expect(response.body.message).to.eq('Já existe produto com esse nome')
            })
        })
    })

    it('should not create a product if no auth token (status 401)', () => {
        const newProduct = {
            nome: faker.commerce.productName(),
            preco: 150,
            descricao: faker.commerce.productDescription(),
            quantidade: 42
        }

        cy.request({
            method: 'POST',
            url: endpoint,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(401)
            expect(response.body.message).to.eq('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais')
        })
    })

    it('should not create a product if user role is not admin (status 403)', () => {
        let token
        const regularUser = {
            nome: faker.internet.displayName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            administrador: 'false'
        }

        const newProduct = {
            nome: faker.commerce.productName(),
            preco: 150,
            descricao: faker.commerce.productDescription(),
            quantidade: 42
        }

        cy.request({
            method: 'POST',
            url: `${Cypress.expose('apiUrl')}/usuarios`,
            body: regularUser
        }).then(() => {
            // Login regular user
            cy.request({
                method: 'POST',
                url: `${Cypress.expose('apiUrl')}/login`,
                body: {
                    email: regularUser.email,
                    password: regularUser.password
                }
            }).then((responseLogin) => {
                // Try creating a product as regular user
                cy.request({
                    method: 'POST',
                    url: endpoint,
                    headers: { Authorization: responseLogin.body.authorization },
                    body: newProduct,
                    failOnStatusCode: false
                }).then((responseProduct) => {
                    expect(responseProduct.status).to.eq(403)
                    expect(responseProduct.body.message).to.eq('Rota exclusiva para administradores')
                })
            })
        })
    })

    it('should edit an existing product successfully (status 200)', () => {
        const newProduct = {
            nome: faker.commerce.productName(),
            preco: 150,
            descricao: faker.commerce.productDescription(),
            quantidade: 42
        }

        // Create a new product to avoid missing data errors
        cy.request({
            method: 'POST',
            url: endpoint,
            headers: { Authorization: authToken },
            body: newProduct
        }).then((responsePost) => {
            const productId = responsePost.body._id

            cy.request({
                method: 'PUT',
                url: `${endpoint}/${productId}`,
                headers: { Authorization: authToken },
                body: {
                    nome: newProduct.nome,
                    preco: 200,
                    descricao: newProduct.descricao,
                    quantidade: 15
                }
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.message).to.eq("Registro alterado com sucesso");
            })
        })
    })

    it('should delete an existing product successfully (status 200)', () => {
        const newProduct = {
            nome: faker.commerce.productName(),
            preco: 150,
            descricao: faker.commerce.productDescription(),
            quantidade: 42
        }

        // Create a product to avoid missing data error
        cy.request({
            method: 'POST',
            url: endpoint,
            headers: { Authorization: authToken },
            body: newProduct
        }).then((responsePost) => {
            const productId = responsePost.body._id;

            // Deletes the newly created product
            cy.request({
            method: 'DELETE',
            url: `${endpoint}/${productId}`,
            headers: { Authorization: authToken }
            }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.message).to.eq("Registro excluído com sucesso");
            })
        })
    })

    it('should not delete any product if ID does not exist', () => {
        const unexistendProductId = 'SeeJh5uesk6kSIzA';

        cy.request({
            method: 'DELETE',
            url: `${endpoint}/${unexistendProductId}`,
            headers: { Authorization: authToken }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.message).to.eq('Nenhum registro excluído');
        });
    })
})