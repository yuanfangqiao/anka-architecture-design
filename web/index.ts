import ArchitectureView from './ArchitectureView.vue'
import type { UiCtx } from './types'

export function setup(uiCtx: UiCtx): void {
  const { defineComponent, h } = uiCtx.vue

  const ArchitectureApp = defineComponent({
    name: 'ArchitectureApp',
    setup: () => () => h(ArchitectureView, { uiCtx }),
  })

  uiCtx.registerApp({
    id: 'anka-architecture-design',
    title: '架构',
    icon: 'waypoints',
    route: '/architecture',
    order: 1,
    inDock: true,
    fullscreen: true,
    component: ArchitectureApp,
  })
}
