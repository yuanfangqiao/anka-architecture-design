export type Tone = 'blue' | 'cyan' | 'violet' | 'amber' | 'green' | 'rose'
export type IconName = 'user' | 'window' | 'api' | 'kernel' | 'agent' | 'model' | 'tools' | 'apps' | 'runtime' | 'database'

export interface SceneNode {
  id: string
  label: string
  sub: string
  icon: IconName
  tone: Tone
  x: number
  y: number
  shape?: 'prism' | 'database'
}

export interface SceneLink {
  id: string
  from: string
  to: string
  label?: string
  dashed?: boolean
}

export interface SceneFlow {
  link: string
  reverse?: boolean
  kind?: 'request' | 'response' | 'tool' | 'event'
}

export interface Camera {
  x: number
  y: number
  w: number
  h: number
}

export interface SceneStep {
  short: string
  eyebrow: string
  title: string
  body: string[]
  changes: string[]
  visible: string[]
  active: string[]
  flows: SceneFlow[]
  metrics: { label: string; value: string }[]
  camera: Camera
}

export const NODES: SceneNode[] = [
  { id: 'user', label: '用户指令', sub: '一句话开始', icon: 'user', tone: 'green', x: -10, y: 4 },
  { id: 'pwa', label: 'PWA 宿主', sub: 'Vue 3 · Dock', icon: 'window', tone: 'blue', x: -5, y: 2 },
  { id: 'api', label: 'FastAPI', sub: 'REST · SSE', icon: 'api', tone: 'blue', x: 0, y: 0 },
  { id: 'kernel', label: 'cordis 内核', sub: 'PluginManager', icon: 'kernel', tone: 'cyan', x: 4, y: -3 },
  { id: 'agent', label: 'Agent Loop', sub: 'reason · act', icon: 'agent', tone: 'cyan', x: 8, y: -5 },
  { id: 'llm', label: '模型适配', sub: 'llm-openai', icon: 'model', tone: 'violet', x: 10, y: -10 },
  { id: 'tools', label: '工具运行时', sub: 'tools-runtime', icon: 'tools', tone: 'amber', x: 11, y: 1 },
  { id: 'apps', label: 'App 插件', sub: '前后端一体', icon: 'apps', tone: 'green', x: -3, y: 8 },
  { id: 'runtime', label: '应用运行时', sub: '保活 · 分屏', icon: 'runtime', tone: 'blue', x: 2, y: 7 },
  { id: 'data', label: '持久层', sub: 'JSONL · SQLite', icon: 'database', tone: 'rose', x: 8, y: 8, shape: 'database' },
]

export const LINKS: SceneLink[] = [
  { id: 'ingress', from: 'user', to: 'pwa', label: '指令' },
  { id: 'rest', from: 'pwa', to: 'api', label: 'REST' },
  { id: 'dispatch', from: 'api', to: 'kernel', label: 'to_thread', dashed: true },
  { id: 'loop', from: 'kernel', to: 'agent', label: 'agents' },
  { id: 'model', from: 'agent', to: 'llm', label: 'stream' },
  { id: 'tools', from: 'agent', to: 'tools', label: 'tool_call' },
  { id: 'workspace', from: 'pwa', to: 'runtime', label: 'appId' },
  { id: 'plugin', from: 'runtime', to: 'apps', label: 'uiCtx' },
  { id: 'app-api', from: 'apps', to: 'api', label: '/api/apps', dashed: true },
  { id: 'events', from: 'agent', to: 'data', label: 'events' },
  { id: 'records', from: 'tools', to: 'data', label: 'tool_result' },
  { id: 'app-data', from: 'apps', to: 'data', label: 'SQLite', dashed: true },
]

export const SCENE_STEPS: SceneStep[] = [
  {
    short: '入口', eyebrow: '01 · 请求进入系统', title: '从一句话开始',
    body: ['你在对话或某个应用里提出目标。PWA 宿主负责窗口、Dock、草稿与交互，它不把 Agent 能力写死在页面里。', '指令经 REST 进入 FastAPI。前端交付形态可以更换，后端插件内核并不依赖这一块屏幕。'],
    changes: ['Vue 3 PWA 接收用户意图', 'FastAPI 提供统一 /api 边界'],
    visible: ['user', 'pwa', 'api'], active: ['user', 'pwa', 'api'],
    flows: [{ link: 'ingress' }, { link: 'rest' }],
    metrics: [{ label: '当前层', value: '体验层' }, { label: '活动连接', value: '2 条' }, { label: '协议', value: 'REST' }],
    camera: { x: 105, y: 55, w: 390, h: 260 },
  },
  {
    short: '内核', eyebrow: '02 · 调度与生命周期', title: '内核开始调度',
    body: ['FastAPI 把同步的 cordis 内核调用放进受控线程，并用锁串行化插件变更，避免阻塞异步服务。', 'PluginManager 根据 inject / provide 装配能力。Agent Loop 消费模型与工具服务，而不是自己实现所有能力。'],
    changes: ['cordis 管理插件生命周期', 'Agent Loop 组织推理与行动'],
    visible: ['user', 'pwa', 'api', 'kernel', 'agent'], active: ['api', 'kernel', 'agent'],
    flows: [{ link: 'rest' }, { link: 'dispatch' }, { link: 'loop' }],
    metrics: [{ label: '当前层', value: '内核层' }, { label: '装配方式', value: '拓扑排序' }, { label: '副作用', value: '可逆' }],
    camera: { x: 230, y: 70, w: 450, h: 285 },
  },
  {
    short: '能力', eyebrow: '03 · 模型与工具', title: '能力按需装配',
    body: ['llm-openai 把不同 OpenAI 兼容提供方接入同一个模型接口。流式文本和 tool_call 沿同一条 Agent 路径返回。', 'tools-runtime 注册 bash、网页操作和 Harness 工具。新增适配器或工具时，Agent Loop 不需要变成更大的巨石。'],
    changes: ['模型通过 Adapter 接入', '工具调用带护栏与执行结果'],
    visible: ['user', 'pwa', 'api', 'kernel', 'agent', 'llm', 'tools'], active: ['agent', 'llm', 'tools'],
    flows: [{ link: 'model' }, { link: 'model', reverse: true, kind: 'response' }, { link: 'tools', kind: 'tool' }, { link: 'tools', reverse: true, kind: 'event' }],
    metrics: [{ label: '当前层', value: '能力层' }, { label: '模型', value: '可替换' }, { label: '工具', value: '可注册' }],
    camera: { x: 360, y: 70, w: 430, h: 310 },
  },
  {
    short: '应用', eyebrow: '04 · 一切皆插件', title: '系统长出应用',
    body: ['应用插件把 manifest、Python 服务和 Vue 界面放在同一个文件夹。安装后，注册表与 Dock 自动获得新的入口。', 'ApplicationWorkspace 按 appId 保活窗口，运行时提供按需加载、独立路由、通信、分屏与嵌套。前端和后端因此共享同一种装配思想。'],
    changes: ['uiCtx 注册应用与路由', '应用切换保留窗口和运行状态'],
    visible: ['user', 'pwa', 'api', 'kernel', 'agent', 'llm', 'tools', 'apps', 'runtime'], active: ['pwa', 'runtime', 'apps'],
    flows: [{ link: 'workspace' }, { link: 'plugin' }, { link: 'app-api' }],
    metrics: [{ label: '当前层', value: '应用层' }, { label: '窗口', value: '按 appId 保活' }, { label: '入口', value: '注册表驱动' }],
    camera: { x: 125, y: 80, w: 480, h: 325 },
  },
  {
    short: '记忆', eyebrow: '05 · 事件与持久化', title: '过程成为记忆',
    body: ['一次行动不只是一段最终回答。文本增量、工具调用、结果和状态都形成可回看的过程，Run 在断连后仍可继续。', '会话使用 append-only JSONL，应用与系统数据按边界进入 SQLite 或文件目录。刷新、重放和恢复由此获得事实来源。'],
    changes: ['会话与工具过程持续记录', '数据按 system / apps / ai 分类'],
    visible: NODES.map(node => node.id), active: ['agent', 'tools', 'apps', 'data'],
    flows: [{ link: 'events', kind: 'event' }, { link: 'records', kind: 'tool' }, { link: 'app-data', kind: 'event' }],
    metrics: [{ label: '当前层', value: '持久层' }, { label: '会话', value: 'append-only' }, { label: '恢复', value: '事件重放' }],
    camera: { x: 245, y: 120, w: 440, h: 300 },
  },
  {
    short: '闭环', eyebrow: '06 · 完整行动路径', title: '行动完成闭环',
    body: ['现在把各层连起来：指令进入宿主，内核装配模型与工具，应用执行任务，事件持续写回界面和持久层。', '这就是 Anka 的核心：不是一个固定功能的聊天框，而是一个能让能力、应用与行动过程不断生长的 Agent 操作系统。'],
    changes: ['请求与响应沿同一路径闭环', '插件能力、应用和记忆协同生长'],
    visible: NODES.map(node => node.id), active: NODES.map(node => node.id),
    flows: [{ link: 'ingress' }, { link: 'rest' }, { link: 'dispatch' }, { link: 'loop' }, { link: 'model' }, { link: 'tools', kind: 'tool' }, { link: 'events', kind: 'event' }, { link: 'rest', reverse: true, kind: 'response' }, { link: 'ingress', reverse: true, kind: 'response' }],
    metrics: [{ label: '系统形态', value: 'AgentOS' }, { label: '核心单元', value: '插件' }, { label: '行动状态', value: '持续可见' }],
    camera: { x: 85, y: 45, w: 680, h: 385 },
  },
]
