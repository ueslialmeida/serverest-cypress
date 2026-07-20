import { faker } from '@faker-js/faker'

describe('Anonymous user registration', () => {
    it('should register a regular user successfully', () => {
        const testUser = {
            name: faker.internet.displayName(),
            email: faker.internet.email(),
            password: faker.internet.password()
        }

        cy.visit('/cadastrarusuarios')

        cy.createUser(testUser)

        cy.get('a').should('be.visible').and('contain.text', 'Cadastro realizado com sucesso')
        cy.url().should('contain', '/home')
        cy.get('#navbarTogglerDemo01').should('be.visible')
        cy.get('h1').should('contain.text', 'Serverest Store')
    })

    it('should register an admin user successfully', () => {
        const testUser = {
            name: faker.internet.displayName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            isAdmin: true
        }

        cy.visit('/cadastrarusuarios')

        cy.createUser(testUser)

        cy.get('a').should('be.visible').and('contain.text', 'Cadastro realizado com sucesso')
        cy.url().should('contain', '/admin/home')
        cy.get('#navbarTogglerDemo01').should('be.visible')
        cy.get('h1').should('contain.text', `Bem Vindo  ${testUser.name}`)
    })

    const invalidUsers = [
        { field: 'Email Duplicado', data: { name: faker.internet.displayName(), email: 'fulano@qa.com', password: faker.internet.password() }, error: 'Este email já está sendo usado' },
        { field: 'Nome Ausente', data: { email: faker.internet.email(), password: faker.internet.password() }, error: 'Nome é obrigatório' },
        { field: 'Email Ausente', data: { name: faker.internet.displayName(), password: faker.internet.password() }, error: 'Email é obrigatório' },
        { field: 'Password Ausente', data: { name: faker.internet.displayName(), email: faker.internet.email() }, error: 'Password é obrigatório' }
    ]

    invalidUsers.forEach((user) => {
        it(`should not register a user when has ${user.field}`, () => {
            cy.visit('/cadastrarusuarios')
            cy.createUser(user.data)
            cy.get('span').should('be.visible').and('contain.text', user.error)
        })
    })
})

describe('User management through Admin Panel', () => {
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

    it('should list all users', () => {
        cy.visit('/admin/listarusuarios')

        cy.get('h1').should('contain.text', 'Lista dos usuários')
        cy.contains('tr', 'Cypress User').should('be.visible')
    })

    it('should create a user through Admin Panel', () => {
        const testUser = {
            name: faker.internet.displayName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            administrador: 'false'
        }

        cy.visit('/admin/cadastrarusuarios')

        cy.createUser(testUser)

        cy.get('h1').should('contain.text', 'Lista dos usuários')
        cy.get('td').should('contain.text', testUser.name)
        cy.get('td').should('contain.text', testUser.email)
    })

    it('should delete a user through Admin Panel', () => {
        const testUser = {
            nome: faker.internet.displayName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            administrador: 'false'
        }

        cy.requestCreateUser(testUser)

        cy.visit('/admin/listarusuarios')

        cy.contains('tr', testUser.email).find('button').contains('Excluir').click()
        cy.get('td').should('not.contain.text', testUser.nome)
        cy.get('td').should('not.contain.text', testUser.email)
    })
})