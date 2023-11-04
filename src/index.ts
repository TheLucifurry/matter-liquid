import GlobalLiquid from './global/global'

const MatterLiquid = {
  name: PKG_NAME,
  version: PKG_VERSION,
  for: 'matter-js@0.17.1',
  install(matter: any) {
    matter.Liquid = GlobalLiquid
  },
} as Matter.Plugin

Matter.Plugin.register(MatterLiquid)
