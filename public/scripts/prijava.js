var username, password;

function ispisi(error, data, sef){
    if(!error){
    if(data == "Neuspješna prijava")
        document.getElementById("poruka").textContent = "Krivo korisničko ime ili lozinka!";
    else{
        document.body.innerHTML = "<h1>" + data + "</h1>";
        setTimeout(function(){
            if(sef)
                window.location.href = "http://localhost:8080/sef";
            else
                window.location.href = "http://localhost:8080/zaposlenik";
        }, 2000);
    }
    }
}

window.onload = function(){
            username = document.getElementById("username");
            password = document.getElementById("password");
            document.getElementById("login-btn").addEventListener("click", function(){ PoziviAjax.postPrijava(username.value,password.value,ispisi)});
}
