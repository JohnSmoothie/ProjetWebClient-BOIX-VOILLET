$(document).ready(function() {

  //////////////////////////////////////////////////////////////////////////////// Variables

  //Pour flickr
  var urlFlickr = "https://api.flickr.com/services/rest/";
  var apiKey = "45074180ed9c766da6cdd745043f1cdc";

  //Pour la dataTable
  var dataSet = [];
  var dataSet2 = [];
  var dataTable = false;
  var nbAjaxComplete = 0;
  var nbAjaxComplete2 = 0;
  var table = null;

  //Autres
  var form = $("#form");
  var modal = $( "#dialog" );
  var calendar = $("#calendar");
  $(modal).dialog({ autoOpen: false, modal: true, width : 1200, height: 600});

  ////////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////////////////// Onglets

  $('#VueTableau').hide();

  var lastTab = null;

  $(".onglets a").each(function(index, elt) { //Pour chaque onglet
    $(elt).click(function(event) {
      event.preventDefault();
      //On cache les deux vues
      $('#VueTableau').hide();
      $('#VuePhoto').hide();
      //console.log(this);
      var currentTab = $('div'+$(this).attr("href")); //On enregistre la vue que l'utilisateur veux
      currentTab.show(); //On l'affiche
    })
  });

  ////////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////////////////// Lorsque le formulaire est validé

  $(form).submit(function(event){
    var ville = $("#ville");
    var nbPhotos = $(".nbPhotos");
    var date = $(calendar).datepicker("getDate");
    var ajax = null;
    event.preventDefault();
    //console.log($(nbPhotos).val());
    //console.log($(ville).val());

    //////////////////////////////////////////////////////////////////////////////// Requette ajax n°1 (récupère toutes les photos voulues)

    //Si une date à été indiqué
    if (date != null) {
      ajax = $.ajax({
        url : urlFlickr,
        method : 'GET',
        data : {
          method : 'flickr.photos.search',
          api_key : apiKey,
          tags : $(ville).val(),
          format : 'json',
          per_page : $(nbPhotos).slider( "option", "value" ),
          nojsoncallback : 1,
          min_upload_date : Math.round((date).getTime() / 1000)
        }
      });
    }
    //Si aucune date n'a été indiqué
    else{
      ajax = $.ajax({
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
    }

    //////////////////////////////////////////////////////////////////////////////// Requette Ajax 1 done

    ajax.done(function(res){
      //On réinitialise des variables pour la dataTable
      dataSet = [];
      dataSet2 = [];
      nbAjaxComplete = 0;
      nbAjaxComplete2 = 0;
      nbAjaxComplete2 = $(res.photos.photo).length + 1;

      //On vide la vue photo
      $("#listePhoto").empty();


      //Si on récupère 0 photos on affiche une fenêtre modale
      if (res.photos.photo.length == 0) {
        $(modal).empty();
        $(modal).dialog( "option", "height", 170 );
        $(modal).dialog( "option", "width", 500 );
        $(modal).append("<h1 class=\"noResult\"> Aucun résultat trouvé </h1>");
        $(modal).dialog("open");
      }
      //Si On récupère au moins une photo
      else {
        $(res.photos.photo).each(function(index, elt){ //Pour chaque photo
          //console.log(this);

          //On récupère des données de la photo
          var id = this.id;
          var secret = this.secret;
          var lien = "https://farm"+this.farm+".staticflickr.com/"+this.server+"/"+id+"_"+secret+".jpg";

          //////////////////////////////////////////////////////////////////////////////// Pour la vue photo

          //On ajoute la photo a la liste
          $("#listePhoto").append("<div class=\"photos_VuePhoto\"><img id=\""+this.id+"\" src=\""+lien+"\"/></div>");
          //On récupère la photo pour plus tard
          var photo_courante = $("#"+this.id);


          //////////////////////////////////////////////////////////////////////////////// Requette Ajax 2 (récupère les info d'une photo)

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

          //////////////////////////////////////////////////////////////////////////////// Requette Ajax 2 Done

          ajaxTab.done(function(resTab) {

            //On réinitialise dataSet2 pour chaque photo
            dataSet2 = [];

            //On récupère certaines onformations de la photo
            var img = "<img src=\""+lien+"\"/>"
            var date = resTab.photo.dates.taken;
            var nom = resTab.photo.title._content;
            var pseudo = resTab.photo.owner.username;

            //////////////////////////////////////////////////////////////////////////////// Pour la vue photo

            //On initialise ce que l'on affiche dans la modale
            var afficherModale = " <div class=\"element_afficherModale\" ><img src=\""+lien+"\"/> <div> <b> Nom: </b>"+nom+"</div><div> <b> Photographe: </b>"+pseudo+"</div><div> <b> Date: </b>"+date+"</div></div> "

            $(photo_courante).click(function() { //Quand on clique sur une photo, une fenêtre modale s'affiche
            $(modal).empty();
            $(modal).dialog( "option", "height", 600 );
            $(modal).dialog( "option", "width", 1000 );
            $(modal).append(afficherModale);
            $(modal).dialog( "open" );
          });

          //////////////////////////////////////////////////////////////////////////////// Pour la vue Tableau
          //On insère les informations de la photo dans un dataSet
          dataSet2.push(img, nom, pseudo, date);
          dataSet.push(dataSet2);

        });

        ajax.fail(function(data){
          console.log("Désolé, une erreure est survenue");
          console.log(data);
        });
      });

    }
  });

  ajax.fail(function(data){
    console.log("Désolé, une erreure est survenue");
    console.log(data);
  });

});

//////////////////////////////////////////////////////////////////////////////// Pour la vue Tableau

$(document).ajaxComplete(function() {
  //On vérifie que toutes les requette ajax sont bien finies
  nbAjaxComplete = nbAjaxComplete + 1;
  if(nbAjaxComplete == nbAjaxComplete2){
    if(dataTable == false) { //Si la table n'existe pas on l'initialise
      dataTable = true;
      table = $('#VueTab').dataTable( {
        data: dataSet,
        searching : false,
      } );
    }
    else{ //Si la table existe déja on la vide et on la re-rempli si les données sont bonnes
      table.fnClearTable();
      if (typeof dataSet !== 'undefined' && dataSet.length > 0) {
        table.fnAddData(dataSet);
      }
    }
  }
});

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////// Autocomplete pour la ville

var inputCommune = $("#ville");

$("#ville").autocomplete({

  source: function(request, response){

    recherche = 'commune='+inputCommune.val()+"&maxRows=10";
    //console.log(recherche);

    var ajax = $.ajax({
      url : 'http://infoweb-ens/~jacquin-c/codePostal/commune.php',
      type : 'GET',
      data : recherche,
    });

    ajax.done(function(codeHtmlSucces){
      map = $.map(codeHtmlSucces, function(n, i){
        ville = n.Ville;
        label = n.Ville;
        value = n.Ville;
        return {ville, label, value};
      });
      return response(map);
    });
  }

});

$("#ville").autocomplete( "option", "minLength", 2 );

//Lorsque l'on selectionne un item de l'autocomplete
$("#ville").on( "autocompleteselect", function( event, ui ) {
  event.preventDefault();
  inputCommune.val(ui.item.ville);
  $(".errMessage").hide();
  $(form).submit(); //On valide le formulaire
});

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////// Icone de flêche

$(".icone").click(function(){ //Lorsque l'on clique sur l'icone, vérifie que la ville mis en valeur existe

  recherche = 'commune='+inputCommune.val()+"&maxRows=10";
  var commune = inputCommune.val();
  var communeBonne = false;

  //Ajax qui récupère toutes les villes
  var ajax = $.ajax({
    url : 'http://infoweb-ens/~jacquin-c/codePostal/commune.php',
    type : 'GET',
    data : recherche,
  });

  ajax.done(function(codeHtmlSucces){
    //pour chaque ville
    $(codeHtmlSucces).each(function(index, elt){
      if (commune == elt.Ville) { //Si la ville est strictement éguale à celle rentrée par l'utilisateur
        communeBonne = true; //Alors la ville est validée
      }
    });

    if (communeBonne == true) { //Si la ville est validée on valide le fromulaire
      $(".errMessage").hide();
      $(form).submit();
    }
    else{ //Si la vile n'est pas validée on affiche un message d'erreur
      $(".errMessage").show();
    }
  });


});

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////// Slider personnalisé

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

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////// Fenêtre Modale

$(".modal_close").click(function() {
  $(".modal").css("display", "none");
  $(".modalbg").css("display", "none");
});

$(".modalbg").click(function() {
  $(".modal").css("display", "none");
  $(".modalbg").css("display", "none");
});
////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////// Mettre le calendrier en format français

$("#calendar").datepicker({
  altField: "#datepicker",
  closeText: 'Fermer',
  prevText: 'Précédent',
  nextText: 'Suivant',
  currentText: 'Aujourd\'hui',
  monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
  monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
  dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
  dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  weekHeader: 'Sem.',
  dateFormat: 'dd-mm-yy',
  firstDay: 1,
});
$("#calendar").datepicker('setDate', '');

////////////////////////////////////////////////////////////////////////////////


});
