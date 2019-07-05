<template>
  <div> 
    <QCHeader />
    <main :style="{marginTop: '83px', minHeight: '750px'}">
        <h3>Users</h3>
      <nuxt />
    </main> 
    <QCFooter />
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
  import Logo from '~/components/Logo.vue'
  import QCHeader from '~/components/QCHeader.vue'
  import QCFooter from '~/components/QCFooter.vue'

  Vue.use(Notify)

export default {
    name: 'defaultLayout',
    components: {
    QCHeader,
    QCFooter,
  }, 
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

.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
