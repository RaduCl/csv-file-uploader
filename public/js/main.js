$(document).ready(function() {

  var socket = io('http://localhost:4000');

  socket.on('connect', function(){
    console.log('conected socket:');
  });
  socket.on('server-response', function(data){
    console.log('server-response: ', data)
  });
  socket.on('disconnect', function(){
    console.log('disconected');
  });

  $('#event-emiter').on('click', function(){
    console.log('emiting test-event');
    socket.emit('test-event');
  })


  Vue.component('input-field', {
    template: `
      <div class="file-input-row">

        <div class="form-group">
          <div class="file-input-group">
            <label class="control-label">File input {{fileInput.id}}</label>
            <input type="file"
              name="myFile"
              v-on:change="changeHandle">
          </div>

          <div class="progres-bar-container">
            <div
              v-if="showProgresBar"
              class="alert alert-danger progres-bar-line"
              :style="{width: progresWidth}">
              {{uploadCompletedPercent}}%
            </div>
          </div>

          <div class="controls-group">
            <button
              
              class="btn btn-primary btn-xs upload-btn"
              :class="uploadBtnValidationStyle"
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
            <label for="sel1">Select Email column ({{selectedOption}}):</label>

            <select class="form-control"
              :disabled="selecBoxValidationStyle"
              v-model="selectedOption">
              <option
                v-for="(option, index) in csvFileHeaders"
                :value="index"
                >{{option}}</option>
            </select>
          </div>
        </div>

      </div>
    `,

    data () {
      return {
        invalidFileType: false,
        fileInputIsEmpty: true,
        csvFileHeaders: [],
        selectedOption: 0,
        csvFile: '',
        uploadCompletedPercent: 0,
      }
    },

    props: [
      'fileInput',
      'index',
      'removeInput'
    ],

    methods: {
      emailSelectHandle (e) {
        console.log(e)
        this.selectedOption = e.value
      },

      changeHandle (e) {
        console.log('changeHandle')

        var file = e.target.files[0] || e.dataTransfer.files

        // do not open file if it is not a CSV
        if (file.type !== 'text/csv') {
          this.invalidFileType = true
          return
        } else this.invalidFileType = false

        this.fileInputIsEmpty = false

        this.csvFile = file

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

        var fd = new FormData();
        fd.append('csvFile', this.csvFile)
        fd.append('uploadStartDate', new Date())
        fd.append('emailColumn', this.selectedOption)

        const onUploadProgress = (progressEvent) => {
          var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
          console.log('percentCompleted: ', percentCompleted)
          this.uploadCompletedPercent = percentCompleted
          // if (percentCompleted === 100) this.uploadCompletedPercent = true
        }

        var config = {
          onUploadProgress: onUploadProgress
        };

        axios.post('/api/upload', fd, config)
        .then(function (response) {
          console.log('ajax post succeses', response);
        })
        .catch(function (error) {
          console.log('ajax post error', error);
        });
      },

      removeField (e) {
        console.log('removeField index', this.index)
        e.preventDefault()
        this.removeInput(this.index)
      }
    },

    computed: {
      uploadBtnValidationStyle () {
        return this.invalidFileType
          || this.fileInputIsEmpty
          || this.uploadInProgress
          || this.uploadCompleted
          || !this.emailColumnWasSelected
          ? 'disabled'
          : 'active'
      },

      selecBoxValidationStyle () {
        return this.fileInputIsEmpty
          || this.uploadInProgress
          || this.uploadCompleted
          ? true
          : false
      },

      showProgresBar () {
        return this.uploadInProgress || this.uploadCompleted
          ? true
          : false
      },

      selectEmailBoxValues () {
        return this.csvFileHeaders.length !== 0 || false
      },

      progresWidth () {
        return this.uploadCompletedPercent + "%"
      },

      uploadCompleted () {
        return this.uploadCompletedPercent === 100
      },

      uploadInProgress () {
        return 0 < this.uploadCompletedPercent && this.uploadCompletedPercent < 100
      },

      emailColumnWasSelected () {
        return this.selectedOption !== 0
      }
    }
  })

  var app = new Vue({
    el: '#app',

    template: `
      <form
        id="csvForm"
        role="form"
        enctype="multipart/form-data"
        method="POST">
        <input-field
          v-for="(file, index) in fileInputs"
          :fileInput="file"
          :index="index"
          :removeInput="removeInput"></input-field>
        <button
          type="button"
          class="btn btn-info btn-block"
          v-on:click="addInput"
          >Add new file input</button>
      </form>`,

    data: {
      fileInputs: [
        {id: 1},
      ],
      idIndex: 1,
    },

    components: [
      'input-field'
    ],

    methods: {
      addInput () {
        console.log('addInput: ', this.idIndex + 1)
        this.fileInputs.push({id: this.idIndex + 1})
        this.idIndex += 1
      },
      removeInput (index) {
        console.log('removeInput index:', index)
        this.fileInputs.splice(index, 1)
      }
    }
  })


});