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
app.get("/prijava", async function(req,res){
    res.sendFile(__dirname +"/public/prijava.html");
});
app.get("/zaposlenik",  function(req,res){
    res.sendFile(__dirname + "/public/zaposlenik.html");
});
app.get("/zaposlenik/rezervacija", function(req,res){
    res.sendFile(__dirname + "/public/rezervisi.html");
});
app.get("/sef",  function(req,res){
    res.sendFile(__dirname + "/public/sef.html");
});
app.get("/sef/rezervacije", function(req,res){
    res.sendFile(__dirname + "/public/rezervacije.html");
});
app.get("/sef/noviZaposlenik", function(req,res){
    res.sendFile(__dirname + "/public/noviZaposlenik.html");
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
    req.session.username = undefined;
    req.session.sef = undefined;
    res.send();
});

app.post("/zaposlenik",  function(req,res){
    if(req.session.username != undefined)
        res.send({username: req.session.username})
    else
        res.send({greska: "Niste prijavljeni na DigiPay"});
});

app.post("/rezervacije", async function(req,res){
    if(req.session.username!=undefined && req.session.sef!=undefined){
        if(req.session.sef)
            res.send({lista: await Rezervacije.findAll({ raw: true})});
        else
            res.send({greska: "Niste šef!"});
    }
    else 
        res.send({greska: "Niste prijavljeni na DigiPay"});
});

app.post("/rezervacija/zaposlenik/:username", async function(req,res){
    var url = decodeURI(req.url);
    var parametri = url.split(":");
    var zaposlenik = parametri[1];
    var pocetak = req.body["pocetak"];
    var kraj = req.body["kraj"];
    var rezervacija = await Rezervacije.findOne({where: {zaposlenik: zaposlenik, datum_pocetka_godisnjeg: pocetak, datum_kraja_godisnjeg: kraj}
    });
    rezervacija.status = "prihvacen";
    await rezervacija.save();
    
    res.send({lista: await Rezervacije.findAll({raw: true})});
});

app.post("/rezervisi/zaposlenik/:username", async function(req,res){
    var url = decodeURI(req.url);
    var parametri = url.split(":");
    var zaposlenik = parametri[1];
    var pocetak = new Date(req.body["pocetak"]);
    var kraj = new Date(req.body["kraj"]);
    var rezervacija = await Rezervacije.findOne({where: {zaposlenik: zaposlenik, datum_pocetka_godisnjeg: pocetak, datum_kraja_godisnjeg: kraj}});  

    if(rezervacija != null) res.send({greska: "Već ste poslali zahtjev za godišnji odmor!"});
    await Rezervacije.create({zaposlenik: zaposlenik, datum_pocetka_godisnjeg: pocetak, datum_kraja_godisnjeg: kraj, status: "neobraden"});  
    res.send({poruka: "Rezervacija uspješno poslana"});
});

app.listen(8080);

module.exports = app;