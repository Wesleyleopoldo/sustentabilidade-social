const createPostDTO = require("../dtos/postDto");
const { tryQuery, useTry } = require("../helper/error");
const { Post, User } = require("../resources/db");

const createPost = async (title, content, userId, dateTime) => {
    const data = {
        title: title,
        content: content,
        userId: userId,
        dateTime: dateTime,
        likes: 0
    }

    const findUser = await tryQuery("Usuário pode não existir", () => User.findByPk(userId));
    if (!findUser) {
        throw new Error("Usuário não foi encontrado na base de dados!!!");
    }

    const newPost = await tryQuery("Erro ao criar post", () => Post.create(data));

    const newPostDto = createPostDTO({
        id: newPost.id,
        title: newPost.title,
        content: newPost.content,
        userId: newPost.userId,
        dateTime: newPost.dateTime,
        likes: newPost.likes
    });

    return newPostDto;
}

const indexAllPosts = async () => {
    const posts = await tryQuery("Erro ao listar todos os posts", () => Post.findAll());
    if (!posts.length) {
        throw new Error("Nenhum post encontrado!");
    }

    const postsDto = posts.map(post => createPostDTO({
        id: post.id,
        title: post.title,
        content: post.content,
        // TODO: Criar método para pegar o slug de cada usuário dono dos posts...
        dateTime: post.dateTime,
        likes: post.likes
    }));

    return postsDto
}

module.exports = {
    createPost,
    indexAllPosts
}