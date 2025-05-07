const request = require("supertest");
const app = require("../src/app");

// test("POST /users deve retornar um json com url de foto e nome de usuário", async () => {
//     const data = {
//         picture_profile_url: "foto",
//         username: "Teste 1",
//         email: "ficticio.exemplo7@gmail.com", // Para cada teste alterar o email...
//         password: "123456"
//     }

//     const response = await request(app)
//                            .post("/users")
//                            .send(data)
//                            .set("Accept", "application/json")
                           
    
//     expect(response.status).toBe(201);
//     expect(response.body).toHaveProperty("picture_profile_url");
//     expect(response.body).toHaveProperty("username");
//     expect(response.body.picture_profile_url).toBe(data.picture_profile_url);
//     expect(response.body.username).toBe(data.username);

// });

// test("POST /users deve falhar se o email já for cadastrado", async () => {
//     const data = {
//         picture_profile_url: "foto",
//         username: "Teste 1",
//         email: "ficticio.exemplo6@gmail.com", // Nesse teste o intuito é realmente dar erro
//         password: "123456"                   // Não alterar o email caso queira testar o lançamento do erro.
//     }

//     const response = await request(app)
//                            .post("/users")
//                            .send(data)
//                            .set("Accept", "application/json")
                           
    
//     expect(response.status).toBe(500);
//     expect(response.text).toContain("Email já cadastrado!");

// });

// test("POST /admin deve retornar um json com url de foto e nome de usuário", async () => {
//     const data = {
//         picture_profile_url: "foto",
//         username: "Teste 3",
//         email: "administrador2.exemplo@gmail.com",    // Para cada teste alterar o email...
//         password: "123456"                         
//     }

//     const response = await request(app)
//                            .post("/admin")
//                            .send(data)
//                            .set("Accept", "application/json")
                           
    
//     expect(response.status).toBe(201);
//     expect(response.body).toHaveProperty("picture_profile_url");
//     expect(response.body).toHaveProperty("username");
//     expect(response.body.picture_profile_url).toBe(data.picture_profile_url);
//     expect(response.body.username).toBe(data.username);

// });

// test("POST /admin deve falhar se o email já for cadastrado", async () => {
//     const data = {
//         picture_profile_url: "foto",
//         username: "Teste 1",
//         email: "administrador.exemplo@gmail.com",   // Esse teste também retorna um erro...
//         password: "123456"
//     }

//     const response = await request(app)
//                            .post("/admin")
//                            .send(data)
//                            .set("Accept", "application/json")
                           
    
//     expect(response.status).toBe(500);
//     expect(response.text).toContain("Email já cadastrado!");
// });

// test("GET /users deve retornar um list de usuários", async () => {
//     const response = await request(app).get("/users");

//     expect(response.status).toBe(200);
//     expect(Array.isArray(response.body)).toBe(true);

//     response.body.forEach(userDto => {
//         expect(userDto).toHaveProperty("id");
//         expect(userDto).toHaveProperty("picture_profile_url");
//         expect(userDto).toHaveProperty("username");
//         expect(userDto).toHaveProperty("email");
//         expect(userDto).toHaveProperty("role");
//     });
// });

// test("GET /users deve retornar um erro pois o banco de dados se encontra vázio", async () => {
//     const response = await request(app).get("/users");

//     expect(response.status).toBe(500);
//     expect(response.text).toContain("Nenhum usuário cadastrado");
// });

test("GET /users deve retornar um erro pois o banco de dados se encontra vázio", async () => {
    const response = await request(app).get("/users/cb143f9b-7727-47a7-8cbe-41bd5ba29745");

    expect(response.status).toBe(200);
});