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

  </form>
</template>

<script>
import Field from './FileInput'

export default {
  data () {
    return {
      fileInputs: [
        {id: 1}
      ],
      idIndex: 1
    }
  },

  components: {
    Field
  },

  methods: {
    addInput () {
      console.log('addInput')
      this.fileInputs.push({id: this.idIndex + 1})
      this.idIndex += 1
    },
    removeInput (index) {
      console.log('removeInput index:', index)
      this.fileInputs.splice(index, 1)
    }
  }
}
</script>
