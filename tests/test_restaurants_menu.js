
import app from "../web.js"
import http from "http"
import assert from "assert"

// A faire: rajouter les tests pour les Menus et remplacer users.. 
describe("Test Menu API", () => {
    let server

    before((done) => {
        server = http.createServer(app)
        server.listen(done)
    })

    after((done) => {
        server.close(done)
    })

    it("should return a list of menu", (done) => {
        http.get("http://localhost:8080/api/menu/", (res) => {
            let data = ""

            res.on("data", (chunk) => {
                data += chunk
            })

            res.on("end", () => {
                const menu = JSON.parse(data)

                // Assertions
                assert.strictEqual(res.statusCode, 200, `Expected status 200, but received ${res.statusCode}`)
                assert(Array.isArray(menu), "Expected response body to be an array")
                assert(menu.length > 0, "Expected at least one product in the response")

                // Additional verifications
                products.forEach((menu) => {
                    assert(menu._id, "Expected menu to have an 'id' property")
                    assert(menu.restaurant_id, "Expected menu to have a 'restaurant_id' property")
                    assert(menu.name, "Expected menu to have a 'name' property")
                    assert(menu.description, "Expected menu to have a 'description' property")
                    assert(menu.price, "Expected menu to have a 'price' property")
                    assert(menu.category, "Expected menu to have a 'category' property")

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




