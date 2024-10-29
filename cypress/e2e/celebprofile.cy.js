const sizes = Cypress.env('sizes')
const actor = 'Nicolas Cage'
const actorPathname = '/name/nm0000115/'
let movieTitle

describe('Celeb profile', () => {

  beforeEach(() => {

    cy.visit('/')

  })

  sizes.forEach((size) => {
    context('See movie info already completed by an actor ', () => {
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
          .should('exist')
          .type(`${actor}{enter}`)

        cy.get('li')
          .contains(actor)
          .click()

        // Confirm  the URL
        cy.location('pathname').should('eq', actorPathname)

        // Open the upcoming section
        cy.getByData('accordion-item-actor-upcoming-projects').click()

        // Click on the first movie Completed       
        cy.get('.date-unrel-credits-list')
          .first()  // There are two lists (actor and producer upcoming)
          .within(() => {
            cy.contains('Completed').first()      //Find the first movie completed
              .parents('div').first()               // From 'Completed' navigate until the first parent div
              .then(($element) => {
                movieTitle = $element.find('a').first().text()    // Save the title of the movie
                cy.wrap($element).click()                         // And click on the title
              })
          })
          .then(() => {  //Compare the name of the movie found in the list with the title displayed after clicking
            cy.getByData('hero__pageTitle').should('have.text', movieTitle)
          })

      })
    })
  })
})
