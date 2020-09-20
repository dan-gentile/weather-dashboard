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
        console.log(response)

        function basicWeather() {
            // converting Kelvin to F 
            $('#basic').empty();
            $('#img-div').empty();
            var temp = parseInt(response.main.temp)
            var tempF = Math.floor(((temp - 273.15) * 1.80) + 32)

            // creating icon 
            var iconurl = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/" + response.weather[0].icon + ".svg";
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
            createHumidity();
            createVisibility();
            createWindSpeed();
            createUVIndex();

            function createHumidity(){
                // add Humidity value
                var humidityDiv = $('<div>').addClass('w-details');
                var humidityIcon = $('<i>').addClass('fas fa-humidity fa-lg');
                var humidityHead = $('<h4>').text('Humidity');
                var humidity = $('<p>');
                humidity.text(`${response.main.humidity}%`);
                humidityDiv.append(humidityIcon, humidityHead, humidity);
                $('#details').append(humidityDiv);  
            }
           
            function createVisibility(){
                // convert visibility from meters to miles
                var visibilityMiles = Math.floor(response.visibility / 1609.344);
                // add visibility value
                var visibilityDiv = $('<div>').addClass('w-details');
                var visibilityIcon = $('<i>').addClass('fas fa-eye-slash fa-lg');
                var visibilityHead = $('<h4>').text('Visibility');
                var visibility = $('<p>');
                visibility.text(`${visibilityMiles} mi`);
                visibilityDiv.append(visibilityIcon, visibilityHead, visibility);
                $('#details').append(visibilityDiv);  

            }
          
            function createWindSpeed(){
                // convert wind speed from meters/second to mph 
                var windMPH = Math.floor(response.wind.speed / 0.44704);
                // add Wind Speed value
                var windSpeedDiv = $('<div>').addClass('w-details');
                var windSpeedIcon = $('<i>').addClass('fas fa-wind fa-lg');
                var windSpeedHead = $('<h4>').text('Wind Speed');
                var windSpeed = $('<p>');
                windSpeed.text(`${windMPH} mph`);
                windSpeedDiv.append(windSpeedIcon, windSpeedHead, windSpeed);
                $('#details').append(windSpeedDiv);  
            }
            
            function createUVIndex(){
                // getting the UV Index from the API
                var lon = response.coord.lon;
                var lat = response.coord.lat;
                var uvURL = `http://api.openweathermap.org/data/2.5/uvi?appid=ece093d755e1ee215e90b7366ec41a32&lat=${lat}&lon=${lon}`;
                
                $.ajax({
                    url: uvURL,
                    method: "GET"
                }).then(function (uvData) {
                    // creating elements
                    var uvIndexDiv = $('<div>').addClass('w-details');
                    var uvIndexIcon = $('<i>').addClass('fas fa-sun fa-lg');
                    var uvIndexHead = $('<h4>').text('UV Index');
                    var uvIndex = $('<p>');
                    uvIndex.text(`${uvData.value}`);
                    // changing text color based on received data and charts
                    if(uvData.value <= 2){
                        uvIndex.addClass('low');
                    } else if (uvData.value >= 3 || uvData <= 5){
                        uvIndex.addClass('moderate');
                    } else if (uvData.value >= 6 || uvData <= 7){
                        uvIndex.addClass('high');
                    } else if (uvData.value >= 8 || uvData <= 10){
                        uvIndex.addClass('very-high');
                    } else{
                        uvIndex.addClass('extreme');
                    }
                    // adding to page 
                    uvIndexDiv.append(uvIndexIcon, uvIndexHead, uvIndex);
                    $('#details').append(uvIndexDiv);  
                })
            }
            

     


        }




    });




}

