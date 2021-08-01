<template>

  <div class="comment container border mb-4 shadow bg-white">

    <div class="comment-body d-flex align-items-center justify-content-between my-2">
      <div class="d-flex align-items-center">
        <div class="comment-body__imageContainer">
          <ProfileImage :imageSrc="content.user.imageUrl" class="comment-body__image"/>
        </div>
        <div class="comment-body__creationDate h4">{{toDisplayDate}}</div>
        <div class="comment-body__content h5">
          <span v-if="(!editMode)">{{content.content}}</span>
          <b-form @submit="newTextSubmit" v-if="(editMode)" >
              <b-form-input
              size="lg"
              ref="my-text"
              v-model="form.content"
              type="text"
              maxlength="50"
              placeholder="Saisir un nouveau contenu"
              @input="textCheck()"
              ></b-form-input>
          </b-form>
        </div>
      </div>
      <EditMenu v-if="(hasEditRights)" @deleteMe="deleteMe" @updateMe="updateMe"/>
    </div>

  </div>

</template>

<script>

import apiConnection from '../services/APIConnection.js'
import ProfileImage from '@/components/ProfileImage.vue'
import EditMenu from '@/components/EditMenu.vue'


export default {
  name: "Comment",
  components: {
    ProfileImage,
    EditMenu,
  },
  data() {
    return {
      form: {
        content: this.content.content,
      },
      editMode: false,
      currentUser: JSON.parse(localStorage.getItem('user')),
      creationDate: new Date(this.content.createdAt),
      dateOptions: {  year: 'numeric', month: 'short', day: 'numeric', hour:'numeric', minute: 'numeric' }
    }
  },
  computed: {
    hasEditRights: function () {
      return (this.content.user.id == this.currentUser.id || this.currentUser.isAdmin );
    },
    toDisplayDate:  function () {
      return "Le " + this.creationDate.toLocaleDateString('fr-FR', this.dateOptions);
    },
  },
  props: {
    content: {type: Object, required: true},
    index: {type: Number, required: true},
  },
  methods:{
    deleteMe() {
      apiConnection.delete("api/article/" + this.content.articleId + "/comment/" + this.content.id)
      .then( response => {
        console.log(response.message);
        // Propagation de l'évenement au parent pour suppression de l'affichage du post
        this.$emit('deleteMe');
      }).catch( error => {
          console.log(error);
          this.errorMessage = "Une erreur est survenue, veuillez réessayer plus tard.";
      });
    },
    updateMe() {
      this.editMode = true;
      // Mettre le curseur/focus sur le champ de saisie que l'on vient de faire apparaitre
      setTimeout(() => {this.$nextTick(() => this.$refs["my-text"].$el.focus()) }, 250);
    },
    setFieldError(fieldName){
      let field = this.$refs[fieldName].$el;
      field.classList.remove("is-valid");
      field.classList.add("is-invalid");
    },
    removeFieldError(fieldName){
      let field = this.$refs[fieldName].$el;
      field.classList.add("is-valid");
      field.classList.remove("is-invalid");
    },
    textCheck(){
      if (!this.form.content){
        this.setFieldError('my-text');
      } else {
        this.removeFieldError('my-text');
        return true;
      }
      return false;
    },
    clearFieldsColors(){
      for(let fieldName of ["my-text"]){
        let field = this.$refs[fieldName].$el;
        field.classList.remove("is-valid");
        field.classList.remove("is-invalid");
      }
    },
    newTextSubmit(event){
      event.preventDefault();
      if (this.form.content){
        // Demander la mise à jour au back
        apiConnection.put("api/article/" + this.content.articleId + "/comment/" + this.content.id, {comment: this.form})
        .then( response => {
          console.log(response.message);
          // Mettre à jour le titre en mémoire
          this.content.content = this.form.content;
          // Puis arreter le mode édit
          this.clearFieldsColors();
          this.editMode = false;
        }).catch( error => {console.log(error)});
      }
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
 
   .comment-body{

    &__imageContainer{
       width: 35px;
      height: 35px;
    }

  }

</style>
