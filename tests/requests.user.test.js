const request = require("supertest");
const app = require("../src/app");
const { generateRecoveryCode } = require("../src/services/userservice");
const { User } = require("../src/resources/db");

test("POST /users deve retornar um json com url de foto e nome de usuário", async () => {
    const data = {
        picture_profile_url: "foto",
        username: "Teste 1",
        email: "ficticio.exemplo2@gmail.com", // Para cada teste alterar o email...
        password: "123456"
    }

    const response = await request(app)
                           .post("/users")
                           .send(data)
                           .set("Accept", "application/json")
                           
    console.log(response.body);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("picture_profile_url");
    expect(response.body).toHaveProperty("username");
    expect(response.body.picture_profile_url).toBe(data.picture_profile_url);
    expect(response.body.username).toBe(data.username);

    await User.destroy({
        where: { username: data.username }
    });

});

test("POST /users deve falhar se o email já for cadastrado", async () => {
    const data = {
        picture_profile_url: "foto",
        username: "Teste 1",
        email: "ficticio.exemplo@gmail.com", // Nesse teste o intuito é realmente dar erro
        password: "123456"                   // Não alterar o email caso queira testar o lançamento do erro.
    }

    const response = await request(app)
                           .post("/users")
                           .send(data)
                           .set("Accept", "application/json")
                           
    console.log(response.text);                       
    
    expect(response.status).toBe(500);
    expect(response.text).toContain("Email já cadastrado!");

});

test("POST /admin deve retornar um json com url de foto e nome de usuário", async () => {
    const data = {
        picture_profile_url: "foto",
        username: "Teste 3",
        email: "administrador2.exemplo@gmail.com",
        password: "123456"                         
    }

    const response = await request(app)
                           .post("/admin")
                           .send(data)
                           .set("Accept", "application/json")
                           
    console.log(response.body);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("picture_profile_url");
    expect(response.body).toHaveProperty("username");
    expect(response.body.picture_profile_url).toBe(data.picture_profile_url);
    expect(response.body.username).toBe(data.username);

    await User.destroy({
        where: { username: data.username }
    });
});

test("POST /admin deve falhar se o email já for cadastrado", async () => {
    const data = {
        picture_profile_url: "foto",
        username: "Teste",
        email: "administrador1.exemplo@gmail.com",   // Esse teste também retorna um erro...
        password: "123456"
    }

    const response = await request(app)
                           .post("/admin")
                           .send(data)
                           .set("Accept", "application/json")
                           
    console.log(response.text);

    expect(response.status).toBe(500);
    expect(response.text).toContain("Email já cadastrado!");
});

test("GET /users deve retornar um list de usuários", async () => {
    const response = await request(app).get("/users");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    console.log(response.body);

    response.body.forEach(user => {
        expect(user).toHaveProperty("id");
        expect(user).toHaveProperty("slug");
        expect(user).toHaveProperty("picture_profile_url");
        expect(user).toHaveProperty("username");
        expect(user).toHaveProperty("email");
        expect(user).toHaveProperty("role");
    });
});

// test("GET /users deve retornar um erro pois o banco de dados se encontra vázio", async () => {
//     const response = await request(app).get("/users");

//     expect(response.status).toBe(500);
//     expect(response.text).toContain("Nenhum usuário cadastrado");
// });

test("GET /users/:id deve retornar um erro pois o banco de dados se encontra vázio", async () => {
    const response = await request(app).get("/users/54071d07-f599-449e-8b16-ca58b9fe416d");
    console.log(response.text);
    expect(response.status).toBe(200);
});

test("PUT /users/:id/username deve retornar o novo username", async () => {
    
    const newName = {
        username: "Nome Atualizado"
    }

    const response = await request(app).put("/users/fe13e840-f275-4911-90d4-e6856e042dcd/username")
                                       .send(newName)
                                       .set("Accept", "application/json");

    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("username");
    expect(response.body.username).toBe(newName.username);
});

test("PUT /users/:id/email deve atualizar o email e retornar o novo e-mail", async () => {
    const newEmail = {
        email: "novoemailatualizado@gmail.com"
    }

    const response = await request(app).put("/users/0bfc4a33-b0a5-4fed-99c6-7cc433dd3642/email")
                                        .send(newEmail)
                                        .set("Accept", "application/json");

    console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("email");
    expect(response.body.email).toBe(newEmail.email);
});

test("PUT /users/:id/password deve atualizar a senha e retornar o nova senha", async () => {
    const newPassword = {
        password: "novasenha123"
    }

    const response = await request(app).put("/users/719f2376-2e5b-4457-9ae6-aa15b952eba9/password")
                                        .send(newPassword)
                                        .set("Accept", "application/json");

    console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("newPassword");
    expect(response.body.newPassword).toBe(newPassword.password);
});

test("Metodo sendRecoveryCode deve enviar um código para o e-mail fornecido", async () => {
    const result = await generateRecoveryCode("desenvolvimentowesleyleopoldo@gmail.com");
    console.log(result)
    expect(result).toHaveProperty("message");
});