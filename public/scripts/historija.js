function odjavi(error, data){
    if(!error){
        document.body.innerHTML = "<h1>" + data + "</h1>";
        setTimeout(function(){
            window.location.href = "http://localhost:8080";
        }, 2000);
    }
}

function unesi(error, data){
    if(!error){
    if(data == "Niste prijavljeni na DigiPay"){
        document.body.innerHTML = data;
        return;
    }
    document.getElementById("username").textContent = data;
    }
}

function ispisi(error, data){
    if(!error){
        if(data == "Niste prijavljeni na DigiPay"){
            document.body.innerHTML = data;
            return;
        }
        var vrati = "";    
        var duzina = data.length;
        for(i=0 ; i<duzina; i++){
            var zaposlenik = data[i].zaposlenik;
            var pocetak = data[i].datum_pocetka_godisnjeg.split("T")[0];
            var kraj = data[i].datum_kraja_godisnjeg.split("T")[0];
            vrati += "<div class='zuta'><p> Početak godišnjeg: " + pocetak + "</p><p> Kraj godišnjeg: " + kraj + "</p><p>Status: završen</p></div>";
            }
        }
        document.getElementById("rezervacije").innerHTML = vrati;
}

function godisnji(error, data){
    if(!error){  
        if(data!=null){
            var pocetak = data.datum_pocetka_godisnjeg.split("T")[0];
            var kraj = data.datum_kraja_godisnjeg.split("T")[0];
            var odobren = data.odobren;
            if(odobren)
            document.getElementById("trenutni").innerHTML = "<div class='zelena'><p> Početak godišnjeg: " + pocetak + "</p><p> Kraj godišnjeg: " + kraj + "</p><p>Status: prihvaćen</p></div>";
            else
            document.getElementById("trenutni").innerHTML = "<div class='crvena'><p> Početak godišnjeg: " + pocetak + "</p><p> Kraj godišnjeg: " + kraj + "</p><p>Status: neobrađen</p></div>";
            }
        else
        document.getElementById("trenutni").innerHTML = "<p>Niste poslali zahtjev za trenutni godišnji";
        }
    }
        


window.onload = function(){
    document.getElementById("odjava").addEventListener("click", function() { PoziviAjax.postOdjava(odjavi)});
    PoziviAjax.postZaposlenik(unesi);
    PoziviAjax.postTrenutniGodisnji(godisnji);
    PoziviAjax.postSviGodisnji(ispisi);
}