var username, password;

function ispisi(error, data, sef, prijavaPrviPut){
    if(!error){
    if(data == "Neuspješna prijava")
        document.getElementById("poruka").textContent = "Krivo korisničko ime ili lozinka!";
    else{
        if(prijavaPrviPut){
        document.body.innerHTML = "<h1>" + data + "</h1>";
        setTimeout(function(){
            if(sef)
                window.location.href = "http://localhost:8080/sef";
            else
                window.location.href = "http://localhost:8080/zaposlenik";
        }, 2000);
        }
        else
            window.location.href = "http://localhost:8080/promjenaLozinke";
    }
    }
}

window.onload = function(){
            username = document.getElementById("username");
            password = document.getElementById("password");
            document.getElementById("login-btn").addEventListener("click", function(){ PoziviAjax.postPrijava(username.value,password.value,ispisi)});
}
