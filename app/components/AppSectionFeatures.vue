<script setup lang="ts">
const cards = [
  {
    title: 'Easy',
    description: 'URL Shortener is easy to use. Enter the long url and short link is one click away.',
    icon: 'i-lucide-mouse-pointer-click',
  },
  {
    title: 'Free',
    description: 'Free to use with or without an account.',
    icon: 'i-lucide-smile',
  },
  {
    title: 'Protected Link',
    description: 'Set a password for short link to limit who can see the content.',
    icon: 'i-lucide-lock',
  },
  {
    title: 'Expiration',
    description: 'Custom the expiration date for your links.',
    icon: 'i-lucide-calendar-days',
  },
  {
    title: 'Management',
    description: 'Sign up for free and take full control of your links. Organize, edit, delete, and more.',
    icon: 'i-lucide-monitor-check',
  },
  {
    title: 'Statistics',
    description: 'Track the number of clicks of your links.',
    icon: 'i-lucide-bar-chart-3',
  },
]
</script>

<template>
  <div class="py-16 px-8">
    <h1 class="text-3xl font-bold text-center">
      Why choose URL Shortener?
    </h1>

    <UPageGrid class="mt-8">
      <UPageCard
        v-for="(card, index) in cards"
        :key="index"
        v-bind="card"
      >
        <template #leading>
          <Icon
            :name="card.icon"
            size="2.5em"
            class="bg-primary"
          />
        </template>
      </UPageCard>
    </UPageGrid>
  </div>
</template>
