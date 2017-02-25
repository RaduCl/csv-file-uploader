<template>
  <form
    id="csvForm"
    role="form"
    enctype="multipart/form-data"
    method="POST">
    <field
      v-for="(file, index) in fileInputs"
      :fileInput="file"
      :index="index"
      :removeInput="removeInput"></field>
    <button
      type="button"
      class="btn btn-info btn-block"
      v-on:click="addInput"
      >Add new file input</button>
    <input
      v-for="input in fileInputs" type='text'>
  </form>
</template>

<script>
import Field from './FileInput'

export default {
  data () {
    return {
      fileInputs: [
        {id: 1}
      ]
    }
  },

  components: {
    Field
  },

  methods: {
    addInput () {
      console.log('addInput')
      this.fileInputs.push({id: this.fileInputs.length + 1})
    },
    removeInput (index) {
      console.log('removeInput index:', index)
      this.fileInputs.splice(index, 1)
    }
  }
}
</script>
