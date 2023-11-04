import Package from '../package.json'
import GlobalLiquid from './global/global'

const MatterLiquid = {
  name: Package.name,
  version: Package.version,
  for: 'matter-js@0.17.1',
  // uses: [],
  // options: {
  //   something: true,
  // },
  install(matter: any) {
    matter.Liquid = GlobalLiquid
  },
}

// @ts-expect-error Hard type flow
Matter.Plugin.register(MatterLiquid)
