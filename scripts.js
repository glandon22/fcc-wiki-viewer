$(document).ready(function() {
    //auto scroll to top on reloads bc hidden ul table will overflow and cause page to refresh to weird location
    $(this).scrollTop(0);

    //allow users to search with enter key or by clicking search
    var search = $("#searchbar");
    search.on("keydown", function(e) {
            if (e.keyCode == 13) {
                searchPage();
            }
        });

    $("#search-button").click(searchPage);
    $(".new-search").click(reload);

    //removes initial search and buttons, moves title to top of page
    function searchPage() {
        var val = $("#searchbar").val();
        $("#disappear").remove();
        $("#title").css("display", "none");
        $("#search-holder").css("top", "0%");
        $("#search-holder").css("left", "39%");
        $("#content-holder").append("<div class='spinner'></div>");
        loadEntries(val);

    };

    function loadEntries(val) {
        var url = "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=" + val +"&srqiprofile=wsum_inclinks_pv&srprop=snippet|titlesnippet&format=json&callback=?";



        $.getJSON(url, null, function(data) {
            console.log(data);

            //error checking- if nothing is entered or wikipedia cant find anything
            if (data.hasOwnProperty("error")) {
                alert("Please enter something in the search bar.");
                reload();
            }

            else if (data["query"]["search"].length == 0) {
                alert("Wikipedia could not find any information on your search. Please try something else.");
                reload();
            }

            //populate the lis in my ul and wrap them in the relevant link
            for (var i = 0; i < 10; i++) {
                var tmp = data["query"]["search"][i]["title"];
                $("ul.wiki-results > li:nth-child(" + (i+1) + ") > h3").html(tmp);
                $("ul.wiki-results > li:nth-child(" + (i+1) + ") > p").html(data["query"]["search"][i]["snippet"] + "...");
                $("ul.wiki-results > li:nth-child(" + (i+1) + ")").wrapInner('<a href="https://en.wikipedia.org/wiki/' + tmp + '" id="no-show" target="_blank"></a>');
            }
            //recenter title in middle of page
            $("#search-holder").css("left", "0%");

            //add a little extra time for the spinner to show while lis load. w/o spinner the blank screen lags for about half a second
            //and looks bad so i added a short amount of time for some animation
            var counter = 0;
            var check = function() {
                if(counter == 2) {
                    $(".spinner").remove();
                    $("#title").css("display", "");
                    $("#appear").css("visibility", "visible").hide().fadeIn("slow");
                    return;
                }
                else {
                    counter++;
                    setTimeout(check, 500); // check again in a second
                }
            }
            check();
        });
    };
    //reload page for new search
    function reload() {
        window.location.reload();
    }
});
