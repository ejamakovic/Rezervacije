let username, pocetak = "", kraj = "";

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

function slanje(error, data){
    if(!error){
        document.body.innerHTML = "<h1>" + data + "</h1>";
        setTimeout(function(){
            window.location.href = "http://localhost:8080/zaposlenik";
        }, 2000);
    }
}

window.onload = function(){
        document.getElementById("odjava").addEventListener("click", function() { PoziviAjax.postOdjava(odjavi)});
        PoziviAjax.postZaposlenik(unesi);
        
        document.getElementById("login-btn").addEventListener("click", function(){
            username = document.getElementById("username").textContent;
            if(pocetak != "" && kraj != ""){
            if(new Date(kraj) < new Date(pocetak))
                document.getElementById("poruka").textContent = "Ne može datum kraja biti prije datuma početka";
            else if(new Date(pocetak) < Date.now())
                document.getElementById("poruka").textContent = "Ne može datum početka biti iza današnjeg datuma";
            else 
            PoziviAjax.postDodajRezervaciju(username, pocetak, kraj, slanje);
            }
            else 
                document.getElementById("poruka").textContent = "Niste izabrali oba datuma";
        });
}


$(document).ready(function() {
    // Inicijalizacija Datepickera
    $("#datepickerP").datepicker();
    
    // Čitanje odabranog datuma
    $("#datepickerP").on("change", function() {
      var selectedDate = $(this).datepicker("getDate");
      pocetak = $.datepicker.formatDate("yy-mm-dd", selectedDate);
    });

    // Inicijalizacija Datepickera
    $("#datepickerK").datepicker();
  
    // Čitanje odabranog datuma
    $("#datepickerK").on("change", function() {
      var selectedDate = $(this).datepicker("getDate");
      kraj = $.datepicker.formatDate("yy-mm-dd", selectedDate);
    });
});

