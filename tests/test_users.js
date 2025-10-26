import app from "../web.js"
import http from "http"
import supertest from "supertest"
import assert from "assert"
import User from "../models/Users.js"

describe("Test Users API", () => {
    let server
    let createdUserId;
    before((done) => {
        server = http.createServer(app)
        server.listen(() => {
            // Créer l'utilisateur directement avec mongoose
            const randomId = Math.random().toString(36).substring(2, 15)
            User.create({
                username: `testuser_${randomId}`,
                email: `test_${randomId}@example.com`,
                password: "testpassword123",
                role: "user"
            }).then((user) => {
                createdUserId = user._id
                done()
            }).catch(done)
        })
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

    it("should return a user by id", (done) => {
        http.get(`http://localhost:8080/api/users/${createdUserId}`, (res) => {
            let data = ""

            res.on("data", (chunk) => {
                data += chunk
            })

            res.on("end", () => {
                const user = JSON.parse(data)
                // Assertions
                assert.strictEqual(res.statusCode, 200, `Expected status 200, but received ${res.statusCode}`)
                // Additional verifications
                assert(user._id, "Expected user to have an 'id' property")
                assert(user.email, "Expected user to have an 'email' property")
                assert(user.username, "Expected user to have an 'username' property")
                assert(user.password, "Expected user to have a 'password' property")
                assert(user.role, "Expected user to have a 'role' property")

                done()
            })
        })
    })

    it("should update a user by id", (done) => {
        const randomId = Math.random().toString(36).substring(2, 15)
        const userUpdate = {
            username: randomId
        }
        const request = supertest(app)
        request.put(`/api/users/${createdUserId}`)
        .send(userUpdate)
        .expect(200)
        .end((err, res) => {
            if (err) {
                console.log(err)
                done(err)
            }
            assert.strictEqual(res.body.username, randomId, "Expected user to have the updated username")
            done()
        })
    })


    it("should delete a user by id", (done) => {
        const request = supertest(app)
        request.delete(`/api/users/${createdUserId}`)
        .send(createdUserId)
        .expect(200)
        .end((err, res) => {
            if (err) {
                console.log(err)
                done(err)
            }

            done()
        })
        
    })    
})