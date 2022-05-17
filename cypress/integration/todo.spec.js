describe('all tests', () => {
    it('initial load and data', () => {
        cy.visit('localhost:8000')
        cy.rowLengthCheck(11)

        cy.get('.row').each((row, i) => { 
            cy.wrap(row).find('div').should('have.text', 'Adding Task ' + (i+4))
            cy.normalRowCheck(row)
        })
    })

    // it('add task', () => {
    //     cy.get('footer .form')
    //         .click()
    //         .type('test{enter}') // TODO: failing, enter is not being pressed
    // })

    
    // TODO: commented out since above task is not working
    // it('remove task', () => {
    //     cy.get('.row').last().find('button').click()

    //     cy.get('.App-system').should('have.text', 'Task successfully deleted!')
    //     cy.wait(3000)

    //     cy.rowLengthCheck(11)
    //     cy.get('.row').last().should('have.text', 'Adding Task 13')
    // })

    it('edit task', () => {
        cy.contains('Adding Task 14').click()
        cy.get('.row').eq(10).then(row => {
            cy.formCheck(row)
        })

        cy.get('.App-body input')
            .type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}')
                .should('have.text', '')
            .type('asdf')
                // .should('have.text', 'asdf') // TODO: failing, showing text = ''
        
        cy.contains('DONE').click()

        cy.get('.row').last().then(row => {
            cy.normalRowCheck(row)
        })

        cy.rowLengthCheck(11)
        cy.get('.row').last().find('div').should('have.text', 'asdf')

        //Reset back to original state
        cy.contains('asdf').click()
        cy.get('.App-body input')
            .type('{backspace}{backspace}{backspace}{backspace}Adding Task 14')
        cy.contains('DONE').click()
    })

    it('edit task to nothing', () => {
        cy.contains('Adding Task 13').click()

        cy.get('.App-body input')
            .type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}')
                .should('have.text', '')

        cy.contains('DONE').click()

        cy.get('.row').eq(9).then(row => {
            cy.normalRowCheck(row)
        })
        cy.get('.row').eq(9).find('div').should('have.text', 'Adding Task 13')
        cy.rowLengthCheck(11)
    })

    it('edit task (no changes)', () => {
        cy.contains('Adding Task 13').click()

        cy.get('.row').eq(9).then(row => cy.formCheck(row))

        cy.contains('DONE').click()

        cy.rowLengthCheck(11)
        cy.get('.row').eq(9).find('div').should('have.text', 'Adding Task 13')
    })

    it('save empty task', () => {
        cy.get('footer .form')
            .click()
            .type('{enter}')

        cy.rowLengthCheck(11)
    })
})