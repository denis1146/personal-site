module.exports = (env, argv) => {
  console.log('==============================================================================');
  console.log('Webpack CLI environment variables:');
  console.log(env);
  console.log();
  console.log('Variables:');
  console.log(argv);
  console.log('==============================================================================');

  const path = require('path');
  const PugPlugin = require('pug-plugin');

  const isDevMode = argv.mode === 'development';

  const PATHS = {
    src: path.resolve(__dirname, 'src'),
    dist: path.resolve(__dirname, 'dist'),
    assets: 'assets',
    html: 'html',
    pug: 'pug',
    scripts: 'scripts',
    styles: 'styles',
    other: 'assets/other',
    games: 'html/games',
    pages: 'pug/pages',
  }

  const SUBPROJECTS_PATH = {
    subprojects: 'subprojects',
    games: 'subprojects/games',
    websites: 'subprojects/websites',
    controls: 'subprojects/controls',
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

  const babelOptions = preset => {
    const opts = {
      presets: [
        '@babel/preset-env'
      ],
    }

    if (preset) {
      opts.presets.push(preset)
    }

    return opts
  }

  const jsLoaders = () => {
    const loaders = [{
      loader: 'babel-loader',
      options: babelOptions(),
    }]

    return loaders
  }

  const tsLoaders = () => {
    if (isDevMode) {
      return {
        loader: 'ts-loader',
      }
    }

    return {
      loader: 'babel-loader',
      options: babelOptions('@babel/preset-typescript'),
    }
  }

  const resourceQueryRules = { not: [/move/, /resource/, /raw/] }
  const moduleRules = () => {
    return [
      {
        test: /\.html$/i,
        resourceQuery: resourceQueryRules,
        loader: 'html-loader',
      },
      {
        test: /\.pug$/i,
        loader: PugPlugin.loader,
      },
      {
        test: /\.css$/i,
        use: cssLoaders(),
        resourceQuery: resourceQueryRules,
      },
      {
        test: /\.s[ac]ss$/i,
        use: cssLoaders('sass-loader'),
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|ico)$/i,
        type: 'asset/resource',
        resourceQuery: resourceQueryRules,
        generator: {
          filename: filename(),
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        resourceQuery: resourceQueryRules,
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
        resourceQuery: /move-original/,
        type: 'asset/resource',
        generator: {
          filename: '[path][name][ext]',
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
        use: jsLoaders(),
        exclude: /node_modules/,
      },
      {
        test: /\.ts$/i,
        use: tsLoaders(),
        exclude: /node_modules/,
      },
    ]
  }

  const keepPugFolderStructure = (ext, relativePath, generatorName) => {
    return pathData => {
      const sourceFile = pathData.filename;
      const relativeFile = path.relative(`${relativePath}`, sourceFile);
      const { dir, name } = path.parse(relativeFile);
      console.log(`=>>> keepPugFolderStructure:
        name.ext = ${`${name}.${ext}`};
        dir = ${dir};
        sourceFile = ${pathData.filename};
        generatorName = ${generatorName(name, ext)}\n`)
      return `${dir}/${generatorName(name, ext)}`;
    }
  }

  const plugins = () => {
    return [
      new PugPlugin({
        pretty: isDevMode,
        filename: keepPugFolderStructure('html', `${PATHS.src}`,
          (name, ext) => name + addExt(ext)
        ),
        css: {
          filename: keepPugFolderStructure('css', `${PATHS.src}`, generatorName),
        },
        js: {
          filename: keepPugFolderStructure('js', `${PATHS.src}`, generatorName),
        },
      }),
    ]
  }

  const optimization = () => {
    const config = {
      splitChunks: {
        cacheGroups: {
          vendor: {
            name: 'vendors',
            test: /[\\/]node_modules[\\/].+\.(js|ts)$/,
            chunks: 'all',
            enforce: true,
          }
        },
      },
    }

    return config;
  }

  const entryPug = {
    main: {
      import: ['pug/pages/index.pug'],
      filename: 'index.html',
    },
    games: {
      import: 'pug/pages/games.pug',
      filename: 'pages/games.html',
    },
    websites: {
      import: 'pug/pages/websites.pug',
      filename: 'pages/websites.html',
    },
    controls: {
      import: 'pug/pages/controls.pug',
      filename: 'pages/controls.html',
    },
  }

  const entrySubprojects = {
    runOrLose: {
      import: [`./${SUBPROJECTS_PATH.games}/RunOrLose/runOrLose.pug`],
    },
    fullscreenSliderMaterialize: {
      import: [`./${SUBPROJECTS_PATH.websites}/FullscreenSliderMaterialize/fullscreenSliderMaterialize.pug`],
    },
    randomColorGenerator: {
      import: [`./${SUBPROJECTS_PATH.websites}/RandomColorGenerator/randomColorGenerator.pug`],
    },
    lightAndDarkTheme: {
      import: [`./${SUBPROJECTS_PATH.controls}/LightAndDarkTheme/lightAndDarkTheme.pug`,
      `./${SUBPROJECTS_PATH.controls}/LightAndDarkTheme/styles/themes/dark.css?move-original`,
      `./${SUBPROJECTS_PATH.controls}/LightAndDarkTheme/styles/themes/light.css?move-original`,
    ],
    },
  }

  return [
    {
      name: 'main',
      target: 'browserslist',
      mode: argv.mode,
      context: PATHS.src,
      entry: {
        ...entryPug,
        ...entrySubprojects,
      },
      output: {
        filename: generatorBaseName('js'),
        path: PATHS.dist,
        assetModuleFilename: `${PATHS.other}/${generatorBaseName()}`,
        clean: true,
      },
      resolve: {
        extensions: ['.ts', '...'],
        alias: {
          'src': PATHS.src,
          '~': PATHS.src,
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
