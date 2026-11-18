<script setup lang="ts">
import { computed } from 'vue'
import SceneNodeView from './SceneNode.vue'
import { LINKS, NODES, type SceneFlow, type SceneLink, type SceneStep } from './scene'
import { labelPoint, LINK_BY_ID, NODE_POINTS, pathForLink, pointOnLink } from './geometry'

const props = defineProps<{
  step: SceneStep
  viewBox: string
  clock: number
}>()

const visibleNodes = computed(() => new Set(props.step.visible))
const activeFlows = computed(() => new Set(props.step.flows.map(flow => flow.link)))

function linkVisible(link: SceneLink) {
  return visibleNodes.value.has(link.from) && visibleNodes.value.has(link.to)
}

function packetTransform(flow: SceneFlow, index: number) {
  const progress = (props.clock * 0.32 + index * 0.173) % 1
  const point = pointOnLink(LINK_BY_ID[flow.link], flow.reverse ? 1 - progress : progress)
  return `translate(${point.x.toFixed(2)} ${point.y.toFixed(2)})`
}

function labelWidth(link: SceneLink) {
  return Array.from(link.label ?? '').length * 10 + 16
}
</script>

<template>
  <div class="architecture-stage">
    <svg
      class="stage-svg"
      :viewBox="viewBox"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      :aria-label="`Anka 架构图：${step.title}`"
    >
      <defs>
        <radialGradient id="stage-glow">
          <stop offset="0" stop-color="var(--primary)" stop-opacity=".12" />
          <stop offset=".7" stop-color="var(--cyan)" stop-opacity=".025" />
          <stop offset="1" stop-color="var(--bg-0)" stop-opacity="0" />
        </radialGradient>
        <pattern id="iso-grid" width="40" height="20" patternUnits="userSpaceOnUse">
          <path d="M0 10 20 0 40 10 20 20Z" fill="none" stroke="currentColor" stroke-width=".65" />
        </pattern>
        <radialGradient id="grid-fade">
          <stop offset="0" stop-color="white" stop-opacity=".9" />
          <stop offset="1" stop-color="white" stop-opacity="0" />
        </radialGradient>
        <mask id="grid-mask">
          <rect x="-1000" y="-1000" width="3000" height="2000" fill="url(#grid-fade)" />
        </mask>
        <filter id="packet-glow" x="-200%" y="-200%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <marker id="stage-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M1 1 9 5 1 9Z" fill="context-stroke" />
        </marker>
      </defs>

      <rect x="-1000" y="-1000" width="3000" height="2000" fill="url(#stage-glow)" />
      <rect class="stage-grid" x="-1000" y="-1000" width="3000" height="2000" fill="url(#iso-grid)" mask="url(#grid-mask)" />

      <g class="stage-links">
        <template v-for="link in LINKS" :key="link.id">
          <template v-if="linkVisible(link)">
            <path
              class="architecture-link"
              :class="{ 'is-active': activeFlows.has(link.id), 'is-dim': !activeFlows.has(link.id) }"
              :d="pathForLink(link)"
              :stroke-dasharray="link.dashed ? '5 6' : undefined"
              marker-end="url(#stage-arrow)"
            />
            <g v-if="link.label" class="link-label" :class="{ 'is-dim': !activeFlows.has(link.id) }" :transform="`translate(${labelPoint(link).x} ${labelPoint(link).y})`">
              <rect :x="-labelWidth(link) / 2" y="-9" :width="labelWidth(link)" height="17" rx="8.5" />
              <text text-anchor="middle" y="3">{{ link.label }}</text>
            </g>
          </template>
        </template>
      </g>

      <g class="stage-packets">
        <g
          v-for="(flow, index) in step.flows"
          :key="`${flow.link}-${flow.reverse}-${index}`"
          class="data-packet"
          :class="`packet-${flow.kind ?? (flow.reverse ? 'response' : 'request')}`"
          :transform="packetTransform(flow, index)"
          filter="url(#packet-glow)"
        >
          <circle class="packet-halo" r="7" />
          <circle class="packet-core" r="3.5" />
        </g>
      </g>

      <g class="stage-nodes">
        <SceneNodeView
          v-for="node in NODES"
          :key="node.id"
          :node="node"
          :point="NODE_POINTS[node.id]"
          :visible="step.visible.includes(node.id)"
          :active="step.active.includes(node.id)"
        />
      </g>
    </svg>
    <div class="stage-legend" aria-label="数据包图例">
      <span><i class="legend-request" />请求</span>
      <span><i class="legend-response" />响应</span>
      <span><i class="legend-tool" />工具调用</span>
      <span><i class="legend-event" />事件记录</span>
    </div>
  </div>
</template>
