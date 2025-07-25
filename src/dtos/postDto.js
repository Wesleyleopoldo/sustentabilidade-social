function createPostDTO(data = {}) {
    const {
        id,
        picture_profile_url,
        title,
        content,
        slug,
        username,
        userId,
        dateTime,
        likes,
        liked
    } = data;

    const dto = {};

    if(id !== undefined) dto.id = id;
    if(picture_profile_url !== undefined) dto.picture_profile_url = picture_profile_url;
    if(title !== undefined) dto.title = title;
    if(content !== undefined) dto.content = content;
    if(slug !== undefined) dto.slug = slug;
    if(username !== undefined) dto.username = username;
    if(userId !== undefined) dto.userId = userId;
    if(dateTime !== undefined) dto.dateTime = dateTime;
    if(likes !== undefined) dto.likes = likes;
    if(liked !== undefined) dto.liked = liked;

    return dto;
}

module.exports = createPostDTO;