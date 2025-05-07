const request = require("supertest");
const app = require("../src/app");

test("POST /users deve retornar um json com url de foto e nome de usuário", async () => {
    const data = {
        picture_profile_url: "foto",
        username: "Teste 1",
        email: "ficticio.exemplo2@gmail.com",
        password: "123456"
    }

    const response = await request(app)
                           .post("/users")
                           .send(data)
                           .set("Accept", "application/json")
                           
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("picture_profile_url");
    expect(response.body).toHaveProperty("username");
    expect(response.body.picture_profile_url).toBe(data.picture_profile_url);
    expect(response.body.username).toBe(data.username);

});

test("POST /users deve falhar se o email já for cadastrado", async () => {
    const data = {
        picture_profile_url: "foto",
        username: "Teste 1",
        email: "ficticio.exemplo@gmail.com",
        password: "123456"
    }

    const response = await request(app)
                           .post("/users")
                           .send(data)
                           .set("Accept", "application/json")
                           
    
    expect(response.status).toBe(500);
    expect(response.text).toContain("Email já cadastrado!");

});