import path from 'path'

export function getTestSpecName(pathName) {
  const baseName = path.basename(pathName)
  const endIndex = baseName.indexOf('.spec.js')
  return baseName.substr(0, endIndex)
}
