<template>
  <div id="app">
    <Navbar />
    <router-view/>
    <Footer />
  </div>
</template>

<script>
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default {
  name: 'App',
  components: {
    Navbar,
    Footer
  },
  data(){
    return{
    }
  }
}
</script>

<style>
 :root{
   --primary-color: #F3F3F3;
 } 
 body{
   background: var(--primary-color);
 }
.body-bg-no-image {
  background: var(--primary-color);
}
.body-bg-image {
  background: url("./assets/bg.jpg") no-repeat top
    center fixed;
  background-size: 100% 100%;
}
.body-bg-image-home{
  background: url("./assets/homebg.jpg") no-repeat top
    center fixed;
  background-size: 100% 100%;
}
.bg-side-menu{
     background-image: url("./assets/bg-sidenav.jpg"); 
     background-size: cover;
     background-repeat: no-repeat;
  }
</style>
