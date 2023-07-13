let newPassword, password;

function ispisi(error, data){
    if(!error){
        document.body.innerHTML = "<h1>" + data + "</h1>";
        setTimeout(function(){
                window.location.href = "http://localhost:8080/zaposlenik";
        }, 2000);
    }
}

window.onload = function(){
            newPassword = document.getElementById("newPassword");
            password = document.getElementById("password");
            
            document.getElementById("login-btn").addEventListener("click", function(){ 
                if(newPassword.value === password.value)
                    PoziviAjax.postPromjenaLozinke(password.value,ispisi);
                else
                    document.getElementById("poruka").textContent = "Lozinke nisu iste!";
            });
}
