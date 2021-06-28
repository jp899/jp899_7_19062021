<template>
  <div class="login">
    <Header/>
    <img alt="Vue logo" src="../assets/logo.png">
    <CardTest msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import CardTest from '@/components/CardTest.vue'
import Header from '@/components/Header.vue'

export default {
  name: 'Login',
  components: {
    Header,
    CardTest
  }
}
</script>
