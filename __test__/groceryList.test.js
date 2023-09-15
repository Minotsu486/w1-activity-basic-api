const request = require("supertest");
const baseURL = "http://localhost:3000";
const {closeServer} = require('../app');
describe("API Test", () => {
    afterAll(done => {
        closeServer();
        done();
      })
    test("GET", async () => {
        //Arrange & Act
        const response = await request(baseURL).get("/api/list");
        //Assert
        expect(response.statusCode).toBe(200);
    })
    test("POST", async () => {
        //Arrange
        const newItem = {
            name: 'Milk',
            price: 4.00,
            quantity: 1,
            purchased: false
        }
        //Act
        const response = await request(baseURL).post("/api/addToList").send(newItem);
        //Assert
        expect(response.statusCode).toBe(201);
    })
    test("PUT", async () => {
        //Arrange 
        const newItem = {
            name: 'Milk',
            price: 4.00,
            quantity: 1,
            purchased: true
        }
        //Act
        const response = await request(baseURL).put("/api/update").send(newItem);
        //Assert
        expect(response.statusCode).toBe(200);
    })
    test("DELETE", async () => {
        //Arrange 
        const newItem = {
            name: 'Milk',
            price: 4.00,
            quantity: 1,
            purchased: true
        }
        //Act
        const response = await request(baseURL).delete("/api").send(newItem);
        //Assert
        expect(response.statusCode).toBe(200);
    })
});

