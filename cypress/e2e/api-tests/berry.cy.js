const parameters = [1, 'petaya']

describe('Poke API', () => {

    beforeEach({ baseUrl: Cypress.env('apiBaseUrl') }, () =>{
        let apiBaseUrl = Cypress.env('apiBaseUrl')
        Cypress.config('baseUrl', apiBaseUrl)
    })

parameters.forEach((parameter) => {
    it(`OK with a valid parameter (${parameter})`, () =>{
        cy.api({
            method:'GET',
            url: `/api/v2/berry/${parameter}`
        }).then((resp) => {
            expect(resp.status).to.eq(200)
        })
    })

    it(`Error code for invalid parameter (${parameter})`, () =>{
        cy.api({
            method:'GET', 
            url: `/api/v2/berry/${parameter}-invalid`, 
            failOnStatusCode: false         // To advoid default failed
        }).then((resp) => {
            expect(resp.status).to.eq(404)
        })
    })

    
})
})