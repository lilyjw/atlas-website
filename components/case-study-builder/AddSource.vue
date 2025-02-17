<template>
  <div id="sourceRender">
    <v-card outlined :style="cardStyle">
      <v-card-title :style="headerStyle">
        <div v-if="index != null">
          Source {{ index+1 }}
        </div>
        <div v-else>
          Add Source
        </div>
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="titleData"
          label="Description"
          hint="Brief description (optional)"
          outlined
          prepend-inner-icon="mdi-format-title"
        />

        <v-text-field
          v-model="urlData"
          label="URL"
          hint="Link (optional)"
          outlined
          prepend-inner-icon="mdi-link"
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text color="grey" @click="$emit('addingBoolUpdate', false)">
          Cancel
        </v-btn>
        <v-btn id="save_reference" text color="green" @click="addSource">
          Save
        </v-btn>
      </v-card-actions>

      <v-alert v-if="addSourceErr" color="red" text type="error" dense>
        {{ addSourceErr }}
      </v-alert>
    </v-card>
    <v-card-subtitle v-if="hasStatus" class="py-2" :style="headerStyle">
      {{
        submissionStatus.message
      }}
    </v-card-subtitle>
  </div>
</template>

<script>
export default {
  name: 'AddSource',
  props: {
    title: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    },
    addingSource: {
      type: Boolean,
      default: false
    },
    index: {
      type: Number,
      default: null
    },
    submissionStatus: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      titleData: this.title,
      urlData: this.url,
      addSourceErr: '',
      addingBool: this.addingSource
    }
  },
  computed: {
    hasStatus () {
      return !!(this.submissionStatus ?? {}).type
    },
    isInErrorState () {
      return (this.submissionStatus ?? {}).type === 'error'
    },
    isInWarningState () {
      return (this.submissionStatus ?? []).type === 'warning'
    },
    headerStyle () {
      if (this.isInErrorState) {
        return 'color: #FF5252'
      } else if (this.isInWarningState) {
        return 'color: #DAA520'
      } else {
        return ''
      }
    },
    cardStyle () {
      const style = {}
      if (this.isInErrorState) {
        style['border-color'] = '#FF5252'
        style['border-width'] = '2px'
      } else if (this.isInWarningState) {
        style['border-color'] = '#DAA520'
        style['border-width'] = '2px'
      }
      return style
    }
  },
  methods: {
    updateValue (inputVal) {
      this.inputVal = inputVal
    },
    addSource () {
      let url
      // If url is empty, valid check remains true by default since field is optional
      let isUrlValid = true

      // If both title and url fields are empty
      if (this.titleData === '' && this.urlData === '') {
        this.addSourceErr = 'Please complete at least one field'
        return
      }

      // If url is not empty then it must be validated
      if (this.urlData !== '') {
        try {
          url = new URL(this.urlData) // eslint-disable-line no-unused-vars
        } catch (_) {
          isUrlValid = false
          this.addSourceErr = 'URL cannot be found or does not start with http(s)://'
          return
        }
      }

      // If there exists a title and url is validated
      if ((this.titleData === '' || this.titleData) && isUrlValid) {
        const newSource = {
          title: this.titleData,
          url: this.urlData
        }
        this.$emit('clicked', newSource)
        this.clearSource()
      } else {
        this.addSourceErr = 'Please complete at least one field'
      }
    },
    clearSource () {
      this.titleData = ''
      this.urlData = ''
      this.addSourceErr = ''
    }
  }
}
</script>
