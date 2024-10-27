function morePotency(berries) {
    var potency = 0
    var resultBerry = null

    berries.forEach(function (berry) {
        if (berry.potency > potency) {
            potency = berry.potency
            resultBerry = berry
        }
    })

    return resultBerry
}

function getPotencyByFlavor(respBody, flavorName){
    var flavorPotency = 0
    
    respBody.forEach(function(flavor){
        if(flavor.flavor.name === flavorName){
            flavorPotency = flavor.potency
        }else{
            return null
        }
    })
    return flavorPotency

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
            const berryId = parseInt(morePotencyBerry['berry']['url'].split("/").at(-2))

            cy.api({
                method: 'GET',
                url: `/api/v2/berry/${berryName}`
            }).then((resp) => {
                expect(resp.status).to.eq(200)
                
                expect(resp.body['name']).to.eq(berryName)
                expect(resp.body['id']).to.eq(berryId)
                expect(getPotencyByFlavor(resp.body['flavors'], berryFlavor)).to.eq(berryPotency)

                // COMPARE RESPONSES
            })
        })


    })

})


