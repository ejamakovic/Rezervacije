
function odjavi(error, data){
    if(!error){
        document.body.innerHTML = "<h1>" + data + "</h1>";
        setTimeout(function(){
            window.location.href = "http://localhost:8080";
        }, 2000);
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
            document.getElementById("ime").innerHTML = data[i].zaposlenik;
            var zaposlenik = data[i].zaposlenik;
            var pocetak = data[i].datum_pocetka_godisnjeg;
            var kraj = data[i].datum_kraja_godisnjeg;
            var odobren =  data[i].odobren;
            var kartica = "crvena"
            if(odobren)
                kartica = "zelena"; 
            vrati += "<div class='" + kartica + "'><h2> Zaposlenik: " + zaposlenik + "</h2><p> Početak godišnjeg: " + pocetak + "</p><p> Kraj godišnjeg: " + kraj + "</p></div>"
        }

        document.getElementById("rezervacije").innerHTML = vrati;
    }
}

window.onload = function(){
    document.getElementById("odjava").addEventListener("click", function() { PoziviAjax.postOdjava(odjavi)});
    PoziviAjax.getRezervacije(ispisi);
}


//<div class="card">
    //<h2>Podaci</h2>
    //<p>Ovdje su neki podaci...</p>
    //<button class="button" onclick="funkcija1()">Gumb 1</button>
    //<button class="button" onclick="funkcija2()">Gumb 2</button>
  //</div>