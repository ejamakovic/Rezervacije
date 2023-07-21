let pocetakD = "", krajD = "";

function odjavi(error, data){
  if(!error){
      document.body.innerHTML = "<h1>" + data + "</h1>";
      setTimeout(function(){
          window.location.href = "http://localhost:8080";
      }, 2000);
  }
}
        
        function reset(){
            pocetakD = "";
            krajD = "";
            document.getElementById("datepickerP").value = "";
            document.getElementById("datepickerK").value = "";
            var pom = new Date();
            pom.setDate(pom.getDate() + 30);
            PoziviAjax.postLista(new Date(), pom, ispisi);
        }
        
        
        function ispisi(error, data){
            if(!error){
                    document.getElementById("lista").innerHTML = data;
                }
            }
        
        
        window.onload = function(){
            document.getElementById("odjava").addEventListener("click", function() { PoziviAjax.postOdjava(odjavi)});
            var pom = new Date();
            pom.setDate(pom.getDate() + 30);
            PoziviAjax.postLista(new Date(), pom, ispisi);
        }
        
        $(document).ready(function() {
            
            $("#datepickerP").datepicker();
            
            
            $("#datepickerP").on("change", function() {
              var selectedDate = $(this).datepicker("getDate");
              pocetakD = $.datepicker.formatDate("yy-mm-dd", selectedDate);
              if(krajD != "")
                PoziviAjax.postLista(pocetakD, krajD, ispisi);
              else if(pocetakD != ""){
                var pom = new Date(pocetakD);
                pom.setDate(pom.getDate() + 30);
                PoziviAjax.postLista(pocetakD, pom, ispisi);
              }
            });
        
            $("#datepickerK").datepicker();
          
            $("#datepickerK").on("change", function() {
              var selectedDate = $(this).datepicker("getDate");
              krajD = $.datepicker.formatDate("yy-mm-dd", selectedDate);
              if(pocetakD != "")
              PoziviAjax.postLista(pocetakD, krajD, ispisi);
              else if(krajD != "")
              PoziviAjax.postLista(new Date(), krajD, ispisi);
              
            });
        });