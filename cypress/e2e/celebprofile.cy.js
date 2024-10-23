describe('Celeb profile', () => {
  it('The last Nicolas Cage movie Completed', () => {

    const actor = 'Nicolas Cage'

    cy.visit('https://www.imdb.com/')

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