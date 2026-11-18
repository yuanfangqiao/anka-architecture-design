<script setup lang="ts">
import { computed } from 'vue'
import SceneIcon from './SceneIcon.vue'
import type { SceneNode } from './scene'
import type { Point } from './geometry'

const props = defineProps<{
  node: SceneNode
  point: Point
  visible: boolean
  active: boolean
}>()

const transform = computed(() => `translate(${props.point.x} ${props.point.y})`)
</script>

<template>
  <g
    class="scene-node"
    :class="{ 'is-visible': visible, 'is-active': active, 'is-dim': !active }"
    :data-tone="node.tone"
    :transform="transform"
    :aria-hidden="!visible"
  >
    <g class="node-enter">
      <ellipse class="node-shadow" cx="0" cy="52" rx="43" ry="12" />
      <template v-if="node.shape === 'database'">
        <path class="node-side" d="M-38-12v37c0 8 17 14 38 14s38-6 38-14v-37z" />
        <ellipse class="node-top" cx="0" cy="-12" rx="38" ry="14" />
        <path class="node-edge" d="M-38 12c0 8 17 14 38 14s38-6 38-14" />
        <g transform="translate(-8 -19)"><SceneIcon :name="node.icon" /></g>
        <text class="node-label" text-anchor="middle" y="12">{{ node.label }}</text>
        <text class="node-sub" text-anchor="middle" y="29">{{ node.sub }}</text>
      </template>
      <template v-else>
        <path class="node-left" d="M-46 0 0 22v30l-38-15q-8-3-8-11z" />
        <path class="node-right" d="M0 22 46 0v26q0 8-8 11L0 52z" />
        <path class="node-top" d="M0-34 38-20q8 3 8 11v9L0 22-46 0v-9q0-8 8-11z" />
        <g transform="translate(-8 -22)"><SceneIcon :name="node.icon" /></g>
        <text class="node-label" text-anchor="middle" y="8">{{ node.label }}</text>
        <text class="node-sub" text-anchor="middle" y="39">{{ node.sub }}</text>
      </template>
    </g>
  </g>
</template>
