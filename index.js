const express = require('express');
const session = require("express-session");
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const zaposlenici = require("./data/zaposlenici.json");
const rezervacije = require("./data/rezervacije.json");
var fs = require('fs')
;
const app = express();
const path = require('path');

const Sequelize = require('sequelize');
const sequelize = require("./baza.js");
const { use } = require('bcrypt/promises');
const { Op } = require("sequelize");
// Kreiranje tabela u sequelize modulu
const Zaposlenici = require("./zaposlenici.js") (sequelize);
const Rezervacije = require("./rezervacije.js") (sequelize);


// Kreiranje i punjenje baze sa json podacima
sequelize.sync().then(async () => {
    var duzina = zaposlenici.length;
    for(var i=0; i<duzina; i++){
        var ime = zaposlenici[i].zaposlenik.ime;
        var prezime = zaposlenici[i].zaposlenik.prezime;
        var username = zaposlenici[i].zaposlenik.username;
        var password = zaposlenici[i].zaposlenik.password_hash;
        var status_godisnjeg = zaposlenici[i].zaposlenik.status_godisnjeg;
        var sef = zaposlenici[i].zaposlenik.sef;
        var prijava_prvi_put = zaposlenici[i].zaposlenik.prijava_prvi_put
        await Zaposlenici.findOrCreate({
        where: {
            username: username,
        },
        defaults: {
            ime: ime,
            prezime: prezime,
            username: username,
            password_hash: password,
            status_godisnjeg: status_godisnjeg,
            sef: sef,
            prijava_prvi_put: prijava_prvi_put
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


app.use(express.static(__dirname+"/public/"));

app.get("/", async function(req,res){
    res.sendFile(__dirname + "/html/pocetna.html");
});
app.get("/prijava", async function(req,res){
    res.sendFile(__dirname +"/html/prijava.html");
});
app.get("/promjenaLozinke", async function(req,res){
    res.sendFile(__dirname +"/html/promjenaLozinke.html");
});
app.get("/zaposlenik",  function(req,res){
    if(req.session.username != undefined)
    res.sendFile(__dirname + "/html/zaposlenik.html");
    else
    res.sendFile(__dirname + "/html/greska.html");
});
app.get("/zaposlenik/rezervacija", function(req,res){
    if(req.session.username != undefined)
    res.sendFile(__dirname + "/html/rezervisi.html");
    else
    res.sendFile(__dirname + "/html/greska.html");
});
app.get("/zaposlenik/historija", function(req,res){
    if(req.session.username != undefined)
    res.sendFile(__dirname + "/html/historija.html");
    else
    res.sendFile(__dirname + "/html/greska.html");
});
app.get("/sef",  function(req,res){
    if(req.session.username != undefined)
    res.sendFile(__dirname + "/html/sef.html");
    else
    res.sendFile(__dirname + "/html/greska.html");
});
app.get("/sef/rezervacije", function(req,res){
    if(req.session.username != undefined)
    res.sendFile(__dirname + "/html/rezervacije.html");
    else
    res.sendFile(__dirname + "/html/greska.html");
});
app.get("/sef/noviZaposlenik", function(req,res){
    if(req.session.username != undefined)
    res.sendFile(__dirname + "/html/noviZaposlenik.html");
    else
    res.sendFile(__dirname + "/html/greska.html");
});

app.get("/sef/neobradeniZahtjevi", function(req,res){
    if(req.session.username != undefined)
    res.sendFile(__dirname + "/html/neobradeniZahtjevi.html");
    else
    res.sendFile(__dirname + "/html/greska.html");
});
app.get("/sef/lista", function(req,res){
    if(req.session.username != undefined)
    res.sendFile(__dirname + "/html/lista.html");
    else
    res.sendFile(__dirname + "/html/greska.html");
});

app.post("/prijava", async function(req,res){
    var username = req.body["username"];
    var password = req.body["password"];
    var poruka = "Neuspješna prijava";
    let user = await Zaposlenici.findOne({where: {username: username}, raw:true});
    if(user!=null){
        var hash = user.password_hash;
        if(await bcrypt.compare(password,hash).then(res=> {return res})) {
            req.session.username = user.username;
            req.session.sef = user.sef;
            poruka = "Uspješna prijava na DigiPay";
        }
    }
    if(user!=null)
        res.send({poruka: poruka, sef: req.session.sef, prijavaPrviPut: user.prijava_prvi_put});
    else
        res.send({poruka: poruka});
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
            res.send({lista: await Rezervacije.findAll({where: {datum_pocetka_godisnjeg: {[Op.gt]: new Date(Date.now())}, odobren: true}, raw: true})});
        else
            res.send({greska: "Niste šef"});
    }
    else 
        res.send({greska: "Niste prijavljeni na DigiPay"});
});

app.post("/zaposlenik/rezervacija", async function(req,res){
    res.send({lista: await Rezervacije.findOne({where: {datum_kraja_godisnjeg: {[Op.gte]: new Date(Date.now())},
        zaposlenik : req.session.username},raw: true})});
});

app.post("/rezervacija/test", async function(req,res){
    var zaposlenik = req.body["zaposlenik"];
    var pocetak = req.body["pocetak"];
    var kraj = new Date(req.body["kraj"]);
    var rezervacije = await Rezervacije.findAll({where: {odobren: true},raw: true});
    var duzina = rezervacije.length;
    var dan_brojZaposlenika = new Map();
    var pomocna = new Date(pocetak);
    while(pomocna <= kraj){
    var broj = 0;
    for(var i = 0; i < duzina; i++){
        var p = rezervacije[i].datum_pocetka_godisnjeg;
        var k = rezervacije[i].datum_kraja_godisnjeg;
        if(pomocna >= p && pomocna <= k)
            broj += 1;
    }
    dan_brojZaposlenika.set(new Date(pomocna), broj);
    pomocna.setDate(pomocna.getDate()+1);
    }
    
    var b = await Zaposlenici.count({where: {sef: false}}) - Math.max(...dan_brojZaposlenika.values());
    res.send({ broj: b, zaposlenik: zaposlenik});
});

app.post("/rezervacija/zaposlenik/promjeni", async function(req,res){
    var zaposlenik = req.body["zaposlenik"];
    var pocetak = req.body["pocetak"];
    var kraj = req.body["kraj"];
    var rezervacija = await Rezervacije.findOne({where: {zaposlenik: zaposlenik, datum_pocetka_godisnjeg: pocetak, datum_kraja_godisnjeg: kraj}});
    rezervacija.odobren = true;
    await rezervacija.save();
    var zap = await Zaposlenici.findOne({where: {username: zaposlenik}});
    zap.status_godisnjeg = "Prihvaćen";
    await zap.save();
    res.send({lista: await Rezervacije.findAll({where: {odobren: false}, raw: true})});
});

app.post("/rezervacija/zaposlenik/izbrisi", async function(req,res){
    var zaposlenik = req.body["zaposlenik"];
    var pocetak = new Date(req.body["pocetak"]);
    var kraj = new Date(req.body["kraj"]);
    console.log("Brisanje");
    console.log(zaposlenik);
    console.log(pocetak);
    console.log(kraj);
    await Rezervacije.destroy({where: {zaposlenik: zaposlenik, datum_pocetka_godisnjeg: pocetak, datum_kraja_godisnjeg: kraj}});
    var zap = await Zaposlenici.findOne({where: {username: zaposlenik}});
    zap.status_godisnjeg = "Odbijen";
    await zap.save();
    res.send({lista: await Rezervacije.findAll({where: {datum_pocetka_godisnjeg: {[Op.gt]: new Date(Date.now())}, odobren: true}, raw: true})});
});

app.post("/rezervisi/zaposlenik/:username", async function(req,res){
    var url = decodeURI(req.url);
    var parametri = url.split(":");
    var zaposlenik = parametri[1];
    var pocetak = new Date(req.body["pocetak"]);
    var kraj = new Date(req.body["kraj"]);
    var rezervacija = await Rezervacije.findOne({where: {datum_kraja_godisnjeg: {[Op.gte]: new Date(Date.now())},
    zaposlenik : zaposlenik }});

    if(rezervacija != null) res.send({poruka: "Već ste poslali zahtjev za godišnji odmor!"});
    else{
    await Rezervacije.create({zaposlenik: zaposlenik, datum_pocetka_godisnjeg: pocetak, datum_kraja_godisnjeg: kraj, odobren: false});
    var zap = await Zaposlenici.findOne({where: {username: zaposlenik}});
    zap.status_godisnjeg = "Neobrađen";
    await zap.save();
    res.send({poruka: "Rezervacija godišnjeg uspješno poslana"});
    }
});

app.post("/username", async function(req,res){
    var username = req.body["username"];
    var zap = await Zaposlenici.findAll({raw:true});
    var duzina = zap.length;
    for(var i=0; i<duzina; i++){
        var korisnik = zap[i].username;
        if(korisnik.substring(0, username.length) === username){
            korisnik = korisnik.substring(username.length, korisnik.length);
            if(korisnik.length == 0){
                var broj = 1;
                while(1){
                var user = await Zaposlenici.findOne({where: {username: username + broj}});
                if(user == null)
                    break;
                broj += 1;
                }
                username = username + broj;
                res.send({username: username});
                break;
            }
        }
    }
    if(username == req.body["username"])
        res.send({username: username});
});

app.post("/dodajZaposlenika", async function(req,res){
    var ime = req.body["ime"];
    var prezime = req.body["prezime"];
    var username = req.body["username"];
    var password = await bcrypt.hash(req.body["password"], 10);
    await Zaposlenici.create({ime: ime, prezime: prezime, username: username, password_hash: password, status_godisnjeg: "Nije poslan", sef: false, prijava_prvi_put: false});

    res.send({poruka: "Zaposlenik uspješno kreiran"});
});

app.post("/neobradeni", async function(req,res){
    var neobradeni = await Rezervacije.findAll({where: {odobren: false}, raw:true});
    res.send({lista: neobradeni});
});


app.post("/promjenaLozinke" , async function(req,res){
    var password = await bcrypt.hash(req.body["password"], 10);
    var user = await Zaposlenici.findOne({where: {username: req.session.username}});
    user.password_hash = password;
    user.prijava_prvi_put = true;
    await user.save();
    res.send({poruka: "Uspješna promjena lozinke"});
});

app.post("/historija", async function(req,res){
    if(req.session.username!=undefined){
        res.send({lista: await Rezervacije.findAll({where: {datum_kraja_godisnjeg: {[Op.lt]: new Date(Date.now())},
            zaposlenik : req.session.username
        },raw: true})});
    }
    else 
        res.send({greska: "Niste prijavljeni na DigiPay"});
});

app.post("/zaposlenik/rezervacije/otkazi", async function(req,res){
    var zaposlenik = req.body["zaposlenik"];
    await Rezervacije.destroy({where: {datum_pocetka_godisnjeg: {[Op.gt]: new Date(Date.now())}, zaposlenik: zaposlenik}});
    var user = await Zaposlenici.findOne({where: {username: zaposlenik}});
    user.status_godisnjeg = "Nije poslan";
    await user.save();
    res.send({poruka: "Rezervacija uspješno otkazana"});
});

app.post("/sef/lista", async function(req,res){
    var pocetak = new Date(req.body["pocetak"]);
    var kraj = new Date(req.body["kraj"]);
    var rezervacije = await Rezervacije.findAll({where: {odobren: true},raw: true});
    var zaposlenici = await Zaposlenici.findAll({where: {sef: false},raw: true});
    var duzina = rezervacije.length;
    var pomocna = new Date(pocetak.toISOString().split("T")[0]);
    var lista = "<table> <tr class='prviRed'> <th>Datum</th> <th>Broj zaposlenika</th></tr>";
    console.log(kraj);
    console.log(pomocna);
    while(pomocna <= kraj){
    var niz = Array.from(zaposlenici);
    for(var i = 0; i < duzina; i++){
        var p = rezervacije[i].datum_pocetka_godisnjeg;
        var k = rezervacije[i].datum_kraja_godisnjeg;
        if(pomocna >= p && pomocna <= k){
        var index = niz.indexOf(await Zaposlenici.findOne({where: {username: rezervacije[i].zaposlenik}, raw:true}));
        if (index > -1)
            niz.splice(index, 1);
        }
    }
    
    var broj = niz.length;
    lista += "<tr> <td>" + pomocna.toISOString().split("T")[0] + "</td><td>" + broj ;
    lista += "<div class='skriveniDiv'><p>Zaposlenici:</p>"; 
    for(var j = 0; j < broj; j++){
            var ime = niz[j].ime;
            var prezime = niz[j].prezime;
            lista += "<p>" + ime + " " + prezime + "</p>";
    }
    lista += "</div></td></tr>";
    pomocna.setDate(pomocna.getDate()+1);
    }
    lista += "</table>";
    res.send({lista: lista});
});

app.listen(8080);

module.exports = app;