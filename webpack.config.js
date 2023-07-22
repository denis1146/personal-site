module.exports = (env, argv) => {
  console.log('==============================================================================');
  console.log('Webpack CLI environment variables:');
  console.log(env);
  console.log();
  console.log('Variables:');
  console.log(argv);
  console.log('==============================================================================');

  const path = require('path');
  const fs = require('fs');
  const PugPlugin = require('pug-plugin');

  const isDevMode = argv.mode === 'development';
  const isDevServer = !!argv.open;
  const isLogging = false;

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
      if (isLogging) {
        console.log(`=>>> keepPugFolderStructure:
          name.ext = ${`${name}.${ext}`};
          dir = ${dir};
          sourceFile = ${pathData.filename};
          generatorName = ${generatorName(name, ext)}\n`)
      }
      return `${dir}/${generatorName(name, ext)}`;
    }
  }

  const plugins = () => {
    const pugPlugin = new PugPlugin({
      pretty: isDevMode,
      filename: keepPugFolderStructure('html', `${PATHS.src}`,
        (name, ext) => name + addExt(ext)
      ),
      css: {
        filename: keepPugFolderStructure('css', `${PATHS.src}`, generatorName),
      },
      js: isDevServer ? {} : {
        filename: keepPugFolderStructure('js', `${PATHS.src}`, generatorName),
      },
    });

    return [
      pugPlugin,
    ];
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

  function getFiles(dir, ext = ''){
    const files = [];
    for (const item of fs.readdirSync(dir)){
      const name = dir + '/' + item;
      const stats = fs.statSync(name);
      if (stats.isDirectory()){
        files.push(...getFiles(name, ext));
      } else if (stats.isFile()) {
        if (ext.length === 0 || name.endsWith(`.${ext}`)) {
          files.push(name);
        }
      }
    }
    return files;
  };

  const entryPug = (() => {
    const res = {};
    const IMPORT = 'import';
    const INDEX = 'index';

    const pagesPath = path.resolve(PATHS.src, PATHS.pages);
    const pubFiles = fs.readdirSync(pagesPath)
      .filter(file => fs.statSync(`${pagesPath}/${file}`).isFile())
      .map(file => './' + path.relative(PATHS.src, `${pagesPath}/${file}`));

    pubFiles.forEach(file => {
      const projectName = path.basename(file, path.extname(file));
      res[projectName] = {
        [IMPORT]: [file],
        filename: `${(projectName === INDEX ? '.' : './pages')}/${projectName}.html`,
      }
    });

    if (isLogging) {
      console.log('entryPug: \n', res);
    }
    return res;
  })();

  const entrySubprojects = (() => {
    const res = {};
    const IMPORT = 'import';

    const subprojectsPath = path.resolve(PATHS.src, SUBPROJECTS_PATH.subprojects);
    const subprojectsPaths = fs.readdirSync(subprojectsPath)
      .map(el => subprojectsPath + '/' + el)
      .filter(dir => fs.statSync(dir).isDirectory());

    subprojectsPaths.forEach(subPath => {
      for (const subproject of fs.readdirSync(subPath)){
        const subprojectPath = subPath + '/' + subproject;
        if (fs.statSync(subprojectPath).isDirectory()) {
          const files = getFiles(subprojectPath, 'pug');
          if (files.length) {
            files.forEach((file, i) => files[i] = './' + path.relative(PATHS.src, file));
            res[subproject] = {
              [IMPORT]: files,
            }
          }
        }
      }
    });

    const LIGHT_AND_DARK_THEME = 'LightAndDarkTheme';
    res?.[LIGHT_AND_DARK_THEME]?.[IMPORT].push(
      `./${SUBPROJECTS_PATH.controls}/${LIGHT_AND_DARK_THEME}/styles/themes/dark.css?move-original`,
      `./${SUBPROJECTS_PATH.controls}/${LIGHT_AND_DARK_THEME}/styles/themes/light.css?move-original`,
    );

    if (isLogging) {
      console.log('entrySubprojects: \n', res);
    }
    return res;
  })();

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
