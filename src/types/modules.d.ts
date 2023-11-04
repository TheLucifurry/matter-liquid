interface TModuleShader {
  consts: any
  sourceCode: string
  uniforms: {
    [name: string]: { variableName: string; variableType: string }
  }
}
declare module '*.vert' {
  const value: TModuleShader
  export default value
}
declare module '*.frag' {
  const value: TModuleShader
  export default value
}
