const request = require("supertest");
const app = require("../src/app");
const { Post } = require("../src/resources/db");

test("POST /:id/post deve criar e retornar os dados da nova publicação", async () => {
    const data = {
        title: "Teste de criação de post...",
        content: `
            A sustentabilidade é um conceito fundamental para garantir o equilíbrio entre o desenvolvimento econômico, 
            a preservação ambiental e o bem-estar social. Ela propõe o uso consciente dos recursos naturais, de modo 
            que as necessidades do presente sejam atendidas sem comprometer a capacidade das futuras gerações. 
             Práticas sustentáveis incluem o consumo responsável, a redução de resíduos, o uso de fontes de energia renováveis
             e a valorização da biodiversidade. Governos, empresas e cidadãos têm papéis importantes nesse processo,
            adotando políticas e comportamentos que minimizem impactos negativos no meio ambiente. 
            A educação ambiental é uma ferramenta essencial para promover a conscientização e estimular mudanças de
             atitude em direção a um futuro mais equilibrado e justo.
        `,
        dateTime: new Date()
    }

    const response = await request(app)
                            .post("/6612d7f4-f42c-42e5-a6bb-0cdc1f6895d0/posts")
                            .send(data)
                            .set("Accept", "application/json")

    console.log(response.body);

    expect(response.body.title).toBe(data.title);
    expect(response.body.content).toBe(data.content);
    expect(response.body.dateTime).toBe(data.dateTime.toISOString());
    expect(response.body.likes).toBe(0);

    await Post.destroy({
        where: { title: data.title }
    });
});

test("GET /posts deve retornar uma lista de posts", async () => {
    const response = await request(app).get("/posts")

    console.log(response.body)

    response.body.forEach(post => {
        expect(post).toHaveProperty("id");
        expect(post).toHaveProperty("title");
        expect(post).toHaveProperty("content");
        expect(post).toHaveProperty("slug");
        expect(post).toHaveProperty("dateTime");
        expect(post).toHaveProperty("likes");
    });
})

test("POST /:id/post/like deve retornar o novo número de likes", async () => {
    const response = await request(app).post("/12/post/like").set("Accept", "application/json");

    console.log(response.body);

    expect(response.body).toHaveProperty("likes");
})

test("POST /:id/post/like deve retornar o novo número de likes", async () => {
    const response = await request(app).post("/12/post/removelike").set("Accept", "application/json");

    console.log(response.body);

    expect(response.body).toHaveProperty("likes");
})