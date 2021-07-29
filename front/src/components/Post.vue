<template>

  <div class="post container border mb-4 shadow">

    <div class="post-header d-flex align-items-center justify-content-between my-2">
      <div class="d-flex align-items-center">
        <ProfileImage :imageSrc="content.user.imageUrl" class="post-header__image"/>
        <div class="post-header__username h4">{{content.user.userName}}</div>
      </div>
      <EditMenu @deleteMe="deleteMe"/>
    </div>

    <div class="post-title row">
      <h2>{{content.title}}</h2>
    </div>

    <div class="post-body row">
      <b-img class="post-body__image" :src="content.imageUrl" fluid alt="Image du post"></b-img>
    </div>

    <div class="post-ratings row">
      <div class="post-ratings__likes">{{content.likesCount}}</div>
      <div class="post__dislikes">{{content.dislikesCount}}</div>
    </div>

    <div class="post-comments row">

    </div>

  </div>

</template>

<script>

import apiConnection from '../services/APIConnection.js'
import ProfileImage from '@/components/ProfileImage.vue'
import EditMenu from '@/components/EditMenu.vue'


export default {
  name: "Post",
  components: {
    ProfileImage,
    EditMenu,
  },
  data: () => ({

  }),
  props: {
    content: {type: Object, required: true},
    index: {type: Number, required: true},
  },
  methods:{
    logout(){
      localStorage.clear();
      this.$router.push("/login");
    },
    deleteMe() {
      apiConnection.delete("api/article/" + this.content.id)
      .then( response => {
        console.log(response.message);
        // Propagation de l'évenement au parent pour suppression de l'affichage du post
        this.$emit('deleteMe');
      }).catch( error => {
          console.log(error);
          this.errorMessage = "Une erreur est survenue, veuillez réessayer plus tard.";
      });
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .post-header{

    &__image{
      width: 60px;
      height: 60px;
    }

    &__username{
      margin-left: 10px;
    }

  }

  .post-image{
    width: 100%;
    height: 300px;
    object-fit: cover;
  }

</style>
