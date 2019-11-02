<template>
  <div>
    <span>
      {{label}}
    </span>
    <span
      v-for="({article, languageId}, index) in articles"
      :key="index"
      class="language"
    >
      <v-menu open-on-hover top offset-y offset-x>
        <template v-slot:activator="{ on }">
          <a :href="`https://${languageId}.wikipedia.org/wiki/${article}`" v-on="on">({{languageId}})</a>
        </template>
        <iframe :src="`https://${languageId}.m.wikipedia.org/wiki/${article}`"></iframe>
      </v-menu>
    </span>
  </div>
</template>

<script>
export default {
  name: 'Result',
  props: ['articles', 'label']
}
</script>

<style scoped lang="less">
  iframe {
    height: 500px;
    width: 450px;
  }

  span.language {
    margin: 0 3px;
  }
</style>
