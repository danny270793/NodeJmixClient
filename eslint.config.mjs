import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'

export default [
    { files: ['**/*.{js,mjs,cjs,ts}'] },
    { languageOptions: { globals: globals.node } },
    pluginJs.configs.recommended,
    { ignores: ['build/*', 'node_modules/*', 'docs/*', 'logs/*'] },
    ...tseslint.configs.recommended,
]
