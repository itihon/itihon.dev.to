import ignore from 'rollup-plugin-ignore';
import { cleandir } from "rollup-plugin-cleandir";
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
    input: [
        'validation/profiles/signin.js',
        'validation/profiles/signup.js',
    ],
    output: {
        format: 'esm',
        dir: 'public/bundles/',
        entryFileNames: '[name].js',
    },
    plugins: [
        ignore('../../repository.js'),
        nodeResolve(),
        cleandir('public/bundles'),
    ],
};