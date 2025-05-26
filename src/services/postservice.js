const createPostDTO = require("../dtos/postDto");
const { tryQuery, useTry } = require("../helper/error");
const { Post, User, Likes } = require("../resources/db");

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
    let postsDto = []

    if (!posts.length) {
        throw new Error("Nenhum post encontrado!");
    }

    for(let index = 0; index < posts.length; index ++) {
        const post = posts[index];

    

        const user = await User.findOne({
            where: { id: post.userId }
        });

        if (!user) continue;

        postsDto.push(createPostDTO({
            id: post.id,
            title: post.title,
            content: post.content,
            slug: user.slug,
            username: user.username,
            dateTime: post.dateTime,
            likes: post.likes
        }));
    }
    
    // const postsDto = posts.map(post => createPostDTO({
    //     id: post.id,
    //     title: post.title,
    //     content: post.content,
    //     // TODO: Criar método para pegar o slug de cada usuário dono dos posts...
    //     slug: 
    //     dateTime: post.dateTime,
    //     likes: post.likes
    // }));


    return postsDto
}

const indexPost = async (postId) => {
    const post = await tryQuery("Erro ao buscar post", () => Post.findByPk(postId));

    if(!post) {
        throw new Error("Post não encontrado!!!");
    }

    const findUser = await tryQuery("Algo deu errado ao buscar usuário", () => User.findByPk(post.userId));

    if(!findUser) {
        throw new Error("Usuário não encontrado!!!");
    }

    const postDto = createPostDTO({
        id: post.id,
        title: post.title,
        content: post.content,
        slug: findUser.slug,
        username: findUser.username,
        dateTime: post.dateTime,
        likes: post.likes
    });

    return postDto;
}

const addLike = async (postId, userId) => {
    const post = await tryQuery("Erro ao buscar post", () => Post.findByPk(postId));

    if(!post) {
        throw new Error("Post não encontrado!!!");
    }

    const findUser = await tryQuery("Algo deu errado ao buscar usuário", () => User.findByPk(userId));

    if(!findUser) {
        throw new Error("Usuário não encontrado!!!");
    }

    const isLiked = await tryQuery("Algo deu errado ao verificar se o usuário já curtiu o post", () => Likes.findOne({
        where: { userId: findUser.userId }
    }))

    post.likes += 1;

    await post.save();

    const likesDto = createPostDTO({
        id: post.id,
        likes: post.likes
    });

    return likesDto
}

const removeLike = async (postId) => {
    const post = await tryQuery("Erro ao buscar post", () => Post.findByPk(postId));

    if(!post) {
        throw new Error("Post não encontrado");
    }

    post.likes -= 1;

    await post.save();

    const likesDto = createPostDTO({
        id: post.id,
        likes: post.likes
    });

    return likesDto;
}

module.exports = {
    createPost,
    indexAllPosts,
    indexPost,
    addLike,
    removeLike
}