const path = require('path') //подключение плагина path в константу
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const PATHS = { //ввод константы PATH со значением текущей директории, нижу пример использования константы
  src: path.join(__dirname, './src'),
  dist: path.join(__dirname, './dist'),
  assets: 'assets/'
}


module.exports = {

  externals: {
    paths: PATHS
  },
  entry: {
    app: PATHS.src // точка входа в проект, файл где подключаются все библиотеки
  },
  output: {
    filename: `${PATHS.assets}js/[name].js`, // точка выхода, файл в который собираются библиотеки, [name] в данном случае = app
    path: PATHS.dist, // путь использующий константу с параметрами
    publicPath: '/' // путь для dev server (?)
  },
  module: {  // плагины
    rules: [{  //правила
      test: /\.js$/,  //проверка js файлов
      loader: 'babel-loader', // плагин через который идет проверка
      exclude: '/node_modules/' //исключения для проверки
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
          options: { sourceMap: true, config: {path: 'src/js/postcss.config.js'} }
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
          options: { sourceMap: true, config: {path: 'src/js/postcss.config.js'} }
        },
      ]
    }]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `${PATHS.assets}css/[name].css`,
    })
  ]
}