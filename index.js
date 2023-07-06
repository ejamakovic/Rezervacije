const express = require('express');
const session = require("express-session");
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const zaposlenici = require("./data/zaposlenici.json");
const rezervacije = require("./data/rezervacije.json");
var fs = require('fs');
const app = express();
const path = require('path');

const Sequelize = require('sequelize');
const sequelize = require("./baza.js");

// Kreiranje tabela u sequelize modulu
const Zaposlenici = require("./zaposlenici.js") (sequelize);
const Rezervacije = require("./rezervacije.js") (sequelize);


// Kreiranje i punjenje baze sa json podacima
sequelize.sync().then(async () => {
    var duzina = zaposlenici.length;
    for(var i=0; i<duzina; i++){
        var username = zaposlenici[i].zaposlenik.username;
        var password = zaposlenici[i].zaposlenik.password_hash;
        var sef = zaposlenici[i].zaposlenik.sef;
        await Zaposlenici.findOrCreate({
        where: {
            username: username,
        },
        defaults: {
            username: username,
            password_hash: password,
            sef: sef
        }
        });
    }

    duzina = rezervacije.length;
    for(var i=0; i<duzina; i++){
        var zaposlenik = rezervacije[i].rezervacija.zaposlenik;
        var pocetak = new Date(rezervacije[i].rezervacija.datum_pocetka_godisnjeg);
        var kraj = new Date(rezervacije[i].rezervacija.datum_kraja_godisnjeg);
        var odobren = rezervacije[i].rezervacija.odobren;
        await Rezervacije.findOrCreate({
            where: {
                zaposlenik: zaposlenik,
                datum_pocetka_godisnjeg: pocetak,
                datum_kraja_godisnjeg: kraj
            },
            defaults: {
                zaposlenik: zaposlenik,
                datum_pocetka_godisnjeg: pocetak,
                datum_kraja_godisnjeg: kraj,
                odobren: odobren
            }
            });
    }
});


app.use(bodyParser.json());
app.use(session({
    secret: 'neka tajna sifra',
    resave: true,
    saveUninitialized: true,
    }));


app.use(express.static(__dirname+"/public"));

app.get("/", async function(req,res){
    res.sendFile(__dirname + "/public/pocetna.html");
});


app.post("/prijava", async function(req,res){
    var username = req.body["username"];
    var password = req.body["password"];
    var poruka = "Neuspješna prijava";
    let user = await Zaposlenici.findOne({where: {username: username},});
    if(user!=null){
        var hash = user.toJSON().password_hash;
        if(await bcrypt.compare(password,hash).then(res=> {return res})) {
            req.session.username = user.toJSON().username;
            req.session.sef = user.toJSON().sef;
            poruka = "Uspješna prijava na DigiPay";
        }
    }
    res.send({poruka: poruka, sef: req.session.sef});
});

app.post("/odjava", function(req,res){
    console.log("nesta");
    req.session.username = undefined;
    res.send();
});


app.get("/zaposlenik",  function(req,res){
    console.log(req.session.username);
    if(req.session.username != undefined)
        res.send({username: req.session.username})
    else
        res.send({greska: "Niste prijavljeni na DigiPay"});
});

app.get("/rezervacije", async function(req,res){
    if(req.session.username!=undefined && req.session.sef){
        res.send({lista: await Rezervacije.findAll({ raw: true})});
    }
    else 
        res.send({greska: "Niste prijavljeni na DigiPay"});
});

app.post("/rezervacija/zaposlenik/:username/datum/:pocetak/kraj", async function(req,res){
    var parametri = req.url.split(":");
    var zaposlenik = parametri[1].split("/")[0];
    var pocetak = new Date(parametri[2].split("/")[0]);
    var kraj = new Date(parametri[2].split("/")[1]);
    var rezervacija = await Rezervacije.findOne({where: {zaposlenik: zaposlenik, datum_pocetka_godisnjeg: pocetak, datum_kraja_godisnjeg: kraj},
        raw: true
    });
    rezervacija[0].odobren = !rezervacija[0].odobren;
    await rezervacija[0].save();
    
    res.send();
});

app.listen(8080);

module.exports = app;