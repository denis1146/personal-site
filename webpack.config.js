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
  const isProdMode = !isDevMode;

  const PATHS = {
    src: path.resolve(__dirname, 'src'),
    dist: path.resolve(__dirname, 'dist'),
    assets: path.resolve(__dirname, 'src/assets'),
  }

  const SEPARATOR = '/';
  const addExt = ext => ext ? (ext.startsWith('.') ? ext : `.${ext}`) : '[ext]';
  const generatorName = (name, ext) => isDevMode ? `${name}${addExt(ext)}` : `${name}.[contenthash].bundle${addExt(ext)}`;
  const generatorBaseName = ext => isDevMode ? `[name]${addExt(ext)}` : `[name].[contenthash].bundle${addExt(ext)}`;
  const filename = (ext, path) => {
    path = path ? (path.endsWith(SEPARATOR) ? path : `${path}${SEPARATOR}`) : `[path]${SEPARATOR}`;
    return `${path}${generatorBaseName(ext)}`;
  }

  const cssLoaders = extra => {
    const loaders = [
      env.WEBPACK_SERVE ? 'style-loader' :
      {
        loader: MiniCssExtractPlugin.loader,
      },
      'css-loader',
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: true,
          postcssOptions: {
            path: `./postcss.config.js`,
          },
        },
      },
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
      {
        test: /\.js$/i,
        loader: 'babel-loader',
        exclude: '/node_modules',
      },
    ]
  }

  const plugins = () => {
    const miniCss = env.WEBPACK_SERVE ? [] : [
      new MiniCssExtractPlugin({
        filename: `assets/css/${generatorName('styles', 'css')}`,
      }),
    ]

    return [
      new HtmlWebpackPlugin({
        template: `${PATHS.src}/index.html`,
        filename: 'index.html',
        inject: true,
        minify: isProdMode,
      }),
      ...miniCss,
    ]
  }

  const optimization = () => {
    const config = {
      splitChunks: {
        cacheGroups: {
          vendor: {
            name: 'vendors',
            test: /node_modules/,
            chunks: 'all',
            enforce: true,
          }
        },
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
      context: PATHS.src, //    ./myFile.cpp
      entry: {
        main: {
          import: [
            './index.js',
          ],
        }
      },
      output: {
        filename: filename('bundle.js', './'),
        path: PATHS.dist,
        assetModuleFilename: `assets/other/${generatorBaseName()}`,
        clean: true,
      },
      resolve: {
        extensions: ['ts', '...'],
        alias: {
          'src': PATHS.src,       //    src/myFile.cpp
          '~': PATHS.src,
          Utilities: `${PATHS.src}/utilities/`,
          Templates: `${PATHS.src}/templates/`,
        }
      },
      optimization: optimization(),
      devServer: {
        port: 4004,
        hot: false,
        liveReload: true,
        client: {
          overlay: {
            errors: true,
            warnings: true,
          },
        },
      },
      watchOptions: {
        ignored: /node_modules/,
      },
      devtool: isDevMode ? 'eval' : 'source-map',
      module: {
        rules: moduleRules()
      },
      plugins: plugins(),
    },
  ];
};
