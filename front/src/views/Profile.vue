<template>
  <div class="home">

    <Header :withProfile="true"/>

    <b-modal 
      ref="my-modal" 
      centered 
      title="Supprimer le compte" 
      @ok="deleteUser" 
      ok-variant="danger"
      ok-title="Supprimer"
      cancel-title="Annuler"
    >
      <p class="my-4">Votre compte ainsi que l'ensemble de vos posts et vos commentaires seront supprimés de manière irréversible.</p>
    </b-modal>

    <main class="container">
      <h2 align="center">{{user.userName}}</h2>
      <div class="imageContainer">
        <ProfileImage :imageSrc="user.imageUrl"/>
      </div>

      <form>
        <b-button
          variant="outline-secondary"
          @click="clickInput"
          type="button"
          aria-label="Modifier ma photo de profil"
        >
          <span >Modifier ma photo</span>
          <b-icon-image class="file-icon"></b-icon-image>
        </b-button>

        <input
          ref="fileInput"
          class="d-none"
          type="file"
          @change="updateProfilImage"
        />
      </form>      

      <b-form @submit="onSubmit">

        <b-form-group id="input-group-1" label="Prénom:" label-for="input-1">
          <b-form-input
            id="input-1"
            v-model="form.firstname"
            type="text"
            placeholder="Prénom"
            maxlength="30"
            @input="firstnameCheck()"
            
          ></b-form-input>
          <b-form-invalid-feedback id="input-1-feedback"></b-form-invalid-feedback>
        </b-form-group>

        <b-form-group id="input-group-2" label="Nom:" label-for="input-2">
          <b-form-input
            id="input-2"
            v-model="form.lastname"
            type="text"
            placeholder="Nom"
            maxlength="30"
            @input="lastnameCheck()"
            
          ></b-form-input>
          <b-form-invalid-feedback id="input-2-feedback"></b-form-invalid-feedback>
        </b-form-group>

        <b-form-group id="input-group-3" label="Adresse email:" label-for="input-3">
          <b-form-input
            id="input-3"
            v-model="form.email"
            type="text"
            placeholder="Email"
            maxlength="50"
            @input="emailCheck()"
            
          ></b-form-input>
          <b-form-invalid-feedback id="input-3-feedback"></b-form-invalid-feedback>
        </b-form-group>
          
        <p class="text-danger my-2">{{ errorMessage }}</p>
        
        <b-button type="submit" variant="primary" class="my-3">Enregistrer les modifications</b-button>
      </b-form>

      <b-button variant="outline-danger" @click="promptConfirmModal">
        Supprimer le compte
      </b-button>

    </main>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from '@/components/Header.vue'
import ProfileImage from '@/components/ProfileImage.vue'
import apiConnection from '../services/APIConnection.js'

export default {
  name: 'Profile',
  components: {
    Header,
    ProfileImage,
  },
  data() {
    return {
      form: {
        email: '',
        lastname: '',
        firstname: '',
      },
      errorMessage: '',
      // EMAIL : format standard : same regex used to check type="email" input in HTML5
      emailRegex: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      // FIRSTNAME : au moins 2 car + espaces et tirets acceptés
      firstnameRegex: /^[a-zA-Z-]{2,}[a-zA-Z- ]*$/,
      // LASTNAME : au moins 2 car + espaces et tirets acceptés
      lastnameRegex: /^[a-zA-Z-]{2,}[a-zA-Z- ]*$/,
      user: JSON.parse(localStorage.getItem('user')),
    }
  },
  // Récupération des informations de l'utilisateur à la création de la vue
  created() {
    // Préremplir les champs de saisie avec les informations connues
    this.form.lastname = this.user.lastName;
    this.form.firstname = this.user.firstName;
    this.form.email = this.user.email;
  },
  methods: {
    clickInput () {
      this.$refs.fileInput.click();
    },
    updateProfilImage(event) {
      const image = event.target.files[0];
      const formData = new FormData();
      formData.append("image", image);
      formData.append("user", JSON.stringify(this.user));
  
      apiConnection.put("api/user/" + this.user.id, formData, true)
      .then( response => {
        console.log(response.message);
        // récupérer l'url de la nouvelle image et recharger le composant
        this.user.imageUrl = response.imageUrl;
        localStorage.setItem('user', JSON.stringify(this.user));
        this.$forceUpdate();
      }).catch( error => {console.log(error)});
    },
    clearFieldsColors(){
      for(let fieldName of ["input-1", "input-2", "input-3" ]){
        let field = document.getElementById(fieldName);
        field.classList.remove("is-valid");
        field.classList.remove("is-invalid");
      }
    },
    setFieldError(fieldName,message){
      let field = document.getElementById(fieldName);
      field.classList.remove("is-valid");
      field.classList.add("is-invalid");
      let feedbackMessage = document.getElementById(fieldName + "-feedback");
      feedbackMessage.innerHTML = message;
    },
    removeFieldError(fieldName){
      let field = document.getElementById(fieldName);
      field.classList.add("is-valid");
      field.classList.remove("is-invalid");
      let feedbackMessage = document.getElementById(fieldName + "-feedback");
      feedbackMessage.innerHTML = "";
    },
    firstnameCheck() {
      if (!this.form.firstname){
        this.removeFieldError('input-1');
      } else if (! this.firstnameRegex.test(this.form.firstname) ) {
        this.setFieldError('input-1', "Format invalide : 2 à 30 caractères requis.");
      } else {
        this.removeFieldError('input-1');
        return true;
      }
      return false;
    },
    lastnameCheck() {
      if (!this.form.lastname){
        this.removeFieldError('input-2');
      } else if (! this.lastnameRegex.test(this.form.lastname) ) {
        this.setFieldError('input-2', "Format invalide : 3 à 15 caractères requis.");
      } else {
        this.removeFieldError('input-2');
        return true;
      }
      return false;
    },
    emailCheck() {
      if (!this.form.email){
        this.removeFieldError('input-3');
      } else if (! this.emailRegex.test(this.form.email) ) {
        this.setFieldError('input-3', "Format invalide");
      } else {
        this.removeFieldError('input-3');
        return true;
      }
      return false;
    },
    onSubmit(event) {
      event.preventDefault();
      // contrôle du format en entrée et qu'une donnée a bien été modifiée par l'utilisateur
      if ( ( this.user.firstName !== this.form.firstname 
            || this.user.lastName !== this.form.lastname
            || this.user.email !== this.form.email ) 
        && this.firstnameCheck() && this.lastnameCheck() && this.emailCheck()){
        const updatedUser = {
          firstName:this.form.firstname,
          lastName:this.form.lastname,
          email: this.form.email,
        }
        // Envoyer le nouvel user à l'API
        apiConnection.put("api/user/" + this.user.id, updatedUser)
        .then( response => {
          console.log(response.message);
          // mise à jour des données utilisateur coté front
          this.user.firstName = updatedUser.firstName;
          this.user.lastName = updatedUser.lastName;
          this.user.email = updatedUser.email;
          localStorage.setItem('user', JSON.stringify(this.user));
          this.clearFieldsColors();
        }).catch( error => {
            console.log(error);
            this.errorMessage = "Une erreur est survenue, veuillez réessayer plus tard.";
        });
      } 
    },
    promptConfirmModal(){
      this.$refs['my-modal'].show();
    },
    deleteUser(){
      apiConnection.delete("api/user/" + this.user.id)
      .then( response => {
        console.log(response.message);
        // RAZ du localStorage
        localStorage.clear();
        // Redirection vers la page de login
        this.$router.push({ name: 'Signup' })
      }).catch( error => {
          console.log(error);
          this.errorMessage = "Une erreur est survenue, veuillez réessayer plus tard.";
      });
    }
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
