

function odjavi(error, data){
    if(!error){
        document.body.innerHTML = "<h1>" + data + "</h1>";
        setTimeout(function(){
            window.location.href = "http://localhost:8080";
        }, 2000);
    }
}

function rezervacije(err, data){
    if(data){

    }
    else
    
}

window.onload = function(){
        document.getElementById("odjava").addEventListener("click", function() { PoziviAjax.postOdjava(odjavi)});
        document.getElementById("rezervacije").addEventListener("click", function() { PoziviAjax.getZaposlenik(rezervacije)});
}


