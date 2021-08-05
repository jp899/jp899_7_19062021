<template>
  <div class="home">
    <Header :withProfile="true"/>

    <main class="container">

      <div class="row px-3">
        <div class="col col-md-8 offset-md-2 col-lg-6 offset-lg-3 post-form border-tertiary mt-3 mb-2 shadow bg-my-light-grey">
          <section class="mt-2 mb-1">
            <b-form-group class="mb-0">

              <div class="d-flex align-items-center justify-content-around">  
                <div class="imageContainer">
                  <ProfileImage :imageSrc="user.imageUrl"/>
                </div>

                <div class="post-form__textarea">
                  <b-form-textarea
                    id="input-title"
                    v-model="newPostForm.title"
                    :placeholder='"Bonjour " + user.userName + ", que voulez-vous partager ?"'
                    rows="2"
                    max-rows="2"
                    maxlength="50"
                    @input="titleCheckLight()"
                    aria-label="Titre de la publication"
                  ></b-form-textarea>
                  <b-form-invalid-feedback id="input-title-feedback" class="post-form__feedback"></b-form-invalid-feedback>
                </div>
              </div>

              <div v-if="(!tempImage)" class="post-form__hz-bar mt-3"></div>
              <b-img class="post-img mt-3" v-if="tempImage" :src="tempImage" fluid alt="Image à partager"></b-img>


              <div class="d-flex mt-3 justify-content-around">  

                <b-button
                  variant="outline-primary"
                  @click="clickInput"
                  type="button"
                  aria-label="Choisir une image"
                  ref="choose-image-button"
                >
                  <span>Choisir une image</span>
                  <b-icon-image class="file-icon"></b-icon-image>
                </b-button>

                <input
                  ref="fileInput"
                  class="d-none"
                  type="file"
                  @change="loadImage"
                  aria-label="Champ technique non affiché"
                />

                <b-button
                  v-bind:class="{ 'disabled': (!(newPostForm.image && newPostForm.title)) || formError }"
                  variant="my-logo-color-darker"
                  @click="postArticle"
                  type="button"
                  aria-label="Partager"
                  ref="share-button"
                >
                  <span>Partager</span>
                </b-button>

              </div>

            </b-form-group>      
          </section>

        </div>
      </div>

      <h1 class="h4 mt-3">Dernières publications :</h1>

      <section class="postList mt-3">
        <Post v-for="(post, index) in postsContent" 
          :content="post" 
          :key="post.id" 
          :index="index"
          @deleteMe="postsContent.splice(index,1)"/>
      </section>

    </main>


  </div>
</template>

<script>
// @ is an alias to /src

import apiConnection from '../services/APIConnection.js'
import Header from '@/components/Header.vue'
import ProfileImage from '@/components/ProfileImage.vue'
import Post from '@/components/Post.vue'


export default {
  name: 'Home',
  components: {
    Header,
    ProfileImage,
    Post,
  },
  data() {
    return {
      tempImage: null,
      newPostForm: {
        image: null,
        title: "",
      },
      formError:false,
      // TITLE : pas d'espace au début de la chaine
      titleRegex: /^[^\s].*$/,
      user: JSON.parse(localStorage.getItem('user')),
      postsContent: [],
    }
  },
  // Récupération des informations de l'utilisateur à la création de la vue
  beforeMount(){
    apiConnection.get("api/article/")
      .then( response => {
        this.postsContent = response.articlesWithLikesCount;
      }).catch( error => {console.log(error)});
  },
  methods: {
    setFieldError(fieldName,message){
      let field = document.getElementById(fieldName);
      field.classList.remove("is-valid");
      field.classList.add("is-invalid");
      let feedbackMessage = document.getElementById(fieldName + "-feedback");
      feedbackMessage.innerHTML = message;
      this.formError = true;
    },
    removeFieldError(fieldName){
      let field = document.getElementById(fieldName);
      field.classList.add("is-valid");
      field.classList.remove("is-invalid");
      let feedbackMessage = document.getElementById(fieldName + "-feedback");
      feedbackMessage.innerHTML = "";
      this.formError = false;
    },
    titleCheckLight(){
      if (!this.newPostForm.title){
        this.clearFieldsColors()
      } else if (! this.titleRegex.test(this.newPostForm.title) ) {
        this.setFieldError('input-title', "Format invalide.");
      } else if (this.newPostForm.title.length > 50){
        this.setFieldError('input-title', "Maximum 50 caractères.");
      } else {
        this.removeFieldError('input-title');
        return true;
      }
      return false;
    },
    titleCheckFull(){
      if (!this.newPostForm.title){
        this.setFieldError('input-title', "Titre obligatoire.");
      } else if (! this.titleRegex.test(this.newPostForm.title) ) {
         this.setFieldError('input-title', "Format invalide.");
      } else if (this.newPostForm.title.length > 50){
        this.setFieldError('input-title', "Maximum 50 caractères.");
      } else {
        this.removeFieldError('input-title');
        return true;
      }
      return false;
    },
    clearFieldsColors(){
      for(let fieldName of ["input-title" ]){
        let field = document.getElementById(fieldName);
        field.classList.remove("is-valid");
        field.classList.remove("is-invalid");
      }
    },
    clickInput (){
      this.$refs.fileInput.click();
    },
    loadImage(event){
      // Enregistrer l'image et l'afficher
      this.newPostForm.image = event.target.files[0];
      this.tempImage = URL.createObjectURL(this.newPostForm.image);
      // Enlever l'effet visuel de focus sur le bouton
      this.$refs["choose-image-button"].blur();
    },
    postArticle(){
      // Post autorisé uniquement si une image a été chargée et un titre renseigné
      if(this.tempImage && this.titleCheckFull()){
        const formData = new FormData();
        formData.append("image", this.newPostForm.image);
        formData.append("title", this.newPostForm.title);
    
        apiConnection.post("api/article/", formData, true)
        .then( response => {
          console.log(response.message);
          // ajouter un nouveau post au mur 
          const newPost = {
            ...response.article,
            Comments: [],
            Likes: [],
            dislikesCount: 0,
            likesCount: 0,
            user: this.user,
          } 
          this.postsContent.unshift(newPost);

          // Vider le formulaire et les données d'image
          this.newPostForm.title = "";
          this.newPostForm.image = null;
          this.tempImage = null;
          this.clearFieldsColors();
          // Enlever l'effet visuel de focus sur le bouton
          this.$refs["share-button"].blur();
        }).catch( error => {console.log(error)});
      }
    },
  }
}
</script>



<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

  .imageContainer{
    // width: 58px;
    min-width:58px;
    width: 20%;
  }

  .file-icon{
  width:24px;
  height:24px;
  margin-left:5px;
  }

  .post-img{
    border: 0px;
    border-radius:7px;
    width:100%;
    object-fit: cover;
  }


  .post-form{
    border: 2px solid;
    border-radius:15px;
    padding: 15px;

    &__textarea{
      width:73%;
      position: relative;
    }

    &__feedback{
      position: absolute;
      left:-30px;
      top:-25px;
    }

    &__hz-bar{
      height:1px;
      width: 95%;
      margin:auto;
      background-color: $my-dark-grey;
    }
  }

</style>
