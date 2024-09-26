// extensions/users-permissions/controllers/Auth.js
const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  async callback(ctx) {
    const { id, username, email, role } = ctx.state.user;
    const jwt = strapi.plugins['users-permissions'].services.jwt.issue({ id });

    // Trả về user cùng với role
    ctx.send({
      jwt,
      user: {
        id,
        username,
        email,
        role: role ? role.name : null,  // Trả về tên của vai trò
      },
    });
  },
};
