import app from "../web.js"
import http, { request } from "http"
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
        http.get(`http://localhost:8080/api/users/`, (res) => {
            console.log("have started reading the data")
            let data = ""

            res.on("data", (chunk) => {
                console.log("have read the data chunk")
                data += chunk
            })

            res.on("end", () => {
                console.log("have finished reading the data and start parsting the data")
                const users = JSON.parse(data)

                // Assertions
                assert.strictEqual(res.statusCode, 200, `Expected status 200, but received ${res.statusCode}`)
                assert(Array.isArray(users), "Expected response body to be an array")
                assert(users.length > 0, "Expected at least one user in the response")

                // Additional verifications
                users.forEach((user) => {
                    assert(user._id, "Expected user to have an 'id' property")
                    assert(user.email, "Expected user to have an 'email' property")
                    assert(user.username, "Expected user to have an 'username' property")
                    assert(user.password, "Expected user to have a 'password' property")
                    assert(user.role, "Expected user to have a 'role' property")
                })
                done()
            })
        })
    })

    // it("should return a user by id", (done) => {
    //     http.get(`http://localhost:8080/api/users/`, (res) => {
    //         let data = ""

    //         res.on("data", (chunk) => {
    //             data += chunk
    //         })

    //         res.on("end", () => {
    //             const users = JSON.parse(data)
    //             // Assertions
    //             assert.strictEqual(res.statusCode, 200, `Expected status 200, but received ${res.statusCode}`)
    //             assert(Array.isArray(users), "Expected response body to be an array")
    //             assert(users.length === 1, "Expected only one user in the response")

    //             // Additional verifications
    //             users.forEach((user) => {
    //                 assert(users._id, "Expected user to have an 'id' property")
    //                 assert(users.email, "Expected user to have an 'email' property")
    //                 assert(user.username, "Expected user to have an 'username' property")
    //                 assert(user.password, "Expected user to have a 'password' property")
    //                 assert(user.role, "Expected user to have a 'role' property")
    //             })

    //             done()
    //         })
    //     })
    // })

    // it("should update a user by id", (done) => {
    //     http.request("http://localhost:8080/api/users/", (res) => {
    //         let data = ""

    //         res.on("data", (chunk) => {
    //             data += chunk
    //         })

    //         res.on("end", () => {
    //             const users = JSON.parse(data)

    //             // Assertions
    //             assert.strictEqual(res.statusCode, 200, `Expected status 200, but received ${res.statusCode}`)
    //             assert(Array.isArray(users), "Expected response body to be an array")
    //             assert(users.length === 1, "Expected only one user in the response")

    //             // Additional verifications
    //             products.forEach((users) => {
    //                 assert(users._id, "Expected user to have an 'id' property")
    //                 assert(users.email, "Expected user to have an 'email' property")
    //                 assert(users.username, "Expected user to have an 'username' property")
    //                 assert(users.password, "Expected user to have a 'password' property")
    //                 assert(users.role, "Expected user to have a 'role' property")
    //             })

    //             done()
    //         })
    //     })
    // })


    // it("should update a user by id", (done) => {
    //     done()
    // })
    // it("should delete a user by id", (done) => {
    //     done()
    // })
})

/*
    it("should delete a user by id", async () => {
        const usersId = firstUsersId

        const response = await request
          .delete(`/api/users/${usersId}`)
          .set("authorization", `Bearer ${adminToken}`)

        expect(response).to.have.status(200)
        expect(response.body).to.have.property(
            "response",
            `User with id ${usersId} has been deleted`
        )
    })


  it("should delete a product", async () => {
    const productId = firstProductId

    const response = await request
      .delete(`/api/products/${productId}`)
      .set("authorization", `Bearer ${adminToken}`)

    expect(response).to.have.status(200)
    expect(response.body).to.have.property(
      "response",
      `Product with id ${productId} has been deleted`
    )
  })


    it("should create a user", (done) => {
        done()
    })
})

*/




