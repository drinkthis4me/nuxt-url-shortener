<script setup lang="ts">

</script>

<template>
  <div class="relative">
    <div class="absolute inset-x-0 top-0 -z-10 overflow-x-clip">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-60 animate-blob" />
      <div class="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-60 animate-blob animation-delay-2000" />
      <div class="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-60 animate-blob animation-delay-4000" />
    </div>

    <UPageHero
      title="Shorten Your Link With Magic"
      :ui="{
        container: 'py-12 pb-12 sm:pb-12 sm:pt-24 lg:pb-12 lg:pt-32',
        title: 'text-3xl sm:text-5xl ',
      }"
    />

    <div class="mx-auto w-full sm:w-xl lg:w-2xl">
      <FormCreateShortLink />
    </div>

    <div>
      <AppSectionFeatures />
    </div>
  </div>
</template>

<style scoped>
@keyframes gradient-blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}

.animate-blob {
  animation: gradient-blob 5s infinite;
}

.animation-delay-2000 { animation-delay: 2s; }
.animation-delay-4000 { animation-delay: 4s; }
</style>
