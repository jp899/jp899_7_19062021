<template>
    <header class="sticky-top bg-white border-bottom border-2">
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
                <b-nav-item v-show="!withProfile"><router-link class="text-decoration-none" to="/login">Se connecter</router-link></b-nav-item>
                <b-nav-item v-show="!withProfile"><router-link class="text-decoration-none" to="/signup">S'inscrire</router-link></b-nav-item>
                <b-nav-item-dropdown v-show="withProfile" text="User" right>
                  <b-dropdown-item><router-link class="text-decoration-none" to="/profile">Mon profil</router-link></b-dropdown-item>
                  <b-dropdown-item><router-link class="text-decoration-none" to="/login">Se déconnecter</router-link></b-dropdown-item>
                </b-nav-item-dropdown>
            </b-navbar-nav>

            <!-- Right aligned nav items -->
            <!-- <b-navbar-nav >
          
                <b-nav-item-dropdown text="User" right>
                  <b-dropdown-item><router-link class="text-decoration-none" to="/profile">Mon profil</router-link></b-dropdown-item>
                  <b-dropdown-item><router-link class="text-decoration-none" to="/login">Se déconnecter</router-link></b-dropdown-item>
                </b-nav-item-dropdown>

                <b-nav-item-dropdown right> -->
                  <!-- Using 'button-content' slot -->
                  <!-- <template #button-content>
                      <em>User</em>
                  </template>
                  <b-dropdown-item><router-link class="text-decoration-none" to="/profile">Mon profil</router-link></b-dropdown-item>
                  <b-dropdown-item><router-link class="text-decoration-none" to="/login">Se déconnecter</router-link></b-dropdown-item>
                </b-nav-item-dropdown>
            </b-navbar-nav> -->
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
    width: 240px;
  }

  .border-2 {
    border-width:2px !important;
  }
</style>
