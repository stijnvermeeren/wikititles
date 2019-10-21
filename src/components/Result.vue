<template>
  <div>
    <v-menu open-on-hover top offset-y offset-x>
      <template v-slot:activator="{ on }">
        <a :href="`https://${languageId}.wikipedia.org/wiki/${article}`" v-on="on">{{article}}</a> ({{languageId}})
      </template>
      <iframe :src="`https://${languageId}.m.wikipedia.org/wiki/${article}`"></iframe>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: 'Result',
  props: ['languageId', 'article']
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
