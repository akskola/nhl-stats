const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/nhle',
    createProxyMiddleware({
      target: 'https://api.nhle.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api/nhle': '',
      },
    })
  );
  app.use(
    '/api-web/nhle',
    createProxyMiddleware({
      target: 'https://api-web.nhle.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api-web/nhle': '',
      },
    })
  );
};
