$(document).ready(function() {
    $('table').hide();
    var lastTab = null;
    $(".onglets a").each(function(index, elt) {
        $(elt).click(function(event) {
            event.preventDefault();
            $('table').hide();
            var currentTab = $('table'+$(this).attr("href"));
            if(currentTab == lastTab) {
                currentTab.hide();
            } else {
                currentTab.show();
                lastTab = currentTab;
            }
        })
    });

    var inputCommune = $("#ville");

    console.log($("#ville"));

    $("#ville").autocomplete({

      source: function(request, response){

        recherche = 'commune='+inputCommune.val()+"&maxRows=10";
        console.log(recherche);

        var ajax = $.ajax({
          url : 'http://infoweb-ens/~jacquin-c/codePostal/commune.php',  // Ressource ciblée coté serveur
          type : 'GET',
          data : recherche,//$_GET['nom'] au niveau serveur
        });

        ajax.done(function(codeHtmlSucces){
          console.log(codeHtmlSucces);
            map = $.map(codeHtmlSucces, function(n, i){
              ville = n.Ville;
              label = n.Ville;
              value = n.Ville;
              return {ville, label, value};
            });
            console.log(map);
            return response(map);
          });
      }

    });

    $("#ville").autocomplete( "option", "minLength", 3 );

    $("#ville").on( "autocompleteselect", function( event, ui ) {
      event.preventDefault();

          console.log(ui);
          console.log(ui.item.label);
          console.log(ui.item.value);
          console.log($(this));

          inputCommune.val(ui.item.ville);


    });
    /*loupe
    $("td.tab-chiffre").each(function(index, elt) {
        $(elt).mouseenter(function(){
            $('#loupe').text($(this).text());
        })
    })*/
});
