<template>
  <div>
    <nuxt />
  </div>
</template>

<script>
  import '~/node_modules/ag-grid-community/dist/styles/ag-grid.css'
  import '~/node_modules/ag-grid-community/dist/styles/ag-theme-balham.css'
  import '~/node_modules/material-design-icons/iconfont/material-icons.css'
  import '~/node_modules/bootstrap-css-only/css/bootstrap.min.css'
  import '~/assets/styles/_custom-variables.scss'
  import '~/assets/styles/config-variables.scss'
  import { polyfill } from 'es6-promise'
  polyfill()
  import 'es6-promise/auto'
  import '~/node_modules/mdbvue/build/css/mdb.css'
  import 'animate.css/animate.min.css'
  import Vue from 'vue'
  import {Notify} from '~/node_modules/mdbvue'

  Vue.use(Notify)

export default {
  	name: 'defaultLayout',
  }
</script>

<style lang="scss">
@import "~/assets/styles/config-variables.scss";
@import "~/assets/styles/imported-variables.scss";
@import "~/assets/styles/_custom-variables.scss";

p.h3 {
	display: block !important;
	margin-top: .8rem !important;
}
.flyout {
	display:         flex;
	flex-direction:  column;
	min-height:      100vh;
	justify-content: space-between;
}

.active {
	background-color: rgba(255, 255, 255, 0.1);
}

.page {
	position: fixed;
	width:    inherit;
}
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
