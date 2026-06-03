<template>
  <UApp>
    <UMain>
      <div class="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <UButton
          to="/"
          variant="solid"
          color="neutral"
          icon="i-lucide-arrow-left"
          class="fixed top-4 right-4 z-50"
        />

        <div class="flex flex-col justify-center items-end px-10 py-12 lg:px-24">
          <div class="max-w-md w-full mx-auto">
            <slot />
          </div>
        </div>

        <div class="hidden lg:flex items-center justify-center">
          <div class="relative w-full h-full p-20 flex items-center justify-start bg-linear-to-r from-violet-500 via-purple-500 to-pink-500">
            <NuxtImg
              src="https://picsum.photos/1600/900"
              fit="contain"
              class="max-w-lg w-full object-contain"
            />
          </div>
        </div>
      </div>
    </UMain>
  </UApp>
</template>
