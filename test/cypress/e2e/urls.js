export const baseUrl = Cypress.env('baseUrl') || 'http://localhost:8080'
export const apiUrl = baseUrl + Cypress.env('apiPath')