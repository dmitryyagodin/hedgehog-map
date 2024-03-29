describe('template spec', () => {
  const baseUrl = Cypress.env('baseUrl') || 'http://localhost:8080'
  
  it(`Visits baseUrl: ${baseUrl}`, () => {
    cy.visit(baseUrl)
  })
})


