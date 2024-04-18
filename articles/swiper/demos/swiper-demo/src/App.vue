<script setup>
import SlideHorizontal from "./components/SlideHorizontal.vue";
import SlideItem from "./components/SlideItem.vue";
</script>

<template>
  <div class="app-page">
    <SlideHorizontal
        name="父"
        class="content">
      <SlideItem style="width: 70%;">
        <div class="page" style="background: gainsboro">
          <div v-for="i in 5">父slide</div>
          <div v-for="i in 5">第一页</div>
          <div v-for="i in 5">宽度只有70%</div>
        </div>
      </SlideItem>
      <SlideItem>
        <SlideHorizontal
            name="子"
            class="content">
          <SlideItem>
            <div class="page" style="background: red">
              <div v-for="i in 5">子slide</div>
              <div v-for="i in 5">第一页</div>
            </div>
          </SlideItem>
          <SlideItem>
            <div class="page" style="background: orange">
              <div v-for="i in 5">子slide</div>
              <div v-for="i in 5">第二页</div>
            </div>
          </SlideItem>
          <SlideItem>
            <div class="page" style="background: yellow">
              <div v-for="i in 5">子slide</div>
              <div v-for="i in 5">第三页</div>
            </div>
          </SlideItem>
          <SlideItem>
            <div class="page" style="background: green">
              <div v-for="i in 5">子slide</div>
              <div v-for="i in 5">第四页</div>
            </div>
          </SlideItem>
        </SlideHorizontal>
      </SlideItem>
      <SlideItem>
        <div class="page" style="background: yellow">
          <div v-for="i in 5">父slide</div>
          <div v-for="i in 5">第三页</div>
        </div>
      </SlideItem>
    </SlideHorizontal>

  </div>
</template>

<style scoped>
.app-page {
  background: black;
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
  font-size: 20px;
}
</style>
