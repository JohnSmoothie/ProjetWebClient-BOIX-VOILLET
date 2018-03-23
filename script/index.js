$(document).ready(function() {
  var urlFlickr = "https://api.flickr.com/services/rest/";
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
        api_key : 'df4ffbf6eb1367ce9bb40aba468602cc',
        tags : $(ville).val(),
        format : 'json',
        par_page : $(nbPhotos).val(),
        nojsoncallback : 1
      }

    });

    ajax.done(function(codeHtmlSucces){
      console.log(codeHtmlSucces);
    });

    ajax.fail(function(data){
      console.log("Désolé, une erreure est survenue");
      console.log(data);
    });
  });






    /*loupe
    $("td.tab-chiffre").each(function(index, elt) {
        $(elt).mouseenter(function(){
            $('#loupe').text($(this).text());
        })
    })*/
});
