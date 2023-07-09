let opcija = "sve";
let trazi = "";
let pocetakD = "", krajD = "";

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
            if(box.parentElement.className == "zelena" && box.textContent == "NE"){
                box.parentElement.className = "crvena";
                PoziviAjax.postRezervacije(zaposlenik, pocetak, kraj, ispisi);
            }
            else if(box.parentElement.className == "crvena" && box.textContent == "DA"){
                box.parentElement.className = "zelena";
                PoziviAjax.postRezervacije(zaposlenik, pocetak, kraj, ispisi);
            }
            
        });
    }
}

function reset(){
    pocetakD = "";
    krajD = "";
    document.getElementById("datepickerP").value = "";
    document.getElementById("datepickerK").value = "";
    PoziviAjax.getRezervacije(ispisi);
}

function traziZaposlenika(){
    trazi = document.getElementById("zaposlenik").value;
    PoziviAjax.getRezervacije(ispisi);
}

function ispisi(error, data){
    if(!error){
        if(data == "Niste prijavljeni na DigiPay" || data == "Niste šef!"){
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
            var kartica = "crvena";
            if(odobren)
                kartica = "zelena";

            if((opcija=="odobreni" && kartica == "zelena") || (opcija=="neodobreni" && kartica == "crvena") || opcija == "sve"){
            var regex = new RegExp(trazi, "i");
            if(regex.test(zaposlenik) || trazi == ""){
                if((new Date(pocetakD) <= new Date(pocetak) || pocetakD == "") && (new Date(krajD) >= new Date(kraj) || krajD == ""))
            vrati += "<div class='" + kartica + "'><h4> Zaposlenik: " + zaposlenik + "</h4><p> Početak godišnjeg: " + pocetak + "</p><p> Kraj godišnjeg: " + kraj + "</p>"
            + "<button class='button' id='" + zaposlenik +":" + pocetak + ":" + kraj + "'>DA</button>" 
            + "<button class='button' id='" + zaposlenik +":" + pocetak + ":" + kraj + "'>NE</button></div>";
                }
            }
        }
        
        document.getElementById("rezervacije").innerHTML = vrati;
        postaviListener();
    }
}
window.onload = function(){
    var filter = document.getElementById("filter")
    filter.addEventListener("change", function(){
        opcija = filter.value;
        PoziviAjax.getRezervacije(ispisi);
    });
    document.getElementById("odjava").addEventListener("click", function() { PoziviAjax.postOdjava(odjavi)});
    PoziviAjax.getRezervacije(ispisi);
}

$(document).ready(function() {
    // Inicijalizacija Datepickera
    $("#datepickerP").datepicker();
    
    // Čitanje odabranog datuma
    $("#datepickerP").on("change", function() {
      var selectedDate = $(this).datepicker("getDate");
      pocetakD = $.datepicker.formatDate("yy-mm-dd", selectedDate);
      PoziviAjax.getRezervacije(ispisi);
    });

    // Inicijalizacija Datepickera
    $("#datepickerK").datepicker();
  
    // Čitanje odabranog datuma
    $("#datepickerK").on("change", function() {
      var selectedDate = $(this).datepicker("getDate");
      krajD = $.datepicker.formatDate("yy-mm-dd", selectedDate);
      PoziviAjax.getRezervacije(ispisi);
    });
});