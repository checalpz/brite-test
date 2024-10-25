const sizes = [[1600, 900], [1024, 768], [1000, 660], [759, 768]]
//const sizes = [[1000, 768]]

describe('Top 250 TV show section ', () => {
  sizes.forEach((size) => {

    it(`Rate the second movie in the top box office. Size: ${size}`, () => {
      if (Cypress._.isArray(size)) {
        cy.viewport(size[0], size[1])
      } else {
        cy.viewport(size)
      }

      cy.visit('https://www.imdb.com/')

      // Accept the website consents in the banner
      cy.getByData('accept-button').click()

      // Open the menu 
      cy.get('#imdbHeader-navDrawerOpen').click()

      // Click on the Top 250 TV Shows section
      if (size[0] < 1024) {
        cy.getByData('nav-link-category').contains('TV Shows').click()
      }
      cy.get('.ipc-list-item__text').contains('Top 250 TV Shows').click()

      // Confirm the URL
      cy.location("pathname").should("eq", "/chart/toptv/")

      // Search and click in Breaking Bad serie
      cy.get('h3').contains('Breaking Bad').click()

      // Go to photos
      cy.get('.ipc-responsive-button__text').contains("All topics").click()

      cy.getByData('topic-popular')
        .within(() => {
          cy.contains('Photos').click()
        })

      // Filtering by Danny Trejo's photos
      cy.getByData('image-chip-dropdown-test-id').click()

      //<option value="nm0001803">Danny Trejo (6)</option>     
      //cy.get('#Person-filter-select-dropdown').select('Danny Trejo (6)') // OK

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
