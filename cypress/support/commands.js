// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('createAdminTestUser', (email, password) => {
    cy.request({
        method: 'POST',
        url: `${Cypress.expose('apiUrl')}/usuarios`,
        body: {
            nome: 'Cypress User',
            email: email,
            password: password,
            administrador: 'true'
        },
        failOnStatusCode: false
    }).then((response) => {
        response.status === 201 ? cy.log('User created for UI tests.') : cy.log('User already exists, continue...')
    })
})

Cypress.Commands.add('login', (email, password) => {
    cy.session(email, () => {
        cy.visit('/login')

        cy.get('[data-testid="email"]').type(email, {log: false})
        cy.get('[data-testid="senha"]').type(password, {log: false})
        cy.get('[data-testid="entrar"]').click()

        // Waits on login to complete
        cy.get('#navbarTogglerDemo01', { timeout: 10000 }).should('be.visible')
    })
})

Cypress.Commands.add('invalidLogin', (email, password) => {
    cy.visit('/login')

    if (email) cy.get('[data-testid="email"]').type(email)
    if (password) cy.get('[data-testid="senha"]').type(password)
    cy.get('[data-testid="entrar"]').click()
})

Cypress.Commands.add('createUser', ({ name, email, password, isAdmin = false }) => {
    if (name) cy.get('[data-testid="nome"]').type(name)
    if (email) cy.get('[data-testid="email"]').type(email)
    if (password) cy.get('[data-testid="password"]').type(password)
    if (isAdmin) cy.get('[data-testid="checkbox"]').check()
    cy.get('[type="submit"]').click()
})

Cypress.Commands.add('logout', () => {
    cy.get('[data-testid="logout"]').click()
})

Cypress.Commands.add('createProduct', ({ name, price, description, quantity, image }) => {
    if (name) cy.get('[data-testid="nome"]').type(name)
    if (price) cy.get('[data-testid="preco"]').type(price)
    if (description) cy.get('[data-testid="descricao"]').type(description)
    if (quantity) cy.get('[data-testid="quantity"]').type(quantity)
    if (image) cy.get('[data-testid="imagem"]').selectFile(image)
    cy.get('[type=submit]').click()
})