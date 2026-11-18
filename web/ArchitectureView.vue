<script setup lang="ts">
import ArchitectureStage from './ArchitectureStage.vue'
import { SCENE_STEPS } from './scene'
import { useScenePlayer } from './useScenePlayer'
import type { UiCtx } from './types'
import './architecture.css'

const props = defineProps<{ uiCtx: UiCtx }>()
const { Check, ChevronLeft, ChevronRight, CircleGauge, Network, Pause, Play, RotateCcw, Sparkles } = props.uiCtx.icons

const { current, step, playing, clock, viewBox, go, previous, next, toggle, replay } = useScenePlayer(SCENE_STEPS)
</script>

<template>
  <div class="architecture-view">
    <header class="architecture-intro">
      <div class="architecture-brand">
        <span class="architecture-logo"><Network :size="23" /></span>
        <div>
          <p class="architecture-eyebrow">ANKA / ARCHITECTURE</p>
          <h1>一个指令，如何成为一次行动？</h1>
          <p class="architecture-subtitle">六步看懂插件化 Agent 操作系统，从界面入口到行动闭环。</p>
        </div>
      </div>
      <div class="architecture-badges">
        <span><CircleGauge :size="13" />2.5D SVG</span>
        <span><Sparkles :size="13" />交互导览</span>
      </div>
    </header>

    <nav class="mobile-stepper" aria-label="架构导览步骤">
      <button v-for="(item, index) in SCENE_STEPS" :key="item.short" :class="{ active: current === index }" @click="go(index)">
        <span>0{{ index + 1 }}</span>{{ item.short }}
      </button>
    </nav>

    <div class="architecture-workspace">
      <aside class="step-sidebar">
        <p class="panel-kicker">系统导览 <span>6 步</span></p>
        <button
          v-for="(item, index) in SCENE_STEPS"
          :key="item.short"
          class="step-nav-item"
          :class="{ active: current === index, complete: current > index }"
          @click="go(index)"
        >
          <span class="step-number"><Check v-if="current > index" :size="12" /><template v-else>0{{ index + 1 }}</template></span>
          <span><strong>{{ item.short }}</strong><small>{{ item.title }}</small></span>
        </button>
        <div class="sidebar-note">
          <span class="live-dot" />
          <p>核心单元<strong>插件</strong></p>
          <p>交付形态<strong>AgentOS · PWA</strong></p>
        </div>
      </aside>

      <section class="scene-column" aria-label="动态架构演示">
        <div class="scene-toolbar">
          <div class="scene-metrics">
            <span v-for="metric in step.metrics" :key="metric.label">
              <small>{{ metric.label }}</small><strong>{{ metric.value }}</strong>
            </span>
          </div>
          <div class="scene-controls">
            <button aria-label="重播当前步骤" title="重播 (R)" @click="replay"><RotateCcw :size="15" /><span>重播</span></button>
            <button class="play-control" :aria-label="playing ? '暂停动画' : '播放动画'" :title="playing ? '暂停 (Space)' : '播放 (Space)'" @click="toggle">
              <Pause v-if="playing" :size="15" /><Play v-else :size="15" />
              <span>{{ playing ? '暂停' : '播放' }}</span>
            </button>
          </div>
        </div>
        <ArchitectureStage :step="step" :view-box="viewBox" :clock="clock" />
        <div class="scene-timeline" :style="{ '--step-progress': `${((current + 1) / SCENE_STEPS.length) * 100}%` }">
          <button
            v-for="(item, index) in SCENE_STEPS"
            :key="item.short"
            :class="{ active: current === index }"
            :aria-label="`第 ${index + 1} 步：${item.title}`"
            @click="go(index)"
          ><span />{{ item.short }}</button>
        </div>
      </section>

      <aside class="step-guide" aria-live="polite">
        <div :key="current" class="guide-content">
          <p class="guide-eyebrow">{{ step.eyebrow }}</p>
          <span class="guide-step-count">第 {{ current + 1 }} / {{ SCENE_STEPS.length }} 步</span>
          <h2>{{ step.title }}</h2>
          <p v-for="paragraph in step.body" :key="paragraph" class="guide-paragraph">{{ paragraph }}</p>
          <div class="guide-changes">
            <p>本步变化</p>
            <span v-for="change in step.changes" :key="change"><Check :size="13" />{{ change }}</span>
          </div>
        </div>
        <div class="guide-actions">
          <button :disabled="current === 0" @click="previous"><ChevronLeft :size="16" />上一步</button>
          <button v-if="current < SCENE_STEPS.length - 1" class="next-step" @click="next">下一步<ChevronRight :size="16" /></button>
          <button v-else class="next-step" @click="go(0)">重新导览<RotateCcw :size="15" /></button>
        </div>
      </aside>
    </div>

    <footer class="architecture-footer">
      <span>原生 SVG · 无 WebGL 依赖 · 数据驱动场景</span>
      <span><kbd>Space</kbd> 播放 <kbd>←</kbd><kbd>→</kbd> 切换 <kbd>R</kbd> 重播</span>
    </footer>
  </div>
</template>
