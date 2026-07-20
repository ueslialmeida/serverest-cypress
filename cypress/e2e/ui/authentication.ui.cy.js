import { faker } from '@faker-js/faker'

describe('Authentication module positive tests', () => {
    before(() => {
        cy.env(['ADMIN_EMAIL', 'ADMIN_PASSWORD']).then(({ADMIN_EMAIL, ADMIN_PASSWORD}) => {
            cy.createAdminTestUser(ADMIN_EMAIL, ADMIN_PASSWORD)
        })
    })

    beforeEach(() => {
        cy.env(['ADMIN_EMAIL', 'ADMIN_PASSWORD']).then(({ADMIN_EMAIL, ADMIN_PASSWORD}) => {
            cy.login(ADMIN_EMAIL, ADMIN_PASSWORD)
        })

        cy.visit('/admin/home')
    })

    it('should login successfully', () => {
        cy.get('h1').should('be.visible').and('include.text', 'Bem Vindo')
    })

    it('should logout successfully', () => {
        cy.logout()

        cy.get('h1').should('be.visible').and('have.text', 'Login')
        cy.get('[data-testid="email"]').should('be.visible')
        cy.get('[data-testid="senha"]').should('be.visible')
        cy.get('[data-testid="entrar"]').should('be.visible')
    })
})

describe('Authentication module negative tests', () => {
    it('should not login using invalid credentials', () => {
        cy.invalidLogin(faker.internet.email(), faker.internet.password())

        cy.get('span').should('be.visible').and('contain.text', 'Email e/ou senha inválidos')
    })

    it('should not login when password field is empty', () => {
        cy.invalidLogin(faker.internet.email(), '')

        cy.get('span').should('be.visible').and('contain.text', 'Password é obrigatório')
    })

    it('should not login when email field is empty', () => {
        cy.invalidLogin('', faker.internet.password())

        cy.get('span').should('be.visible').and('contain.text', 'Email é obrigatório')
    })
})