<!DOCTYPE html>
 <?php
 // Build images from images folder

 // $rootFolder="flashcards/";
 
 $folderName= $_GET["set"];
 $location= $_GET["loc"];

 $usersDir="/usercards/";
 if($location!="flashcards") {
	 $rootFolder=$usersDir.$location."/";
 } else {    
 	// $rootFolder="../".$location."/";
        $rootFolder= $location."/";
 }

 $folder=$rootFolder.$folderName ; 
 
 
 // $manifest= 'manifest.php?cat='.$folderName;
?> 
<html>
<head>
	<title><?php echo $folderName; ?></title>
	<link href="style.css" rel="stylesheet">
	<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
	<script src="jquery.js"></script>
	<script src="amhazingfind.js"></script>
	<script src="screenfull.js"></script>
	
	<script>
	    // setup for fullscreen
		screenfull.request();
		
		// initialise variables
		var deck = new Array();
		var totalAttempts = 0;
		var rightAnswers = 0;
		var scoreAsPercent = 0;
		var cardsMissed ="";
		var cardsOnTable = new Array();
		var showTreatTrackerFlag = localStorage.showTT;
		var showStatusBarFlag = localStorage.showSB;
		var treatTrackerPos = localStorage.ttPos;
		var maxNumberOfCardsOnTable = 3;	// for adaptive play - is max number of cards to go upto showing
		var cardCountPattern = new Array(1,1,2,1,2,2,3); // card pattern
		var patternPointer=0; // tracks progress through the pattern array
		var cardsPlayed = new Array(); // stores the cards played so far - used by adaptive to choose distractor cards from
		var cardsPlayedPointer = 0;
		var adaptiveDeckPointer = 0; // progress through deck for adaptive play
		var cardsMissed = new Array(); // cards wrong so far - for adaptive play to know what to recycle through 1 card pattern
		var lastRightCard = 0; // prevent same right card playing in a row during adaptive play
		localStorage.firstTurnFlag=1;
		var turnsSinceMissed=0; // turns since card missed - for adaptive play
		var turnsGap = 2; // gap to leave since card missed - for adaptive play 
		var touching=0; // prevent touching activating multiple cards and double click responses
		var clicking=0; // this is a click response
		document.ontouchmove = function(event){
			// prevent screen scroll / bounce for iOS devices
    		event.preventDefault();
		}
		/*		
		note from Stackoverflow:
		For anyone trying to acheive this with PhoneGap, you can disable the elastic scrolling in the cordova.plist, set the value for UIWebViewBounce to NO. I hope that helps anyone spending ages on this (like i was).
		*/

		
	</script>
</head>
<body class="main">

<table width="100%">
	<tr>
		<td>
			<table width="100%" id="header">
  			<tr id="top">
  			<td width="20%">
      			<div id ="backbutton" onTouchStart="history.go(-1)" onClick="history.go(-1)">&lt;&lt; BACK</div>
      			<div onTouchStart="history.go(-1)" onClick="history.go(-1)"><img id ="backbuttonimage" alt ="back button" src="back.png"></div>
      		</td>
      		<td width="60%">
      			<button id="find" onclick="var sayThis = localStorage.sayText; var msg = new SpeechSynthesisUtterance(sayThis);window.speechSynthesis.speak(msg);">&nbsp;?&nbsp;</button>
      		</td>
      		<td width="20%">
      			<div id ="menubutton" onClick="promptCC()">
      				<strong>#</strong>
     	 			</div>
     	 		<div  onTouchStart="promptCC()" onClick="promptCC()"><img id ="menubuttonimage" alt ="menu button" src="pause.png"></div>
     	 		</td>
    		</tr>
  		</table>
		</td>
	</tr>
	<tr>
		<td>
  		<table width="100%" id="content">
    		<tr>
      		<td>

<?php
 // Build images from images folder

 $temp ="";
 $idtext=0;
 
 $dir = new RecursiveDirectoryIterator( $folder );
 foreach(new RecursiveIteratorIterator($dir) as $file) {
 	$filename= $file->getFilename();  
 	if ($file->Isfile() && (substr( $filename,-4) != ".php") && (substr( $filename ,0,1) != ".")&& (substr($filename,0,-4)!="icon")) {
    //if ($file->Isfile() && (substr( $filename,-4) != ".php") && substr( $filename ,0,1) != ".") {
      	$cardID = substr( $filename ,0,strlen($filename)-4);
	    $temp = $temp. "<img class='flashcard' src='".  $folder."/" . $filename ."' alt='". $cardID. "' id='".$idtext."' >" ;
      	$idtext++;
      }
    }
 echo $temp;

// print_r($_GET);
 
?>
      	

      		</td>
  			</tr>
  		</table>
		</td>
	</tr>
	<tr>
		<td>
  		<table width="100%" id="bottom" >
  			<tr>
      		<td>
      			<div id ="tally"></div>
      		</td>
    		</tr>
  		</table>
		</td>
	</tr>
  <tr>
		<td>
			<table id ="footer" data-role="footer">
				<tr>
      		<td id="timer"></td>
      		<td id="setname" align="left">   Set: <?php echo $folderName;?></td>
			<td><button onclick="screenfull.request();">Fullscreen</button></td>
			<td><button onClick="history.go(0);">Reset</button></td>
   			</tr>
			</table>
		</td>
  </tr>
  <tr>
	  <td>
		<br>
		<br>
		
		<br>
	  </td>
  </tr>
</table>
	<script>
		$(document).ready(function() {
			
			// attempt to make screen full screen
			screenfull.request();

			// alert("ready");
			if(typeof(Storage)!=="undefined") {
  			// Yes! localStorage and sessionStorage support!
  			// alert("yes local storage");
 				initialiseModel();
 			} else {
  			// Sorry! No web storage support..
  			alert("no local storage (html 5)- can't play");
  		}
  	});
	</script>
</body>
</html>

