<template>
  <div>
    <epa-header />
    <comptox-header />
    <main :style="{marginTop: '53px', minHeight: '750px'}">
      <nuxt />
    </main>
    <comptox-footer />
    <epa-footer />
  </div>
</template>

<script>
import { polyfill } from "es6-promise";
polyfill();
import "es6-promise/auto";
import Vue from "vue";
import { Notify } from "~/node_modules/mdbvue";
import ComptoxHeader from "@/components/headers/ComptoxHeader.vue";
import EpaHeader from "@/components/headers/EpaHeader.vue";
import EpaFooter from "@/components/headers/EpaFooter.vue";
import ComptoxFooter from "@/components//headers/ComptoxFooter.vue";

Vue.use(Notify);

export default {
  name: "defaultLayout",
  components: {
    ComptoxHeader,
    EpaHeader,
    EpaFooter,
    ComptoxFooter
  }
};
</script>

<style lang="scss">
@import "~/assets/styles/config-variables.scss";
@import "~/assets/styles/imported-variables.scss";
@import "~/assets/styles/_custom-variables.scss";
</style>
