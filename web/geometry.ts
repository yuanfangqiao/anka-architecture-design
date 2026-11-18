import { LINKS, NODES, type SceneLink } from './scene'

export interface Point {
  x: number
  y: number
}

export function project(x: number, y: number, z = 0): Point {
  return { x: 380 + 15 * (x - y), y: 150 + 7.5 * (x + y) - z }
}

export const NODE_POINTS = Object.fromEntries(
  NODES.map(node => [node.id, project(node.x, node.y)]),
) as Record<string, Point>

export const LINK_BY_ID = Object.fromEntries(
  LINKS.map(link => [link.id, link]),
) as Record<string, SceneLink>

function curve(link: SceneLink) {
  const start = NODE_POINTS[link.from]
  const end = NODE_POINTS[link.to]
  const distance = Math.hypot(end.x - start.x, end.y - start.y)
  const direction = link.id === 'app-api' || link.id === 'app-data' ? 1 : -1
  return {
    start,
    end,
    control: {
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2 + direction * Math.min(34, distance * 0.16),
    },
  }
}

export function pathForLink(link: SceneLink): string {
  const { start, control, end } = curve(link)
  return `M ${start.x} ${start.y} Q ${control.x} ${control.y} ${end.x} ${end.y}`
}

export function pointOnLink(link: SceneLink, progress: number): Point {
  const { start, control, end } = curve(link)
  const t = Math.max(0, Math.min(1, progress))
  const inverse = 1 - t
  return {
    x: inverse * inverse * start.x + 2 * inverse * t * control.x + t * t * end.x,
    y: inverse * inverse * start.y + 2 * inverse * t * control.y + t * t * end.y,
  }
}

export function labelPoint(link: SceneLink): Point {
  return pointOnLink(link, 0.5)
}
