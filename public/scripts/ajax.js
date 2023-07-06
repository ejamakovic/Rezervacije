
const PoziviAjax = (()=>{

    function impl_getRezervacije(naziv, fnCallback){
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function(){
        if (ajax.readyState == 4 && ajax.status == 200){
            var jsonRez = JSON.parse(ajax.responseText);
            fnCallback(null, jsonRez.lista);
            }
        else if (ajax.readyState == 4)
        fnCallback(ajax.statusText, null);
        }

        ajax.open("GET", "http://localhost:8080/rezervacije", true);
        ajax.send();
    }

    function impl_postPrijava(username,password,fnCallback){
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {// Anonimna funkcija
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
        ajax.onreadystatechange = function() {// Anonimna funkcija
        if (ajax.readyState == 4 && ajax.status == 200){ 
            fnCallback(null, "Uspješna odjava");
        }
        else if (ajax.readyState == 4)
        fnCallback(ajax.statusText, null);
        }
        
        ajax.open("POST","http://localhost:8080/odjava",true);
        ajax.send();
    }
    

    function impl_getZaposlenik(fnCallback){
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

        ajax.open("GET", "http://localhost:8080/zaposlenik", true);
        ajax.send();
    }

    function impl_getRezervacije(fnCallback){
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

        ajax.open("GET", "http://localhost:8080/rezervacije", true);
        ajax.send();
    }

    return{
    postOdjava: impl_postOdjava,
    postPrijava: impl_postPrijava,
    getRezervacije: impl_getRezervacije,
    getZaposlenik: impl_getZaposlenik
    };
    })();