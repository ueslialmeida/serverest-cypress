import { faker } from '@faker-js/faker'

describe('Product management tests', () => {
    before(() => {
        cy.env(['ADMIN_EMAIL', 'ADMIN_PASSWORD']).then(({ADMIN_EMAIL, ADMIN_PASSWORD}) => {
            cy.createAdminTestUser(ADMIN_EMAIL, ADMIN_PASSWORD)
        })
    })
    
    beforeEach(() => {
        cy.env(['ADMIN_EMAIL', 'ADMIN_PASSWORD']).then(({ADMIN_EMAIL, ADMIN_PASSWORD}) => {
            cy.login(ADMIN_EMAIL, ADMIN_PASSWORD)
        })
    })

    it('should list all products', () => {
        cy.visit('/admin/listarprodutos')

        cy.get('h1').should('contain.text', 'Lista dos Produtos')
        cy.contains('tr', 'Samsung 60 polegadas')
            .should('include.text', '5240')
            .and('include.text', 'TV')
            .and('include.text', '49977')
    })

    it('should create a product with image successfully', () => {
        const testProduct = {
            name: faker.commerce.productName(),
            price: faker.commerce.price({ min: 1, max: 9999, dec: 0 }),
            description: faker.commerce.productDescription(),
            quantity: 42,
            image: 'cypress/fixtures/test-img.png'
        }

        cy.visit('/admin/cadastrarprodutos')
        cy.createProduct(testProduct)

        cy.contains('tr', testProduct.name)
            .should('include.text', testProduct.price)
            .and('include.text', testProduct.description)
            .and('include.text', testProduct.quantity)
            .and('include.text', "C:\\fakepath\\test-img.png")
    })

    it('should create a product without image successfully', () => {
        const testProduct = {
            name: faker.commerce.productName(),
            price: faker.commerce.price({ min: 1, max: 9999, dec: 0 }),
            description: faker.commerce.productDescription(),
            quantity: 42
        }

        cy.visit('/admin/cadastrarprodutos')
        cy.createProduct(testProduct)

        cy.contains('tr', testProduct.name)
            .should('include.text', testProduct.price)
            .and('include.text', testProduct.description)
            .and('include.text', testProduct.quantity)
    })

    it('should not create a product when data is invalid', () => {
        const invalidProducts = [
            {
                data: {
                    price: faker.commerce.price({ min: 1, max: 9999, dec: 0 }),
                    description: faker.commerce.productDescription(),
                    quantity: 42
                },
                error: 'Nome é obrigatório'
            },
            {
                data: {
                    name: faker.commerce.productName(),
                    description: faker.commerce.productDescription(),
                    quantity: 42
                },
                error: 'Preco é obrigatório'
            },
            {
                data: {
                    name: faker.commerce.productName(),
                    price: faker.commerce.price({ min: 1, max: 9999, dec: 0 }),
                    quantity: 42
                },
                error: 'Descricao é obrigatório'
            },
            {
                data: {
                    name: faker.commerce.productName(),
                    price: faker.commerce.price({ min: 1, max: 9999, dec: 0 }),
                    description: faker.commerce.productDescription()
                },
                error: 'Quantidade é obrigatório'
            }
        ]

        invalidProducts.forEach(product => {
            cy.visit('/admin/cadastrarprodutos')

            cy.createProduct(product.data)

            cy.get('span').should('be.visible').and('contain.text', product.error)
        })
    })

    it('should delete a product', () => {
        const testProduct = {
            name: faker.commerce.productName(),
            price: faker.commerce.price({ min: 1, max: 9999, dec: 0 }),
            description: faker.commerce.productDescription(),
            quantity: 42
        }

        cy.visit('/admin/cadastrarprodutos')
        cy.createProduct(testProduct)

        cy.get('h1').should('contain.text', 'Lista dos Produtos')
        cy.contains('tr', testProduct.name).find('button').contains('Excluir').click()
        cy.contains('tr', testProduct.name).should('not.exist')
    })
})