const postService = require("../services/postservice");
const { tryRun } = require("../helper/error");

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

const indexPost = async (request, response) => {
    const post = await postService.indexPost(request.params.id);
    return response.status(200).json(post);
}

const addLikes = async (request, response, next) => {
    const postLikes = await tryRun(next, () => postService.addLike(request.params.id, request.params.userId));
    return response.status(201).json(postLikes);
}

const removeLike = async (request, response, next) => {
    const postLikes = await tryRun(next, () => postService.removeLike(request.params.id, request.params.userId));
    if (!postLikes) return;
    return response.status(200).json(postLikes);
}

module.exports = {
    createPost,
    indexAllPosts,
    indexPost,
    addLikes,
    removeLike
}