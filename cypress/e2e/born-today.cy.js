const sizes = Cypress.env('sizes')

/*
    Get the dates
*/
function formatDate(format = 'YYYY-MM-DD', relativeDate = 'today') {
    // Helper function to format the date
    function formatDateString(date, format) {
        const pad = (num) => num.toString().padStart(2, '0'); // Helper to pad single digit numbers
        
        let year = date.getFullYear();
        let month = pad(date.getMonth() + 1); // Months are 0-indexed
        let day = pad(date.getDate());
        
        // Replace format placeholders with actual date values
        return format.replace('YYYY', year)
                     .replace('MM', month)
                     .replace('DD', day);
    }

    // Handle relative dates
    function getRelativeDate(relativeDate) {
        const today = new Date();
        let resultDate;

        switch (relativeDate.toLowerCase()) {
            case 'yesterday':
                resultDate = new Date(today);
                resultDate.setDate(today.getDate() - 1);
                break;
            case 'tomorrow':
                resultDate = new Date(today);
                resultDate.setDate(today.getDate() + 1);
                break;
            default:
                const regex = /(\d+)\s*(years?|months?|days?)\s*ago/i;
                const match = relativeDate.match(regex);

                if (match) {
                    const amount = parseInt(match[1], 10);
                    const unit = match[2].toLowerCase();
                    resultDate = new Date(today);
                    
                    if (unit.includes('year')) resultDate.setFullYear(today.getFullYear() - amount);
                    else if (unit.includes('month')) resultDate.setMonth(today.getMonth() - amount);
                    else if (unit.includes('day')) resultDate.setDate(today.getDate() - amount);
                } else {
                    resultDate = today; // Default to today if no match
                }
        }

        return resultDate;
    }

    // Get the relative date
    const date = getRelativeDate(relativeDate);
    
    // Format the date according to the requested format
    return formatDateString(date, format);
}

/*
    Navigate to the Born Today section
*/
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
        expect(loc.search).to.eq(`?birth_monthday=${formatDate('MM-DD', 'today')}`);
    });

    // Remove the default filter (today)
    cy.getByData(`selected-input-chip-list-birthday-${formatDate('MM-DD', 'today')}`).click();
}


describe('Born today section ', () => {

    beforeEach(() => {

        cy.visit('/')

    })

    sizes.forEach((size) => {
        context(`Celebrities Birthday. Size: ${size}`, () => {
            it('Celebrities born yesterday', () => {

                navigate(size);

                // Introduce the new filter: Birthday yesterday
                cy.getByData('accordion-item-birthdayAccordion').click()
                cy.getByData('birthday-input-test-id').type(`${formatDate('MM-DD', 'yesterday')}{enter}`)

                cy.getByData('adv-search-get-results')
                    .should('be.visible')
                    .click()

                // Click on the 3rd result and take a screenshot
                cy.getByData('nlib-title').eq(2).click()

                cy.screenshot()
            })

            it('Celebrities born 40 years ago', () => {

                navigate(size);

                //Introduce the new filter:  Birth Date 40 years ago
                cy.getByData('accordion-item-birthDateAccordion').click()

                // "From" option of the date picker
                cy.getByData('birthDate-start').type(`${formatDate('YYYY-MM-DD', '40 years ago')}`)

                // "To" option of the string field (only the year)
                cy.getByData('birthYearMonth-end').type(`${formatDate('YYYY-MM', '40 years ago')}{enter}`)

                cy.getByData('adv-search-get-results')
                    .should('be.visible')
                    .click()

                // Check the first result if has any link
                cy.get('div.ipc-html-content-inner-div').eq(0).then($elem => {
                    if ($elem.find('a[href]').length > 0) {
                        cy.get($elem).find('a').first().click()
                    }
                    else {
                        cy.log('Link not found in the description')
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
