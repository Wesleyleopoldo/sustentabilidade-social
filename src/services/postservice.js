const createCommentDTO = require("../dtos/commentDto");
const createPostDTO = require("../dtos/postDto");
const { tryQuery, useTry, AppError } = require("../helper/error");
const { Post, User, Likes, Comments } = require("../resources/db");
const classifyTheme = require("../utils/aiSentinel");

const createPost = async (title, content, userId, dateTime) => {

    const permission = await tryQuery("Erro ao executar a função classifyTheme", () => classifyTheme(content));

    if (permission !== undefined) {
        if(permission.probalityToxic > 0.6 || permission.theme !== "sustentabilidade") {
            throw new AppError("Oi! A Raiza, nossa assistente inteligente, analisou seu conteúdo e identificou que ele não pode ser publicado conforme nossas regras. Que tal revisar e tentar de novo?", 401);
        }
    
        if(permission.trust < 0.5) {
            throw new AppError("Oi! A Raiza, nossa assistente inteligente, analisou seu conteúdo e identificou que ele não pode ser publicado conforme nossas regras. Que tal revisar e tentar de novo?", 401);
        }
    }


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

const indexAllPosts = async (protocol, host, userId) => {

    console.log("Entrou na função")
    const posts = await tryQuery("Erro ao listar todos os posts", () => Post.findAll());
    let isLiked = null;
    const object = {}
    let postsDto = []

    if (!posts.length) {
        throw new AppError("Nenhum post encontrado!", 404);
    }

    for(let index = 0; index < posts.length; index ++) {
        console.log("Entrou no loop");
        const post = posts[index];
        
        const user = await User.findOne({
            where: { id: post.userId }
        });
        
        if (userId !== null) {
            isLiked = await tryQuery("Erro ao buscar curtida", () => Likes.findOne({
                where: { 
                    userId: userId, 
                    postId: post.id 
                }
            }));
        }

        console.log(`${protocol}://${host}${user.picture_profile_url}`);

        object.id = post.id;
        object.picture_profile_url = user.picture_profile_url ? `${protocol}://${host}${user.picture_profile_url}` : null;
        object.title = post.title;
        object.content = post.content;
        object.slug = user.slug || "Usuário não encontrado";
        object.username = user.username || "Usuário não encontrado";
        object.dateTime = post.dateTime;
        object.likes = post.likes
        if (isLiked && isLiked !== null) {
            console.log(isLiked.action);
            object.liked = isLiked.action;
        }
        postsDto.push(createPostDTO(object));
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

    console.log("Retornou algo")

    console.log(postsDto.liked);


    return postsDto
}

const indexPost = async (postId, userId) => {
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

    if (!isLiked) {

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
    let commentsDto = []

    if(!post) {
        throw new AppError("Post não encontrado!!!", 404);
    }

    const allComments = await tryQuery("Erro ao listar comentários!!", () => Comments.findAll({
        where: { postId: post.id }
    }));

    if(!allComments.length) {
        throw new AppError("Nenhum Comentário encontrado!!!", 404);
    }

    for(let index = 0; index < allComments.length; index ++) {
        const comment = allComments[index];
        const user = await User.findOne({
            where: { id: comment.userId }
        });

        if(!user) continue;

        commentsDto.push(createCommentDTO({
            id: comment.id,
            postId: comment.postId,
            slug: user.slug,
            userName: user.username,
            content: comment.content,
            dateTime: comment.dateTime
        }));
    }

    return commentsDto;
}

module.exports = {
    createPost,
    indexAllPosts,
    indexPost,
    addLike,
    removeLike,
    createComment,
    updateComment,
    destroyComment,
    indexAllCommentsByPostId
}