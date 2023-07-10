

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

function posalji(){
    var ime = document.getElementById("ime").value;
    var prezime = document.getElementById("prezime").value;
    var password = document.getElementById("password").value;
    var pre = prezime.replace("č", "c");
    pre = pre.replace("ć", "c");
    pre = pre.replace("š", "s");
    pre = pre.replace("ž", "z");
    pre = pre.replace("đ", "d");
    pre = pre.replace("dž", "dz");

    var username = ime.substring(0,1).toLowerCase() + pre.toLowerCase();

    PoziviAjax.postDodajZaposlenika(ime, prezime, username, password);
}



window.onload = function(){
        document.getElementById("odjava").addEventListener("click", function() { PoziviAjax.postOdjava(odjavi)});
        PoziviAjax.postZaposlenik(unesi);
}


