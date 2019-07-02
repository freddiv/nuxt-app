<template>
  <div class="container">
  <QCHeader />
    <div>
      <logo />
      <h1 class="title">
        nuxt-app
      </h1>
      <h2 class="subtitle">
        NCCT POC NUXTJS APP
      </h2>
      <div class="links">
        <a
          href="https://nuxtjs.org/"
          target="_blank"
          class="button--green"
        >
          Documentation
        </a>
        <a
          href="https://github.com/nuxt/nuxt.js"
          target="_blank"
          class="button--grey"
        >
          GitHub
        </a>
      </div>
    </div>
      <section>
    <main>
      <h1 class="title">Posts</h1>
      <ul>
        <li :key="id" v-for="{ id, title } in slicedPosts">
          <nuxt-link v-if="title !== 'foo'" :to="`/${id}`">
            {{ title }}
          </nuxt-link>
          <p v-else>{{ title }}</p>
        </li>
      </ul>
      <div class="links">
        <button @click="createPost" class="button--grey">
          Create a post (send POST request)
        </button>
      </div>
    </main>
  </section>
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
import {Notify} from '~/node_modules/mdbvue'
import Logo from '~/components/Logo.vue'
import QCHeader from '~/components/QCHeader.vue'

export default {
  components: {
    Logo,
    QCHeader,
  },
  data() {
    return {
      posts: []
    }
  },
   async asyncData(ctx) {
    return {
      posts: await ctx.app.$userRepository.index()
    }
  },
   computed: {
    slicedPosts() {
      return this.posts.slice(-3)
    }
  },
  methods: {
    async createPost() {
      const result = await this.$userRepository.create({
        title: 'test',
        body: 'bar',
        userId: 1
      })
      console.log(result)
      // Fix ids to be unique
      this.posts.push({ ...result, id: Number(this.posts.slice(-1)[0].id) + 1 })
    }
  }
}
</script>

<style>
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
