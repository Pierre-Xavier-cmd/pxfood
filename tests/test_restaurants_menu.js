
import app from "../web.js"
import http from "http"
import assert from "assert"
import supertest from "supertest"
import Menu from "../models/Menu.js"
import User from "../models/Users.js"
import Restaurant from "../models/Restaurant.js"
const request = supertest(app)

// A faire: rajouter les tests pour les Menus et remplacer users.. 
describe("Test Menu API", () => {
    let server
    let userToken
    let adminToken
    let menuId
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
        Menu.deleteMany({})
            .then(() => User.deleteMany({})).then(() => Restaurant.deleteMany({}))
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

    it("should create a menu after creating a restaurant", function(done) {
        this.timeout(7000); // Increase timeout to 7 seconds

        const restaurant = {
            name: "Test Restaurant",
            address: "123 rue de la Paix, Paris",
            phone: "+33 1 42 36 78 90",
            opening_hours: "09:00:00",
        };
        request
            .post("/api/restaurant/")
            .set("authorization", `Bearer ${adminToken}`)
            .send(restaurant)
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                const restaurantId = res.body._id;
                const menu = {
                    restaurant_id: restaurantId,
                    name: "Test Menu",
                    description: "Test Description",
                    price: 10,
                    category: "Test Category",
                };
                request
                    .post("/api/menu/")
                    .set("authorization", `Bearer ${adminToken}`)
                    .send(menu)
                    .expect(201)
                    .end((err, res) => {
                        if (err) return done(err);
                        menuId = res.body._id;
                        done();
                    });
            });
    });


    it("should return a list of menu", (done) => {
        request.get("/api/menu/").set("authorization", `Bearer ${userToken}`).expect(200).end((err, res) => {
            if (err) {
                console.log(err)
                done(err)
            }
            const menus = res.body
            assert(Array.isArray(menus), "Expected response body to be an array")
            assert(menus.length > 0, "Expected at least one menu in the response")

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



    it("should return a menu by id", (done) => {
        
        request.get(`/api/menu/${menuId}`).set("authorization", `Bearer ${userToken}`).expect(200).end((err, res) => {
            if (err) {
                console.log(err)
                done(err)
            }
            const menu = res.body
            assert(menu._id, "Expected menu to have an 'id' property")
            assert(menu.restaurant_id, "Expected menu to have an 'restaurant_id' property")
            assert(menu.name, "Expected menu to have an 'name' property")
            assert(menu.description, "Expected menu to have a 'description' property")
            assert(menu.price, "Expected menu to have a 'price' property")
            assert(menu.category, "Expected menu to have a 'category' property")
            done()
        })
    })


    it("should update a menu by id", (done) => {
        const newName = "updated menu"
        const menuUpdate = {
            name: newName
        }
        request.put(`/api/menu/${menuId}`)
        .set("authorization", `Bearer ${adminToken}`)
        .send(menuUpdate)
        .expect(200)
        .end((err, res) => {
            assert.strictEqual(res.body.name, newName, "Expected menu to have the updated name")
            done()
        })        
    })

    it("should delete a menu by id", (done) => {
        request.delete(`/api/menu/${menuId}`)
        .set("authorization", `Bearer ${adminToken}`)
        .expect(200)
        .end((err, res) => {
            done()
        })
    })
 








  
})




