<script setup>
import SlideHorizontal from "./components/SlideHorizontal.vue";
import SlideItem from "./components/SlideItem.vue";
</script>

<template>
  <div class="app-page">
    <SlideHorizontal class="content">
      <SlideItem>
        <div class="page" style="background: red"></div>
      </SlideItem>
      <SlideItem>
        <div class="page" style="background: orange"></div>
      </SlideItem>
      <SlideItem>
        <div class="page" style="background: yellow"></div>
      </SlideItem>
      <SlideItem>
        <div class="page" style="background: green"></div>
      </SlideItem>
      <SlideItem>
        <div class="page" style="background: blue"></div>
      </SlideItem>
      <SlideItem>
        <div class="page" style="background: pink"></div>
      </SlideItem>
    </SlideHorizontal>
  </div>
</template>

<style scoped>
.app-page {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content {
  width: 400px;
  height: 90vh;
}

.page {
  width: 100%;
  height: 100%;
  background: #f1f1f1;
}
</style>
