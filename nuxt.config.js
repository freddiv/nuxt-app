
export default {
  mode: "spa",
  messages: {
    loading: 'Loading...',
    error_404: 'This page could not be found',
    server_error: 'Server error',
    nuxtjs: 'Nuxt.js',
    back_to_home: 'Back to the home page',
    server_error_details:
      'An error occurred in the application and your page could not be served. If you are the application owner, check your logs for details.',
    client_error: 'Error',
    client_error_details:
      'An error occurred while rendering the page. Check developer tools console for details.'
  },
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },
  /*
   ** Global CSS
   */
  css: [
      '~node_modules/ag-grid-community/dist/styles/ag-grid.css',
      '~node_modules/ag-grid-community/dist/styles/ag-theme-balham.css',
      '~node_modules/material-design-icons/iconfont/material-icons.css',
      '~node_modules/bootstrap-css-only/css/bootstrap.min.css',
      '~assets/styles/global-styles.scss',          
      '~node_modules/mdbvue/build/css/mdb.css', 
      'animate.css/animate.min.css',
      '~node_modules/mdbvue',
    ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ["~plugins/repository"],
  /*
   ** Nuxt.js modules
   */
  modules: ["@nuxtjs/axios"],
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    // Set the baseURL to JSONPlaceholder API
    baseURL: "https://jsonplaceholder.typicode.com/"
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
};
