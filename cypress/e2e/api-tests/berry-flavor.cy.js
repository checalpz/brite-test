const berryFlavor = 'spicy'

/*
    Given a array of berries, return the information of the berry with more potency
*/
function morePotency(berries) {
    let potency = 0
    let resultBerry = null

    berries.forEach(function (berry) {
        if (berry.potency > potency) {
            potency = berry.potency
            resultBerry = berry
        }
    })

    return resultBerry
}

/*
    Return the  potency of a given flavor searching in the response body of the endpoint,
*/
function getPotencyByFlavor(respBody, flavorName) {

    const flavorPotency = respBody.find((flavor) => flavor.flavor.name === flavorName);

    return flavorPotency.potency;
}


describe('Spicy flavour API', () => {

    beforeEach({ baseUrl: Cypress.env('apiBaseUrl') }, () => {
        const apiBaseUrl = Cypress.env('apiBaseUrl')
        Cypress.config('baseUrl', apiBaseUrl)
    })

    it('Berry flavour', () => {

        // Call the first endpoint, confirm if all the necesary field  exist
        cy.api({
            method: 'GET',
            url: `/api/v2/berry-flavor/${berryFlavor}`
        }).then((resp) => {
            expect(resp.status).to.eq(200)
            expect(resp.body['berries']).to.exist

            const morePotencyBerry = morePotency(resp.body['berries'])
            const berryName = morePotencyBerry['berry']['name']
            const berryPotency = morePotencyBerry['potency']
            const berryId = parseInt(morePotencyBerry['berry']['url'].split('/').at(-2))    // Split the URL to get the berry id

            cy.api({
                method: 'GET',
                url: `/api/v2/berry/${berryName}`
            }).then((resp) => {
                expect(resp.status).to.eq(200)

                // Compare that information receive in both call are the same
                expect(resp.body['name']).to.eq(berryName)
                expect(resp.body['id']).to.eq(berryId)
                expect(getPotencyByFlavor(resp.body['flavors'], berryFlavor)).to.eq(berryPotency)

            })
        })
    })
})
