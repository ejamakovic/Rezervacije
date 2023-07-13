
const PoziviAjax = (()=>{

    function impl_postPrijava(username,password,fnCallback){
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.status == 200){
        var jsonRez = JSON.parse(ajax.responseText);
        fnCallback(null,jsonRez.poruka, jsonRez.sef);
        }
        else if (ajax.readyState == 4)
        fnCallback(ajax.statusText, null);
        }
        
        ajax.open("POST","http://localhost:8080/prijava",true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify({username:username, password: password}));
    }
    
    
    function impl_postOdjava(fnCallback){
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.status == 200){ 
            fnCallback(null, "Uspješna odjava");
        }
        else if (ajax.readyState == 4)
        fnCallback(ajax.statusText, null);
        }
        
        ajax.open("POST","http://localhost:8080/odjava",true);
        ajax.send();
    }
    

    function impl_postZaposlenik(fnCallback){
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function(){
        if (ajax.readyState == 4 && ajax.status == 200){
            var jsonRez = JSON.parse(ajax.responseText);
            if(jsonRez.username != undefined)
                fnCallback(null, jsonRez.username);
            else
                fnCallback(null, jsonRez.greska);
            }
        else if (ajax.readyState == 4)
        fnCallback(ajax.statusText, null);
        }

        ajax.open("POST", "http://localhost:8080/zaposlenik", true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send();
    }

    function impl_postRezervacije(fnCallback){
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function(){
        if (ajax.readyState == 4 && ajax.status == 200){
            var jsonRez = JSON.parse(ajax.responseText);
            if(jsonRez.lista != undefined)
                fnCallback(null, jsonRez.lista);
            else
                fnCallback(null, jsonRez.greska);
        }
        else if(ajax.readyState == 4)
            fnCallback(ajax.statusText, null);
        }

        ajax.open("POST",encodeURI("http://localhost:8080/rezervacije"),true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send();
    }

    function impl_postPromjeniRezervaciju(username, pocetak, kraj, fnCallback){
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.status == 200){ 
            var jsonRez = JSON.parse(ajax.responseText);
            fnCallback(null, jsonRez.lista);
        }
        else if (ajax.readyState == 4)
        fnCallback(ajax.statusText, null);
        }
        
        ajax.open("POST",encodeURI("http://localhost:8080/rezervacija/zaposlenik/promjeni" ),true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify({zaposlenik: username, pocetak: pocetak, kraj: kraj}));
    }

    function impl_postDodajRezervaciju(username, pocetak, kraj, fnCallback){
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.status == 200){
        var jsonRez = JSON.parse(ajax.responseText);
        fnCallback(null, jsonRez.poruka);
        }
        else if (ajax.readyState == 4)
        fnCallback(ajax.statusText, null);
        }
        
        ajax.open("POST",encodeURI("http://localhost:8080/rezervisi/zaposlenik/:" + username ),true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify({pocetak: pocetak, kraj: kraj}));
    }

    function impl_postUsername(username, fnCallback){
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.status == 200){
        var jsonRez = JSON.parse(ajax.responseText);
        fnCallback(null, jsonRez.username);
        }
        else if (ajax.readyState == 4)
        fnCallback(ajax.statusText, null);
        }
        
        ajax.open("POST","http://localhost:8080/username",true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify({username: username}));
    }

    function impl_postDodajZaposlenika(ime, prezime, username, password, fnCallback){
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.status == 200){
        var jsonRez = JSON.parse(ajax.responseText);
        fnCallback(null, jsonRez.poruka);
        }
        else if (ajax.readyState == 4)
        fnCallback(ajax.statusText, null);
        }
        
        ajax.open("POST","http://localhost:8080/dodajZaposlenika",true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify({ime: ime, prezime: prezime, username: username, password: password}));
    }

    function impl_postNeobradeni(fnCallback){
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.status == 200){
        var jsonRez = JSON.parse(ajax.responseText);
        fnCallback(null, jsonRez.lista);
        }
        else if (ajax.readyState == 4)
        fnCallback(ajax.statusText, null);
        }
        
        ajax.open("POST","http://localhost:8080/neobradeni",true);
        ajax.send();
    }

    function impl_postIzbrisiRezervaciju(username, pocetak, kraj, fnCallback){
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.status == 200){ 
            var jsonRez = JSON.parse(ajax.responseText);
            fnCallback(null, jsonRez.lista);
        }
        else if (ajax.readyState == 4)
        fnCallback(ajax.statusText, null);
        }
        
        ajax.open("POST",encodeURI("http://localhost:8080/rezervacija/zaposlenik/izbrisi" ),true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify({zaposlenik: username, pocetak: pocetak, kraj: kraj}));
    }
    
    return{
    postOdjava: impl_postOdjava,
    postPrijava: impl_postPrijava,
    postRezervacije: impl_postRezervacije,
    postZaposlenik: impl_postZaposlenik,
    postPromjeniRezervaciju: impl_postPromjeniRezervaciju,
    postDodajRezervaciju: impl_postDodajRezervaciju,
    postUsername: impl_postUsername,
    postDodajZaposlenika: impl_postDodajZaposlenika,
    postNeobradeni: impl_postNeobradeni,
    postIzbrisiRezervaciju: impl_postIzbrisiRezervaciju
    };
    })();