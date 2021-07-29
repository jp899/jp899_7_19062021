<template>
  <div class="login">
    <Header/>
    <main class="container">
      <h2 align="center">Connectez-vous !</h2>
      <b-form @submit="onSubmit">

        <b-form-group id="input-group-1" label="Pseudo:" label-for="input-1">
          <b-form-input
            id="input-1"
            v-model="form.username"
            placeholder="Pseudo"
            maxlength="15"
            @input="usernameCheck()"
          ></b-form-input>
          <b-form-invalid-feedback id="input-1-feedback"></b-form-invalid-feedback>
        </b-form-group>

        <b-form-group id="input-group-2" label="Mot de passe:" label-for="input-2">
          <b-form-input
            id="input-2"
            v-model="form.password"
            type="password"
            placeholder="Mot de passe"
            maxlength="15"
            @input="passwordCheck()"
          ></b-form-input>
          <b-form-invalid-feedback id="input-2-feedback"></b-form-invalid-feedback>
          
        </b-form-group>

        <p class="text-danger my-2">{{ errorMessage }}</p>

        <b-button type="submit" variant="primary" class="my-3">Se connecter</b-button>
      </b-form>

      <p>
        Première visite ?
        <router-link to="/signup">Inscrivez-vous</router-link>
      </p>

    </main>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from '@/components/Header.vue'
import apiConnection from '../services/APIConnection.js'

export default {
  name: 'Login',
  components: {
    Header,
  },
  data() {
    return {
      form: {
        username: '',
        password: '',
      },
      errorMessage: '',
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
      } else {
        this.removeFieldError('input-1');
        return true;
      }
      return false;
    },
    passwordCheck() {
      if (!this.form.password){
        this.setFieldError('input-2', "Mot de passe requis");
      } else {
        this.removeFieldError('input-2');
        return true;
      }
      return false;
    },
    onSubmit(event) {
      event.preventDefault();
      if ( this.usernameCheck() 
      && this.passwordCheck()){
        const user = {
          userName: this.form.username,
          password: this.form.password
        }
        // LOGIN via l'API
        apiConnection.post("api/auth/login", user)
        .then( userData => {
          // SI login OK enregistrement infos de connection en local storage
          localStorage.setItem('userToken', userData.token);
          localStorage.setItem('userId', userData.userId);
          // Puis débranchement vers vue acceuil
          this.$router.push({ name: 'Home' })
        }).catch(error => {
          const errorMessage = error.toString();
          // En cas de message spécifique renvoyé dans l'erreur par l'API on la traite
          //  sinon on affiche juste un message générique à l'utilisateur
          if(errorMessage.includes("apiMessage:")){
            const apiMessage = errorMessage.split("apiMessage:")[1];
            if(apiMessage === "User not found !"){
              this.setFieldError("input-1","Pseudo introuvable");
            } else if (apiMessage === "Incorrect password !"){
              this.setFieldError("input-2","Mot de passe incorrect");
            } else if (apiMessage === "Too Many Requests"){
              this.errorMessage = "Trop de connections échouées, réessayez dans 1 heure."
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