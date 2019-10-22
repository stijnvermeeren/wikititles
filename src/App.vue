<template>
  <div id="app" :class="{searching}">
    <v-app>
      <v-content>
        <div>
          <h1>Search for Wikipedia articles</h1>
          <v-container fluid>
            <v-text-field
                v-model="query"
                label="Search for Wikipedia articles by initials or by full regex"
                placeholder="Query"
                filled
                clearable
                hide-details
                @keyup.enter="search()"
              />
            <v-btn @click="search()" :disabled="searching">
              Search
            </v-btn>
            <v-radio-group
              v-model="mode"
              row
            >
              <v-radio label="By initials" value="initials"></v-radio>
              <v-radio label="Full regex" value="regex"></v-radio>
            </v-radio-group>
            <v-checkbox v-model="caseSensitive" label="Case sensitive regex" />
            <v-checkbox v-model="caseSensitiveResults" label="Case sensitive results" />
          </v-container>
          <div>
            <h2>Results</h2>
            <v-list v-if="results.length">
              <v-list-item v-for="({article, languageIds}, index) in results" :key="index">
                <v-list-item-content>
                  <result :article="article" :language-ids="languageIds" />
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <div v-else>
              No results found.
            </div>
            <div v-if="results.length >= 1000">
              More than 1000 results. Only the first 1000 results are shown.
            </div>
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
      caseSensitive: false,
      caseSensitiveResults: false,
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
      const params = { regex: this.regex }
      if (this.caseSensitive) {
        params.caseSensitive = true;
      }
      if (this.caseSensitiveResults) {
        params.caseSensitiveResults = true;
      }
      this.axios.get('/api', { params }).then(({ data }) => {
        this.results = data
        this.searching = false
      })
    }
  }
}
</script>

<style lang="less">
  .searching * {
    cursor: progress;
  }
</style>
