<template>
  <div class="home">
    <Header :withProfile="true"/>
    <img alt="Vue logo" src="../assets/logo.png">
    <CardTest msg="Welcome to Your Vue.js App"/>
    <CardTest msg="Welcome to Your Vue.js App"/>
    <CardTest msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import CardTest from '@/components/CardTest.vue'
import Header from '@/components/Header.vue'


export default {
  name: 'Home',
  components: {
    Header,
    CardTest
  }
}
</script>
