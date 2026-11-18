"""
架构导览插件后端：ArchitectureService（Service 类，provide=['anka-architecture-design']）

页面完全由前端 SVG 场景渲染，没有业务数据；后端只保留一个空 snapshot，
让插件满足「app 类插件必须有后端入口」的安装契约。
"""

from app.cordis import Service

name = 'anka-architecture-design'
provide = ['anka-architecture-design']


class ArchitectureService(Service):
    def __init__(self, ctx):
        super().__init__(ctx, name)

    def snapshot(self) -> dict:
        return {}
