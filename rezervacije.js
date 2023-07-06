const Sequelize = require("sequelize");
const sequelize = require("./baza.js");


module.exports = function (sequelize, DataTypes){
    
    const Rezervacije = sequelize.define("Rezervacije", {
        zaposlenik: Sequelize.STRING,
        datum_pocetka_godisnjeg: Sequelize.DATE,
        datum_kraja_godisnjeg: Sequelize.DATE,
        odobren: Sequelize.BOOLEAN
    },
    {
        tableName: "Rezervacije"
    });
    return Rezervacije;
};