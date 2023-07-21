const Sequelize = require('sequelize');
// umjesto wt22 unesite ime vaše baze
const sequelize = new Sequelize('wt22', 'root', '', {
host: 'localhost',
dialect: 'mysql'
});
module.exports = sequelize;