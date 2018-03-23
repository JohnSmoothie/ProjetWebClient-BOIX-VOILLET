$(document).ready(function() {
  var urlFlickr = "https://api.flickr.com/services/rest/";
  var apiKey = "45074180ed9c766da6cdd745043f1cdc";

  var form = $("#form");
  var ville = $("#ville");
  var nbPhotos = $("#nbPhotos");


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

  $(form).submit(function(event){
    event.preventDefault();
    console.log($(nbPhotos).val());
    console.log($(ville).val());

    var ajax = $.ajax({
      url : urlFlickr,
      method : 'GET',
      data : {
        method : 'flickr.photos.search',
        api_key : apiKey,
        tags : $(ville).val(),
        format : 'json',
        par_page : $(nbPhotos).val(),
        nojsoncallback : 1
      }
    });

    ajax.done(function(res){
      console.log(res);
      $("#listePhoto").empty();
      $(res.photos.photo).each(function(index, elt){
        console.log(this);
        var lien = "https://farm"+this.farm+".staticflickr.com/"+this.server+"/"+this.id+"_"+this.secret+".jpg";
        $("#listePhoto").append("<li><img src=\""+lien+"\"/></li>");
      });
    });

    ajax.fail(function(data){
      console.log("Désolé, une erreure est survenue");
      console.log(data);
    });

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
