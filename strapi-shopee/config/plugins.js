module.exports = ({ env }) => ({
  email: {
    logger: {
      debug: console.log,
      info: console.info,
      warn: console.warn,
      error: console.error
    },
    config: {
      provider: 'sendgrid',
      providerOptions: {
        apiKey: env('SENDGRID_API_KEY'),
      },
      settings: {
        defaultFrom: 'thanhdong1311ma@gmail.com',
        defaultReplyTo: 'thanhdong1311ma@gmail.com',
      },
    },
  },
  'users-permissions': {
    config: {
      providers: {
        github: {
          enabled: true,
          icon: 'github',
          key: env('GITHUB_CLIENT_ID'),
          secret: env('GITHUB_CLIENT_SECRET'),
          callback: 'http://localhost:1337/connect/github/callback',
          redirect_uri: 'http://localhost:3000/connect/github/redirect', // URL frontend redirect
        },
      },
    },
  },
});