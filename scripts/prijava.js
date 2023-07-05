var username, password;

function ispisi(error, data){
    if(!error){
    if(data == "Neuspješna prijava")
        document.getElementById("poruka").textContent = "Krivo korisničko ime ili lozinka!";
    else{
        document.body.innerHTML = "<h1>" + data + "</h1>";
        setTimeout(function(){
            window.location.href = window.location.protocol + "//" + window.location.hostname + "/predmeti.html";
        }, 2000);
    }
    }
}

window.onload = function(){
            username = document.getElementById("username");
            password = document.getElementById("password");
            document.getElementById("login-btn").addEventListener("click", function(){ PoziviAjax.postLogin(username.value,password.value,ispisi)});
}
