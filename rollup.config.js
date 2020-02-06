import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/index.js',
        format: 'esm'
    },
    plugins: [
        babel({
            exclude: 'node_modules/**'
        }),
        resolve({
            customResolveOptions: {
                moduleDirectory: 'node_modules'
            }
        })
    ],
    external: ['axios']
};