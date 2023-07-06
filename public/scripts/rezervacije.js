let opcija = "sve";

function odjavi(error, data){
    if(!error){
        document.body.innerHTML = "<h1>" + data + "</h1>";
        setTimeout(function(){
            window.location.href = "http://localhost:8080";
        }, 2000);
    }
}
function postaviListener(){
    let dugmad = document.getElementsByClassName("button");
    for(let box of dugmad){
        box.addEventListener("click", function handleClick(event){
            var parametri = box.id.split(":");
            var zaposlenik = parametri[0];
            var pocetak = new Date(parametri[1]);
            var kraj = new Date(parametri[2]);
            if(box.parentElement.className == "zelena" && box.textContent == "NE")
                box.parentElement.className = "crvena";
            else if(box.parentElement.className == "crvena" && box.textContent == "DA")
                box.parentElement.className = "zelena";
            PoziviAjax.postRezervacija(zaposlenik, pocetak, kraj, potvrda);
        });
    }
}

function potvrda(error, data){

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
            var odobren =  data[i].odobren;
            var kartica = "crvena"
            if(odobren)
                kartica = "zelena"; 
            vrati += "<div class='" + kartica + "'><h4> Zaposlenik: " + zaposlenik + "</h4><p> Početak godišnjeg: " + pocetak + "</p><p> Kraj godišnjeg: " + kraj + "</p>"
            + "<button class='button' id='" + zaposlenik +":" + pocetak + ":" + kraj + "'>DA</button>" 
            + "<button class='button' id='" + zaposlenik +":" + pocetak + ":" + kraj + "'>NE</button></div>";
        }
        
        document.getElementById("rezervacije").innerHTML = vrati;
        postaviListener();
    }
}

window.onload = function(){
    var filter = document.getElementById("filter")
    filter.addEventListener("change", function(){
        opcija = filter.value;
    });
    document.getElementById("odjava").addEventListener("click", function() { PoziviAjax.postOdjava(odjavi)});
    PoziviAjax.getRezervacije(ispisi);
}