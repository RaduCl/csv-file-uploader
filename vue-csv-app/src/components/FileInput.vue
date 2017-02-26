<template>
  <div class="file-input-row">

    <div class="form-group">
      <div class="file-input-group">
        <label class="control-label">File input {{fileInput.id}}</label>
        <input type="file"
          name="myFile"
          v-on:change="changeHandle">
      </div>

      <div class="progres-bar-container">
        <div class="alert alert-danger progres-bar-line">
          20%
        </div>
      </div>

      <div class="controls-group">
        <button
          class="btn btn-primary btn-xs upload-btn"
          :class="validationStyle"
          v-on:click="uploadFile"
          >Upload</button>

        <button
          class="btn btn-danger btn-xs"
          v-on:click="removeField"
          >X</button>
      </div>
    </div>

    <div class="field-status">
      <div v-if="invalidFileType" class="alert alert-danger">
        Invalid <strong>CSV</strong> file.
      </div>

      <div v-if="selectEmailBoxValues" class="form-group">
        <label for="sel1">Select Email column:</label>

        <select class="form-control" v-model="selectedOption">
          <option
            v-for="(option, index) in csvFileHeaders"
            :value="index"
            >{{option}}</option>
        </select>
      </div>
    </div>

  </div>
</template>

<script>
import R from 'ramda'

export default {
  data () {
    return {
      invalidFileType: false,
      isInputEmpty: true,
      csvFileHeaders: [],
      selectedOption: 0
    }
  },

  props: [
    'fileInput',
    'index',
    'removeInput'
  ],

  components: {

  },

  methods: {
    changeHandle (e) {
      console.log('changeHandle')

      var file = e.target.files[0] || e.dataTransfer.files

      // do not open file if it is not a CSV
      if (file.type !== 'text/csv') {
        this.invalidFileType = true
        return
      } else this.invalidFileType = false

      this.isInputEmpty = false

      var reader = new FileReader()

      const funcA = (arr) => {
        this.csvFileHeaders = arr
      }

      const callback = (cb) => (e) => {
        var text = reader.result // the entire file
        var firstLine = R.head(text.split('\n')).split(',') // first line
        cb(firstLine)
      }

      reader.onload = callback(funcA)

      reader.readAsText(file, 'UTF-8')
    },

    uploadFile (e) {
      e.preventDefault()
    },

    removeField (e) {
      console.log('removeField index', this.index)
      e.preventDefault()
      this.removeInput(this.index)
    }
  },

  computed: {
    validationStyle () {
      return this.invalidFileType || this.isInputEmpty
        ? 'disabled'
        : 'active'
    },

    selectEmailBoxValues () {
      console.log('selectEmailBoxValues:', this.csvFileHeaders)
      return this.csvFileHeaders.length !== 0 || false
    }
  }
}
</script>

<style scoped>
  .disabled {
    pointer-events: none;
  }

  .form-group {
    display: flex;
    justify-content: space-between;
  }

  .controls-group {
    display: flex;
    align-items: center;
  }

  .file-input-row {
    border-bottom: 1px solid #a0a0a0;
    margin-bottom: 25px;
  }

  .file-input-group {
    flex: 2;
  }

  .progres-bar-container{
    flex: 3;
    padding: 0;
    margin: 12px;
  }

  .progres-bar-line {
    margin: 0;
    padding: 0;
    width: 6%;
  }

  .upload-btn {
    margin-right: 10px;
  }
</style>
