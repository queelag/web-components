import { copyFile } from 'fs/promises'
import { glob } from 'glob'

for (let dts of await glob('dist/elements/**/*.d.ts')) {
  await copyFile(dts, dts.replace('.d.ts', '.d.cts'))
}
