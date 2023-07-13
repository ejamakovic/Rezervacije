const Sequelize = require("sequelize");
const sequelize = require("./baza.js");


module.exports = function (sequelize, DataTypes){
    
    const Zaposlenici = sequelize.define("Zaposlenici", {
        ime: Sequelize.STRING,
        prezime: Sequelize.STRING,
        username: Sequelize.STRING,
        password_hash: Sequelize.STRING,
        status_godisnjeg: Sequelize.STRING,
        sef: Sequelize.BOOLEAN,
        prijava_prvi_put: Sequelize.BOOLEAN
    },
    {
        tableName: "Zaposlenici"
    });

    return Zaposlenici;
};