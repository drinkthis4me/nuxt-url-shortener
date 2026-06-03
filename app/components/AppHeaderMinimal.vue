<template>
  <UHeader
    title="URL shortener"
    :toggle="false"
    :ui="{
      root: 'bg-default/75 backdrop-blur border-b border-default h-(--ui-header-height) z-50',
    }"
    class="bg-transparent border-none backdrop-blur-none"
  >
    <template #title>
      <div class="text-primary">
        URL Shortener
      </div>
    </template>
  </UHeader>
</template>
