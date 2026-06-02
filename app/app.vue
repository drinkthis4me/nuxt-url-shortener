<script setup lang="ts">
const { data } = useFetch('/api/hello')
</script>

<template>
  <div>
    Hello
    <pre>{{ data }}</pre>
    <button @click="navigateTo('/redirect')">Redirect</button>
  </div>
</template>
