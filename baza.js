const Sequelize = require('sequelize');
const sequelize = new Sequelize('wt22', 'root', 'password', {
host: 'localhost',
dialect: 'mysql',
});
module.exports = sequelize;