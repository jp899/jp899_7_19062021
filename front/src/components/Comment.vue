<template>

  <div class="comment container border mb-3 pl-5 px-sm-5">

    <div class="comment-body d-flex align-items-start my-2 pl-sm-5 px-sm-3 ml-xl-4">

        <div class="comment-body__imageContainer mt-1 mr-2">
          <ProfileImage :imageSrc="content.user.imageUrl" class="comment-body__image"/>
        </div>

        <div class="comment-body__body bg-white shadow rounded flex-fill">

          <div class="comment-body__header d-flex justify-content-between">
            <div class="pl-2 pt-1 text-left">
              <div class="comment-body__userName font-weight-bold text-my-dark-grey">{{content.user.userName}}</div>
              <div class="comment-body__creationDate font-italic text-my-dark-grey">{{toDisplayDate}}</div>
            </div>
            <EditMenu v-if="(hasEditRights)" @deleteMe="deleteMe" @updateMe="updateMe"/>
          </div>

          <div class="comment-body__content">
            <div v-if="(!editMode)" class="text-left text-break pl-2 pt-1 pr-1 pb-2">{{content.content}}</div>

            <!-- <b-form @submit="newTextSubmit" v-if="(editMode)" class="comment-body__form d-flex col-9 col-sm-10 pl-0" v-bind:class="{ 'mt-2': contentFeedbackMessage }"> -->
            <b-form @submit="newTextSubmit" v-if="(editMode)" class="comment-body__form d-flex" v-bind:class="{ 'pt-3': contentFeedbackMessage }">

              <b-form-textarea
                ref="my-text"
                v-model="form.content"
                placeholder="Qu'en pensez vous ?"
                rows="2"
                max-rows="10"
                @input="textCheck()"
                aria-label="Saisir un nouveau contenu"
                maxlength="250"
                class="comment-body__textarea mr-0 shadow"
              ></b-form-textarea>
              <b-form-invalid-feedback ref="my-comment-feedback" class="comment-body__feedback">{{contentFeedbackMessage}}</b-form-invalid-feedback>

              <b-button ref="update-button" type="submit" variant="outline-my-light-blue" 
                class="comment-body__button btn-no-border"
                aria-label="Enregistrer la modification du commentaire" v-bind:class="{ 'disabled': ( (!form.content) || contentFeedbackMessage) }">
                <b-icon-check-circle-fill scale="1.2"></b-icon-check-circle-fill>
              </b-button>
            </b-form>

          </div>
        </div>

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
      dateOptions: {  year: 'numeric', month: 'short', day: 'numeric', hour:'numeric', minute: 'numeric' },
      contentFeedbackMessage: "",
      // Comment : pas d'espace au début de la chaine et pas de saut de ligne
      commentRegex: /^[^\s].*$/,
    }
  },
  computed: {
    hasEditRights: function () {
      return (this.content.user.id == this.currentUser.id || this.currentUser.isAdmin );
    },
    toDisplayDate:  function () {
      return this.creationDate.toLocaleDateString('fr-FR', this.dateOptions);
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
        this.removeFieldError('my-text');
        this.contentFeedbackMessage = "";
        this.clearFieldsColors("my-text");
       } else if (! this.commentRegex.test(this.form.content) ) {
        this.setFieldError('my-text');
        this.contentFeedbackMessage = "Format invalide.";
      } else if (this.form.content.length > 250){
        this.setFieldError('my-text');
        this.newCommentForm.content = "Maximum 250 caractères.";
      } else {
        this.removeFieldError('my-text');
        this.contentFeedbackMessage = "";
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
      if (this.form.content && this.textCheck()){
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
 
  .btn-no-border{
    border:0;
  }

  .comment-body{
    &__creationDate{
      font-size:0.9em;
      margin-top:-5px;
    }

    &__image{
      width: 35px;
      height: 35px;
    }

    &__form{
      margin-top:0 !important;
      position:relative;
    }
    
    &__feedback{
      position: absolute;
      top:-7px;
      left:9px;
      text-align:left;
      font-size: 0.9em;
    }

    &__button{
      margin-left:3px;
      width: 45px;
    }

  }

</style>
