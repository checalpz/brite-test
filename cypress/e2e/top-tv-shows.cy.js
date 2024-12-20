const sizes = Cypress.env('sizes')

describe('Top 250 TV show section ', () => {
  
  beforeEach(() => {

    cy.visit('/')

  })

  sizes.forEach((size) => {
    context('See photo of a TV show', () => {
      it(`See 2nd photo of Danny Trejo . Size: ${size}`, () => {

        if (Cypress._.isArray(size)) {
          cy.viewport(size[0], size[1])
        } else {
          cy.viewport(size)
        }
        // Accept the website consents in the banner
        cy.getByData('accept-button').click()

        // Open the menu 
        cy.get('#imdbHeader-navDrawerOpen').click()

        // Click on the Top 250 TV Shows section
        if (size[0] < 1024) {
          cy.getByData('nav-link-category').contains('TV Shows').click()
          cy.get('.ipc-list-item__text').contains('Top 250 TV Shows').click()
        }
        else {
          cy.get('.ipc-list-item__text').contains('Top 250 TV Shows').click()
        }

        // Confirm the URL
        cy.location('pathname').should('eq', '/chart/toptv/')

        // Search and click in Breaking Bad serie
        cy.get('h3').contains('Breaking Bad').click()

        // Go to photos
        cy.get('.ipc-responsive-button__text').contains('All topics').click()

        cy.getByData('topic-popular')
          .within(() => {
            cy.contains('Photos').click()
          })

        // Filtering by Danny Trejo's photos
        cy.getByData('image-chip-dropdown-test-id').click()

        cy.get('#Person-filter-select-dropdown')    //filter only by the name instead the full text displayed in the dropdown
          .find('option')
          .contains('Danny Trejo')
          .then((selectOption) => {
            cy.get('#Person-filter-select-dropdown')
              .select(selectOption.text())
          })

        cy.get('#Person-filter-select-dropdown').should('not.exist')  //wait until the modal reload without dropdown
        cy.getByData('promptable__x').click()

        // Click on the 2nd photo
        cy.getByData('image-gallery-image').eq(1).click()

      })
    })
  })
})
