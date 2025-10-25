import app from "../web.js"
import http from "http"
import assert from "assert"

describe("Test Users API", () => {
    let server

    before((done) => {
        server = http.createServer(app)
        server.listen(done)
    })

    after((done) => {
        server.close(done)
    })

    it("should return a list of users", (done) => {
        http.get("http://localhost:8080/api/users/", (res) => {
            let data = ""

            res.on("data", (chunk) => {
                data += chunk
            })

            res.on("end", () => {
                const products = JSON.parse(data)

                // Assertions
                assert.strictEqual(res.statusCode, 200, `Expected status 200, but received ${res.statusCode}`)
                assert(Array.isArray(products), "Expected response body to be an array")
                assert(products.length > 0, "Expected at least one product in the response")

                // Additional verifications
                products.forEach((product) => {
                    assert(product._id, "Expected product to have an 'id' property")
                    assert(product.title, "Expected product to have a 'title' property")
                    assert(product.price, "Expected product to have a 'price' property")
                })

                done()
            })
        })
    })

    it("should return a user by id", (done) => {})
    it("should update a user by id", (done) => {})
    it("should delete a user by id", (done) => {})
    it("should create a user", (done) => {})
})




