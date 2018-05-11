// Initialize your app
var myApp = new Framework7();

// Export selectors engine
var $$ = Dom7;

// Add views

var view1 = myApp.addView('#view-1');
var view2 = myApp.addView('#view-2',{
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});
var view3 = myApp.addView('#view-3');
var view4 = myApp.addView('#view-4');
	//bytton reference

var calendarDefault = myApp.calendar({
	input:"#calendar-default",
});


$$('#submit-data').on('click', function() {
	//this is the address to check the data
	//http://52.48.79.163/db.php?type=getmystories&id=1657883944275742
	// newstory
	// moodle page http://www.cctmoodle.com/mod/page/view.php?id=27687
	var formData = myApp.formToDfata('#my-form');

	var stringData = JSON.stringify(formData);
	var data = encodeURI(stringData);
	submitToServer(data);
	// now i need to encode the data

});


function submitToServer(data){
		var url = "http://52.48.79.163/db.php?type=newstory&data="+data+"&id="+window.user_ID;
		$$.post(url, function(data){
		$$('.login').html(data);
		alert("Your information has been successfully submitted.");
	})
}

