import { baseUrl } from './urls'

describe('Page elements', () => {
  beforeEach('The page should be accesible', () => {
    cy.visit(baseUrl)
  })

  it('The page should have a title tag', () => {
    cy.get('title').should('exist').invoke('text').should('not.be.empty')
  })

  it('The form should not be initially visible', () => {
    cy.get('.cy-form').should('not.exist')
  })

  it('The map should be visible', () => {
    cy.get('.cy-map canvas').should('exist')
  })
})
