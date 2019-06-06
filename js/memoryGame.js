var noFound = 0;
var totalClicks = 0;
var doNotClick = 0;
var level;
		
function init(){

    $(".level1").click(function(){
        level=6;
        $("#gameContainer").width('372px').height('248px').css('margin-top','50px');
        startGame();
    });
    $(".level2").click(function(){
        level=12;
        $("#gameContainer").width('496px').height('372px');
        startGame();
    });
    $(".level3").click(function(){
        level=24;
        $("#gameContainer").width('744px').height('496px');
        startGame();
    });

}

function startGame() {

    //initialise cards
    var memoryGame = {};
    memoryGame.cards1st = ["card1","card2",
			   "card3","card4",
			   "card5","card6",
			   "card7","card8",
			   "card9","card10",
			   "card11","card12"]

    memoryGame.cards2nd = ["card1","card2",
			   "card3","card4",
			   "card5","card6",
			   "card7","card8",
			   "card9","card10",
			   "card11","card12"];

    function shuffle(){
        return 0.5 - Math.random();
    };

    //determine how many cards required
    var cardsReq = level;

    //split the decks
    memoryGame.cards1st = memoryGame.cards1st.slice(0,(cardsReq/2));
    memoryGame.cards2nd = memoryGame.cards2nd.slice(0,(cardsReq/2));

    //Shuffle all the cards
    memoryGame.cards1st.sort(shuffle);
    memoryGame.cards2nd.sort(shuffle);
    memoryGame.cards = memoryGame.cards1st.concat(memoryGame.cards2nd);

    for (var cc = 0; cc < (cardsReq-1); cc++){
        $(".card:first-child").clone().appendTo("#cards");
    }

    $("#cards").children(".card").each(function(index) {
        var shuffledList = $(memoryGame.cards).get();
        $(this).find(".cardBack").addClass(shuffledList[index]);
        $(this).attr("character",shuffledList[index]);
        $(this).click(cardChosen);

    });

    $("#clickScore").text("CLICKS: " + totalClicks);
    $("#menuContainer").fadeOut("slow");

};


function cardChosen(){

    //	    
    $(this).addClass("selected");
    var noClicked = $(".selected").length;

    if ( noClicked > 2) {

       return;

    } 

    // flip the cards and increase the click count if the
    // card has not yet been flipped.

    if ($(this).hasClass("flip")==false){

        totalClicks++;
        $("#clickScore").text("CLICKS: " + totalClicks);

        //flip the card
        $(this).addClass("flip");

        if (!has3d()){
	    $(this).find(".cardBack").css("z-index", 7);
	    $(this).find(".cardFront").css("z-index",6);
	}

    } else {

	return;

    }

    //If two have been flipped over check the cards for a match

    if ( noClicked == 2) {

        //check for a match
        checkCards($(this));

    } else {
       
       return;
       
    }


}

function checkCards(obj){

    if (cardsMatch()){
        var hideDelay = setTimeout(function() {
	    $(".flip").fadeTo("medium",0, function(){
	        $("DIV").removeClass("flip");
	        $("DIV").removeClass("selected");
	    });
        },2000);

    } else {
        var flipDelay = setTimeout(function() {
	    if (!has3d()){
	        $(".flip").find(".cardBack").css("z-index",6);
	        $(".flip").find(".cardFront").css("z-index",7);
	    };
	    $("DIV").removeClass("flip");
	    $("DIV").removeClass("selected");
        }, 1000);

    }

}

function cardsMatch(){

    var cardsToMatch = Array();

    $(".flip").each(function() {
	cardsToMatch.push($(this).attr("character"));
    });

    return (cardsToMatch[0] == cardsToMatch[1]);

};

function has3d(){
    var el = document.createElement('p'),
        has3d,    
        transforms = {'webkitTransform':'-webkit-transform',
                      'OTransform'     :'-o-transform',        
                      'msTransform'    :'-ms-transform',        
                      'MozTransform'   :'-moz-transform',
                      'transform'      :'transform'};     
                 
    // Add it to the body to get the computed style    
    document.body.insertBefore(el, null);     
    
    for(var t in transforms){        
        if( el.style[t] !== undefined ){            
            el.style[t] = 'translate3d(1px,1px,1px)';            
            has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
        }    
    }
    
    document.body.removeChild(el);
    
    return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
    
}