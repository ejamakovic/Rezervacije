
let ime, prezime, password, username;

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

    var pre = prezime.value.toLowerCase();
    pre = pre.replaceAll("č", "c");
    pre = pre.replaceAll("ć", "c");
    pre = pre.replaceAll("š", "s");
    pre = pre.replaceAll("ž", "z");
    pre = pre.replaceAll("đ", "d");
    pre = pre.replaceAll("dž", "dz");

    username = ime.value.substring(0,1).toLowerCase() + pre.toLowerCase();

    PoziviAjax.postUsername(username, popuni);
    
}

function popuni(error, user){
    username = user;
    document.getElementById("korisnik").value = username;
}

function posalji(){
    PoziviAjax.postDodajZaposlenika(ime.value, prezime.value, username, password.value, poruka);
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
        ime = document.getElementById("ime");
        prezime = document.getElementById("prezime");
        password = document.getElementById("password");
        document.getElementById("odjava").addEventListener("click", function() { PoziviAjax.postOdjava(odjavi)});
        
        ime.addEventListener('input', napravi);
        ime.addEventListener('propertychange', napravi); 
        prezime.addEventListener('input', napravi);
        prezime.addEventListener('propertychange', napravi);
        PoziviAjax.postZaposlenik(unesi);
}


