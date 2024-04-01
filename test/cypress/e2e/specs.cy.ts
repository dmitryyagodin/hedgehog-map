import { baseUrl } from './urls'

describe('template spec', () => {
  it(`Visits baseUrl: ${baseUrl}`, () => {
    cy.visit(baseUrl)
  })
})


