const parameters = [1, 'petaya']

describe('Poke API', () => {

    beforeEach({ baseUrl: Cypress.env('apiBaseUrl') }, () => {
        const apiBaseUrl = Cypress.env('apiBaseUrl')
        Cypress.config('baseUrl', apiBaseUrl)
    })

    parameters.forEach((parameter) => {
        // Happy path - Validate call the endpoint with a valid parameter (id and/or name)
        it(`OK with a valid parameter (${parameter})`, () => {
            cy.api({
                method: 'GET',
                url: `/api/v2/berry/${parameter}`
            }).then((resp) => {
                expect(resp.status).to.eq(200)
            })
        })

        // Unhappy path - Validate error when the calling with a invalid parameter (id and/or name)
        it(`Error code for invalid parameter (${parameter})`, () => {
            cy.api({
                method: 'GET',
                url: `/api/v2/berry/${parameter}-invalid`,
                failOnStatusCode: false         // To advoid default failed (It's expected that the call fail)
            }).then((resp) => {
                expect(resp.status).to.eq(404)
            })
        })
    })
})
