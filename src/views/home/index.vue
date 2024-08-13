<template>
  <div class="container">{{ home }}</div>
</template>
<script setup lang="ts">
import { ref } from "vue";

const home: any = ref("Home");
</script>
<style lang="scss">
.container {
  width: 100%;
  height: 100vh;
  font-size: 50px;
  font-weight: bold;
  text-align: center;
}
</style>
