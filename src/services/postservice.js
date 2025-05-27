const createCommentDTO = require("../dtos/commentDto");
const createPostDTO = require("../dtos/postDto");
const { tryQuery, useTry, AppError } = require("../helper/error");
const { Post, User, Likes, Comments } = require("../resources/db");

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
        throw new AppError("Usuário não foi encontrado na base de dados!!!", 404);
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
        throw new AppError("Nenhum post encontrado!", 404);
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
        throw new AppError("Post não encontrado!!!", 404);
    }

    const findUser = await tryQuery("Algo deu errado ao buscar usuário", () => User.findByPk(post.userId));

    if(!findUser) {
        throw new AppError("Usuário não encontrado!!!", 404);
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
        throw new AppError("Usuário não encontrado!!!", 404);
    }

    const isLiked = await tryQuery("Algo deu errado ao verificar se o usuário já curtiu o post", () => Likes.findOne({
        where: { userId: userId, postId: post.id }
    }));

    if(isLiked && isLiked.action === "like") {
        throw new AppError("Usuário já curtiu esse post!!!", 409);
    }

    if(!isLiked) {

        const data = {
            postId: postId,
            userId: userId,
            action: "like"
        }
    
        await tryQuery("Erro ao salvar o usuário que curtiu o post!!!", () => Likes.create(data));
    
    } else {
        isLiked.action = "like"
        await isLiked.save();
    }


    post.likes += 1;

    await post.save();

    const likesDto = createPostDTO({
        id: post.id,
        likes: post.likes
    });

    return likesDto
}

const removeLike = async (postId, userId) => {

    const post = await tryQuery("Erro ao buscar post", () => Post.findByPk(postId));

    if(!post) {
        throw new AppError("Post não encontrado", 404);
    }

    const findUser = await tryQuery("Algo deu errado ao buscar usuário", () => User.findByPk(userId));

    if(!findUser) {
        throw new AppError("Usuário não encontrado!!!", 404);
    }

    const isLiked = await tryQuery("Algo deu errado ao verificar se o usuário já curtiu o post", () => Likes.findOne({
        where: { userId: userId, postId: post.id }
    }));

    if(!isLiked) {
        throw new AppError("Usuário nunca curtiu esse post!!!", 404);
    }
    else if(isLiked && isLiked.action === "unlike") {
        console.log("Entrou aqui")
        throw new AppError("Usuário já descurtiu esse post!!!", 409);
    }

    isLiked.action = "unlike";

    await isLiked.save();

    post.likes -= 1;

    await post.save();

    const likesDto = createPostDTO({
        id: post.id,
        likes: post.likes
    });

    return likesDto;
}

const createComment = async (userId, postId, comment, createdAt) => {
    const post = await tryQuery("Erro ao tentar buscar post!!!", () => Post.findByPk(postId));

    if(!post) {
        throw new AppError("Post não encontrado!!!", 404);
    }

    const findUser = await tryQuery("Erro ao tentar buscar usuário!!!", () => User.findByPk(userId));

    if(!findUser) {
        throw new AppError("Usuário não encontrado", 404);
    }

    const data = {
        userId: findUser.id,
        postId: post.id,
        content: comment,
        dateTime: createdAt
    }

    const newComment = await tryQuery("Erro ao tentar salvar comentário!!!", () => Comments.create(data));

    const commentDTO = createCommentDTO({
        id: newComment.id,
        postId: post.id,
        slug: findUser.slug,
        userName: findUser.username,
        content: newComment.content,
        dateTime: newComment.dateTime
    });

    return commentDTO;
}

const updateComment = async (commentId, userId, content) => {
    const comment = await tryQuery("Erro ao buscar comentário", () => Comments.findByPk(commentId));

    if(!comment) {
        throw new AppError("Comentário não encontrado!!!", 404);
    }

    const findUser = await tryQuery("Erro ao buscar usuário!!!", () => User.findByPk(userId));

    if(!findUser) {
        throw new AppError("Usuário não encontrado!!!", 404);
    }

    if(comment.userId !== userId) {
        throw new AppError("Você não pode alterar o comentário de outro usuário", 401);
    }

    comment.content = content;

    await comment.save();

    const commentDTO = createCommentDTO({
        id: comment.id,
        slug: findUser.slug,
        userName: findUser.username,
        content: comment.content
    });

    return commentDTO;
}

const destroyComment = async (commentId, userId) => {
    const comment = await tryQuery("Erro ao buscar comentário", () => Comments.findByPk(commentId));

    if(!comment) {
        throw new AppError("Comentário não encontrado!!!", 404);
    }

    const findUser = await tryQuery("Erro ao buscar usuário!!!", () => User.findByPk(userId));

    if(!findUser) {
        throw new AppError("Usuário não encontrado!!!", 404);
    }

    if(comment.userId !== userId) {
        throw new AppError("Você não pode apagar o comentário de outro usuário", 401);
    }

    await tryQuery("Erro ao tentar apagar", () => Comments.destroy({
        where: { id: comment.id }
    }));

    return "Sucesso!!!";
}

const indexAllCommentsByPostId = async (postId) => {
    const post = await tryQuery("Erro ao tentar buscar post!!!", () => Post.findByPk(postId));

    if(!post) {
        throw new AppError("Post não encontrado!!!", 404);
    }

    const allComments = await tryQuery("Erro ao listar comentários!!", () => Comments.findAll({
        where: { postId: post.id }
    }));
} 

module.exports = {
    createPost,
    indexAllPosts,
    indexPost,
    addLike,
    removeLike,
    createComment,
    updateComment
}