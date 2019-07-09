<template>
  <div> 
    <QCHeader />
    <main :style="{marginTop: '53px', minHeight: '750px'}">
      <nuxt />
    </main> 
    <QCFooter />
  </div>
</template>

<script>
  import { polyfill } from 'es6-promise'
  polyfill()
  import 'es6-promise/auto'
  import Vue from 'vue'
  import {Notify} from '~/node_modules/mdbvue'
  import Logo from '@/components/Logo.vue'
  import QCHeader from '@/components/QCHeader.vue'
  import QCFooter from '@/components/QCFooter.vue'

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
</style>
