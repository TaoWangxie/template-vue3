<template>
  <div class="container">{{ home }}</div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ceshi } from "@/api/demo";

onMounted(async ()=>{
  console.log(import.meta.env.VITE_APP_TITLE);
  console.log(import.meta.env.MODE);
  await ceshi()
})

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
