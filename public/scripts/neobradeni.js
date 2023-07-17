let trazi = "";
let pocetakD = "", krajD = "";
let pocetak, kraj;

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
            var parametri = box.parentElement.id.split(":");
            var zaposlenik = parametri[0];
            var p = new Date(parametri[1]);
            var k= new Date(parametri[2]);
            if(box.textContent == "Odbiji"){
                PoziviAjax.postIzbrisiRezervaciju(zaposlenik, p, k, ucitaj);
            }
            else if(box.textContent == "Prihvati"){
                var upozorenje = document.getElementById("upozorenje");
                upozorenje.style.display = "flex";
                pocetak = parametri[1];
                kraj = parametri[2];
                PoziviAjax.postRezervacijaTest(zaposlenik, pocetak, kraj, provjeriRezervacije);
            }
        });
    }
}

function provjeriRezervacije(error, broj, zaposlenik){
    if(!error){
        document.getElementById("brojZaposlenika").textContent = "Trenutno imate barem " + broj + " zaposlenika u firmi u razdoblju od " + pocetak + " do " + kraj + ".";
        document.getElementById("da").addEventListener("click", function(){
                    upozorenje.style.display = "none";
                    PoziviAjax.postPromjeniRezervaciju(zaposlenik, pocetak, kraj, ucitaj)});
        }
        document.getElementById("ne").addEventListener("click", function(){
            upozorenje.style.display = "none";
        });
}

function ucitaj(error, data){
    if(!error)
        PoziviAjax.postNeobradeni(ispisi);
}

function reset(){
    pocetakD = "";
    krajD = "";
    document.getElementById("datepickerP").value = "";
    document.getElementById("datepickerK").value = "";
    PoziviAjax.postNeobradeni(ispisi);
}

function traziZaposlenika(){
    trazi = document.getElementById("zaposlenik").value;
    PoziviAjax.postNeobradeni(ispisi);
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


            var regex = new RegExp(trazi, "i");
            if(regex.test(zaposlenik) || trazi == ""){
            if((new Date(pocetakD) <= new Date(pocetak) || pocetakD == "") && (new Date(krajD) >= new Date(kraj) || krajD == ""))
            vrati += "<div class='crvena' id='" + zaposlenik + ":" + pocetak + ":" + kraj + "'><h4> Zaposlenik: " + zaposlenik + "</h4><p> Početak godišnjeg: " 
            + pocetak + "</p><p> Kraj godišnjeg: " + kraj + "</p><p>Status: Neobrađen</p>"
            + "<button class='button'>Prihvati</button>" 
            + "<button class='button'>Odbiji</button></div>";
                }
            }
        }
        
        document.getElementById("rezervacije").innerHTML = vrati;
        postaviListener();
}

window.onload = function(){
    document.getElementById("odjava").addEventListener("click", function() { PoziviAjax.postOdjava(odjavi)});
    PoziviAjax.postNeobradeni(ispisi);
}

$(document).ready(function() {
    // Inicijalizacija Datepickera
    $("#datepickerP").datepicker();
    
    // Čitanje odabranog datuma
    $("#datepickerP").on("change", function() {
      var selectedDate = $(this).datepicker("getDate");
      pocetakD = $.datepicker.formatDate("yy-mm-dd", selectedDate);
      PoziviAjax.postNeobradeni(ispisi);
    });

    // Inicijalizacija Datepickera
    $("#datepickerK").datepicker();
  
    // Čitanje odabranog datuma
    $("#datepickerK").on("change", function() {
      var selectedDate = $(this).datepicker("getDate");
      krajD = $.datepicker.formatDate("yy-mm-dd", selectedDate);
      PoziviAjax.postNeobradeni(ispisi);
    });
});