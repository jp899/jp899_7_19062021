<template>

    <div class="row px-3 mb-3">
        <div class="col col-md-10 offset-md-1 col-lg-8 offset-lg-2 post border-tertiary mb-4 shadow bg-my-light-grey px-3">

    <div class="post-header d-flex align-items-center justify-content-between mt-1 mb-3">
      <div class="d-flex align-items-center">
        <div class="post-header__imageContainer">
          <ProfileImage :imageSrc="content.user.imageUrl" class="post-header__image"/>
        </div>
        <div class="post-header__description text-left pl-3">
          <div class="post-header__username mb-0 font-weight-bold">{{content.user.userName}}</div>
          <div class="post-header__creationDate font-italic">{{toDisplayDate}}</div>
        </div>
      </div>
      <EditMenu v-if="(hasEditRights)" @deleteMe="deleteMe" @updateMe="updateMe" class="align-self-start"/>
    </div>

    <div class="post-body">
      <b-img class="post-body__image" :src="content.imageUrl" fluid alt="Image du post"></b-img>
    </div>
    
    <div class="post-title mt-3">
      <h2 class="h5">
        <span v-if="(!editMode)">{{content.title}}</span>

        <b-form @submit="newTitleSubmit" v-if="(editMode)" class="post-title__form d-flex" v-bind:class="{ 'mt-4': titleFeedbackMessage }">
          <b-form-textarea
            ref="my-title"
            size="lg"
            v-model="form.title"
            placeholder="Saisir un nouveau titre"
            rows="1"
            max-rows="2"
            @input="titleCheck()"
            aria-label="Titre de la publication"
            maxlength="50"

          ></b-form-textarea>
          <b-button type="submit" variant="my-light-blue" class="post-title__button" aria-label="Enregistrer le nouveau titre de la publication" 
            v-bind:class="{ 'disabled': titleFeedbackMessage }">
            <b-icon-check scale="1.7"></b-icon-check>
          </b-button>
          <b-form-invalid-feedback ref="my-title-feedback" class="post-title__feedback">{{titleFeedbackMessage}}</b-form-invalid-feedback>
        </b-form>

      </h2>
    </div>

    <div class="hz-bar mt-2"></div>

    <div class="post-ratings mx-2 my-3">
      <div class="row">

        <div class="post-ratings__thumbUp col col-lg-3 col-xl-2 offset-xl-1 d-flex align-items-center  justify-content-center">
           <b-button 
            variant="outline-primary" 
            aria-label="Pouces en haut" 
            @click="likeIt"
            type="button"
            ref="thumbUp-button"
            class="ratings-btn mr-2"
          >
            <font-awesome-icon v-if="hasRatedUp" :icon="['fas', 'thumbs-up']" class="ratings-icon thumbs-up-icon"/>
            <font-awesome-icon v-if="!hasRatedUp" :icon="['far', 'thumbs-up']" class="ratings-icon thumbs-up-icon"/>
          </b-button>
          <div class="post-ratings__thumbUpCounter h5 mb-0">{{content.likesCount}}</div>
        </div>

        <div class="post-ratings__thumbDown col col-lg-3 col-xl-2 d-flex align-items-center justify-content-center">
          <b-button 
            variant="outline-my-logo-color-darker" 
            aria-label="Pouces en bas" 
            @click="dislikeIt"
            type="button"
            ref="thumbDown-button"
            class="ratings-btn mr-2"
          >
            <font-awesome-icon v-if="hasRatedDown" :icon="['fas', 'thumbs-down']" class="ratings-icon thumbs-down-icon"/>
            <font-awesome-icon v-if="!hasRatedDown" :icon="['far', 'thumbs-down']" class="ratings-icon thumbs-down-icon"/>
          </b-button>
          <div class="post-ratings__thumbDownCounter text-my-logo-color-darker h5 mb-0">{{content.dislikesCount}}</div>
        </div>

        <div class="post-ratings__toggleComments col col-lg-6 offset-xl-1">
            <b-button 
              variant="outline-primary" 
              aria-label="Activer l'affichage des commentaires" 
              @click="toggleComments"
              type="button"
              ref="toggle-comments-button"
              class="ratings-btn toggle-comments-button"
            >
              <font-awesome-icon v-if="displayComments" :icon="['fas', 'comment-dots']" class="ratings-icon comment-dots-icon"/>
              <font-awesome-icon v-if="!displayComments" :icon="['far', 'comment-dots']" class="ratings-icon comment-dots-icon"/>
            </b-button>
        </div>
      </div>
    </div>

    <div class="post-newComment d-flex" v-if="displayComments">

        <b-form @submit="commentArticle" class="post-newComment__form d-flex" v-bind:class="{ 'mt-2': commentFeedbackMessage }">
          <div class="post-newComment__imageContainer">
            <ProfileImage :imageSrc="currentUser.imageUrl" class="post-newComment__image"/>
          </div>

          <b-form-textarea
            ref="my-comment"
            size="lg"
            v-model="newCommentForm.content"
            placeholder="Qu'en pensez vous ?"
            rows="2"
            max-rows="5"
            @input="commentCheck()"
            aria-label="Votre commentaire sur la publication"
            maxlength="250"
          ></b-form-textarea>
          <b-button type="submit" variant="my-light-blue" aria-label="Commenter la publication" v-bind:class="{ 'disabled': ( (!newCommentForm.content) || commentFeedbackMessage) }">
            <b-icon-plus-circle scale="1.2"></b-icon-plus-circle>
          </b-button>
          <b-form-invalid-feedback ref="my-comment-feedback" class="post-newComment__feedback feedback-message">{{commentFeedbackMessage}}</b-form-invalid-feedback>

        </b-form>

 
    </div>

    <div class="post-comments row" v-if="displayComments">
        <Comment v-for="(comment, index) in commentsContent" 
          :content="comment" 
          :key="comment.id" 
          :index="index"
          @deleteMe="commentsContent.splice(index,1)"/>
      </div>

  </div>
  </div>
  

</template>

<script>

import apiConnection from '../services/APIConnection.js'
import ProfileImage from '@/components/ProfileImage.vue'
import Comment from '@/components/Comment.vue'
import EditMenu from '@/components/EditMenu.vue'


export default {
  name: "Post",
  components: {
    ProfileImage,
    Comment,
    EditMenu,
  },
  data() {
    return {
      form: {
        title: this.content.title,
      },
      newCommentForm: {
        content: "",
      },
      editMode: false,
      hasNotRated: false,
      hasRatedUp: false,
      hasRatedDown: false,
      commentsContent: this.content.Comments,
      currentUser: JSON.parse(localStorage.getItem('user')),
      creationDate: new Date(this.content.createdAt),
      dateOptions: {  year: 'numeric', month: 'short', day: 'numeric', hour:'numeric', minute: 'numeric' },
      // TITLE : pas d'espace au début de la chaine et pas de saut de ligne
      titleRegex: /^[^\s].*$/,
      // Comment : pas d'espace au début de la chaine et pas de saut de ligne
      commentRegex: /^[^\s].*$/,
      displayComments: false,
      titleFeedbackMessage:"",
      commentFeedbackMessage:"",
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
  created(){
    this.setHasNotRated();
    this.setHasRatedUp();
    this.setHasRatedDown();
  },
  methods:{
    toggleComments() {
      this.displayComments = !this.displayComments;
      this.$refs["toggle-comments-button"].blur();
    },
    setHasNotRated() {
      this.hasNotRated = (this.content.Likes.length === 0 || this.content.Likes[0].liked === 0 );
    },
    setHasRatedUp() {
      this.hasRatedUp = (this.content.Likes.length !== 0 && this.content.Likes[0].liked === 1 );
    },
    setHasRatedDown() {
      this.hasRatedDown = (this.content.Likes.length !== 0 && this.content.Likes[0].liked === -1 );
    },
    rateIt(newLiked) {
      const body = {
        liked: newLiked,
        userId: this.currentUser.id,
      };
      apiConnection.post("api/article/" + this.content.id +"/like", body)
      .then( response => {
        console.log(response.message);

        // Mise à jour des compteurs de like coté front
        const previousLiked = this.content.Likes.length === 0 ? 0 : this.content.Likes[0].liked;
        if(newLiked === 1){
          this.content.likesCount++; 
        } else if (newLiked === -1){
          this.content.dislikesCount++;
        }
        if(previousLiked === 1){
          this.content.likesCount--;
        } else if (previousLiked === -1){
          this.content.dislikesCount--;
        } 

        // Mise à jour du like en mémoire coté front
        if(this.content.Likes.length === 0 ){
          this.content.Likes.push({liked: newLiked})
        } else {
          this.content.Likes[0].liked = newLiked;
        }
        this.setHasNotRated();
        this.setHasRatedUp();
        this.setHasRatedDown();
      }).catch( error => {
          console.log(error);
          this.errorMessage = "Une erreur est survenue, veuillez réessayer plus tard.";
      });
    },
    likeIt() {
      if(this.hasRatedUp){
        this.unlikeIt();
      } else {
        this.rateIt(1);
      }
      this.$refs["thumbUp-button"].blur();
    },
    unlikeIt() {
      this.rateIt(0);
    },
    dislikeIt() {
      if(this.hasRatedDown){
        this.unlikeIt();
      } else {
        this.rateIt(-1);
      }
      this.$refs["thumbDown-button"].blur();
    },
    deleteMe() {
      apiConnection.delete("api/article/" + this.content.id)
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
      setTimeout(() => {this.$nextTick(() => this.$refs["my-title"].$el.focus()) }, 250);
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
    titleCheck(){
      if (!this.form.title){
        this.setFieldError('my-title');
        this.titleFeedbackMessage = "Titre obligatoire.";
      } else if (! this.titleRegex.test(this.form.title) ) {
        this.setFieldError('my-title');
        this.titleFeedbackMessage = "Format invalide.";
      } else if (this.form.title.length > 50){
        this.setFieldError('my-title');
        this.titleFeedbackMessage = "Maximum 50 caractères.";
      } else {
        this.removeFieldError('my-title');
        this.titleFeedbackMessage = "";
        return true;
      }
      return false;
    },
    commentCheck(){
      if (!this.newCommentForm.content){
        this.removeFieldError('my-comment');
        this.commentFeedbackMessage = "";
        this.clearFieldsColors("my-comment");
       } else if (! this.commentRegex.test(this.newCommentForm.content) ) {
        this.setFieldError('my-comment');
        this.commentFeedbackMessage = "Format invalide.";
      } else if (this.newCommentForm.content.length > 250){
        this.setFieldError('my-comment');
        this.newCommentForm.content = "Maximum 250 caractères.";
      } else {
        this.removeFieldError('my-comment');
        this.commentFeedbackMessage = "";
        return true;
      }
      return false;
    },
    clearFieldsColors(fieldName){
      let field = this.$refs[fieldName].$el;
      field.classList.remove("is-valid");
      field.classList.remove("is-invalid");
    },
    newTitleSubmit(event){
      event.preventDefault();
      if (this.form.title && this.titleCheck()){
        // Demander la mise à jour au back
        apiConnection.put("api/article/" + this.content.id, this.form)
        .then( response => {
          console.log(response.message);
          // Mettre à jour le titre en mémoire
          this.content.title = this.form.title;
          // Puis arreter le mode édit
          this.clearFieldsColors("my-title");
          this.editMode = false;
        }).catch( error => {console.log(error)});
      }
    },
    commentArticle(){
      // Post autorisé uniquement si une image a été chargée et un titre renseigné
      if(this.newCommentForm.content && this.commentCheck()){
        const body = {comment: this.newCommentForm, userId: this.currentUser.id};
        apiConnection.post("api/article/" + this.content.id + "/comment/", body)
        .then( response => {
          console.log(response.message);
          // ajouter un nouveau post au mur 
          const newComment = {
            ...response.comment,
            user: this.currentUser,
          } 
          this.commentsContent.unshift(newComment);

          // Vider le formulaire et les données d'image
          this.newCommentForm.content = "";
          this.clearFieldsColors("my-comment");
        }).catch( error => {console.log(error)});
      }
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

  .post{
    border: 2px solid;
    border-radius:15px;
    padding: 15px;
  }

  .feedback-message{
    font-size: 0.8em;
  }

  .post-header{
    &__imageContainer{
      width: 60px;
      height: 60px;
    }

    &__username{
      font-size: 1.1em;
    }
  }

  .post-title{
    &__form{
      position:relative;
    }

    &__feedback{
      position: absolute;
      top:-25px;
    }

    // &__button{
    //   margin-left:5px;
    //   margin-top:5px;
    //   margin-right:5px;
    //   width: 45px;
    //   height: 45px;
    //   border-radius:8px;
    // }
  }

  .post-body{
    &__image{
      border: 0px;
      border-radius:7px;
      width:100%;
      object-fit: cover;
    }
  }

  .post-newComment{
    &__imageContainer{
       width: 60px;
      height: 60px;
    }

    &__form{
      position:relative;
    }

    &__feedback{
      position: absolute;
      top:-25px;
    }
  }

  .ratings-btn{
    width: 45px;
    height: 45px;
    border: 0px;

    @include media-breakpoint-up(sm) {
        width: 60px;
      }
  }

  .toggle-comments-button{
    @include media-breakpoint-up(lg) {
        width: 100px;
      }
  }
  
  .ratings-icon{
    font-size: 1.5em;
  }

  .thumbs-down-icon{
    margin-top:5px;
    margin-left:-1px;
  }

  .thumbs-up-icon{
    margin-top:0px;
    margin-left:-1px;
  }

  .comment-dots-icon{
    margin-top:2px;
    margin-left:-1px;
  }

  .hz-bar{
    height:1px;
    width: 100%;
    background-color: $primary;
  }

</style>
