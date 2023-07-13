

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

function rezervacije(){
    window.location.href = "http://localhost:8080/sef/rezervacije";
}

function dodajZaposlenika(){
    window.location.href = "http://localhost:8080/sef/noviZaposlenik";
}

function zahtjevi(){
    window.location.href = "http://localhost:8080/sef/neobradeniZahtjevi";
}

window.onload = function(){
        document.getElementById("odjava").addEventListener("click", function() { PoziviAjax.postOdjava(odjavi)});
        PoziviAjax.postZaposlenik(unesi);
        PoziviAjax.postNeobradeni(function(error, data){
            if(!error){
                var duzina = data.length;
                if(duzina != 0)
                {
                    document.getElementById("obavijest").innerHTML = "<div class='obavijest' onclick='zahtjevi()'>Imate "+ duzina + " neobrađen zahtjev za godišnji odmor!</div>";
                }
            }
        });
}


