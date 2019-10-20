<template>
  <div id="app">
    <v-app>
      <v-content>
        <h1>Search for Wikipedia articles</h1>
        <div>
          <input v-model="query" type="text" @keyup.enter="search()" />
          <button @click="search()" :enabled="!searching">
            Search
          </button>
        </div>
        <div>
          <input id="mode_initials" type="radio" v-model="mode" value="initials" />
          <label for="mode_initials">By initials</label>
          <input id="mode_regex" type="radio" v-model="mode" value="regex" />
          <label for="mode_regex">Full regex</label>
        </div>
        <div>
          <h2>Results</h2>
          <ul v-if="results.length">
            <li v-for="(result, index) in results" :key="index">
              <result :article="result" />
            </li>
          </ul>
          <div v-else>
            No results found.
          </div>
          <div v-if="results.length >= 1000">
            More than 1000 results. Only the first 1000 results are shown.
          </div>
        </div>
      </v-content>
    </v-app>
  </div>
</template>

<script>
import Result from './components/Result'

export default {
  name: 'app',
  components: {
    Result
  },
  data() {
    return {
      query: '',
      mode: 'initials',
      results: [],
      searching: false
    }
  },
  computed: {
    regex() {
      if (this.mode === 'initials') {
        const chars = this.query.split('')
        const segments = chars.map(char => `${char}[^_]*`)
        return '^' + segments.join('_') + '$'
      } else {
        return this.query
      }
    }
  },
  methods: {
    search() {
      this.searching = true
      this.axios.get('/api', { params: { regex: this.regex }}).then(({ data }) => {
        this.results = data
        this.searching = false
      })
    }
  }
}
</script>

<style lang="less">
#app {
}
</style>
