//const sizes = [[1600, 900], [1024, 768], [1000, 660], [759, 768]]
const sizes = [[1000, 768]]

function navigate(size) {
    if (Cypress._.isArray(size)) {
        cy.viewport(size[0], size[1]);
    } else {
        cy.viewport(size);
    }
    // Accept the website consents in the banner
    cy.getByData('accept-button').click();

    // Open the menu 
    cy.get('#imdbHeader-navDrawerOpen').click();

    // Click on the Born Today section
    if (size[0] < 1024) {
        cy.getByData('nav-link-category').contains('Celebs').click();
        cy.get('.ipc-list-item__text').contains('Born Today').click();
    }
    else {
        cy.get('.ipc-list-item__text').contains('Born Today').click();
    }

    // Confirm the URL              
    cy.location().should((loc) => {
        expect(loc.pathname).to.eq('/search/name/');
        expect(loc.search).to.eq(`?birth_monthday=${daysAgo(0)}`);
    });

    // Remove the default filter (today)
    cy.getByData(`selected-input-chip-list-birthday-${daysAgo(0)}`).click();
}

function daysAgo(num) {
    const now = new Date(Date.now())
    now.setTime(now.getTime() + (-num * 24 * 60 * 60 * 1000));

    const dd = now.getDate()      // Get the day of the month
    const mm = now.getMonth() + 1  // Get month

    return mm + '-' + dd
}

function yearsAgo(num) {
    const now = new Date(Date.now())
    now.setFullYear(now.getFullYear() - num)
    const dd = now.getDate()
    const mm = now.getMonth() + 1
    const yyyy = now.getFullYear()

    return yyyy + '-' + mm + '-' + dd
}

describe('Born today section ', () => {

    beforeEach(() => {

        cy.visit('/')

    })

    sizes.forEach((size) => {
        context(`Celebrities Birthday. Size: ${size}`, () => {
            it("Celebrities born yesterday", () => {

                navigate(size);

                // Introduce the new filter: Birthday yesterday
                cy.getByData("accordion-item-birthdayAccordion").click()
                cy.getByData("birthday-input-test-id").type(`${daysAgo(1)}{enter}`)

                cy.getByData("adv-search-get-results")
                    .should('be.visible')
                    .click()

                // Click on the 3rd result and take a screenshot
                cy.getByData("nlib-title").eq(2).click()

                cy.screenshot()
            })

            it.only("Celebrities born 40 years ago", () => {

                navigate(size);

                //Introduce the new filter:  Birth Date 40 years ago
                cy.getByData("accordion-item-birthDateAccordion").click()

                // "From" option of the date picker
                cy.getByData("birthDate-start").type(`${yearsAgo(40)}`)

                // "To" option of the string field (only the year)
                cy.getByData("birthYearMonth-end").type(`${yearsAgo(40).split('-')[0]}{enter}`)

                cy.getByData("adv-search-get-results")
                    .should('be.visible')
                    .click()

                // Check the first result if has any link
                cy.get("div.ipc-html-content-inner-div").eq(0).then($elem => {
                    if ($elem.find("a[href]").length > 0) {
                        cy.get($elem).find("a").first().click()
                    }
                    else {
                        cy.log("Link not found in the description")
                    }
                })

                // Take a screenshot 
                    // If found any link, it will take a screenshot of the new page
                    // otherwise, it will capture the search list
                cy.screenshot()

            })
        })
    })
})
