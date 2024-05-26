const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/nhle',
    createProxyMiddleware({
      target: 'https://api.nhle.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api/nhle': '', // remove base path
      },
    })
  );
  app.use(
    '/api-web/nhle',
    createProxyMiddleware({
      target: 'https://api-web.nhle.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api-web/nhle': '', // remove base path
      },
    })
  );
};
