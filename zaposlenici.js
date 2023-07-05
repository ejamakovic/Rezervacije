const Sequelize = require("sequelize");
const sequelize = require("./baza.js");


module.exports = function (sequelize, DataTypes){
    
    const Zaposlenici = sequelize.define("Zaposlenici", {
        username: Sequelize.STRING,
        password_hash: Sequelize.STRING,
        sef: Sequelize.BOOLEAN
    },{
        tableName: "Zaposlenici"
    });

    return Zaposlenici;
};