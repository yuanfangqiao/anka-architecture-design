<script setup lang="ts">
import type { IconName } from './scene'

defineProps<{ name: IconName }>()
</script>

<template>
  <g class="scene-icon" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <template v-if="name === 'user'">
      <circle cx="8" cy="4" r="2.5" />
      <path d="M3 14v-1.5a5 5 0 0 1 10 0V14M1 15h14" />
    </template>
    <template v-else-if="name === 'window'">
      <rect x="1.5" y="2.5" width="13" height="11" rx="2" />
      <path d="M1.5 6h13M4 4.2h.1M6.5 4.2h.1M5 9l2 2-2 2M9 13h3" />
    </template>
    <template v-else-if="name === 'api'">
      <path d="M5 2 2 8l3 6M11 2l3 6-3 6M9 3 7 13" />
    </template>
    <template v-else-if="name === 'kernel'">
      <rect x="3" y="3" width="10" height="10" rx="2" />
      <path d="M6 1v2M10 1v2M6 13v2M10 13v2M1 6h2M1 10h2M13 6h2M13 10h2M6 6h4v4H6z" />
    </template>
    <template v-else-if="name === 'agent'">
      <circle cx="8" cy="8" r="3" />
      <circle cx="8" cy="1.5" r="1" /><circle cx="14.5" cy="8" r="1" />
      <circle cx="8" cy="14.5" r="1" /><circle cx="1.5" cy="8" r="1" />
      <path d="M8 2.5v2.5M11 8h2.5M8 11v2.5M5 8H2.5" />
    </template>
    <template v-else-if="name === 'model'">
      <rect x="2" y="3" width="12" height="10" rx="3" />
      <path d="M5 1v2M11 1v2M5 13v2M11 13v2M5 7h.1M11 7h.1M5.5 10h5" />
    </template>
    <template v-else-if="name === 'tools'">
      <path d="M9.5 2.5a4 4 0 0 0-5 5L1.5 12a2 2 0 0 0 2.5 2.5l4.5-3a4 4 0 0 0 5-5l-2.5 2-2-2z" />
      <path d="m10 11 4 4" />
    </template>
    <template v-else-if="name === 'apps'">
      <rect x="1.5" y="1.5" width="5" height="5" rx="1" />
      <rect x="9.5" y="1.5" width="5" height="5" rx="1" />
      <rect x="1.5" y="9.5" width="5" height="5" rx="1" />
      <path d="M12 9.5v5M9.5 12h5" />
    </template>
    <template v-else-if="name === 'runtime'">
      <path d="m8 1.5 6.5 3.5L8 8.5 1.5 5zM1.5 8 8 11.5 14.5 8M1.5 11 8 14.5 14.5 11" />
    </template>
    <template v-else>
      <ellipse cx="8" cy="3.5" rx="6" ry="2.5" />
      <path d="M2 3.5v9c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-9M2 8c0 1.4 2.7 2.5 6 2.5S14 9.4 14 8" />
    </template>
  </g>
</template>
