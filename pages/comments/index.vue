<template>
  <div class="container">
    <div>
      <logo />
      <h1 class="title">nuxt-app</h1>
      <h2 class="subtitle">NCCT POC NUXTJS APP</h2>
      <div class="links">
        <a href="https://nuxtjs.org/" target="_blank" class="button--green">Documentation</a>
        <a href="https://github.com/nuxt/nuxt.js" target="_blank" class="button--grey">GitHub</a>
      </div>
    </div>
    <section>
      <main>
        <h1 class="title">Posts</h1>
        <ul>
          <li :key="id" v-for="{ id, title } in slicedPosts">
            <nuxt-link v-if="title !== 'foo'" :to="`/${id}`">{{ title }}</nuxt-link>
            <p v-else>{{ title }}</p>
          </li>
        </ul>
        <div class="links">
          <button @click="createPost" class="button--grey">Create a post (send POST request)</button>
        </div>
      </main>
    </section>
  </div>
</template>

<script>
import Logo from "~/components/Logo.vue";
export default {
  components: {
    Logo
  },
  data() {
    return {
      posts: []
    };
  },
  async asyncData(ctx) {
    return {
      posts: await ctx.app.$userRepository.index()
    };
  },
  computed: {
    slicedPosts() {
      return this.posts.slice(-3);
    }
  },
  created() {},
  methods: {
    async createPost() {
      const result = await this.$userRepository.create({
        title: "test",
        body: "bar",
        userId: 1
      });
      console.log(result);
      // Fix ids to be unique
      this.posts.push({
        ...result,
        id: Number(this.posts.slice(-1)[0].id) + 1
      });
    }
  }
};
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
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
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
