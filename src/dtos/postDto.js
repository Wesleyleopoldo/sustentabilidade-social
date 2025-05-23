function createPostDTO(data = {}) {
    const {
        id,
        title,
        content,
        userId,
        dateTime,
        likes
    } = data;

    const dto = {};

    if(id !== undefined) dto.id = id;
    if(title !== undefined) dto.title = title;
    if(content !== undefined) dto.content = content;
    if(userId !== undefined) dto.userId = userId;
    if(dateTime !== undefined) dto.dateTime = dateTime;
    if(likes !== undefined) dto.likes = likes;

    return dto;
}

module.exports = createPostDTO;