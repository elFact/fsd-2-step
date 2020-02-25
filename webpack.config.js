const path = require('path') //подключение плагина path в константу
module.exports = {
  entry: {
    app: './src/index.js' // точка входа в проект, файл где подключаются все библиотеки
  },
  output: {
    filename: '[name].js', // точка выхода, файл в который собираются библиотеки, [name] в данном случае = app
    path: path.resolve(__dirname, './dist'), // путь использующий константу с параметрами
    publicPath: '/dist' // путь для dev server (?)
  },
  module: {  // плагины
    rules: [{  //правила
      test: /\.js$/,  //проверка js файлов
      loader: 'babel-loader', // плагин через который идет проверка
      exclude: '/node_modules/' //исключения для проверки
    }]
  },
  devServer: { //настройки плагина dev-server
    overlay: true // показ ошибок в браузере
  }
}