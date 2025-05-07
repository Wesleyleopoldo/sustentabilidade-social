function createUserDTO(data = {}) {
    const {
        id,
        picture_profile_url,
        username,
        email,
        password,
        role
    } = data;

    const dto = {}

    if(id !== undefined) dto.id = id;
    if(picture_profile_url !== undefined) dto.picture_profile_url = picture_profile_url;
    if(username !== undefined) dto.username = username;
    if(email !== undefined) dto.email = email;
    if(password !== undefined) dto.password = password;
    if(role !== undefined) dto.role = role;

    return dto;
}

module.exports = createUserDTO;