// define global variables
var cities = []

// click event on search button to add cities to array and start the get info process
$('#btn').click(function (e) {
    e.preventDefault();
    var city = $('#city').val().trim();
    cities.unshift(city);

    displayCurrentWeather()
});


function displayCurrentWeather() {
    var currentCity = cities[0];
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${currentCity}&appid=ece093d755e1ee215e90b7366ec41a32`

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        basicWeather()
        detailedWeather()


        function basicWeather() {
            // converting Kelvin to F 
            var temp = parseInt(response.main.temp)
            var tempF = Math.floor(((temp - 273.15) * 1.80) + 32)

            // creating icon 
            var iconurl = "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
            var icon = $('<img>');
            icon.attr('width', '160px')
            icon.attr('height', '160px')
            icon.attr('src', iconurl);

            // creating city name 
            var weatherHeader = $('<div>').attr('id', 'weather-city');
            weatherHeader.html(`Current Weather ${response.name}`);

            // creating date
            var currentDate = $('<div>').attr('id', 'current-date');
            currentDate.html(moment().format('MMMM Do YYYY'));

            // creating current temp
            var currentTemp = $('<div>').attr('id', 'current-temp');
            currentTemp.html(`${tempF} &#176`);

            // adding items to page
            $('#basic').append(weatherHeader, currentDate, currentTemp);
            $('#img-div').append(icon)
        }

        function detailedWeather() {
            // add humidity value 
            var humidity = $('<p>');
            humidity.text(`${response.main.humidity}%`);
            $('#humidity').append(humidity);
            $('#humidity').css('visibility', 'visible');

            // convert visibility from meters to miles
            var visibilityMiles = Math.floor(response.visibility / 1609.344);

            // add visibility value
            var visibility = $('<p>');
            visibility.text(`${visibilityMiles} mi`);
            $('#visibility').append(visibility);
            $('#visibility').css('visibility', 'visible');

            // convert wind speed from meters/second to mph 
            var windMPH = Math.floor(response.wind.speed / 0.44704);


            var windSpeed = $('<p>');
            windSpeed.text(`${windMPH}`)
        }




    });




}


// response.main.humidity
// response.wind.speed 
// response.weather[0].description
// response.icon
// response.visibility
// response.sys.sunrise
// response.sys.sunset