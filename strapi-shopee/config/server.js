module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    // keys: env.array('APP_KEYS'),
    keys: ['1vHhSfjCeQio1XaQkcwmpA==', '5VKQOC0CcZJEawV9CePz3Q==', 'mg2vlUKqGhaPcLpOtr92vg==,', 'WJufLDdlOxXBjg49dki+Ig=='],
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});
