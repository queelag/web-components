import { writeFile } from 'fs/promises'
import { glob } from 'glob'
import PACKAGE from '../package.json' assert { type: 'json' }

PACKAGE.exports = {}

for (let path of await glob('src/elements/**/*.ts')) {
  let folder, name

  folder = path.replace('src/elements/', '').split('/')[0]
  name = path.replace('src/elements/').split('/')[1].replace('.ts', '')

  PACKAGE.exports[`./elements/${folder}/${name}.js`] = {
    import: `./elements/${folder}/${name}.js`,
    require: {
      default: `./elements/${folder}/${name}.cjs`,
      types: `./elements/${folder}/${name}.d.ts`
    }
  }
}

await writeFile('package.json', JSON.stringify(PACKAGE, null, 2))
