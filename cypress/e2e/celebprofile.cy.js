const actor = 'Nicolas Cage'
const sizes = Cypress.env('sizes')

describe('Celeb profile', () => {
  
  beforeEach(() => {

    cy.visit('/')

  })

  sizes.forEach((size) => {
    context("See movie info already completed by an actor ", () => {
      it(`The last Nicolas Cage movie Completed. Size: ${size}`, () => {

        //Adjust the browser resolution
        if (Cypress._.isArray(size)) {
          cy.viewport(size[0], size[1])
        } else {
          cy.viewport(size)
        }

        // Accept the website consents in the banner
        cy.getByData('accept-button').click()

        // Search actor in the search box and visit his profile
        cy.get('#nav-search-form')
          .should("exist")
          .type(`${actor}{enter}`)

        //cy.get('#suggestion-search-button').click()

        cy.get("li").contains(`${actor}`).click()

        // Confirm  the URL
        cy.location("pathname").should("eq", "/name/nm0000115/")

        // Open the upcoming section
        cy.getByData('accordion-item-actor-upcoming-projects').click()

        // Click on the first movie Completed
        cy.get('.date-unrel-credits-list')
          .first()  // There are two lists, one of them is hidden
          .within(() => {
            cy.contains('Completed').first().parents('div').first().click()
          })

      })
    })
  })
})