<template>
    <header class="sticky-top bg-white border-bottom border-2 container">
      <nav>
        <b-navbar toggleable="lg" type="light">
          <b-navbar-brand>
            <router-link to="/">
              <img id="mainLogo"
              :src="require('../assets/icon-left-font-short.svg')"
              alt="logo de groupomania"/>
            </router-link>
          </b-navbar-brand>

          <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

          <b-collapse id="nav-collapse" is-nav class="justify-content-end">
            <b-navbar-nav >
                <b-nav-item v-show="!withProfile"><router-link to="/login">Se connecter</router-link></b-nav-item>
                <b-nav-item v-show="!withProfile"><router-link to="/signup">S'inscrire</router-link></b-nav-item>
                <!-- <b-nav-item-dropdown v-show="withProfile" text="User" right>
                  <b-dropdown-item v-show="withProfile"><router-link to="/profile">Mon profil</router-link></b-dropdown-item>
                  <b-dropdown-item v-show="withProfile" @click="logout">Se déconnecter</b-dropdown-item>
                </b-nav-item-dropdown> -->
                  <b-nav-item v-show="withProfile"><router-link to="/">Accueil</router-link></b-nav-item>
                  <b-nav-item v-show="withProfile"><router-link to="/profile">Mon profil</router-link></b-nav-item>
                  <b-nav-item v-show="withProfile" @click="logout">Se déconnecter</b-nav-item>
            </b-navbar-nav>
          </b-collapse>

        </b-navbar>
      </nav>
    </header>
</template>

<script>
    export default {
      name: "Header",
      data: () => ({
        
      }),
      props: {
        withProfile: {type: Boolean, default: false}
      },
      methods:{
        logout() {
          localStorage.clear();
          this.$router.push("/login");
        }
      }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  #mainLogo{
    height: 100%;
    width: 220px;
  }

  .border-2 {
    border-width:2px !important;
  }
</style>
