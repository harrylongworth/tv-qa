<!DOCTYPE html>
<html>
<head>
<title>Menu</title>
<link href="menu.css" rel="stylesheet">
<meta name="apple-mobile-web-app-capable" content="yes">
   <script src="jquery.js"></script>
   <script src="menu.js"></script>
   <script src="screenfull.js"></script>
<script>
screenfull.request();
$(document).ready(function() {

// alert("ready");

if(typeof(Storage)!=="undefined")
  {
  // Yes! localStorage and sessionStorage support!
  // alert("yes local storage");
 // initialise();

  }
else
  {
  // Sorry! No web storage support..
  alert("no local storage (html 5)- can't play");
  }
  
});
</script>

</head>
<body class="main" >

<table width="100%">
<tr>
<td>
<table width="96%">
  	<tr>
      <td >
      <div id ="top">
        
      </div>
      </td>
    </tr>
  </table>
</td>
</tr>

<tr>
<td>
  <table width="96%">
    <tr>
      <td>
      <div id ="content">
      	 <?php
 
   // Shared IMAGE MENU   	 
   // foreach(glob('*', GLOB_ONLYDIR) as $dir)
   $flashDir="flashcards";
   $rootdir=$flashDir."/*";
   foreach(glob($rootdir, GLOB_ONLYDIR) as $dir) 
   //foreach(glob("{./flashcards/*,*}", GLOB_ONLYDIR) as $dir)

{ 
    $dir = basename($dir); 
    $imgText = $flashDir."/".$dir."/icon.jpg";
    echo '<a href="JavaScript:this.location=',"'play.php?set=", $dir, "&loc=",$flashDir,"'",'"><img width=100 height=150 alt="',$dir,'" src="', $imgText, '"></a>'; 
}  

echo "<hr>";

   // personal IMAGE MENU  > use "usercards" as root and then username?  need to have option to use username folder as a game too (and may not have sub folders  	 
   $rootUsersDir="usercards";
   
   if(empty($_GET)) {
   		// $myDir="shared";
   		// $myDir="jamie";
               $myDir="";
	} else {
		 $myDir=$_GET["u"];
	 } // END if
	 
   $usersDir=$rootUsersDir.$myDir."/*";
 
   foreach(glob($usersDir, GLOB_ONLYDIR) as $dir) 
{ 
    $dir = basename($dir); 
    $imgText = $rootUsersDir.$myDir."/".$dir."/icon.jpg";
    echo '<a href="JavaScript:this.location=',"'play.php?set=", $dir, "&loc=",$myDir,"'",'"><img width=100 height=150 alt="',$dir,'" src="', $imgText, '"></a>'; 
}

echo "<br><br>";

/*
 foreach(glob('*', GLOB_ONLYDIR) as $dir) 
{ 
    $dir = basename($dir); 
    echo '<a href="JavaScript:this.location=',"'", $dir, "'",'">', $dir, '</a><br>'; 
}  
 */
?>
      	
			</div>
      </td>
    </tr>
  </table>
</td>
</tr>


<tr>
<td>
  <table width="96%">
    <tr>
      <td >
      <div id ="footer">
      
      </div>
      </td>
    </tr>
  </table>
</td>
</tr>

</body>

<script>

</script>

</html>

