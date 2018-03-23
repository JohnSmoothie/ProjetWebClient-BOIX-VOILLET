$(document).ready(function() {
  var urlFlickr = "https://api.flickr.com/services/rest/";
  var apiKey = "45074180ed9c766da6cdd745043f1cdc";

<<<<<<< HEAD
  var form = $("#form");
=======
>>>>>>> b8b61e4612b9da3df87fd70ea585a355698ac846



  $('#VueTab').hide();
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

  var form = $("#form");
  $(form).submit(function(event){
    var ville = $("#ville");
    var nbPhotos = $("#nbPhotos");
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
        per_page : $(nbPhotos).val(),
        nojsoncallback : 1
      }
    });

    ajax.done(function(res){
      console.log(res);
      $("#listePhoto").empty();
      $(res.photos.photo).each(function(index, elt){
        console.log(this);
        var id = this.id;
        var secret = this.secret;
        var lien = "https://farm"+this.farm+".staticflickr.com/"+this.server+"/"+id+"_"+secret+".jpg";
        //pour la vue Photo
        $("#listePhoto").append("<li><img src=\""+lien+"\"/></li>");
        var photo = $("#"+this.id);
        $(photo).click(function() {
          $(photo).closest(".modal").css("display", "initial");
          $(photo).closest(".modalbg").css("display", "initial");
        });
        //pour la vue Tableau
        var ajaxTab = $.ajax({
          url : urlFlickr,
          method : 'GET',
          data : {
            method : 'flickr.photos.getInfo',
            api_key : apiKey,
            photo_id : id,
            secret : secret,
            format : 'json',
            nojsoncallback : 1
          }

        });

        ajaxTab.done(function(resTab) {

        })
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



  $(".modal_close").click(function() {
    $(".modal").css("display", "none");
    $(".modalbg").css("display", "none");
  });

  $(".modalbg").click(function() {
    $(".modal").css("display", "none");
    $(".modalbg").css("display", "none");
  });

  /*loupe
  $("td.tab-chiffre").each(function(index, elt) {
  $(elt).mouseenter(function(){
  $('#loupe').text($(this).text());
})
})*/
});
