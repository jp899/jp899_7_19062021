<template>
  <div class="menu-container">
    <b-dropdown id="dropdown-1" right text="..." class="m-2" variant="outline-tertiary" no-caret>
      <b-dropdown-item-button @click="onUpdateClick">Modifier le texte</b-dropdown-item-button>
      <b-dropdown-item-button @click="onDeleteClick">Supprimer</b-dropdown-item-button>
    </b-dropdown>
  </div>
</template>

<script>
  export default {
    name: "EditMenu",
    data() {
      return {
        
      }
    },
    props: {
      
    },
    methods:{
      onDeleteClick() {
        this.$emit('deleteMe');
      },
      onUpdateClick() {
        this.$emit('updateMe');
      }
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
