<template>
  <div class="rect-img-container">
    <b-img class="rect-img" :src="imageSrc || defaultSrc" fluid alt="Image de l'utilisateur" rounded="circle"></b-img>
  </div>
</template>

<script>
  export default {
    name: "ProfileImage",
    data() {
      return {
        defaultSrc: "images/profileImageDefault.svg"
      }
    },
    props: {
      imageSrc: {
        type: String,
        default: "images/profileImageDefault.svg"},
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  // tronquer l'image source dans un carré
  .rect-img-container {
    position: relative;
  }
  .rect-img-container::after {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
  .rect-img {
    position: absolute;
    left:0;
    top:0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
