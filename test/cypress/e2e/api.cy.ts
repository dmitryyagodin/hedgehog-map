/// <reference types='cypress' />
import { apiUrl } from './urls'

describe('API tests', () => {
  it('GET all request should have response status 200', () => {
    cy.request(apiUrl).as('Get')
    cy.get('@Get').its('status').should('equal', 200)
  })

  it('response should be json', () => {
    cy.request(apiUrl).as('Get')
    cy.get('@Get')
      .its('headers')
      .its('content-type')
      .should('include', 'application/json')
  })

  it('request to a non-existing path returns 404', () => {
    cy.request({
      url: apiUrl + 'foo_bar/foo',
      failOnStatusCode: false,
    }).as('Get')
    cy.get('@Get').its('status').should('equal', 404)
  })

  /* hedgehog #1 is set by default */
  it('successfully fetch an existing hedgehog', () => {
    cy.request({ url: apiUrl + '1' }).as('existingHedgehog')
    cy.get('@existingHedgehog').its('status').should('equal', 200)
  })

  it('request to a non-existing hedgehog should return 404', () => {
    cy.request({ url: apiUrl + '0/10', failOnStatusCode: false }).as(
      'nonexistingHedgehog',
    )
    cy.get('@nonexistingHedgehog').its('status').should('equal', 404)
  })

  it('request to an invalid hedgehog id should return 404', () => {
    cy.request({ url: apiUrl + '1.1', failOnStatusCode: false }).as(
      'nonexistingHedgehog',
    )
    cy.get('@nonexistingHedgehog').its('status').should('equal', 904)
  })

  it('request to a valid non-existing hedgehog should return 404', () => {
    cy.request({ url: apiUrl + '100000000', failOnStatusCode: false }).as(
      'nonexistingHedgehog',
    )
    cy.get('@nonexistingHedgehog').its('status').should('equal', 404)
  })
})
