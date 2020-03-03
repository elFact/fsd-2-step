const path = require('path') //подключение плагина path в константу
const fs = require("fs")
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

const PATHS = { //ввод константы PATH со значением текущей директории, нижу пример использования константы
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../dist'),
  assets: 'assets/'
}
// константа для HtmlWebpackPlugin
const PAGES_DIR = `${PATHS.src}/pug/pages`
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'))

module.exports = {

  externals: {
    paths: PATHS
  },
  entry: {
    app: PATHS.src ,// точка входа в проект, файл где подключаются все библиотеки
    lk: `${PATHS.src}/lk.js`
  },
  output: {
    filename: `${PATHS.assets}js/[name].[hash].js`, // точка выхода, файл в который собираются библиотеки, [name] в данном случае = app
    path: PATHS.dist, // путь использующий константу с параметрами
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendors',
          test: /node_modules/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  module: {  // плагины
    rules: [{  //правила
      test: /\.js$/,  //проверка js файлов
      loader: 'babel-loader', // плагин через который идет проверка
      exclude: '/node_modules/' //исключения для проверки
    }, {
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        loader: {
          scss: 'vue-style-loader!css-loader!sass-loader'
        }
      }
    }, {
      test: /\.pug$/,
      loader: 'pug-loader'
    }, {
      test: /\.(png|jpg|gif|svg)$/, 
      loader: 'file-loader',
      options: {
        name: '[name].[ext]'
      }
    }, {
      test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/, 
      loader: 'file-loader',
      options: {
        name: '[name].[ext]'
      }
    }, {
      test: /\.scss$/,
      use: [
        'style-loader',
        MiniCssExtractPlugin.loader,
        {
          loader: "css-loader",
          options: { sourceMap: true }
        }, {
          loader: "postcss-loader",
          options: { sourceMap: true, config: {path: `./postcss.config.js`} }
        }, {
          loader: "sass-loader",
          options: { sourceMap: true }
        }
      ]
    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        MiniCssExtractPlugin.loader,
        {
          loader: "css-loader",
          options: { sourceMap: true }
        }, {
          loader: "postcss-loader",
          options: { sourceMap: true, config: {path: `./postcss.config.js`} }
        },
      ]
    }]
  },
  resolve: {
    alias: {
      '~': 'src',
      'vue$': 'vue/dist/vue.js' // присваивание ярлыку vue пути к файлу
    }
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: `${PATHS.assets}css/[name].[hash].css`,
    }),
    // new HtmlWebpackPlugin ({
    //   hash: false,
    //   template: `${PATHS.src}/index.html`,
    //   filename: './index.html'
    // }),
    new CopyWebpackPlugin([
      {from: `${PATHS.src}/${PATHS.assets}img`, to: `${PATHS.assets}img`},
      {from: `${PATHS.src}/${PATHS.assets}fonts`, to: `${PATHS.assets}fonts`},
      {from: `${PATHS.src}/static`, to: '' },
    ]),

    // Авто создание других html страниц.
    ...PAGES.map(page => new HtmlWebpackPlugin({
      template: `${PAGES_DIR}/${page}`, // на входе .pug
      filename: `./${page.replace(/\.pug/,'.html')}` // конвертирует в .html
    }))
  ]
}