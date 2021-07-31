<template>

  <div class="post container border mb-4 shadow">

    <div class="post-header d-flex align-items-center justify-content-between my-2">
      <div class="d-flex align-items-center">
        <ProfileImage :imageSrc="content.user.imageUrl" class="post-header__image"/>
        <div class="post-header__username h4">{{content.user.userName}}</div>
      </div>
      <EditMenu v-if="(hasEditRights)" @deleteMe="deleteMe" @updateMe="updateMe"/>
    </div>

    <div class="post-title row">
      <h2>
        <span v-if="(!editMode)">{{content.title}}</span>
        <b-form @submit="newTitleSubmit" v-if="(editMode)" >
          <b-form-input
            size="lg"
            ref="my-title"
            v-model="form.title"
            type="text"
            maxlength="50"
            placeholder="Saisir un nouveau titre"
            @input="titleCheck()"
          ></b-form-input>
        </b-form>
      </h2>
    </div>

    <div class="post-body row">
      <b-img class="post-body__image" :src="content.imageUrl" fluid alt="Image du post"></b-img>
    </div>

    <div class="post-ratings row mx-2 my-2">
      <div class="post-ratings__thumbUp col">
        
          <b-icon-arrow-up-circle v-if="(hasNotRated || hasRatedDown)" class="icon-thumbs-up h2" variant="primary" @click="likeIt"></b-icon-arrow-up-circle>
          <b-icon-arrow-up-circle-fill v-if="(hasRatedUp)" class="icon-thumbs-up h2" variant="primary" @click="unlikeIt"></b-icon-arrow-up-circle-fill>

      </div>
      <div class="post-ratings__likes col">{{content.likesCount}}</div>
      <div class="post-ratings__thumbDown col">
        <b-icon-arrow-down-circle v-if="(hasNotRated || hasRatedUp)" class="icon-thumbs-up h2" @click="dislikeIt"></b-icon-arrow-down-circle>
        <b-icon-arrow-down-circle-fill v-if="(hasRatedDown)" class="icon-thumbs-up h2" @click="unlikeIt"></b-icon-arrow-down-circle-fill>
      </div>
      <div class="post__dislikes col">{{content.dislikesCount}}</div>
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
  data() {
    return {
      form: {
        title: this.content.title,
      },
      editMode: false,
      hasNotRated: false,
      hasRatedUp: false,
      hasRatedDown: false,
    }
  },
  computed: {
    hasEditRights: function () {
      return (this.content.user.id == JSON.parse(localStorage.getItem('user')).id || JSON.parse(localStorage.getItem('user')).isAdmin );
    },
  },
  props: {
    content: {type: Object, required: true},
    index: {type: Number, required: true},
  },
  created(){
    this.setHasNotRated();
    this.setHasRatedUp();
    this.setHasRatedDown();
  },
  methods:{
    setHasNotRated() {
      this.hasNotRated = (this.content.Likes.length === 0 || this.content.Likes[0].liked === 0 );
    },
    setHasRatedUp() {
      this.hasRatedUp = (this.content.Likes.length !== 0 && this.content.Likes[0].liked === 1 );
    },
    setHasRatedDown() {
      this.hasRatedDown = (this.content.Likes.length !== 0 && this.content.Likes[0].liked === -1 );
    },
    rateIt(newLiked) {
      const body = {
        liked: newLiked,
        userId: JSON.parse(localStorage.getItem('user')).id,
      };
      apiConnection.post("api/article/" + this.content.id +"/like", body)
      .then( response => {
        console.log(response.message);

        // Mise à jour des compteurs de like coté front
        const previousLiked = this.content.Likes.length === 0 ? 0 : this.content.Likes[0].liked;
        if(newLiked === 1){
          this.content.likesCount++; 
        } else if (newLiked === -1){
          this.content.dislikesCount++;
        }
        if(previousLiked === 1){
          this.content.likesCount--;
        } else if (previousLiked === -1){
          this.content.dislikesCount--;
        } 

        // Mise à jour du like en mémoire coté front
        if(this.content.Likes.length === 0 ){
          this.content.Likes.push({liked: newLiked})
        } else {
          this.content.Likes[0].liked = newLiked;
        }
        this.setHasNotRated();
        this.setHasRatedUp();
        this.setHasRatedDown();
      }).catch( error => {
          console.log(error);
          this.errorMessage = "Une erreur est survenue, veuillez réessayer plus tard.";
      });
    },
    likeIt() {
      this.rateIt(1);
    },
    unlikeIt() {
      this.rateIt(0);
    },
    dislikeIt() {
      this.rateIt(-1);
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
    updateMe() {
      this.editMode = true;
      // Mettre le curseur/focus sur le champ de saisie que l'on vient de faire apparaitre
      setTimeout(() => {this.$nextTick(() => this.$refs["my-title"].$el.focus()) }, 500);
    },
    setFieldError(fieldName){
      let field = this.$refs[fieldName].$el;
      field.classList.remove("is-valid");
      field.classList.add("is-invalid");
    },
    removeFieldError(fieldName){
      let field = this.$refs[fieldName].$el;
      field.classList.add("is-valid");
      field.classList.remove("is-invalid");
    },
    titleCheck(){
      if (!this.form.title){
        this.setFieldError('my-title');
      } else {
        this.removeFieldError('my-title');
        return true;
      }
      return false;
    },
    clearFieldsColors(){
      for(let fieldName of ["my-title"]){
        let field = this.$refs[fieldName].$el;
        field.classList.remove("is-valid");
        field.classList.remove("is-invalid");
      }
    },
    newTitleSubmit(event){
      event.preventDefault();
      if (this.form.title){
        // Demander la mise à jour au back
        apiConnection.put("api/article/" + this.content.id, this.form)
        .then( response => {
          console.log(response.message);
          // Mettre à jour le titre en mémoire
          this.content.title = this.form.title;
          // Puis arreter le mode édit
          this.clearFieldsColors()
          this.editMode = false;
        }).catch( error => {console.log(error)});
      }
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

  .post-body{
    &__image{
      width: 90%;
      margin:auto;
      object-fit: cover;
    }
  }

</style>
