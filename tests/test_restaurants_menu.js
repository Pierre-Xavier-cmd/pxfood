
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
                const menus = JSON.parse(data)

                // Assertions
                assert.strictEqual(res.statusCode, 200, `Expected status 200, but received ${res.statusCode}`)
                assert(Array.isArray(menus), "Expected response body to be an array")
                assert(menus.length > 0, "Expected at least one product in the response")

                // Additional verifications
                menus.forEach((menu) => {
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



    it("should return a menu by id", (done) => {
        const menuId = "68fd06792c7a005435236b52"
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
                assert(menu._id, "Expected menu to have an 'id' property")
                assert(menu.restaurant_id, "Expected menu to have an 'restaurant_id' property")
                assert(menu.name, "Expected menu to have an 'name' property")
                assert(menu.description, "Expected menu to have a 'description' property")
                assert(menu.price, "Expected menu to have a 'price' property")
                assert(menu.category, "Expected menu to have a 'category' property")

                done()
            })
        })

        done()
    })






    it("should update a user by id", (done) => {
        const menuId = "68fd06792c7a005435236b52"
        const randomId = Math.random().toString(36).substring(2, 15)
        const menuUpdate = {
            name: randomId
        }
        const request = supertest(app)
        request.put(`/api/users/${menuId}`)
        .send(menuUpdate)
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
        const menuId = "68fd06792c7a005435236b52"
        const request = supertest(app)
        request.delete(`/api/menu/${menuId}`)
        .send(menutId)
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
 








    it("should create a user", (done) => {
        done()
    })
})




