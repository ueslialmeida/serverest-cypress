describe('Reports module tests.', () => {
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

    it('should load the report page', () => {
        cy.visit('/admin/relatorios')

        cy.get('h1').should('contain.text', 'Em construção aguarde')
    })
})