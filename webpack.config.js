module.exports = (env, argv) => {
  console.log('==============================================================================');
  console.log('Webpack CLI environment variables:');
  console.log(env);
  console.log();
  console.log('Variables:');
  console.log(argv);
  console.log('==============================================================================');

  // const webpack = require('webpack');
  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin');
// const TerserWebpackPlugin = require('terser-webpack-plugin');

  const isDevMode = argv.mode === 'development';
  const isProdMode =  !isDevMode;

  const PATHS = {
    src: path.resolve(__dirname, 'src'),
    dist: path.resolve(__dirname, 'dist'),
  }

  const SEPARATOR = '/';
  const addExt = ext => ext ? (ext.startsWith('.') ? ext : `.${ext}`) : '[ext]';
  const generatorName =  (name, ext) => isDevMode ? `${name}${addExt(ext)}` : `${name}.[contenthash].bundle${addExt(ext)}`;
  const generatorBaseName =  ext => isDevMode ? `[name]${addExt(ext)}` : `[name].[contenthash].bundle${addExt(ext)}`;
  const filename = (ext, path) => {
    path = path ? (path.endsWith(SEPARATOR) ? path : `${path}${SEPARATOR}`) : `[path]${SEPARATOR}`;
    return `${path}${generatorBaseName(ext)}`;
  }

  const cssLoaders = extra => {
    const loaders = [
      // isDevMode ? 'style-loader' :
      {
        loader: MiniCssExtractPlugin.loader,
        // options: {
        //   hmr: isDevMode,
        //   reloadAll: true
        // },
      },
      'css-loader',
      //'postcss-loader',
    ];

    if (extra) {
      loaders.push(extra);
    }

    return loaders;
  }

  const moduleRules = () => {
    return [
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.css$/i,
        use: cssLoaders(),
        resourceQuery: { not: [/move/, /resource/, /raw/] },
      },
      {
        test: /\.s[ac]ss$/i,
        use: cssLoaders('sass-loader'),
        resourceQuery: { not: [/move/, /resource/, /raw/] },
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|ico)$/i,
        type: 'asset/resource',
        resourceQuery: { not: [/move/, /resource/, /raw/] },
        generator: {
          filename: filename(),
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        resourceQuery: { not: [/move/, /resource/, /raw/] },
        generator: {
          filename: filename(),
        },
      },
      {
        resourceQuery: /move/,
        type: 'asset/resource',
        generator: {
          filename: filename(),
        },
      },
      {
        resourceQuery: /resource/,
        type: 'asset/resource',
      },
      {
        resourceQuery: /raw/,
        type: 'asset/source',
      },
    ]
  }

  const plugins = () => {
    return [
      // new webpack.SourceMapDevToolPlugin({filename: '[file].map'}), --- only dev
      new HtmlWebpackPlugin({
        template: './index.html',
        filename: 'index.html',
        minify: isProdMode,
      }),
      new MiniCssExtractPlugin({
        filename: `css/${generatorName('styles', 'css')}`,
      }),
    ]
  }

  const optimization = () => {
    const config = {
      // runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
      },
    }

    // if (isProdMode) {
    //   config.minimizer = [
    //     new OptimizeCssAssetWebpackPlugin(),
    //     new TerserWebpackPlugin()
    //   ]
    // }

    return config;
  }

  return [
    {
      name: 'main',
      target: 'browserslist',
      mode: 'production',
      // mode: argv.mode,
      context: PATHS.src, //    ./myFile.cpp
      entry: {
        main: {
          import: [
            './index.js',
          ],
        }
      },
      output: {
        path: PATHS.dist,
        filename: filename('bundle.js', './'),
        assetModuleFilename: `resources/${generatorBaseName()}`,
        clean: true,
      },
      resolve: {
        extensions: ['ts', '...'],
        alias: {
          'src': path.resolve(__dirname, 'src'),  //    src/myFile.cpp
          Utilities: path.resolve(__dirname, 'src/utilities/'),
          Templates: path.resolve(__dirname, 'src/templates/'),
        }
      },
      optimization: optimization(),
      devServer: {
        port: 4004,
        hot: isDevMode,
        // overlay: {
        //   warnings: false,
        //   errors: true,
        // },
      },
      watchOptions: {
        ignored: /node_modules/,
      },
      devtool: isDevMode ? 'source-map' : 'eval',
      module: {
        rules: moduleRules()
      },
      plugins: plugins(),
    },
  ];
};
