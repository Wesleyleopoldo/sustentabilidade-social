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

const indexAllPosts = async (request, response) => {
    const posts = await postService.indexAllPosts();
    return response.status(200).json(posts);
}

module.exports = {
    createPost,
    indexAllPosts
}