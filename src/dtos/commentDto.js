function createCommentDTO(data = {}) {
    const {
        id,
        slug,
        userName,
        postId,
        content,
        dateTime
    } = data;

    const dto = {};

    if(id !== undefined) dto.id = id;
    if(slug !== undefined) dto.slug = slug;
    if(userName !== undefined) dto.userName = userName;
    if(postId !== undefined) dto.postId = postId;
    if(content !== undefined) dto.content = content;
    if(dateTime !== undefined) dto.dateTime = dateTime;

    return dto;
}

module.exports = createCommentDTO;