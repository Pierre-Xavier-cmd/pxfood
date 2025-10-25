
import app from "../web.js"
import http from "http"
import supertest from "supertest"
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
                const restaurants = JSON.parse(data)

                // Assertions
                assert.strictEqual(res.statusCode, 200, `Expected status 200, but received ${res.statusCode}`)
                assert(Array.isArray(restaurants), "Expected response body to be an array")
                assert(restaurants.length > 0, "Expected at least one restaurant in the response")

                // Additional verifications
                restaurants.forEach((restaurant) => {
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

    it("should return a restaurant by id", (done) => {
        const restaurantId = "68fd06792c7a005435236b52"
        http.get(`http://localhost:8080/api/restaurant/${restaurantId}`, (res) => {
            let data = ""

            res.on("data", (chunk) => {
                data += chunk
            })

            res.on("end", () => {
                const restaurant = JSON.parse(data)
                // Assertions
                assert.strictEqual(res.statusCode, 200, `Expected status 200, but received ${res.statusCode}`)
                // Additional verifications
                assert(restaurant._id, "Expected restaurant to have an 'id' property")
                assert(restaurant.name, "Expected restaurant to have an 'name' property")
                assert(restaurant.address, "Expected restaurant to have an 'address' property")
                assert(restaurant.phone, "Expected restaurant to have a 'phone' property")
                assert(restaurant.opening_hours, "Expected restaurant to have a 'opening_hours' property")

                done()
            })
        })

        done()
    })





    it("should update a restaurant by id", (done) => {
        const restaurantId = "68fd06792c7a005435236b52"
        const randomId = Math.random().toString(36).substring(2, 15)
        const restaurantUpdate = {
            name: randomId
        }
        const request = supertest(app)
        request.put(`/api/users/${restaurantId}`)
        .send(restaurantUpdate)
        .expect(200)
        .end((err, res) => {
            if (err) {
                console.log(err)
                done(err)
            }
            assert.strictEqual(res.body.name, randomId, "Expected user to have the updated name")
            done()
        })        
        done()


    })




    it("should delete a restaurant by id", (done) => {
        const userId = "68fd06792c7a005435236b52"
        const request = supertest(app)
        request.delete(`/api/restaurant/${restaurantId}`)
        .send(restaurantId)
        .expect(200)
        .end((err, res) => {
            if (err) {
                console.log(err)
                done(err)
            }

            done()
        })  
        done()      
    })





    it("should create a restaurant", (done) => {
        done()
    })
})




