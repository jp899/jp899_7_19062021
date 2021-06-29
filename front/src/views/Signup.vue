<template>
  <div class="home">
    <Header/>
    <main>
      <h2 align="center">Inscription</h2>
      <b-form @submit="onSubmit" v-if="show">

        <b-form-group id="input-group-1" label="Pseudo:" label-for="input-1">
          <b-form-input
            id="input-1"
            v-model="form.username"
            placeholder="Pseudo"
            maxlength="15"
            @input="usernameCheck(form.username)"
            required
          ></b-form-input>
          <b-form-invalid-feedback id="input-1-feedback"></b-form-invalid-feedback>
        </b-form-group>

        <b-form-group id="input-group-2" label="Adresse email:" label-for="input-2">
          <b-form-input
            id="input-2"
            v-model="form.email"
            type="text"
            placeholder="Email"
            maxlength="50"
            @input="emailCheck(form.email)"
            required
          ></b-form-input>
          <b-form-invalid-feedback id="input-2-feedback"></b-form-invalid-feedback>
        </b-form-group>

        <b-form-group id="input-group-3" label="Mot de passe:" label-for="input-3">
          <b-form-input
            id="input-3"
            v-model="form.password"
            type="password"
            placeholder="Mot de passe"
            maxlength="15"
            @input="passwordCheck(form.password)"
            required
          ></b-form-input>
          <b-form-invalid-feedback id="input-3-feedback"></b-form-invalid-feedback>
          
        </b-form-group>

        <p class="text-danger my-2">{{ errorMessage }}</p>

        <b-button type="submit" variant="primary" class="my-3">Submit</b-button>
      </b-form>

      <p>
        Déja inscrit ?
        <router-link to="/login">Se connecter</router-link>
      </p>

    </main>
  </div>
</template>

<script>
// @ is an alias to /src

import Header from '@/components/Header.vue'

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
      emailRegex: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      usernameRegex: /^[a-zA-Z0-9]{3,}$/,
      passwordRegex: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*$@%#=_])([-+!*$@%#=_\w]{8,15})$/,
      show: true
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
    usernameCheck(username) {
      if (!username){
        this.setFieldError('input-1', "Pseudo requis");
      } else if (! this.usernameRegex.test(username) ) {
        this.setFieldError('input-1', "Format invalide : 3 à 15 caractères/chiffres requis, sans caractère spéciaux.");
      } else {
        this.removeFieldError('input-1');
      }
    },
    emailCheck(email) {
      if (!email){
        this.setFieldError('input-2', "Email requis");
      } else if (! this.emailRegex.test(email) ) {
        this.setFieldError('input-2', "Format invalide");
      } else {
        this.removeFieldError('input-2');
      }
    },
    passwordCheck(password) {
      if (!password){
        this.setFieldError('input-3', "Mot de passe requis");
      } else if (! this.passwordRegex.test(password) ) {
        this.setFieldError('input-3', "Format invalide : 8 à 15 caractères requis avec chiffre, majuscule, minuscule et caractère spécial");
      } else {
        this.removeFieldError('input-3');
      }
    },
    onSubmit(event) {
      event.preventDefault()
      alert(JSON.stringify(this.form))
    }
  }
}
</script>
