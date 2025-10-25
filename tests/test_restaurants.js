
import app from "../web.js"
import http from "http"
import assert from "assert"

// A faire: rajouter les tests pour les restaurants et remplacer users.. 
describe("Test Restaurants API", () => {
    let server

    before((done) => {
        server = http.createServer(app)
        server.listen(done)
    })

    after((done) => {
        server.close(done)
    })

    it("should return a list of restaurant", (done) => {
        http.get("http://localhost:8080/api/restaurant/", (res) => {
            let data = ""

            res.on("data", (chunk) => {
                data += chunk
            })

            res.on("end", () => {
                const restaurant = JSON.parse(data)

                // Assertions
                assert.strictEqual(res.statusCode, 200, `Expected status 200, but received ${res.statusCode}`)
                assert(Array.isArray(restaurant), "Expected response body to be an array")
                assert(restaurant.length > 0, "Expected at least one restaurant in the response")

                // Additional verifications
                products.forEach((restaurant) => {
                    assert(restaurant._id, "Expected restaurant to have an 'id' property")
                    assert(restaurant.name, "Expected restaurant to have a 'name' property")
                    assert(restaurant.address, "Expected restaurant to have a 'address' property")
                    assert(restaurant.phone, "Excepted restaurant to have a 'phone' property")
                    assert(restaurant.opening_hours, "Excepted restaurant to have a 'opening_hours' property")
                })

                done()
            })
        })
    })

    it("should return a user by id", (done) => {
        done()
    })
    it("should update a user by id", (done) => {
        done()
    })
    it("should delete a user by id", (done) => {
        done()
    })
    it("should create a user", (done) => {
        done()
    })
})




