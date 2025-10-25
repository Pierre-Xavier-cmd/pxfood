import chai from "chai"
import chaiHttp from "chai-http"
import app from "../web.js"
import User from "../models/User.js"

chai.use(chaiHttp)
const expect = chai.expect

let userCredentials
let adminCredentials

let userToken
let adminToken

let normalUserId
let adminUserId
let thirdUserId

let firstProductId

before(async () => {
  await User.deleteMany({})
  
  userCredentials = {
    username: "nox",
    email: "nox@noxen.net",
    password: "aZerTy123",
  }

  adminCredentials = {
    username: "thierry",
    email: "thierry.prost@supinfo.com",
    password: "aZerTy123",
  }
})

describe("User Registration & Login", () => {
  it("should register a new user", async () => {
    const response = await chai
      .request(app)
      .post("/api/auth/register")
      .send(userCredentials)

    expect(response).to.have.status(201)
    expect(response.body).to.have.property("username")
  })

  it("should login a user and set token", async () => {
    const response = await chai
      .request(app)
      .post("/api/auth/login")
      .send(userCredentials)

    expect(response).to.have.status(200)
    expect(response.body).to.have.property("accessToken")

    userToken = response.body.accessToken
    normalUserId = response.body._id
  })
})

describe("Admin Registration à Login", () => {
  it("should register a second user (future admin)", async () => {
    const response = await chai
      .request(app)
      .post("/api/auth/register")
      .send(adminCredentials)

    expect(response).to.have.status(201)
    expect(response.body).to.have.property("username")

    adminUserId = response.body._id
  })

  it("should update user role to admin", async () => {
    const response = await chai
      .request(app)
      .put(`/api/users/${adminUserId}/admin`)
      .send({ isAdmin: true })

    expect(response).to.have.status(200)
    expect(response.body).to.have.property("isAdmin", true)
  })

  it("should login the admin user and set the global token", async () => {
    const response = await chai
      .request(app)
      .post("/api/auth/login")
      .send(adminCredentials)

    expect(response).to.have.status(200)
    expect(response.body).to.have.property("accessToken")

    adminToken = response.body.accessToken
  })
})

describe("User entity tests", () => {
  it("should get the user", async () => {
    const response = await chai
      .request(app)
      .get(`/api/users/${normalUserId}`)
      .set("authorization", `Bearer ${userToken}`)

    expect(response).to.have.status(200)
    expect(response.body).to.have.property(
      "username",
      userCredentials.username
    )
  })

  it("should update the user", async () => {
    const updatedUserData = {
      username: "noxen",
      email: "info@noxen.net",
    }

    const response = await chai
      .request(app)
      .put(`/api/users/${normalUserId}`)
      .set("authorization", `Bearer ${userToken}`)
      .send(updatedUserData)

    expect(response).to.have.status(200)
    expect(response.body).to.have.property("username", "noxen")
  })

  it("should get the admin user", async () => {
    const response = await chai
      .request(app)
      .get(`/api/users/${adminUserId}`)
      .set("authorization", `Bearer ${adminToken}`)

    expect(response).to.have.status(200)
    expect(response.body).to.have.property(
      "username",
      adminCredentials.username
    )
    expect(response.body).to.have.property("isAdmin", true)
  })

  it("should get all users", async () => {
    const response = await chai
      .request(app)
      .get("/api/users")
      .set("authorization", `Bearer ${adminToken}`)

    expect(response).to.have.status(200)
    expect(response.body).to.be.an("array")
    expect(response.body.length).to.be.greaterThan(0)
  })

  it("should create a third user", async () => {
    const newUser = {
      username: "john",
      email: "john@example.com",
      password: "password123",
    }

    const response = await chai
      .request(app)
      .post("/api/auth/register")
      .send(newUser)

    expect(response).to.have.status(201)
    expect(response.body).to.have.property("username", newUser.username)

    thirdUserId = response.body._id
  })

  it("should delete the third user", async () => {
    const response = await chai
      .request(app)
      .delete(`/api/users/${thirdUserId}`)
      .set("authorization", `Bearer ${adminToken}`)

    expect(response).to.have.status(200)
    expect(response.body).to.have.property(
      "message",
      "User deleted successfully"
    )
  })
})

describe("Product Routes", () => {
  it("should add a new product", async () => {
    const newProduct = {
      title: "New Product",
      desc: "This is a new product",
      img: "new_product.jpg",
      tag: "new",
      price: 9.99,
    }

    const response = await chai
      .request(app)
      .post("/api/products")
      .set("authorization", `Bearer ${adminToken}`)
      .send(newProduct)

    expect(response).to.have.status(200)
    expect(response.body).to.have.property("_id")

    firstProductId = response.body._id
  })

  it("should bulk add products", async () => {
    const response = await chai
      .request(app)
      .post("/api/products/bulk")
      .set("authorization", `Bearer ${adminToken}`)
      .send(
        [
          {
            title: "Console 1",
            desc: "Description for Console 1",
            img: "console1.jpg",
            tag: "console",
            price: 499.99
          },
          {
            title: "Console 1",
            desc: "Description for Console 1",
            img: "console1.jpg",
            tag: "console",
            price: 599.99
          }
        ]
      )

    expect(response).to.have.status(200)
  })

  it("should return the count of all products", async () => {
    const response = await chai
      .request(app)
      .get("/api/products/count")
      .set("authorization", `Bearer ${adminToken}`)

    expect(response).to.have.status(200)
    expect(response.body).to.have.property("count")
  })

  it("should return all products", async () => {
    const response = await chai.request(app).get("/api/products")

    expect(response).to.have.status(200)
    expect(response.body).to.be.an("array")
  })

  it("should return all products sorted by title", async () => {
    const response = await chai
      .request(app)
      .get("/api/products?sort=title")
      .set("authorization", `Bearer ${adminToken}`)
  
    expect(response).to.have.status(200)
    expect(response.body).to.be.an("array")
  
    // Verify that the products are sorted by title
    const titles = response.body.map((product) => product.title)
    const sortedTitles = [...titles].sort()
  
    expect(titles).to.deep.equal(sortedTitles)
  })

  it("should return all products sorted by title and decreasing prices", async () => {
    const response = await chai
      .request(app)
      .get("/api/products?sort=title,-price")
      .set("authorization", `Bearer ${adminToken}`)
  
    expect(response).to.have.status(200);
    expect(response.body).to.be.an("array")
  
    // Verify that the products are sorted by title and price
    const sortedProducts = response.body.sort((a, b) => {
      if (a.title < b.title) return -1
      if (a.title > b.title) return 1
      if (a.price < b.price) return -1
      if (a.price > b.price) return 1
      return 0
    })
  
    expect(response.body).to.deep.equal(sortedProducts);
  })

  it("should return only 2 products", async () => {
    const response = await chai
      .request(app)
      .get("/api/products?limit=2")
      .set("authorization", `Bearer ${adminToken}`)
  
    expect(response).to.have.status(200);
    expect(response.body).to.be.an("array")
    expect(response.body).to.have.lengthOf(2)
  })

  it("should return a single product by id", async () => {
    const productId = firstProductId

    const response = await chai.request(app).get(`/api/products/${productId}`)

    expect(response).to.have.status(200)
    expect(response.body).to.have.property("_id", productId)
  })

  it("should update a product", async () => {
    const productId = firstProductId
    const updatedProduct = {
      title: "Updated Product",
      desc: "This is an updated product",
      img: "updated_product.jpg",
      tag: "updated",
      price: 19.99,
    }

    const response = await chai
      .request(app)
      .put(`/api/products/${productId}`)
      .set("authorization", `Bearer ${adminToken}`)
      .send(updatedProduct)

    expect(response).to.have.status(200)
    expect(response.body).to.have.property("_id", productId)
    expect(response.body).to.have.property("title", updatedProduct.title)
  })

  it("should delete a product", async () => {
    const productId = firstProductId

    const response = await chai
      .request(app)
      .delete(`/api/products/${productId}`)
      .set("authorization", `Bearer ${adminToken}`)

    expect(response).to.have.status(200)
    expect(response.body).to.have.property(
      "response",
      `Product with id ${productId} has been deleted`
    )
  })

  it("should delete all products", async () => {
    const response = await chai
      .request(app)
      .delete("/api/products")
      .set("authorization", `Bearer ${adminToken}`)

    expect(response).to.have.status(200)
    expect(response.body).to.have.property(
      "response",
      "All products have been removed"
    )
  })
})

after(async () => {
  //await User.deleteMany({})
})

