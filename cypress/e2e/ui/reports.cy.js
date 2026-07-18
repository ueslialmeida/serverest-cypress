describe('Reports module tests.', () => {
    beforeEach(() => {
        cy.login('fulano@qa.com', 'teste')
    })

    it('should load the report page', () => {
        cy.visit('/admin/relatorios')

        cy.get('h1').should('contain.text', 'Em construção aguarde')
    })
})