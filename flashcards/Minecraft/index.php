<!DOCTYPE html>
 <?php
 // Build images from images folder
 
 $location=explode("/", __FILE__);
 // print_r($location);
 $folderName= $location[count($location)-2];
 // $folderName= substr($filename ,0,-4);
 $folder="./";
 
	$manifest= $filename."m.php";

 
?> 
<html manifest="manifest.php">
<head>
	<title><?php echo $folderName  ?></title>
	<link href="../style.css" rel="stylesheet">
	<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">

	<script src="../jquery.js"></script>
	<script src="../initialise.js"></script>
	<script>
		$(document).ready(function() {
			// alert("ready");
			if(typeof(Storage)!=="undefined") {
  			// Yes! localStorage and sessionStorage support!
  			// alert("yes local storage");
 				initialise();
 			} else {
  			// Sorry! No web storage support..
  			alert("no local storage (html 5)- can't play");
  		}
  	});
	</script>

</head>
<body class="main">

<table width="100%" data-role="page">
	<tr>
		<td>
			<table width="90%" id="header" data-role="header">
  			<tr id="top">
      		<td>
      			<div id ="find"></div>
      		</td>
      		<td>
      			<div id ="menubutton" onClick="window.close()">
      				<strong>| |</strong>
     	 			</div>
     	 		</td>
    		</tr>
  		</table>
		</td>
	</tr>
	<tr>
		<td>
  		<table width="96%" id=" content " data-role="content" >
    		<tr>
      		<td>
						<div id ="cardtable">
<?php
 // Build images from images folder
 
 $temp ="";
 $idtext=0;
 
 $dir = new RecursiveDirectoryIterator( $folder );
 foreach(new RecursiveIteratorIterator($dir) as $file) {
 		 $filename= $file->getFilename();  
    if ($file->Isfile() && (substr( $filename,-4) != ".php") && (substr( $filename ,0,1) != ".")&& (substr($filename,0,-4)!="icon")) {
      $temp = $temp. "<img width='220px' src='" . $filename ."' alt='". substr( $filename ,0,strlen($filename)-4). "' id='". $idtext."' >" ;
      $idtext++;
      }
    }
 echo $temp;
?>
      	
						</div>
      		</td>
  			</tr>
  		</table>
		</td>
	</tr>
	<tr>
		<td>
  		<table width="96%" id="bottom" >
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
      		<td id="lives"></td>
      		<td id="setname">  |  Set: <?php echo $folderName;?></td>
   			</tr>
			</table>
		</td>
  </tr>
</table>

</body>
</html>


