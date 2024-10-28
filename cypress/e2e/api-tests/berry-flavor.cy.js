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

function getPotencyByFlavor(respBody, flavorName){
    
    const flavorPotency = respBody.find((flavor) => flavor.flavor.name === flavorName);
    
    return flavorPotency.potency;
}

const berryFlavor = 'spicy'

describe('Spicy flavour API', () => {

    beforeEach({ baseUrl: Cypress.env('apiBaseUrl') }, () => {
        const apiBaseUrl = Cypress.env('apiBaseUrl')
        Cypress.config('baseUrl', apiBaseUrl)
    })

    it('Berry flavour', () => {
        cy.api({
            method: 'GET',
            url: `/api/v2/berry-flavor/${berryFlavor}`
        }).then((resp) => {
            expect(resp.status).to.eq(200)
            
            cy.log(resp.body['berries'])

            const morePotencyBerry = morePotency(resp.body['berries'])
            const berryName = morePotencyBerry['berry']['name']
            const berryPotency = morePotencyBerry['potency']
            const berryId = parseInt(morePotencyBerry['berry']['url'].split('/').at(-2))

            cy.api({
                method: 'GET',
                url: `/api/v2/berry/${berryName}`
            }).then((resp) => {
                expect(resp.status).to.eq(200)
                
                expect(resp.body['name']).to.eq(berryName)
                expect(resp.body['id']).to.eq(berryId)
                expect(getPotencyByFlavor(resp.body['flavors'], berryFlavor)).to.eq(berryPotency)

            })
        })


    })

})
