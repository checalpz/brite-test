const sizes = [[1600, 900], [1024, 768], [1000, 660], [759, 768]]
//const sizes = [[1000, 768]]

describe('Top Box Office section ', () => {
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

            // Click on the Top Box Office section
            if (size[0] < 1024) {
                cy.getByData('nav-link-category').contains('Movies').click()
            }
            cy.get('.ipc-list-item__text').contains('Top Box Office').click()

            // Confirm the URL
            cy.location("pathname").should("eq", "/chart/boxoffice/")

            // Click on the second movie
            cy.get('.ipc-metadata-list-summary-item')
                .eq(1)
                .within(() => {
                    cy.get('.ipc-title-link-wrapper').click()
                })

            // Rate button
            if (size[0] < 1024) {
                cy.getByData('hero-rating-bar__user-rating')
                    .last()
                    .click()
            }
            else {
                cy.getByData('hero-rating-bar__user-rating')
                    .first()
                    .click()
            }

            // Rating with 5 starts
            //cy.get('.ipc-starbar__rating__button').eq(4).click({ force: true }) // Option 1
            cy.get('[aria-label="Rate 5"]').click({ force: true })                // Option 2

            cy.get('.ipc-rating-prompt__rate-button').click()

        })
    })
})