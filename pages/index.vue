<template>
  <div class="container">
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
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo
  },  data() {
    return {
      posts: []
    }
  },
  async asyncData(ctx) {
    return {
      posts: await ctx.app.$postRepository.index()
    }
  },
  computed: {
    slicedPosts() {
      return this.posts.slice(-3)
    }
  },
  methods: {
    async createPost() {
      const result = await this.$postRepository.create({
        title: 'foo',
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
