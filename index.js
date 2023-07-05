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
    let listePredmeta = new Map();
    var duzina = zaposlenici.length;
    for(var i=0; i<duzina; i++){
        var username = zaposlenici[i].zaposlenik.username;
        var password = zaposlenici[i].zaposlenik.password_hash;
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
        var duzina = prisustva.length;
        for(var i=0; i<duzina; i++){
            var predmet = prisustva[i].predmet;
            var studenti = prisustva[i].studenti;
            var prisustvo = prisustva[i].prisustva;
            var brojPredavanjaSedmicno = prisustva[i].brojPredavanjaSedmicno;
            var brojVjezbiSedmicno = prisustva[i].brojVjezbiSedmicno;
            var nastavnik;
            listePredmeta.forEach(async(value, key) => {
                var ima = false;
                for(var k=0; k<value.length; k++){
                    if(value[k] == predmet){
                        ima = true;
                        nastavnik = key;
                    }
                    if(ima) break;
                }
                if(ima) 
                await Predmeti.findOrCreate({where: {predmet: predmet, nastavnik: nastavnik},
                                defaults: {predmet: predmet, nastavnik: nastavnik, brojPredavanjaSedmicno: brojPredavanjaSedmicno, brojVjezbiSedmicno: brojVjezbiSedmicno}
                });
                });
                var duzina2 = prisustvo.length
                    for(var j=0; j<duzina2; j++){
                    var sedmica = prisustvo[j].sedmica;
                    var predavanja = prisustvo[j].predavanja;
                    var vjezbe = prisustvo[j].vjezbe;
                    var index = prisustvo[j].index;
                    await Prisustva.findOrCreate({where: {predmet: predmet, sedmica: sedmica, index: index},
                                    defaults: {predmet: predmet, sedmica: sedmica, predavanja: predavanja, vjezbe: vjezbe, index: index}});
                    }
                duzina2 = studenti.length;
                    for(var j=0; j<duzina2; j++)
                        await Studenti.findOrCreate({where: {index: studenti[j].index}, 
                                defaults: {ime: studenti[j].ime, index: studenti[j].index}}); 
                          
                    }

});


app.use(bodyParser.json());
app.use(session({
    secret: 'neka tajna sifra',
    resave: true,
    saveUninitialized: true,
    }));


app.use(express.static(__dirname+"/public"));

app.get("/predmet/:NAZIV", async function(req,res){
    let predmet = req.url.substring(10, req.url.length);
    var prisustvo = await Prisustva.findAll({where: {predmet: predmet}, 
        attributes: ["sedmica", "predavanja", "vjezbe", "index"],
        raw: true
    });
    var predmetBaza = await Predmeti.findOne({where: {predmet: predmet},
        attributes: ["brojPredavanjaSedmicno", "brojVjezbiSedmicno"],
        raw: true
    });
    var studenti = new Array();
    var vrati = new Array();
    if(prisustvo!=null){
        var duzina = prisustvo.length;
        for(var i=0; i<duzina; i++){
            var objekat = prisustvo[i];
            vrati.push({sedmica: objekat.sedmica, predavanja: objekat.predavanja, vjezbe: objekat.vjezbe, index: objekat.index});
            var student = await Studenti.findOne({where: {index: objekat.index},
                attributes: ["ime"],
                raw: true
            });
            if(student!=null){
                var duzina2 = studenti.length;
                var ima = false;
                for(var j=0; j<duzina2; j++){
                    if(studenti[j].index == objekat.index) ima = true;
                    if(ima) break;
                }
                if(!ima)
                studenti.push({ime: student.ime, index: objekat.index});
            }

        }
    }
    res.send({prisustvo: {studenti: studenti, prisustva: vrati, predmet: predmet, brojPredavanjaSedmicno: predmetBaza.brojPredavanjaSedmicno, brojVjezbiSedmicno: predmetBaza.brojVjezbiSedmicno}});
});

app.get("/predmeti", function(req,res){
    if(req.session.username!=undefined)
    res.send({lista: req.session.lista});
    else
    res.send({greska: "Nastavnik nije loginovan"});
});

app.post("/login",async function(req,res){
    var username = req.body["username"];
    var password = req.body["password"];
    var poruka = "Neuspješna prijava";
    let user = await Nastavnici.findOne({where: {username: username},});
    if(user!=null){
        req.session.username = user.toJSON().username;
        var hash = user.toJSON().password_hash;
        if(await bcrypt.compare(password,hash).then(res=> {return res})){           
            req.session.username = username;
            var predmeti = await Predmeti.findAll({where: { nastavnik: username},
                attributes: ["predmet"],
                raw: true});
            req.session.lista = predmeti;
            poruka = "Uspješna prijava na ARM";
        }
    }
    res.send({poruka: poruka});
});

app.post("/logout", function(req,res){
    req.session.username = undefined;
    req.session.lista = undefined;
    res.send();
});

app.post("/prisustvo/predmet/:NAZIV/student/:index", async function(req,res){
    var parametri = req.url.split(":");
    var predmet = parametri[1].split("/")[0];
    var index = parseInt(parametri[2]);
    var trenutnaSedmica = parseInt(req.body["sedmica"]);
    var predavanja = req.body["predavanja"];
    var vjezbe = req.body["vjezbe"];
    var prisustvo = await Prisustva.findOrCreate({where: {predmet: predmet, sedmica: trenutnaSedmica, index: index},
        defaults: {predmet: predmet, sedmica: trenutnaSedmica, predavanja: predavanja, vjezbe: vjezbe, index: index}
    });                     
    prisustvo[0].predavanja = predavanja;
    prisustvo[0].vjezbe = vjezbe;
    await prisustvo[0].save();

    prisustvo = await Prisustva.findAll({where: {predmet: predmet}, 
        attributes: ["sedmica", "predavanja", "vjezbe", "index"],
        raw: true
    });
    var predmetBaza = await Predmeti.findOne({where: {predmet: predmet},
        attributes: ["brojPredavanjaSedmicno", "brojVjezbiSedmicno"],
        raw: true
    });
    var studenti = new Array();
    var vrati = new Array();
    if(prisustvo!=null){
        var duzina = prisustvo.length;
        for(var i=0; i<duzina; i++){
            var objekat = prisustvo[i];
            vrati.push({sedmica: objekat.sedmica, predavanja: objekat.predavanja, vjezbe: objekat.vjezbe, index: objekat.index});
            var student = await Studenti.findOne({where: {index: objekat.index},
                attributes: ["ime"],
                raw: true
            });
            if(student!=null){
                var duzina2 = studenti.length;
                var ima = false;
                for(var j=0; j<duzina2; j++){
                    if(studenti[j].index == objekat.index) ima = true;
                    if(ima) break;
                }
                if(!ima)
                studenti.push({ime: student.ime, index: objekat.index});
            }

        }
    }
    res.send({prisustvo: {studenti: studenti, prisustva: vrati, predmet: predmet, brojPredavanjaSedmicno: predmetBaza.brojPredavanjaSedmicno, brojVjezbiSedmicno: predmetBaza.brojVjezbiSedmicno}});
});
app.listen(8080);

module.exports = app;