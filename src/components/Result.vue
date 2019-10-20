<template>
  <div>
    <v-menu open-on-hover top offset-y offset-x>
      <template v-slot:activator="{ on }">
        <a :href="`https://en.wikipedia.org/wiki/${article}`" v-on="on">{{article}}</a>
      </template>
      <iframe :src="`https://en.m.wikipedia.org/wiki/${article}`"></iframe>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: 'Result',
  props: ['article']
}
</script>

<style scoped lang="less">
  iframe {
    height: 500px;
    width: 450px;
  }

  a {
    text-decoration: none;
  }
</style>
