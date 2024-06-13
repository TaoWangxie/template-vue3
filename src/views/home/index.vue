<template>
  <div class="container">{{ home }}</div>
</template>
<script setup lang="ts">
import { ref } from "vue";

const home: any = ref("home");
</script>
<style lang="scss">
.container {
  width: 100%;
  height: 100vh;
}
</style>
