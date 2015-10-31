function play() {

	// alert("play");
	
 	var winProps= "toolbar=no,status=no,scrollbar=no,location=no,menubar=no";
  var newWindow = open("playgame.php","playgame",winProps );
  
}

function quit() {
	alert("close");
	 // playgame.close();
	 $(window).close();
}

function settings() {

	// alert("play");
	
 	var winProps= "toolbar=no,status=no,scrollbar=no,location=no,menubar=no";
  var newWindow = open("settings.php","settings",winProps );
  
}



