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
    /*loupe
    $("td.tab-chiffre").each(function(index, elt) {
        $(elt).mouseenter(function(){
            $('#loupe').text($(this).text());
        })
    })*/
});