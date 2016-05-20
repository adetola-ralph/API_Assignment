var dayTime = "linear-gradient(#f1c40f 0%, #d35400 100%)";
var nightTime = "linear-gradient(#7f8c8d 0%, #2c3e50 76%, #2c3e50 76%)";
var cancel = "fa fa-ban";
var noTemp = "0<sup>o</sup>C"; //if the browser doesn't support getting locations
var lat = ""; //latitude
var lon = ""; //longitude
var link = "http://api.openweathermap.org/data/2.5/weather"; //api endpoint
var key = "c34e05afbe22b8834c31ca9fc05ccb19"; //my api key

//jquery used to chek if the window has loaded
$(window).load(function() {
  //check if navigator.geolocation is supported
  if (navigator.geolocation) {
    //get the users locationa and give the function that'll get the data from the endpoint
      navigator.geolocation.getCurrentPosition(function(position) {
      lat = position.coords.latitude;
      lon = position.coords.longitude;
      getWeather(lat, lon);
    },function(error){
      if (error.code == error.PERMISSION_DENIED)
      {
        //if access is not granted to the navigator.geolocation the load this function
        noWeather();
      }
    });
  } else {
    //if navigator.geolocation is not supported then run this function
    noWeather();
  }
});

//if the geolocation is disabled or not available
function noWeather() {
  $(".weather_icon_div i").addClass(cancel);
  $(".weather_condition p").html("No Weather");
  $(".weather_location p").html("No Location");
  $(".weather_temp p").html(noTemp);
}

//method to get weather from api
function getWeather(lat, lon) {
  //Jquery ajax to get the data from the api endpoint
  $.ajax({
    url: link, //api endpoint link
    type: 'GET', //HTTP GET verb used to get the information from the server
    data:{lat:lat,lon:lon,units:"metric",APPID:key}, //data being sent to send to the server to know what data to send back
    dataType: 'json', //return type of the data being received
    success: function(json) { //callback function executed if the request was succcessful
      console.log(json); //outout the information as raw json
      $(".weather_location .text-center").html("<strong>" + json.name + ", " + json.sys.country + "</strong>");
      $(".weather_condition .text-center").html(json.weather[0].description);

      //temp tag doesn't exist using it to differentiate the temperature value from the unit
      $(".weather_temp .text-center").html("<temp>"+json.main.temp+"</temp><sup>o</sup>C");
      $(".temp_unit").val("c");

      //decide if it is day or night
      var dayNight = day_night(json.sys.sunrise,json.sys.sunset);
      var icon = "owf-"+json.weather[0].id+""+dayNight;
      $(".weather_icon_div i").addClass("owf");
      $(".weather_icon_div i").addClass(icon);
      if(dayNight=="-n")
      {
        $("body").css("background",nightTime);
      }else{$("body").css("background",dayTime);}
    }
  });
}

//function that controls changing the background color of the app if it is day or night
function day_night(sunrise,sunset)
{
  var d = new Date();
  var time = d.getTime();
  var timeWithoutMilli = Math.floor(time/1000);

  if(timeWithoutMilli>sunrise && timeWithoutMilli<sunset)
  {
    return "-d";
  }else
    {
      return "-n";
    }
}
