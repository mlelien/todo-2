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

Cypress.Commands.add('normalRowCheck', row => {
    cy.wrap(row).find('button').should('have.text', 'X')
    cy.wrap(row).find('form').should('not.exist')
    cy.wrap(row).find('input').should('not.exist')
    cy.wrap(row).should('have.class', 'row')
})

Cypress.Commands.add('rowLengthCheck', len => {
    cy.get('.App-body').find('.row').should('have.length', len)
})

Cypress.Commands.add('formCheck', row => {
    cy.wrap(row).find('button').should('have.text', 'DONE')
    cy.wrap(row).find('form').should('exist')
    cy.wrap(row).find('input').should('exist')
})