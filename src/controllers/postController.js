const postService = require("../services/postservice");

const createPost = async (request, response) => {
    const newPost = await postService.createPost(
        request.body.title,
        request.body.content,
        request.params.id,
        request.body.dateTime
    );
    return response.status(201).json(newPost);
}

const indexAllPosts = async (_request, response) => {
    const posts = await postService.indexAllPosts();
    return response.status(200).json(posts);
}

const addLikes = async (request, response) => {
    const postLikes = await postService.addLike(request.params.id);
    return response.status(201).json(postLikes);
}

const removeLike = async (request, response) => {
    const postLikes = await postService.removeLike(request.params.id);
    return response.status(200).json(postLikes);
}

module.exports = {
    createPost,
    indexAllPosts,
    addLikes,
    removeLike
}