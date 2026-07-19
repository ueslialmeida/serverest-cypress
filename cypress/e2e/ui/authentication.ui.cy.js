import { faker } from '@faker-js/faker'

describe('Authentication module positive tests', () => {
    beforeEach(() => {
        cy.env(['ADMIN_EMAIL', 'ADMIN_PASSWORD']).then(({ADMIN_EMAIL, ADMIN_PASSWORD}) => {
            cy.login(ADMIN_EMAIL, ADMIN_PASSWORD)
        })
    })

    it('should login successfully', () => {

        cy.visit('/admin/home')
        cy.get('h1').should('be.visible').and('have.text', 'Bem Vindo  Fulano da Silva')
    })

    it('should logout successfully', () => {
        cy.visit('/admin/home')

        cy.logout()

        cy.get('h1').should('be.visible').and('have.text', 'Login')
        cy.get('[data-testid="email"]').should('be.visible')
        cy.get('[data-testid="email"]').should('be.visible')
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