
let ime, prezime, password;

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

function napravi(){
    ime = document.getElementById("ime").value;
    prezime = document.getElementById("prezime").value;
    password = document.getElementById("password").value;
    var pre = prezime.toLowerCase();
    pre = pre.replaceAll("č", "c");
    pre = pre.replaceAll("ć", "c");
    pre = pre.replaceAll("š", "s");
    pre = pre.replaceAll("ž", "z");
    pre = pre.replaceAll("đ", "d");
    pre = pre.replaceAll("dž", "dz");

    var username = ime.substring(0,1).toLowerCase() + pre.toLowerCase();

    PoziviAjax.postUsername(username, posalji);
    
}

function posalji(error, username){
    PoziviAjax.postDodajZaposlenika(ime, prezime, username, password, poruka);
}

function poruka(error, data){
    if(!error){
        document.body.innerHTML = "<h1>" + data + "</h1>";
        setTimeout(function(){
            window.location.href = "http://localhost:8080/sef";
        }, 2000);
    }
}

window.onload = function(){
        document.getElementById("odjava").addEventListener("click", function() { PoziviAjax.postOdjava(odjavi)});
        PoziviAjax.postZaposlenik(unesi);
}


