//https://stackoverflow.com/questions/45882605/store-json-array-from-newsapi-in-firebase
//I am using this var to store the username
var username ="";
//I am using this var to store the userID
var user_ID ="";

//I am using the object objectOfData to store all the arrays into it and tranform it into a json 
var objectOfData, sportsArray, fincancialArray,
businessArray, dbNewsRoom, authorsNewsRoom;

//this is the key from my news api that I use to get the JSON data
var newsApiKey = "9f1c830e6faa4b3fbd69964edf2f3b94";
var linkNews = ["https://newsapi.org/v2/top-headlines?sources=espn&apiKey="+newsApiKey,
  "https://newsapi.org/v2/top-headlines?sources=financial-post&apiKey="+newsApiKey,
  "https://newsapi.org/v2/top-headlines?sources=business-insider-uk&apiKey="+newsApiKey];


//here is where my app starts once the user is logged in to facebook
function startApp() {
  //I tell the app to close the login screen model
  myApp.closeModal('.login-screen.modal-in');
  
  //then get the user name and load it into the html
  document.getElementById('welcome-user').innerHTML = "Welcome "+window.username;
  
  //this methods is where I call to load all the JSON news 
  loadNews();

  // this method click Buttons has a listener whenever the user clicks on something it is activate
  clickButtons();

  //this method is where I used to get the user profile picture from facebook
  loadUserInfo();

}

// function greetUser(){
//    document.getElementById('welcome-user').innerHTML = "Welcome "+window.username;
// }

//This function call all the methods that loads my JSON from
//the server and the newsAPI
function loadNews(){
  getSporstNews();
  getFinancialNews();
  getBusinessNews();
  getNewsRoomDB();
  getAuthorsNewsRoomDB();
}


function clickButtons(){
  var type;
  //this methods are listaning if a button is clicked then the function is triggered
  $("#business").on("click", function(event){
    window.type = "business";
    loadJSONews(window.type);
    

  });
  $("#financial").on("click", function(event){
    //https://newsapi.org/v2/top-headlines?sources=bbc-sport&apiKey=9f1c830e6faa4b3fbd69964edf2f3b94
    window.type = "financial";
    loadJSONews(window.type); 

  });  

  $("#sports").on("click", function(event){
    window.type = "sports";
    loadJSONews(window.type);

  });

  $("#logout-label").on("click",function(event){
    logOutUser();
  });
  $("#form-submit").on("click",function(event){
    getNewStoryValues();
  });
  $("#form-cancel").on("click",function(event){
      setFormToNull();
  });

}

//this function is where I am getting the user profile img
function loadUserInfo(){ 
  FB.api("/me/picture?width=500&height=500",  function(response) {
        var userImgSource;
        
        var userProfile = document.getElementById("userInfo");
        var userImg = document.createElement("img");
        
        userImg.src = response.data.url;
        userImg.style.cssFloat = "center";
        userImg.height="150";
        userImg.width="150";
        

        userProfile.appendChild(userImg);
        userProfile.innerHTML += "<h2 style='letter-spacing:2px'>"+window.username+"</h2>";
  }); 
}

//create an Object of Data to display as my custom JSON
function createOBJ(){
  window.objectOfData = {
    financial   : window.fincancialArray,
    sport       : window.sportsArray,
    business    : window.businessArray,
    newsRoom    : window.dbNewsRoom,
    authors     : window.authorsNewsRoom
  };
  var lastJOB = document.getElementById("loadStringfy");
  
  lastJOB.innerHTML = "<pre>"+JSON.stringify(objectOfData, null, 4)+"</pre>";

}
//This function will log the user out off the app and will open the login screen again.
function logOutUser(){
  FB.logout(function(response){
    myApp.loginScreen();
    location.reload();
  });

}

// ------------------------------------------------------------------------------
//the function gets connects to the server
//and save the data into an array.
//so does the other 4 functions bellow;
var select;

//I am using the select var to pass the id that I want to select from the html
function getNewsRoomDB(){
    $.getJSON( "http://52.48.79.163/db.php?type=top10stories",
    function( data ) {
      //so in this case I want to select the news from the server
      window.select = "newsFromTheServer";
      window.dbNewsRoom = data;
      //so here I am passing the id and the data I want to print out
      createNewsRoomBody(window.select, window.dbNewsRoom.news.story);

  });
}
function getAuthorsNewsRoomDB(){
  $.getJSON("http://52.48.79.163/db.php?type=currentauthors", function(data){
    window.authorsNewsRoom = data;
    window.select = "authorsFromTheServer";
    createNewsRoomBody(window.select, window.authorsNewsRoom.authors.author)
  })
}

// -----------------------------------------------------------------------

// -----------------------------------------------------------------------
// These 3 functions are getting the data from the newsapi.org and storing it in a local array
function getSporstNews(){
  $.getJSON(window.linkNews[0], function(data){
    window.sportsArray = data.articles;
  });
}

function getFinancialNews(){
  $.getJSON(window.linkNews[1], function(data){
    window.fincancialArray = data.articles;
  });
}

function getBusinessNews(){
  $.getJSON(window.linkNews[2], function(data){
    window.businessArray = data.articles;
    createNews(window.businessArray);
  });
}
// ------------------------------------------------------------------------


// This function is just getting the elements from the form and setting it to null.
//When the cancel button is clicked
function setFormToNull(){
  document.getElementById("form-title").value = null;
  document.getElementById("form-description").value = null;
  document.getElementById("calendar-default").value = null;
  document.getElementById("form-author").value = null;

}
// ----------------------------------------------------------------------------

// Here is where is making the decision which news to display based on the button clicked
function loadJSONews(type){
    if(window.type == "business"){
      replaceNews(window.businessArray);

    }else if(window.type == "financial"){
      replaceNews(window.fincancialArray);

    }else if(window.type == "sports"){
      replaceNews(window.sportsArray);

    }
    else{
      alert("something went wrong at loadJsonNews");
    }
}
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------

// This function is where I create the div tags and display the news from the sever based
// on the id and the data from the server.
function createNewsRoomBody(id , data){

  //so select whichver id was passed
  var start = document.getElementById(id);

  //this variable is the ones I am going to use to create my div elements
  var card, cardContent, cardContentInner;

  //Just setting the data to a local scoope
  var arrayOfData = data;
  //window.dbNewsRoom.news.story;

  //Here is where the magic begins haha DOM 
  for(var i =0; i< arrayOfData.length; i++){
    //creating a sample card to generate the news from the server
    
    //So basically what I am doing here is creating div tags
    // and adding the classes from framework 7 into it
    card = document.createElement("div");
    card.className = "card";

    cardContent = document.createElement("div");
    cardContent.className = "card-content";

    cardContentInner = document.createElement("div");
    cardContentInner.className = "card-content-inner";
    cardContentInner.innerHTML = arrayOfData[i];
    

    //so the var start is the root node                   start           = Grandad
    start.appendChild(card);                        //    card            = Parent
    //the the card is the child of the Root               cardContent     = Child
    card.appendChild(cardContent);                  //    cardContentInner= Great Gran Child...
    //the card content is the child of the card
    cardContent.appendChild(cardContentInner);
    //the card content is the child of the child


  }
}

function createNews(data){

    //get the body element on the html where I am going to start my creation of DOM
    var body = document.getElementById("newsBody");
    
    //store the data into a local scope
    var arrayOfData = data;
    
    //these variables is where I am going to use the innerHTML to display the JSON data
    var author, dec, title, publishAt, photo, url, sourceName;

    //These variables is the ones I am going to use to create my div tags
    var card, header, content, contentInner, contentFooter;

    //This is the source name
    var newName = document.getElementById("sourceName");
    newName.innerHTML = '<h2 style="text-align:center;">'+arrayOfData[1].source.name+'</h2>';
    

    //so if var i var is less than arrayOfLength keep looping until i is equal the
    //  arrayOfData.length which is 10 
    for(var i = 0; i< arrayOfData.length; i++){  
      //get author, des, url, photo , sourceName, title , publish at from index 1
      author = arrayOfData[i].author;
      desc = arrayOfData[i].description;
      url = arrayOfData[i].url;
      photo = arrayOfData[i].urlToImage;
      sourceName = arrayOfData[i].source.name;  
      title = arrayOfData[i].title;
      publishAt = arrayOfData[i].publishedAt;
       
      //CREATE CARD 
      card = document.createElement('div');
      card.className = "card"; 
      
      // CREATE TITLE
      header = document.createElement('div');
      header.className = "card-header";
      header.style.justifyContent = "center";

      //CREATE CARD CONTENT CONTAINER
      content = document.createElement('div');
      content.setAttribute("id","content");
      content.className = "card-content";
      
      //CREATE CARD CONTENT INNER CONTAINER
      //THIS IS WHERE THE DESC AND THE PIC WILL LOAD
      contentInner = document.createElement('div');
      contentInner.className = "card-content-inner";
      contentInner.style.textAlign = "center";
               
      contentFooter = document.createElement('div');
      contentFooter.className = ("card-footer");

    
      header.innerHTML = "<h3>"+title+"</h3>";
      contentInner.innerHTML = "<img src="+photo+" style= 'width :80%' 'height :auto'><p>"
      +desc+"</p> <a href="+url+"<p>"+url+"</p></a>";
      contentFooter.innerHTML = "<p style='text-align: left;'><i>"+author+"</i></p>"+
      "<p style = 'text-align: center;'<b>"+sourceName+"</b></p>"+
      "<p style='text-align: right;'>"+publishAt+"</p>";  
    

      // ADDING ELEMENTS TO THE NODE
      body.appendChild(card);
      card.appendChild(header);
      card.appendChild(content);
      content.appendChild(contentInner);
      card.appendChild(contentFooter);  

      
  }
  createOBJ();
}

function replaceNews(data){
  var arrayOfData = data;
  var author, dec, title, publishAt, photo, url, sourceName;
  var card, header, content, contentInner, contentFooter;

  var header = document.querySelectorAll(".card-header");
  var contentInner = document.querySelectorAll(".card-content-inner");
  var footer = document.querySelectorAll(".card-footer");

  var newName = document.getElementById("sourceName");
  newName.innerHTML = '<h2 style="text-align:center;">'+arrayOfData[1].source.name+'</h2>';

  for (var i = 0; i <arrayOfData.length ; ++i) {
     
     author = arrayOfData[i].author;
     desc = arrayOfData[i].description;
     url = arrayOfData[i].url;
     photo = arrayOfData[i].urlToImage;
     sourceName = arrayOfData[i].source.name;  
     title = arrayOfData[i].title;
     publishAt = arrayOfData[i].publishedAt;
     
     header[i].innerHTML = "<h3>"+title+"</h3>";
     contentInner[i].innerHTML = "<img src="+photo+" style= 'width :80%' 'height :auto'><p>"
    +desc+"</p> <a href="+url+"<p>"+url+"</p></a>";
     footer[i].innerHTML = "<p style='text-align: left;'><i>"+author+"</i></p>"+
    "<p style = 'text-align: center;'<b>"+sourceName+"</b></p>"+
    "<p style='text-align: right;'>"+publishAt+"</p>";
  }

}



function statusChangeCallback(response) {
      // The response object is returned with a status field that lets the
      // app know the current login status of the person.
      // Full docs on the response object can be found in the documentation
      // for FB.getLoginStatus().
      if (response.status === 'connected') {
          // Logged into your app and Facebook.
        //here it is where I should start my coding
        window.user_ID = response.authResponse.userID;

          FB.api('/me', function(response) {
            console.log("statusChangeCallback");
            window.username = response.name;
            startApp();
          });
        

      }else if(response.status =='not_authorized'){
        document.getElementById('status').innerHTML = "Please authorize the app to continue"
        
      }else {
        // The person is not logged into your app or we are unable to tell.
        document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
      }
    }  

  //This is the callback. It call fb.getLoginStatus() 
  //to get hte most recent login state
   function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }


// Facebook SDK
window.fbAsyncInit = function() {
  FB.init({
    appId      : '818620558299543',// App id
    cookie     : true,  //enable cookies to allow the server to access
                        // the session
    xfbml      : true,  //parse social plugins on this page
    version    : 'v2.8' //use graph api version 2.8
  });
  FB.getLoginStatus(function(response) {
  statusChangeCallback(response);
    
  });
};

// Load the SDK asynchronously
(function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = 'https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v2.10&appId=818620558299543';
      fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));