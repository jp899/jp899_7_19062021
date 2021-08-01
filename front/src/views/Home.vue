<template>
  <div class="home">
    <Header :withProfile="true"/>

    <main class="container">

      <div class="post-form border my-4 shadow">
        <b-form-group>

          <div class="d-flex">  
            <div class="imageContainer">
              <ProfileImage :imageSrc="user.imageUrl"/>
            </div>
            
            <b-form-input
              id="input-title"
              v-model="newPostForm.title" 
              placeholder="Exprimez-vous" 
              maxlength="50"
              type="text"
              @input="titleCheck()"
            ></b-form-input>
          
          </div>

          <b-img class="post-img" v-if="tempImage" :src="tempImage" fluid alt="Image à partager"></b-img>


          <div class="d-flex">  

            <b-button
              variant="outline-secondary"
              @click="clickInput"
              type="button"
              aria-label="Choisir une image"
            >
              <span>Choisir une image</span>
              <b-icon-image class="file-icon"></b-icon-image>
            </b-button>

            <input
              ref="fileInput"
              class="d-none"
              type="file"
              @change="loadImage"
            />

            <b-button
              variant="outline-primary"
              @click="postArticle"
              type="button"
              aria-label="Partager"
            >
              <span>Partager</span>
            </b-button>

          </div>

        </b-form-group>      
      </div>

      <div class="postList">
        <Post v-for="(post, index) in postsContent" 
          :content="post" 
          :key="post.id" 
          :index="index"
          @deleteMe="postsContent.splice(index,1)"/>
      </div>

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
    setFieldError(fieldName){
      let field = document.getElementById(fieldName);
      field.classList.remove("is-valid");
      field.classList.add("is-invalid");
    },
    removeFieldError(fieldName){
      let field = document.getElementById(fieldName);
      field.classList.add("is-valid");
      field.classList.remove("is-invalid");
    },
    titleCheck(){
      if (!this.newPostForm.title){
        this.setFieldError('input-title');
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
    },
    postArticle(){
      // Post autorisé uniquement si une image a été chargée et un titre renseigné
      if(this.tempImage && this.titleCheck()){
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
        }).catch( error => {console.log(error)});
      }
    },
  }
}
</script>



<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .imageContainer{
    width: 150px;
    margin: auto;
  }

  .file-icon{
  width:24px;
  height:24px;
  margin-left:5px;
  }

</style>
