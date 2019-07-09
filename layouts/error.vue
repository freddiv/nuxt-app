<template>
  <div class="container">
    
    <p class="h3 blue-text">Error <br>
    statusCode: {{ error.statusCode}}<br>
      message: {{error.message}}</p>
  </div>
</template>

<script>
export default {
  props: ['error'],
  layout: 'blog' ,
  created() {
        console.log(this.error.message)
    },
}
</script>