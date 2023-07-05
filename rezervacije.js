const Sequelize = require("sequelize");
const sequelize = require("./baza.js");


module.exports = function (sequelize, DataTypes){
    
    const Rezervacija = sequelize.define("Rezervacija", {
        zaposlenik: Sequelize.STRING,
        datum_pocetka_godisnjeg: Sequelize.DATE,
        datum_kraja_godisnjeg: Sequelize.DATE,
        odobren: Sequelize.BOOLEAN
    },
    {
        tableName: "Rezervacija"
    });
    return Rezervacija;
};