/**
 * uiCtx 类型契约（插件侧最小声明）
 *
 * 插件是自包含目录，不能跨目录 import 宿主源码，
 * 故自带这份与内核 web/src/registry/uiCtx.ts 对齐的类型声明。
 */
import type * as Vue from 'vue'
import type { Component } from 'vue'

export interface AppMeta {
  id: string
  title: string
  icon: string
  route: string
  order: number
  component: Component
  system?: boolean
  inDock?: boolean
  fullscreen?: boolean
}

export interface UiCtx {
  vue: typeof Vue
  icons: Record<string, Component>
  registerApp: (meta: AppMeta) => void
}
