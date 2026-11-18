import { computed, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'
import type { Camera, SceneStep } from './scene'

function cameraValue(camera: Camera): string {
  return `${camera.x.toFixed(2)} ${camera.y.toFixed(2)} ${camera.w.toFixed(2)} ${camera.h.toFixed(2)}`
}

export function useScenePlayer(steps: SceneStep[]) {
  const current = ref(0)
  const playing = ref(false)
  const clock = ref(0)
  const viewBox = ref(cameraValue(steps[0].camera))
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  let frame = 0
  let last = 0
  let cameraFrom: Camera = { ...steps[0].camera }
  let cameraStarted = 0

  const step = computed(() => steps[current.value])

  function schedule() {
    if (!frame && !document.hidden) {
      last = performance.now()
      frame = requestAnimationFrame(tick)
    }
  }

  function tick(now: number) {
    frame = 0
    const delta = Math.min(50, now - last) / 1000
    last = now
    if (playing.value) clock.value += delta
    if (cameraStarted) {
      const progress = Math.min(1, (now - cameraStarted) / 620)
      const eased = 1 - Math.pow(1 - progress, 3)
      const target = step.value.camera
      const value = (key: keyof Camera) => cameraFrom[key] + (target[key] - cameraFrom[key]) * eased
      viewBox.value = cameraValue({ x: value('x'), y: value('y'), w: value('w'), h: value('h') })
      if (progress === 1) cameraStarted = 0
    }
    if (playing.value || cameraStarted) schedule()
  }

  function animateCamera() {
    if (reducedMotion.matches) {
      viewBox.value = cameraValue(step.value.camera)
      cameraStarted = 0
      return
    }
    const [x, y, w, h] = viewBox.value.split(' ').map(Number)
    cameraFrom = { x, y, w, h }
    cameraStarted = performance.now()
    schedule()
  }

  function go(index: number) {
    current.value = Math.max(0, Math.min(steps.length - 1, index))
  }

  function previous() {
    go(current.value - 1)
  }

  function next() {
    go(current.value + 1)
  }

  function toggle() {
    if (reducedMotion.matches) return
    playing.value = !playing.value
    if (playing.value) schedule()
  }

  function replay() {
    clock.value = 0
    if (!reducedMotion.matches) {
      playing.value = true
      schedule()
    }
  }

  function onKeydown(event: KeyboardEvent) {
    const target = event.target as HTMLElement | null
    if (target?.matches('input, textarea, select, [contenteditable="true"]')) return
    if (event.code === 'Space') {
      event.preventDefault()
      toggle()
    } else if (event.key === 'ArrowLeft') previous()
    else if (event.key === 'ArrowRight') next()
    else if (event.key.toLowerCase() === 'r') replay()
  }

  function onVisibility() {
    if (document.hidden && frame) {
      cancelAnimationFrame(frame)
      frame = 0
    } else if (!document.hidden) schedule()
  }

  function onMotionChange() {
    if (reducedMotion.matches) {
      playing.value = false
      viewBox.value = cameraValue(step.value.camera)
      cameraStarted = 0
    }
  }

  watch(current, () => {
    clock.value = 0
    animateCamera()
  })

  onMounted(() => {
    playing.value = !reducedMotion.matches
    window.addEventListener('keydown', onKeydown)
    document.addEventListener('visibilitychange', onVisibility)
    reducedMotion.addEventListener('change', onMotionChange)
    schedule()
  })

  onBeforeUnmount(() => {
    cancelAnimationFrame(frame)
    window.removeEventListener('keydown', onKeydown)
    document.removeEventListener('visibilitychange', onVisibility)
    reducedMotion.removeEventListener('change', onMotionChange)
  })

  return { current, step, playing, clock, viewBox, go, previous, next, toggle, replay }
}

export type ScenePlayer = ReturnType<typeof useScenePlayer>
export type SceneClock = Ref<number>
