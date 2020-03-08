const path = require('path') //подключение плагина path в константу
const fs = require("fs")
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlBeautifyPlugin = require('html-beautify-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

const PATHS = { //ввод константы PATH со значением текущей директории, нижу пример использования константы
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../dist'),
  assets: 'assets/'
}
// константа для HtmlWebpackPlugin
const INDEX_DIR = `${PATHS.src}`
const INDEX = fs.readdirSync(INDEX_DIR).filter(fileName => fileName.endsWith('.pug'))
const PAGES_DIR = `${PATHS.src}/content/website-pages`
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'))
const UI_DIR = `${PATHS.src}/content/ui-kit`
const UI = fs.readdirSync(UI_DIR).filter(fileName => fileName.endsWith('.pug'))

module.exports = {

  externals: {
    paths: PATHS
  },
  entry: {
    app: PATHS.src ,// точка входа в проект, файл где подключаются все библиотеки
    lk: `${PATHS.src}/lk.js`,
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
      loader: 'pug-loader',
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
        MiniCssExtractPlugin.loader,
        {
          loader: "css-loader",
          options: { sourceMap: true, url: false }
        }, {
          loader: "postcss-loader",
          options: { sourceMap: true, config: {path: `./postcss.config.js`} }
        }, {
          loader: 'resolve-url-loader',
        }, {
          loader: "sass-loader",
          options: { sourceMap: true }
        }
      ]
    }, {
      test: /\.css$/,
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: "css-loader",
          options: { sourceMap: true, url: true },
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
      filename: `[name].[hash].css`,
    }),
    new CopyWebpackPlugin([
      {from: `${PATHS.src}/${PATHS.assets}images`, to: `${PATHS.assets}images`},
      {from: `${PATHS.src}/${PATHS.assets}fonts`, to: `${PATHS.assets}fonts`},
      {from: `${PATHS.src}/static`, to: '' },
    ]),

    // Авто создание других html страниц.
    ...INDEX.map(index => new HtmlWebpackPlugin({
      template: `${INDEX_DIR}/${index}`, // на входе .pug
      filename: `./${index.replace(/\.pug/,'.html')}` // конвертирует в .html
    })),
    ...UI.map(ui => new HtmlWebpackPlugin({
      template: `${UI_DIR}/${ui}`, // на входе .pug
      filename: `./ui/${ui.replace(/\.pug/,'.html')}` // конвертирует в .html
    })),
    ...PAGES.map(page => new HtmlWebpackPlugin({
      template: `${PAGES_DIR}/${page}`, // на входе .pug
      filename: `./pages/${page.replace(/\.pug/,'.html')}` // конвертирует в .html
    })),
    new HtmlBeautifyPlugin({
      config: {
          html: {
              end_with_newline: true,
              indent_size: 2,
              indent_with_tabs: false,
              indent_inner_html: true,
              preserve_newlines: true,
              unformatted: ['p', 'i', 'b', 'span']
          }
      },
      replace: [ ' type="text/javascript"' ]
  })
  //  new HtmlWebpackPlugin ({
  //    template: `${PATHS.assets}/index.html`,
  //    filename: './index.html'
  //  })
  ]
}