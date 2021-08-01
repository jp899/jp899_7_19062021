<template>
  <div class="signup">
    <Header/>
    <main class="container">
      <h1 align="center" class="h2 mt-3">Rejoignez-nous !</h1>
      <b-form @submit="onSubmit" class="mt-3">

        <b-form-group id="input-group-1" label="Pseudo:" label-for="input-1" class="text-left">
          <b-form-input
            id="input-1"
            v-model="form.username"
            placeholder="Pseudo"
            maxlength="15"
            @input="usernameCheck()"
            
          ></b-form-input>
          <b-form-invalid-feedback id="input-1-feedback"></b-form-invalid-feedback>
        </b-form-group>

        <b-form-group id="input-group-2" label="Adresse email:" label-for="input-2" class="text-left">
          <b-form-input
            id="input-2"
            v-model="form.email"
            type="text"
            placeholder="Email"
            maxlength="50"
            @input="emailCheck()"
            
          ></b-form-input>
          <b-form-invalid-feedback id="input-2-feedback"></b-form-invalid-feedback>
        </b-form-group>

        <b-form-group id="input-group-3" label="Mot de passe:" label-for="input-3" class="text-left">
          <b-form-input
            id="input-3"
            v-model="form.password"
            type="password"
            placeholder="Mot de passe"
            maxlength="15"
            @input="passwordCheck()"
            
          ></b-form-input>
          <b-form-invalid-feedback id="input-3-feedback"></b-form-invalid-feedback>
          
        </b-form-group>

        <p class="text-danger my-2">{{ errorMessage }}</p>

        <b-button type="submit" variant="primary" class="my-3">Inscription</b-button>
      </b-form>

      <p>
        Déja inscrit ?
        <router-link to="/login" class="text-tertiary">Se connecter</router-link>
      </p>

    </main>
  </div>
</template>

<script>
// @ is an alias to /src

import Header from '@/components/Header.vue'
import apiConnection from '../services/APIConnection.js'

export default {
  name: 'Signup',
  components: {
    Header,
  },
  data() {
    return {
      form: {
        email: '',
        username: '',
        password: '',
      },
      errorMessage: '',
      // EMAIL : format standard : same regex used to check type="email" input in HTML5
      emailRegex: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      // USERNAME : au moins 3 car/chiffres
      usernameRegex: /^[a-zA-Z0-9]{3,}$/,
      // PASSWORD : de 8 à 15 caractères avec au moins : 1 minuscule, 1 majuscule, un chiffre, un caractère spécial
      passwordRegex: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*$@%#=_])([-+!*$@%#=_\w]{8,15})$/
    }
  },
  methods: {
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
    usernameCheck() {
      if (!this.form.username){
        this.setFieldError('input-1', "Pseudo requis");
      } else if (! this.usernameRegex.test(this.form.username) ) {
        this.setFieldError('input-1', "Format invalide : 3 à 15 caractères/chiffres requis, sans caractères spéciaux.");
      } else {
        this.removeFieldError('input-1');
        return true;
      }
      return false;
    },
    emailCheck() {
      if (!this.form.email){
        this.setFieldError('input-2', "Email requis");
      } else if (! this.emailRegex.test(this.form.email) ) {
        this.setFieldError('input-2', "Format invalide");
      } else {
        this.removeFieldError('input-2');
        return true;
      }
      return false;
    },
    passwordCheck() {
      if (!this.form.password){
        this.setFieldError('input-3', "Mot de passe requis");
      } else if (! this.passwordRegex.test(this.form.password) ) {
        this.setFieldError('input-3', "Format invalide : 8 à 15 caractères requis avec chiffre, majuscule, minuscule et caractère spécial.");
      } else {
        this.removeFieldError('input-3');
        return true;
      }
      return false;
    },
    onSubmit(event) {
      event.preventDefault();
      if ( this.usernameCheck() 
      && this.passwordCheck()
      && this.emailCheck()){
        const newUser = {
          userName: this.form.username,
          firstName:"",
          lastName:"",
          email: this.form.email,
          password: this.form.password
        }
        // Envoyer le nouvel user à l'API
        apiConnection.post("api/auth/signup", newUser)
        .then( response => {
          console.log(response);
          // Si OK Login via l'API
          apiConnection.post("api/auth/login", {userName: newUser.userName, password: newUser.password})
          .then( userData => {
            // SI login OK enregistrement infos de connection en local storage
            localStorage.setItem('userToken', userData.token);
            localStorage.setItem('user', JSON.stringify(userData.user));
            // Puis débranchement vers vue acceuil
            this.$router.push({ name: 'Home' })
          }).catch(error => {
            console.log(error);
            this.errorMessage = "Une erreur est survenue, veuillez réessayer plus tard.";
          });
        }).catch( error => {
          const errorMessage = error.toString();
          // En cas de message spécifique renvoyé dans l'erreur par l'API on la traite
          //  sinon on affiche juste un message générique à l'utilisateur
          if(errorMessage.includes("apiMessage:")){
            const apiMessage = errorMessage.split("apiMessage:")[1];
            if(apiMessage === "Username not available"){
              this.setFieldError("input-1","Ce pseudo n'est pas disponible");
            } else {
              console.log(error);
              this.errorMessage = "Une erreur est survenue, veuillez réessayer plus tard.";
            }
          } else {
            console.log(error);
            this.errorMessage = "Une erreur est survenue, veuillez réessayer plus tard.";
          }
        });
      } 
    }
  }
}
</script>
