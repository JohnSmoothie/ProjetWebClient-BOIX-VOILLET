$(document).ready(function() {
  var urlFlickr = "https://api.flickr.com/services/rest/";
  var apiKey = "45074180ed9c766da6cdd745043f1cdc";


  var form = $("#form");
  var dataSet = [];
  var dataSet2 = [];
  var dataTable = false;
  var nbAjaxComplete = 0;
  var nbAjaxComplete2 = 0;
  var modal = $( "#dialog" );
  $(modal).dialog({ autoOpen: false, modal: true, width : 1200, height: 600});


  $('#VueTab').hide();
  var lastTab = null;
  $(".onglets a").each(function(index, elt) {
    $(elt).click(function(event) {
      event.preventDefault();
      $('table').hide();
      $('#VuePhoto').hide();
      console.log(this);
      if ($(this).attr("href") == "#VueTab") {
        var currentTab = $('table'+$(this).attr("href"));
        if(currentTab == lastTab) {
          currentTab.hide();
        } else {
          currentTab.show();
          lastTab = currentTab;
        }
      }
      else{
        var currentTab = $('div'+$(this).attr("href"));
        if(currentTab == lastTab) {
          currentTab.hide();
        } else {
          currentTab.show();
          lastTab = currentTab;
        }
      }

    })
  });

  $(form).submit(function(event){
    var ville = $("#ville");
    var nbPhotos = $(".nbPhotos");
    event.preventDefault();
    //console.log($(nbPhotos).val());
    //console.log($(ville).val());

    var ajax = $.ajax({
      url : urlFlickr,
      method : 'GET',
      data : {
        method : 'flickr.photos.search',
        api_key : apiKey,
        tags : $(ville).val(),
        format : 'json',
        per_page : $(nbPhotos).slider( "option", "value" ),
        nojsoncallback : 1
      }
    });

    ajax.done(function(res){
      nbAjaxComplete = 0;
      nbAjaxComplete2 = 0;
      console.log(res);
      $("#listePhoto").empty();
      $("#VueTabBody").empty();
      nbAjaxComplete2 = $(res.photos.photo).length;
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

        if (res.photos.photo.length == 0) {
          $(modal).empty();
          $(modal).dialog( "option", "height", 170 );
          $(modal).dialog( "option", "width", 500 );
          $(modal).append("<h1 class=\"noResult\"> Aucun résultat trouvé </h1>");
          $(modal).dialog("open");
        }
        else
        {
          $("#listePhoto").empty();
          $(res.photos.photo).each(function(index, elt){
            //console.log(this);
            var id = this.id;
            var secret = this.secret;
            var lien = "https://farm"+this.farm+".staticflickr.com/"+this.server+"/"+id+"_"+secret+".jpg";
            //pour la vue Photo
            $("#listePhoto").append("<span class=\"photos_VuePhoto\"><img id=\""+this.id+"\" src=\""+lien+"\"/></span>");
            var photo_courante = $("#"+this.id);
            //console.log($(photo_courante));

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
              //console.log(resTab);
              dataSet2 = [];
              var img = "<img src=\""+lien+"\"/>"
              var date = resTab.photo.dates.taken;
              var nom = resTab.photo.title._content;
              var pseudo = resTab.photo.owner.username;

              var afficherModale = " <div class=\"element_afficherModale\" ><img src=\""+lien+"\"/> <div> <b> Nom: </b>"+nom+"</div><div> <b> Photographe: </b>"+pseudo+"</div><div> <b> Date: </b>"+date+"</div></div> "
              $(photo_courante).click(function() {
                $(modal).empty();
                $(modal).dialog( "option", "height", 600 );
                $(modal).dialog( "option", "width", 1000 );
                $(modal).append(afficherModale);
                $(modal).dialog( "open" );
              });

              dataSet2.push(img, nom, pseudo, date);
              dataSet.push(dataSet2);
              //console.log("dataset2"+dataSet2);
            });
          });

          ajax.fail(function(data){
            //console.log("Désolé, une erreure est survenue");
            //console.log(data);
          });
        }

      });
    });

    ajax.fail(function(data){
      console.log("Désolé, une erreure est survenue");
      console.log(data);
    });

  });

  $(document).ajaxComplete(function() {
    nbAjaxComplete = nbAjaxComplete + 1;
    console.log( "Triggered ajaxComplete handler." );
    if(nbAjaxComplete == nbAjaxComplete2){
      if(dataTable == false) {
        console.log("test");
        dataTable = true;
        $('#VueTab').dataTable( {
          data: dataSet,
          searching : false,
        } );
      }
    }
  });

  var inputCommune = $("#ville");

  //console.log($("#ville"));

  $("#ville").autocomplete({

    source: function(request, response){

      recherche = 'commune='+inputCommune.val()+"&maxRows=10";
      //console.log(recherche);

      var ajax = $.ajax({
        url : 'http://infoweb-ens/~jacquin-c/codePostal/commune.php',  // Ressource ciblée coté serveur
        type : 'GET',
        data : recherche,//$_GET['nom'] au niveau serveur
      });

      ajax.done(function(codeHtmlSucces){
        //console.log(codeHtmlSucces);
        map = $.map(codeHtmlSucces, function(n, i){
          ville = n.Ville;
          label = n.Ville;
          value = n.Ville;
          return {ville, label, value};
        });
        //console.log(map);
        return response(map);
      });
    }

  });

  $("#ville").autocomplete( "option", "minLength", 2 );

  $("#ville").on( "autocompleteselect", function( event, ui ) {
    event.preventDefault();

    //console.log(ui);
    //console.log(ui.item.label);
    //console.log(ui.item.value);
    //console.log($(this));

    inputCommune.val(ui.item.ville);
    $(".errMessage").hide();
    $(form).submit();
  });



  $(".modal_close").click(function() {
    $(".modal").css("display", "none");
    $(".modalbg").css("display", "none");
  });

  $(".modalbg").click(function() {
    $(".modal").css("display", "none");
    $(".modalbg").css("display", "none");
  });

  $(".icone").click(function(){

    recherche = 'commune='+inputCommune.val()+"&maxRows=10";
    //console.log(recherche);
    var commune = inputCommune.val();
    var communeBonne = false;

    var ajax = $.ajax({
      url : 'http://infoweb-ens/~jacquin-c/codePostal/commune.php',  // Ressource ciblée coté serveur
      type : 'GET',
      data : recherche,//$_GET['nom'] au niveau serveur
    });

    ajax.done(function(codeHtmlSucces){
      //console.log(codeHtmlSucces);
      $(codeHtmlSucces).each(function(index, elt){
        console.log(commune+" égal à "+elt.Ville+" ?");
        if (commune == elt.Ville) {
          console.log("oui");
          communeBonne = true;
        }
      });

      if (communeBonne == true) {
        $(".errMessage").hide();
        $(form).submit();
      }
      else{
        $(".errMessage").show();
      }
    });


  });

  var handle = $( "#custom-handle" );
  $("#slider").slider({
    create: function() {
      handle.text( $( this ).slider( "value" ) );
    },
    slide: function( event, ui ) {
      handle.text( ui.value );
    },
    max : 100,
    min : 1
  });
  /*loupe
  $("td.tab-chiffre").each(function(index, elt) {
  $(elt).mouseenter(function(){
  $('#loupe').text($(this).text());
})
})*/
});
