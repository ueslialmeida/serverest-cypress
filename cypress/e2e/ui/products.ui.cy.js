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

        cy.get('h1').should('be.visible').and('contain.text', 'Lista dos Produtos')
        cy.get('table').should('be.visible')

        cy.get('tbody tr').first().within(() => {
            cy.get('td').should('have.length.at.least', 5) // Garante as colunas básicas
            cy.get('button').contains('Excluir').should('be.visible') // Garante a ação
        })

        cy.get('tbody tr').eq(1).within(() => {
            cy.get('td').should('have.length.at.least', 5)
            cy.get('button').contains('Excluir').should('be.visible')
        })
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

    // Generate different 'it' blocks for each invalid products to test different errors
    const invalidProducts = [
        { field: 'Nome', data: { price: '100', description: 'Desc', quantity: 10 }, error: 'Nome é obrigatório' },
        { field: 'Preço', data: { name: 'Prod', description: 'Desc', quantity: 10 }, error: 'Preco é obrigatório' },
        { field: 'Descrição', data: { name: 'Prod', price: '100', quantity: 10 }, error: 'Descricao é obrigatório' },
        { field: 'Quantidade', data: { name: 'Prod', price: '100', description: 'Desc' }, error: 'Quantidade é obrigatório' }
    ]

    invalidProducts.forEach(product => {
        it(`should not create a product when ${product.field} field is missing`, () => {
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