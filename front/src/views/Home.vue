<template>
  <div class="home">
    <Header :withProfile="true"/>

    <main>

      <div>
        <!-- <b-form-textarea
              id="textarea"
              v-model="newPostForm.text"
              placeholder="Exprimez-vous !"
              rows="3"
              no-resize
            ></b-form-textarea>

            <textarea rows="4" cols="50" maxlength="50" placeholder="Enter text here"></textarea> -->

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
            <b-form-invalid-feedback id="input-3-feedback"></b-form-invalid-feedback>
          
            
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

      <div>

      </div>

    </main>


  </div>
</template>

<script>
// @ is an alias to /src

import apiConnection from '../services/APIConnection.js'
import Header from '@/components/Header.vue'
import ProfileImage from '@/components/ProfileImage.vue'


export default {
  name: 'Home',
  components: {
    Header,
    ProfileImage,
  },
  data() {
    return {
      tempImage: null,
      newPostForm: {
        image: null,
        title: "",
      },
      user: {},
    }
  },
  // Récupération des informations de l'utilisateur à la création de la vue
  created() {
    apiConnection.get("api/user/" + localStorage.getItem('userId'))
      .then( response => {
        // Enregistrer les données sur l'utilisateur
        this.user = response;
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
    titleCheck() {
      if (!this.newPostForm.title){
        this.setFieldError('input-title');
      } else {
        this.removeFieldError('input-title');
        return true;
      }
      return false;
    },
    clickInput () {
      this.$refs.fileInput.click();
    },
    loadImage(event) {
      // Enregistrer l'image et l'afficher
      this.newPostForm.image = event.target.files[0];
      this.tempImage = URL.createObjectURL(this.newPostForm.image);
    },
    postArticle() {
      const formData = new FormData();
      formData.append("image", this.newPostForm.image);
      formData.append("title", JSON.stringify(this.newPostForm.title));
  
      apiConnection.post("api/article/", formData, true)
      .then( response => {
        console.log(response);
        // récupérer l'url de la nouvelle image et recharger le composant
        // this.user.imageUrl = response.imageUrl;
        // this.$forceUpdate();
      }).catch( error => {console.log(error)});
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
