module.exports = {
  productionSourceMap: false,
  publicPath: process.env.NODE_ENV === 'production' ? '/vue-smooth-scrollbar/' : '/',
  css: {
    extract: false
  }
}
