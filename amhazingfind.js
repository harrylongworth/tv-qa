
// -------------- UTILITIES ------------------

function randINT(maxINT) {
	var randomINT;	
	randomINT = Math.floor(Math.random()*maxINT);
	return randomINT;	
} // END randINT

function capitaliseFirstLetter(myString)
{
    return myString.charAt(0).toUpperCase() + myString.slice(1);
} // END capitalise

function myIsSet(variableToCheck) {
	// function to check if variable is null or not set to a value yet
	
	if (typeof(variable) != "undefined" && variable !== null) {
		return true;
	} else {
		return false;
	} // END if
		
} // END myIsSet

function removeNumber(textToFix) {
	// remove numbers from end of card names 
	// numbers allow for globalisation (i.e. use of fish and fish2 as two different cards but of same name)
	
	var fixedtext = "";
	var positionOfLastChar=textToFix.length-1;
	
	if (!isNaN(textToFix.substring(positionOfLastChar))&&(textToFix.length>2)) {
		fixedtext=textToFix.substring(0,positionOfLastChar);
	} else {
		fixedtext = textToFix;
	}// END if	

	return fixedtext;
}

function getCardName(cardIDIN) {
	
	var tempCardName = "";
	var tempIDtext = "#"+cardIDIN;
	
	tempCardName= $(tempIDtext).attr("alt");	
	tempCardName = removeNumber(tempCardName);
	tempCardName = capitaliseFirstLetter(tempCardName);
	
	return tempCardName;
	
} // END get Card Name

// -------------- MODEL ------------------

function getCC() {
	//  CC is Card Count - the number of cards on the table for this round	
	// in adaptive mode this changes depending on previous performance and a pattern
	// otherwise it stays the same based on the user provided setting.
	// the underlying card count is stored in the localStorage.cc
	// if cc is 0 then adaptive
	// The maximum cc is 6

	if (localStorage.adaptiveModeFlag==1) {
		// alert("adaptiveModeFlag is 1");
		// alert("Card Count from Pattern is: "+cardCountPattern[patternPointer]);
		// alert("Length of cardCountPattern is: "+cardCountPattern.length);
		// alert("Pattern Pointer is: "+patternPointer);
		if(patternPointer+1>cardCountPattern.length) {
			// alert("pattern pointer larger than array!");
			patternPointer=0;
			} // catch going past end of array issue
		return +cardCountPattern[patternPointer];// card count changes each turn based on progress through the pattern
		// var tempStore=3;
		// return +tempStore;	
	} else if ((localStorage.cc>6)||( isNaN(localStorage.cc))||localStorage.cc<0) {
		var tempStore=3;
	  	localStorage.cc=+tempStore;
	  	return +localStorage.cc;
	} else {	
		// Card count is <6 and >0
		return +localStorage.cc;
	}
} // END getCC

function initialiseModel() { 
   
   
	cardsPlayed = [];	// initialise the cardsplayed already this turn array
	cardsPlayedPointer = 0; // initialise the cardsplayed pointer
	
	cardsMissed = []; // initialise the cardsMissed array
	adaptiveDeckPointer = 0; // initialise adaptive play pointer
	
	lastRightCard = 0; // initialise adaptive play last right card in a row checker
	
   // initialise the MODEL
   //alert("initialise Model");
  localStorage.firstTurnFlag=1;
   
  if (localStorage.cc==0) { 
	  localStorage.adaptiveModeFlag=1;
	  patternPointer=0; // initialise the pattern pointer in case it got lost somewhere
  } else {
	  localStorage.adaptiveModeFlag=0;
	} 
   
   localStorage.findText="Find "; // needs to be managed by a setting - enable or simply edit?
   localStorage.lives=5;
   updateLives( localStorage.lives );
  
  localStorage.rightCard="-1"; 
    
  localStorage.tallyToGetTreat=10;
  localStorage.tally=0;
   
  if (localStorage.backColour) { localStorage.backColour = "black"; }
    
  buildDeck();
  
  // start the new game build process	
  newGame();
 
} // END InitialiseModel

function startTimer () {
	var temp = new Date()
	var now = temp.getTime(); // milliseconds since 1974
	localStorage.lastime=now;
}


function measureTime() {
	var temp = new Date()
	var now = temp.getTime(); // milliseconds since 1974
	var timer = ((now - localStorage.lastime)/1000).toFixed(2);
	$("#timer").html( "time: "+ timer+"  |   &nbsp;" );
}

function updateLives(lives) {
	$("#lives").html("Lives: "+lives);
}

function buildDeck() {

	//alert("build Deck");
	
	
	var imageButtons =$(".flashcard");
  	var deckSize= imageButtons.length;
  	localStorage.deckSize= deckSize;
  	localStorage.deckProgressPointer=0;
  	
  	for(var i=0;i<deckSize;i++) {
	  	deck[i]=i;
	}  
	
	// Shuffle Deck:
	
	cardBuffer1=-1;
	cardBuffer2=-1;
	
	for (var j=0;j<deckSize;j++) {
		// alert("j loop: "+j);
		if (deckSize>2) {
			var swapPos=j;
			while (swapPos==j) { swapPos=randINT(deckSize); } // to prevent swap with self
			cardBuffer1=+deck[j];
			cardBuffer2=+deck[swapPos];
			// alert("swapping position: "+j+" with: "+swapPos);
			deck[j]=+cardBuffer2;
			deck[swapPos]=+cardBuffer1;
		} // END if
	} // END for
	 				
	
	//wire up image buttons
	// imageButtons.mousedown(function (){cardClick(this);})

	imageButtons.on("touchstart",function (event){event.preventDefault();cardClick(this);});
	// imageButtons.on("touchend",function (){return false;}); 
	imageButtons.click(function (){cardClick(this);});
	// imageButtons.focus(function (){ $(this).addClass("activecard");});
	// imageButtons.blur(function (){$(this).removeClass("activecard");});
	// imageButtons.removeClass("activecard");
	imageButtons.keydown(function (e){
		var keyPressed = e.which;
		// alert("charcode is: "+keyPressed);
	
		if (keyPressed!= 9){
			$(".activecard").click();
		} // END if
	}); // END keydown	
	
	
	// DRAW CARDS:

	/* 
	var wAndH = new Array();
	// wAndH = [150,200];
	wAndH = getWidthAndHeight();
	
	var imageW = wAndH[0]+"px";
	var imageH = wAndH[1]+"px";

	// var imageW = getImageWidth()+"px";
	// var imageH = getImageHeight()+"px";
	// alert("Image width: "+imageW+" Image Height: "+imageH);
	
	imageButtons.width(imageW);
	imageButtons.height(imageH);
			
	*/
} // END buildDeck

function getNextRightCard() {
	
	// alert(Math.Random(0, localStorage.deckSize));
	
	
	// if want just random card selection:
	//var nextRightCard=Math.floor(Math.random()*localStorage.deckSize);
	
	// if want in order of filename:
	/* 
	var nextRightCard=+localStorage.deckProgressPointer;
	 localStorage.deckProgressPointer++;

	*/

	turnsSinceMissed++;
	
	// if auto mode increment to the next place in the pattern
	if(localStorage.adaptiveModeFlag==1) {
		if(localStorage.firstTurnFlag==1) {
			// alert("firstTurn");
			localStorage.firstTurnFlag=0;
		} else {
			patternPointer++;
		} // end firstTurnCheck
		
		if(patternPointer>cardCountPattern.length) {
		patternPointer=0; // restart the pattern	
		} // end patternPointer
	} else {
		// alert("Not adaptive mode");
	}	// END if CC=0
		
	
	// want a shuffled deck and handle adaptive:
	// alert("Cards Missed Array is this long: "+cardsMissed.length+" and Last card missed was: "+cardsMissed[cardsMissed.length-1]+" and lastRightCard was: "+lastRightCard);
	if ((localStorage.adaptiveModeFlag==1)&&(getCC()==1)&&(cardsMissed.length>0)&&(turnsSinceMissed>turnsGap)&&(cardsMissed[cardsMissed.length-1]!=lastRightCard)) {
			nextRightCard=cardsMissed.pop();
			turnsSinceMissed=0;
	} else {
		
		if ((localStorage.adaptiveModeFlag==1)&&(getCC()>1)) {
			// right card has to come from previously played cards if card count is larger than 1 
			// thus select at random from previously played cards and don't progress the deck pointer

			do  {  // prevent playing right card twice in a row
				var tempCard=randINT(cardsPlayed.length);
				nextRightCard=cardsPlayed[tempCard];
			} while (nextRightCard==lastRightCard)
			
			/* 
			adaptiveDeckPointer = 0;
			// var nextRightCard=cardsPlayed[adaptiveDeckPointer];
			// adaptiveDeckPointer++;
			if (adaptiveDeckPointer>cardsPlayed.length) {
			 adaptiveDeckPointer=0;
			} 
			*/
			// assumes that there will always have been cards played with a card count of 1 before hand
			
		} else {
			var nextRightCard=deck[localStorage.deckProgressPointer];			
			localStorage.deckProgressPointer++;
		}  // end IF right card 
	} //
	
	// Check for end of set & just restart	
	if (localStorage.deckProgressPointer>localStorage.deckSize-1) {
		 localStorage.deckProgressPointer=0;
		 patternPointer=0; // restart the pattern
		 cardsPlayed=[];
		 alert("Set Complete");
	 }
	 
	// ("getNextCard is "+nextRightCard);
	lastRightCard = nextRightCard;
	return nextRightCard;

} // end init

// -------------- VIEW/UI ------------------

function drawCardTable() {
	//alert("drawCardTable");
	
	// go to full screen
	screenfull.request();
	// DRAW CARDS:
	var cardButtons =$(".showing");
	
	var wAndH = new Array();
	// wAndH = [150,200];
	wAndH = getWidthAndHeight();
	
	var imageW = wAndH[0]+"px";
	var imageH = wAndH[1]+"px";
	
	// var imageW = +wAndH[0];
	// var imageH = +wAndH[1];

	// var imageW = getImageWidth()+"px";
	// var imageH = getImageHeight()+"px";
	
	// alert("Image width: "+imageW+" Image Height: "+imageH);
	
	// cardButtons.width(imageW).height(imageH);
	cardButtons.css('width',imageW);
	cardButtons.css('height',imageH);
	

	// DRAW BACKGROUND:
	if (!localStorage.backColour=="black") {
  		$(".main").addClass("whiteback");
		} else {
		$(".main").addClass("blackback");
	}
  
	// DRAW treat tally
  	updateTally(localStorage.tally, localStorage.tallyToGetTreat );  
  
  	// DRAW BUTTONS
  	$("#backbutton").hide();
  	$("#menubutton").hide();
  	 
  	var buttonSize = getButtonSize()+"px";	
  	$("#backbuttonimage").width(buttonSize).height(buttonSize);
  	$("#menubuttonimage").width(buttonSize).height(buttonSize);
	// $(".flashcard").hide().removeClass("activecard");  // Turn off all currently showing cards & any activations

/*
if (document.all) {
var xMax = screen.width, yMax = screen.height;
{
else {
if (document.layers)
var xMax = window.outerWidth, yMax = window.outerHeight;
}
*/

if( $(window).width()> $(window).height()) {	
	localStorage.mode="Landscape";
	 $('#content ').addClass("horizontal");
	 $('#content ').removeClass("vertical");
	// $("img").unwrap();

	} else {
	 localStorage.mode="Portrait";
	 $('#content').addClass("vertical");
	 $('#content ').removeClass("horizontal");

	 //$("img").unwrap();
	 //$("img").wrap("<div></div>");

	} 
// alert("Window Mode is:  "+ localStorage.mode) ;	
	
}  // END drawCardTable

function updateTally(tally,total) {
// DRAW the updated Treat Tracker based on the current tally and total to get a treat
// Location of treat tracker should be adjustable to either a column down the left or below the flashcards

// IF tally disabled hide tally otherwise update it:

 var showTally = 0;

if (!showTally) {
	$("#tally").hide();
} else {
	var temp="";
	var star="<span class='star'> &#9733; </span>";
	var empty=" &#9734; ";
	var space="&nbsp;";

	for(var i=0;i<total;i++) {
  		if(i<tally) {
     		temp += star;
     		temp += space;
  		} else {
  			temp += empty;
  	 		temp += space;
  		} // end if
	} // end for

	$("#tally").html(temp);
}	// END if showTally
	
} // END updateTally

function promptCC() {

	var tempStore = prompt("Number of Cards?",localStorage.cc);
   localStorage.cc = +tempStore;
   
   if ((localStorage.cc>6)||( isNaN(localStorage.cc))||(localStorage.cc<0)) {
	var tempStore=3;
	localStorage.cc=+tempStore;
  }
  
  // toggle adaptive mode to give a different indicator for adaptive mode than card count
  if (localStorage.cc==0) { 
	  // alert("CC is zero");
	  localStorage.adaptiveModeFlag=1;
	  patternPointer=0;
  } else {
	  // alert("CC is NOT zero");
	  localStorage.adaptiveModeFlag=0;
	  
}
  
  initialiseModel();
	
}


function getWidthAndHeight() {
	var widthAndHeight = new Array();

	var imageWidth = 0;
	var imageHeight =0;

	var screenWidth = getScreenWidth();
	var screenHeight = getScreenHeight();
	var numberOfCardsOnTable = getCC();
	
	// DETERMINE Which mode we're in - landscape, portrait or square?
	// depending on the result set the imageWidth and height
	
	if ((screenWidth < screenHeight)||(screenWidth==screenHeight)){
		// PORTRAIT - Vertical Mode (or square)
		// alert("ImageHeight: Portrait Mode");
		
	switch(+numberOfCardsOnTable) {
		case 0:  
			imageHeight = Math.floor(screenHeight*0.6);
			break;
		case 1:  
			imageHeight = Math.floor(screenHeight*0.6);
			break;
		case 2:
			imageHeight = Math.floor(screenHeight/4);
			break;
		case 3:
			imageHeight = Math.floor(screenHeight/4);
			break;
		case 4:
			imageHeight = Math.floor(screenHeight/5);
			break;
		case 5:
			imageHeight = Math.floor(screenHeight/7);
			break;
		case 6:
			imageHeight = Math.floor(screenHeight/9);
			break;
		} // END Switch
		
	imageWidth = +Math.floor(imageHeight*0.75);	// as in this mode image width is based on image height
		
		
	} else {
		// alert("ImageHeight: in Landscape mode thus dependent on width");
		// LANDSCAPE - Horizontal Mode - thus height is dependent on width
		
  switch(+numberOfCardsOnTable) {
	case 0:  
		imageWidth = Math.floor((screenHeight*0.6)*0.75);
		break;
	case 1:  
		imageWidth = Math.floor((screenHeight*0.6)*0.75);
		break;
	case 2:
		imageWidth = Math.floor(screenWidth/4);
		break;
	case 3:
		//imageWidth = Math.floor(screenWidth/(numberOfCardsOnTable+0.2));
		imageWidth = Math.floor(screenWidth/4);
		// alert("ImageWidth: case 3 of landscape mode ran and should have resulted in: "+imageWidth+" for a screenWidth of: "+screenWidth+" and number of cards: "+numberOfCardsOnTable);
		break;
	case 4:
		imageWidth = Math.floor(screenWidth/6);
		break;
	case 5:
		imageWidth = Math.floor((screenHeight*0.3)*0.75);
		// set H padding to force onto new line?
		
		break;
	case 6:
		imageWidth = Math.floor((screenHeight*0.3)*0.75);
		
		break;
	} // END Switch
		
		imageHeight = Math.floor(imageWidth*1.333);
		
	} // END if	
	
	// DEBUG:
	//imageWidth = 150;
	//imageHeight = 200;	
	widthAndHeight = [imageWidth,imageHeight];
	
	return widthAndHeight;
}

function getButtonSize() {
	var buttonSize = 0;
	var screenWidth = +getScreenWidth();
	var screenHeight = +getScreenHeight();
	var minDimension = 0;
	
	if (screenWidth<screenHeight){
		minDimension = screenWidth;
	} else {
		minDimension = screenHeight;
	} // END if
	
	if (minDimension > 500) {
		buttonSize = Math.floor(minDimension /10);
	} else {
		buttonSize = Math.floor(minDimension /5);
	} // END if
	
	return buttonSize;
} // END getButtonSize


function getScreenWidth() {
	var tWidth=$(window).width();
	// alert("Screen Width is: "+tWidth);
	return +tWidth;

} // END screenWidth

function getScreenHeight() {
	var tHeight=$(window).height();
	// alert("Screen height is: "+tHeight);
	return +tHeight;
} // END screenHeight




// -------------- CONTROLLER ------------------



function newGame() {
		
	// start the next round:
	nextTurn();
} // END newGame

function nextTurn() {
	
	$(".flashcard").hide().removeClass("activecard").removeClass("showing");
	// alert("Next Turn");
	// select right card;
	
	// var rightCard=1;
	var rightCard = getNextRightCard();

	localStorage.rightCard= +rightCard;
	// alert("right card is:"+rightCard);
	
	rightCardNameTemp = getCardName(rightCard);
	rightCardName = removeNumber(rightCardNameTemp);

	var findText= localStorage.findText+" " +rightCardName+"</h1>";
	// $("#find").html(findText);
	//localStorage.sayText = findText;
	localStorage.sayText = removeNumber(rightCardName);

	// select right position
	var cardCount=getCC();
		
	var rightPosition= randINT(cardCount);
	
	//var rightPosition=1;
	localStorage.rightPosition= rightPosition;

	// alert("right position: "+localStorage.rightPosition);

	// BUILD TABLE:
		
	var cardsOnTable = new Array();
		
	// if(cardCount==0) {cardCount=1;}
	// alert("Card Count before build table is: "+cardCount+" and rightCard is: "+localStorage.rightCard+" and right card position is: "+localStorage.rightPosition);
	
	for(var i=0;i<cardCount;i++) {
  	  // alert("build table loop: "+i);
  	  if(i== rightPosition) { 
  		// alert("rightcard in position and is: "+localStorage.rightCard);
  		//$("#"+rightCard).slideDown(300).attr("tabindex",i).removeClass("activecard").addClass("showing");
  		$("#"+rightCard).show().attr("tabindex",i).removeClass("activecard").addClass("showing");
  		
  		cardsOnTable.push(rightCard);
  		cardsPlayed.push(rightCard);
  		// alert("after slidedown");
  	  } else {
	  	 
	  	// SELECT DISTRACTOR CARD  

  		
		if(localStorage.adaptiveModeFlag==1) {
			// select a distractor card from previously played cards that is not the current right card or already on the table
			// thus select from the previouslyPlayedCards array and push cards into this array as played
			var nextDistractorCard=+rightCard;			
			// select from the cardsPlayed array a card that is not the current card
			// if (cardsPlayedPointer==adaptiveDeckPointer) {	cardsPlayedPointer++ } // prevent overlapping distractor and right card

			
			while(getCardName(nextDistractorCard)==getCardName(rightCard)) {				
				cardsPlayedPointer++
				if (cardsPlayedPointer>cardsPlayed.length) {cardsPlayedPointer = 0;}
				nextDistractorCard = cardsPlayed[cardsPlayedPointer];
			} // END while - used to prevent adaptive right card overlap with distractors
									
			
			$("#"+ nextDistractorCard ).show().attr("tabindex",i).removeClass("activecard").addClass("showing");
			cardsPlayed.push(nextDistractorCard);
			
		} else {
		// Select a random distractor card	
		var tempcard= -1;  		
		//alert("current count of cards on table is: "+onTableSize);
		
		do {
  			tempCard=randINT(localStorage.deckSize);		
  			// check if card is already on the table:
  			if (getCardName(tempCard)!=getCardName(rightCard)) {
  				var onTableSize=cardsOnTable.length;
  				for(var j=0;j<onTableSize;j++) {
  					// alert("j is: "+j);
  					if (getCardName(cardsOnTable[j])==getCardName(tempCard)) {
		  				//alert("tempCard is already on table");
	  					tempCard=-1;
		  				break;
	  				} else {		  		
		  				// alert("tempCard is not on table so put it on table and push into array");
  						$("#"+ tempCard ).show().attr("tabindex",i).removeClass("activecard").addClass("showing");
  						cardsOnTable.push(tempCard);
					} // END if cardsOnTable
			
				} // END for j
			} else {
				tempCard=-1;	
			}	// END if not rightCard
			//alert("got past check card is not already on table");
			
			// catch the no cards in cardsOnTable yet case:
			if ((onTableSize==0)&&(tempCard!=-1)) {
				// alert("catching case where there are no cards on the table yet so just put card on table");
				$("#"+ tempCard ).show().attr("tabindex",i).removeClass("activecard").addClass("showing");
  				cardsOnTable.push(tempCard);
			} // END if
			//alert("reached end of do while loop");
  		}  while ((tempCard==-1)&&(cardsOnTable.length<cardCount))
		} // end IF not adaptive
  	  } // end if

	} // end for
	
	drawCardTable();
	
	// Say card name
    var testtext2 = localStorage.sayText; var msg2 = new SpeechSynthesisUtterance(testtext2);msg2.lang = 'en-US';window.speechSynthesis.speak(msg2);
	startTimer ();
} // END nextTurn()


function cardClick(item){

// alert("card clicked");

//var tempstring= $(this).attr("alt") +" "+ $(this).attr("id") ;
//alert($('this').attr("alt"));
	var rightCardID=localStorage.rightCard;
	var cardClickedID=  $(item).attr('id');
	// alert("right card ID: "+ rightCardID +" and this card is : "+ cardClickedID) ;
		 
	if ( rightCardID == cardClickedID ) {
		// RIGHT CARD:
		// alert("correct");
		measureTime(); 

		localStorage.tally= +localStorage.tally + 1;
		
		if ( localStorage.tally== localStorage.tallyToGetTreat) {
		 //  alert("Treat Time");
		  localStorage.tally=0;
		  }
		  
		 updateTally(localStorage.tally, localStorage.tallyToGetTreat );
		
		nextTurn();
 
		  
	}  else {
		// WRONG CARD:
		// alert("wrong card");
		
		if (rightCardID!=cardsMissed[cardsMissed.length-1]) {  // prevent double pushing of a missed card from same round
			// alert("pushing missed card");
			cardsMissed.push(rightCardID); // store the card missed
			// Say wrong card
			var wrongCard = "Wrong Card. Find "+localStorage.sayText; var wrongMsg = new SpeechSynthesisUtterance(wrongCard);wrongMsg.lang = 'en-US';window.speechSynthesis.speak(wrongMsg);
			
		} // end IF
		
		$(item).hide();
		//  localStorage.lives--;
		 // updateLives( localStorage.lives);
		 if ( localStorage.lives<1) {
		 	alert("Game Over");
		 	initialiseModel();
		 	}
	}// end if
	

		startTimer ();
	// return false;
} // end click

// ----------------- END of FILE --------------------



