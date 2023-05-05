import { writeFile } from 'fs/promises'
import { glob } from 'glob'
import PACKAGE from '../package.json' assert { type: 'json' }

PACKAGE.exports = {
  '.': {
    import: './index.js',
    require: {
      default: './index.cjs.js',
      types: './index.d.ts'
    }
  }
}

for (let path of await glob('src/elements/**/*.ts')) {
  let folder, name

  folder = path.replace('src/elements/', '').split('/')[0]
  name = path.replace('src/elements/').split('/')[1].replace('.ts', '')

  PACKAGE.exports[`./elements/${folder}/${name}.js`] = {
    import: `./elements/${folder}/${name}.js`,
    require: {
      default: `./elements/${folder}/${name}.cjs.js`,
      types: `./elements/${folder}/${name}.d.ts`
    }
  }
}

await writeFile('package.json', JSON.stringify(PACKAGE, null, 2))
