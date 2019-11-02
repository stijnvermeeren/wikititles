<template>
  <div id="app" :class="{searching}">
    <v-app>
      <v-content>
        <v-container>
          <h1>Search for Wikipedia articles</h1>
          <v-row align="start">
            <v-col cols="8">
              <v-text-field
                  v-model="query"
                  label="Search for Wikipedia articles by initials or by full regex"
                  placeholder="Query"
                  filled
                  clearable
                  hide-details
                  @keyup.enter="search()"
                />
            </v-col>
            <v-col>
              <v-btn @click="search()" :disabled="searching">
                Search
              </v-btn>
            </v-col>
          </v-row>
          <v-row cols="12">
            <v-col>
              <v-radio-group
                v-model="mode"
                row
              >
                <v-radio label="By initials" value="initials"></v-radio>
                <v-radio label="Full regex" value="regex"></v-radio>
              </v-radio-group>
            </v-col>
            <v-col>
              <v-checkbox v-model="caseSensitive" label="Case sensitive regex" />
            </v-col>
            <v-col>
              <v-checkbox v-model="caseSensitiveResults" label="Case sensitive results" />
            </v-col>
          </v-row>
          <div>
            <h2>Results</h2>
            <div v-if="results.length >= 1000">
              More than 1000 results. Only the first 1000 results for each language are shown.
            </div>
            <div v-for="{count, resultsForCount} in groupedResults" :key="count">
              <h3>Results with {{count}} {{ count === 1 ? 'version' : 'versions' }}</h3>
              <v-list>
                <v-list-item v-for="({label, articles}, index) in resultsForCount" :key="index">
                  <v-list-item-content>
                    <result :label="label" :articles="articles" />
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </div>
            <div v-if="results.length === 0">
              No results found.
            </div>
          </div>
        </v-container>
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
    },
    groupedResults() {
      // group results by number of languages
      const groups = new Map()
      let maxSize = 0

      this.results.forEach(result => {
        const key = result.articles.length
        maxSize = Math.max(maxSize, key)

        if (!groups.has(key)) {
          groups.set(key, [])
        }
        groups.get(key).push(result)
      })

      // convert from map to list
      const groupsList = []
      for (let count = maxSize; count > 0; count--) {
        if (groups.has(count)) {
          groupsList.push({
            count,
            resultsForCount: groups.get(count)
          })
        }
      }

      return groupsList
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
