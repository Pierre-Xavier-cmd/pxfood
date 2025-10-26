
import app from "../web.js"
import http from "http"
import supertest from "supertest"
import assert from "assert"
import Restaurant from "../models/Restaurant.js"
import User from "../models/Users.js"
// A faire: rajouter les tests pour les restaurants et remplacer users.. 




describe("Test Restaurants API", () => {
    let server
    let userToken
    let adminToken
    let restaurantId
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
        
        const request = supertest(app)
        
        // Séquentiel : delete → create users → login
        Restaurant.deleteMany({})
            .then(() => User.deleteMany({}))
            .then(() => User.create({
                username: adminCredentials.username,
                email: adminCredentials.email,
                password: adminCredentials.password,
                role: "admin",
            }))
            .then(() => User.create({
                username: userCredentials.username,
                email: userCredentials.email,
                password: userCredentials.password,
                role: "user",
            }))
            .then(() => {
                request.post("/api/auth/login").send(userCredentials).expect(200).end((err, res) => {
                    if (err) return done(err)
                    userToken = res.body.accessToken
                    
                    request.post("/api/auth/login").send(adminCredentials).expect(200).end((err, res) => {
                        if (err) return done(err)
                        adminToken = res.body.accessToken
                        done()
                    })
                })
            })
            .catch((err) => done(err))
    })

    after((done) => {
        server.close(done)
    })

    it("should create a restaurant", (done) => {
        const restaurant = {
            name: "Test Restaurant",
            address: "123 rue de la Paix, Paris",
            phone: "+33 1 42 36 78 90",
            opening_hours: "09:00:00",
        }
        const request = supertest(app)
        request.post("/api/restaurant").set("authorization", `Bearer ${adminToken}`).send(restaurant).expect(201).end(
            
            (err, res) => {
                if (err) {
                    console.log(err)
                    done(err)
                }
                restaurantId = res.body._id
                done()
            })
    })
    it("should return a list of restaurant", (done) => {
        const request = supertest(app)
        request.get("/api/restaurant/").set("authorization", `Bearer ${userToken}`).expect(200).end((err, res) => {
            if (err) {
                console.log(err)
                done(err)
            }
            const restaurants = res.body
            restaurants.forEach((restaurant) => {
                assert(restaurant._id, "Expected restaurant to have an 'id' property")
                assert(restaurant.name, "Expected restaurant to have a 'name' property")
                assert(restaurant.address, "Expected restaurant to have an 'address' property")
                assert(restaurant.phone, "Expected restaurant to have a 'phone' property")
                assert(restaurant.opening_hours, "Expected restaurant to have a 'opening_hours' property")
            })
            done()
        })
    })

    it("should return a restaurant by id", (done) => {
        const request = supertest(app)
        request.get(`/api/restaurant/${restaurantId}`).set("authorization", `Bearer ${userToken}`).expect(200).end((err, res) => {
            const restaurant = res.body
            assert(restaurant._id, "Expected restaurant to have an 'id' property")
            assert(restaurant.name, "Expected restaurant to have a 'name' property")
            done()
        })
    })





    it("should update a restaurant by id", (done) => {
        const newName = "updated restaurant"
        const restaurantUpdate = {
            name: newName
        }
        const request = supertest(app)
        request.put(`/api/restaurant/${restaurantId}`)
        .set("authorization", `Bearer ${adminToken}`)
        .send(restaurantUpdate)
        .expect(200)
        .end((err, res) => {
            if (err) {
                console.log(err)
                done(err)
            }
            assert.strictEqual(res.body.name, newName, "Expected restaurant to have the updated name")
            done()
        })        
    })

    it("should delete a restaurant by id", (done) => {
        const request = supertest(app)
        request.delete(`/api/restaurant/${restaurantId}`)
        .set("authorization", `Bearer ${adminToken}`)
        .expect(200)
        .end((err, res) => {
            done()
        })  
    })

})




