import copier from 'rollup-plugin-copier';
import cssdiscard from 'postcss-discard-comments';
import cssimport from 'postcss-import';
import cssprefixer from 'autoprefixer';
import cssurl from 'postcss-url';
import path from 'path';
import postcss from 'rollup-plugin-postcss';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';


const devel = () => [
    'dev', 'devel', 'development'
].includes(process.env.BUILD);

const NODE_M = path.normalize(path.join(
  __dirname, 'node_modules',
));
const SOURCES = path.normalize(path.join(
  __dirname, '_assets',
));
const ASSETS = path.normalize(path.join(
  __dirname, 'assets',
));
const STATIC = path.normalize(path.join(
  __dirname, 'static',
));

const assetStyle = () => {
  return {
    input: path.join(SOURCES, '_style.css'),
    output: {
      file: path.join(ASSETS, 'style.css'),
      format: 'system',
    },
    plugins: [
      postcss({
        plugins: [
          cssimport(),
          cssurl({
            url: 'copy',
            assetsPath: path.join(STATIC, 'assets', 'fonts'),
            useHash: true,
          }),
          cssurl({
            url: (asset) => path.relative(
              STATIC, path.join(NODE_M, asset.url)
            ),
          }),
          cssprefixer(),
          cssdiscard({
            removeAll: true,
          }),
        ],
        extract: true,
        minimize: !devel(),
        sourceMap: (devel() ? 'inline' : false),
      }),
      copier({
        items: [{
          src: path.join(NODE_M, 'purecss', 'LICENSE'),
          dest: path.join(STATIC, 'assets', 'license-purecss'),
        }, {
          src: path.join(NODE_M, 'source-code-pro', 'LICENSE.md'),
          dest: path.join(STATIC, 'assets', 'license-source-code-pro.md'),
        }, {
          src: path.join(NODE_M, 'source-sans-pro', 'LICENSE.md'),
          dest: path.join(STATIC, 'assets', 'license-source-sans-pro.md'),
        }, {
          src: path.join(NODE_M, 'source-serif-pro', 'LICENSE.md'),
          dest: path.join(STATIC, 'assets', 'license-source-serif-pro.md'),
        }],
      }),
    ],
  };
};


const assetScript = () => {
  return {
    input: path.join(SOURCES, '_script.ts'),
    output: {
      file: path.join(ASSETS, 'script.js'),
      format: 'iife',
    },
    plugins: [
      typescript(),
      (devel() ? null : terser()),
    ],
  };
};


export default [
  assetStyle(),
  assetScript(),
];
