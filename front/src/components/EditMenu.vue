<template>
  <div class="menu-container">
    <b-dropdown class="dropdown" right toggle-class="border rounded-circle p-2" variant="outline-tertiary" no-caret>
      <template #button-content >
        <b-icon-pencil class="pencil-icon"></b-icon-pencil>
        <span class="d-none">Menu d'édition</span>
      </template>
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

  .menu-container, .dropdown{
    width:45px;
    height:45px;
  }

  .pencil-icon{
    width:23px;
    height:23px;
  }
  
</style>
