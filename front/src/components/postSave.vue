<template>

    <div class="row px-3 mb-3">
        <div class="col col-md-10 offset-md-1 col-lg-8 offset-lg-2 post border-tertiary mb-4 shadow bg-my-light-grey px-3">

    <div class="post-header d-flex align-items-center justify-content-between mt-1 mb-3">
      <div class="d-flex align-items-center">
        <div class="post-header__imageContainer">
          <ProfileImage :imageSrc="content.user.imageUrl" class="post-header__image"/>
        </div>
        <div class="post-header__description text-left pl-3">
          <div class="post-header__username h5 mb-0">{{content.user.userName}}</div>
          <div class="post-header__creationDate font-italic">{{toDisplayDate}}</div>
        </div>
      </div>
      <EditMenu v-if="(hasEditRights)" @deleteMe="deleteMe" @updateMe="updateMe" class="align-self-start"/>
    </div>

    <div class="post-body">
      <b-img class="post-body__image" :src="content.imageUrl" fluid alt="Image du post"></b-img>
    </div>
    
    <div class="post-title mt-3">
      <h2 class="h4 ">
        <span v-if="(!editMode)">{{content.title}}</span>



        <!-- <b-form @submit="newTitleSubmit" v-if="(editMode)" class="post-title__textarea">
          <b-form-input
            size="lg"
            ref="my-title"
            v-model="form.title"
            type="text"
            maxlength="50"
            placeholder="Saisir un nouveau titre"
            @input="titleCheck()"
          ></b-form-input>
        </b-form> -->


        <b-form @submit="newTitleSubmit" v-if="(editMode)" class="post-title__textarea d-flex">
          <b-form-textarea
            size="lg"
            ref="my-title"
            v-model="form.title"
            placeholder="Saisir un nouveau titre"
            rows="2"
            max-rows="2"
            @input="titleCheck()"
            aria-label="Titre de la publication"
            maxlength="50"
          ></b-form-textarea>
          <b-form-invalid-feedback ref="my-title-feedback" class="post-title__feedback">test</b-form-invalid-feedback>
          <b-button type="submit" variant="primary"><b-icon-check></b-icon-check></b-button>
        </b-form>

      </h2>
    </div>

    <div class="hz-bar mt-2"></div>

    <div class="post-ratings mx-2 my-2">
      <div class="row">
        <div class="post-ratings__thumbUp col d-flex">
           <b-button 
            variant="outline-primary" 
            aria-label="Pouces en haut" 
            @click="likeIt"
            type="button"
            ref="thumbUp-button"
            size="lg"
            class="d-flex justify-content-between"
            :pressed="(hasRatedUp)"
          >
            <b-icon-arrow-up-circle></b-icon-arrow-up-circle>
            <div class="post-ratings__thumbUpCounter">{{content.likesCount}}</div>
          </b-button>
        </div>
        <div class="post-ratings__thumbDown col">
          <b-button 
            variant="outline-my-logo-color-darker" 
            aria-label="Pouces en bas" 
            @click="dislikeIt"
            type="button"
            ref="thumbDown-button"
            size="lg"
            class="d-flex justify-content-between"
            :pressed="(hasRatedDown)"
          >
            <b-icon-arrow-down-circle></b-icon-arrow-down-circle>
            <div class="post-ratings__thumbDownCounter">{{content.dislikesCount}}</div>
          </b-button>
        </div>

        <div class="post-ratings__toggleComments col">
          <b-button 
            variant="outline-primary" 
            aria-label="Activer l'affichage des commentaires" 
            @click="toggleComments"
            type="button"
            ref="toggle-comments-button"
            :pressed="(displayComments)"
            size="lg"
          ><b-icon-chat-left-dots></b-icon-chat-left-dots></b-button>
        </div>
      </div>
    </div>

    <div class="post-newComment" v-if="displayComments">
  
      <b-form-group>

        <div class="d-flex">  
          <div class="post-newComment__imageContainer">
            <ProfileImage :imageSrc="currentUser.imageUrl"/>
          </div>
          
          <b-form-input
            class="post-newComment__input"
            ref="my-comment"
            v-model="newCommentForm.content" 
            placeholder="Donnez votre avis!" 
            maxlength="50"
            type="text"
            @input="commentCheck()"
          ></b-form-input>
        
          <b-button
            class="post-newComment__button"
            variant="outline-primary"
            @click="commentArticle"
            type="button"
            aria-label="Commenter"
          >
            <b-icon-plus-circle class="file-icon"></b-icon-plus-circle>
          </b-button>
        </div>

      </b-form-group>      
 
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
      // TITLE : pas d'espace au début de la chaine
      titleRegex: /^[^\s].*$/,
      displayComments: false,
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
    titleCheck(){
      if (!this.form.title){
        this.setFieldError('my-title', "Titre obligatoire.");
      } else if (! this.titleRegex.test(this.form.title) ) {
         this.setFieldError('my-title', "Format invalide.");
      } else if (this.form.title.length > 50){
        this.setFieldError('my-title', "Maximum 50 caractères.");
      } else {
        this.removeFieldError('my-title');
        return true;
      }
      return false;
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
    setFieldError(fieldName, message){
      let field = this.$refs[fieldName].$el;
      field.classList.remove("is-valid");
      field.classList.add("is-invalid");
      let feedbackMessage = this.$refs[fieldName + "-feedback"].$el;
      feedbackMessage.innerHTML = message;
    },
    removeFieldError(fieldName){
      let field = this.$refs[fieldName].$el;
      field.classList.add("is-valid");
      field.classList.remove("is-invalid");
      let feedbackMessage = this.$refs["my-title-feedback"].$el;
      feedbackMessage.innerHTML = "";
    },
    // titleCheck(){
    //   if (!this.form.title){
    //     this.setFieldError('my-title');
    //   } else {
    //     this.removeFieldError('my-title');
    //     return true;
    //   }
    //   return false;
    // },
    commentCheck(){
      if (!this.newCommentForm.content){
        this.setFieldError('my-comment');
      } else {
        this.removeFieldError('my-comment');
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
      if(this.commentCheck()){
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
  .post-header{


    &__imageContainer{
      width: 60px;
      height: 60px;
    }

    // &__description{
    //   padding-left: 10px;
    // }

    // &__creationDate{
    //   // margin-left: 20px;
    // }

  }


  .post-title__feedback{
    font-size:55%;
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
       width: 40px;
      height: 40px;
    }

  }


  .post{
    border: 2px solid;
    border-radius:15px;
    padding: 15px;

    // &__textarea{
    //   width:75%;
    //   position: relative;
    // }

    // &__feedback{
    //   position: absolute;
    //   left:-30px;
    //   top:-25px;
    // }

    // &__hz-bar{
    //   height:1px;
    //   width: 95%;
    //   margin:auto;
    //   background-color: $primary;
    // }
  }

  .hz-bar{
    height:1px;
    width: 100%;
    background-color: $primary;
  }

</style>
