import app from "../web.js"
import http from "http"
import supertest from "supertest"
import assert from "assert"
import User from "../models/Users.js"

describe("Test Users API", () => {
    let server
    let createdUserId;
    let createdAdminId;
    let userToken;
    let adminToken;
    let userCredentials = {
        username: "nox",
        email: "nox@noxen.net",
        password: "aZerTy123",
      }
    
      let adminCredentials = {
        username: "thierry",
        email: "thierry.prost@supinfo.com",
        password: "aZerTy123",
      }


    before((done) => {
        server = http.createServer(app)
        server.listen()
        User.deleteMany({})
            .then(() => done())
            .catch((err) => done(err));
    })
    after((done) => {
        server.close(done)
    })

    it("should register a normal user", (done) => {
        const request = supertest(app)
        request.post(`/api/auth/register`)
        .send(userCredentials)
        .expect(201)
        .end((err, res) => {
            createdUserId = res.body._id
            userToken = res.body.accessToken
            done()
        })
    })

    it("should create a admin user via mongo db directly", (done) => {
        // La seule maniere de creer un admin user est vias mongo db directement pas l'api
        User.create({
            username: adminCredentials.username,
            email: adminCredentials.email,
            password: adminCredentials.password,
            role: "admin",
        })
        .then((user) => {
            createdAdminId = user._id
            const request = supertest(app)
            request.post(`/api/auth/login`)
            .send({
                username: adminCredentials.username,
                password: adminCredentials.password,
            })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    console.log("error logging in admin user", err)
                    return done(err)}
                adminToken = res.body.accessToken
                console.log("adminToken", adminToken)
                done(err)
            })
        })
        .catch((err) => {
            console.log("error creating admin user", err)
            done(err)
        });
    })

    it("should return a list of users", (done) => {
        const request = supertest(app)
        request.get(`/api/users/`)
        .set("authorization", `Bearer ${adminToken}`)
        .expect(200)
        .end((err, res) => {
            if (err) done(err)
            const users = res.body
            assert.strictEqual(res.statusCode, 200, `Expected status 200, but received ${res.statusCode}`)
            assert(Array.isArray(users), "Expected response body to be an array")
            assert(users.length > 0, "Expected at least one user in the response")
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

    it("should return a user by id", (done) => {
        const request = supertest(app)
        request.get(`/api/users/${createdUserId}`)
        .set("authorization", `Bearer ${adminToken}`)
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

    it("should create a user", (done) => {
        const randomId = Math.random().toString(36).substring(2, 15)
        const request = supertest(app)
        request.post(`/api/auth/register`)
        .send({
            username: `testuser_${randomId}`,
            email: `test_${randomId}@example.com`,
            password: "testpassword123",
        })
        .expect(200)
        .end((err, res) => {
        console.log(res.body)
        done()
    })
})
})
