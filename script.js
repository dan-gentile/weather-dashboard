// define global variables
var cities = []
var storedCities = []

// click event on search button to add cities to array and start the get info process
$('#btn').click(function (e) {
    e.preventDefault();
    var city = $('#city').val().replace(/\s*,\s*/g, ",").split(',');
    cities.unshift(city);
    // running functions
    clearCells();
    displayCurrentWeather();
});


function displayCurrentWeather() {
    var currentCity = cities[0];
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${currentCity},US&appid=ece093d755e1ee215e90b7366ec41a32`

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        basicWeather()
        detailedWeather()
        displayFiveDayForcast()

        setTimeout(function () {
            storeItems();
        }, 10)


        function basicWeather() {
            $('#main-weather').css('visibility', 'visible')
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
        };

        function detailedWeather() {
            createHumidity();
            createVisibility();
            createWindSpeed();
            createUVIndex();

            function createHumidity() {
                // add Humidity value
                var humidityDiv = $('<div>').addClass('w-details');
                var humidityIcon = $('<i>').addClass('fas fa-humidity fa-lg');
                var humidityHead = $('<h4>').text('Humidity');
                var humidity = $('<p>');
                humidity.text(`${response.main.humidity}%`);
                // add to page
                humidityDiv.append(humidityIcon, humidityHead, humidity);
                $('#details').append(humidityDiv);
            };

            function createVisibility() {
                // convert visibility from meters to miles
                var visibilityMiles = Math.floor(response.visibility / 1609.344);
                // add visibility value
                var visibilityDiv = $('<div>').addClass('w-details');
                var visibilityIcon = $('<i>').addClass('fas fa-eye-slash fa-lg');
                var visibilityHead = $('<h4>').text('Visibility');
                var visibility = $('<p>');
                visibility.text(`${visibilityMiles} mi`);
                // add to page
                visibilityDiv.append(visibilityIcon, visibilityHead, visibility);
                $('#details').append(visibilityDiv);

            };

            function createWindSpeed() {
                // convert wind speed from meters/second to mph 
                var windMPH = Math.floor(response.wind.speed / 0.44704);
                // add Wind Speed value
                var windSpeedDiv = $('<div>').addClass('w-details');
                var windSpeedIcon = $('<i>').addClass('fas fa-wind fa-lg');
                var windSpeedHead = $('<h4>').text('Wind Speed');
                var windSpeed = $('<p>');
                windSpeed.text(`${windMPH} mph`);
                // add to page
                windSpeedDiv.append(windSpeedIcon, windSpeedHead, windSpeed);
                $('#details').append(windSpeedDiv);
            };

            function createUVIndex() {
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
                    if (uvData.value <= 2) {
                        uvIndexDiv.addClass('low');
                    } else if (uvData.value >= 3 && uvData.value < 6) {
                        uvIndexDiv.addClass('moderate');
                    } else if (uvData.value >= 6 && uvData.value < 8) {
                        uvIndexDiv.addClass('high');
                    } else if (uvData.value >= 8 && uvData.value < 10) {
                        uvIndexDiv.addClass('very-high');
                    } else {
                        uvIndexDiv.addClass('extreme');
                    }
                    // add to page 
                    uvIndexDiv.append(uvIndexIcon, uvIndexHead, uvIndex);
                    $('#details').append(uvIndexDiv);
                })
            };
        };

        function displayFiveDayForcast() {
            var lon = response.coord.lon;
            var lat = response.coord.lat;
            var fiveDayURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly&appid=ece093d755e1ee215e90b7366ec41a32`

            $.ajax({
                url: fiveDayURL,
                method: "GET"
            }).then(function (fiveDay) {
                nextDayWeather();

                function nextDayWeather() {
                    // for loop for each day of the 5 day 
                    for (i = 1; i < 6; i++) {
                        // creating the main div and time element 
                        var dayDiv = $('<div>').addClass('days')
                        var dayDate = $('<h4>').text(moment().add(parseInt([i]), 'days').format('M.D.YY'))
                        // creating the weather icon 
                        var iconurl = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/" + fiveDay.daily[i].weather[0].icon + ".svg";
                        var icon = $('<img>');
                        icon.attr('width', '40px')
                        icon.attr('height', '40px')
                        icon.attr('src', iconurl);
                        // creating the high temp container
                        var dayTemp = $('<div>').addClass('label');
                        var highTempIcon = $('<i>').addClass('fas fa-thermometer-three-quarters fa-lg');
                        // calculating the high temp 
                        var temp = parseInt(fiveDay.daily[i].temp.max);
                        var tempF = Math.floor(((temp - 273.15) * 1.80) + 32);
                        var highTempValue = $('<p>');
                        highTempValue.text(`${tempF}°`);
                        // adding icon and value to high temp container
                        dayTemp.append(highTempIcon, highTempValue);
                        // creating humidity container + value
                        var dayHumidity = $('<div>').addClass('label');
                        var dayHumidityIcon = $('<i>').addClass('fas fa-humidity fa-lg');
                        var dayHumidityValue = $('<p>');
                        dayHumidityValue.text(`${fiveDay.daily[i].humidity}%`);
                        // adding icon and value to humidity container
                        dayHumidity.append(dayHumidityIcon, dayHumidityValue);
                        // adding date, weather icon, high temp, and humidity to main container
                        dayDiv.append(dayDate, icon, dayTemp, dayHumidity);
                        // adding all of them to the page
                        $('#five-day').append(dayDiv);
                    }


                }
            });

        };

        function storeItems() {
            var temp = parseInt(response.main.temp)
            var tempF = Math.floor(((temp - 273.15) * 1.80) + 32)
            var pastCities = [{
                city: response.name,
                image: response.weather[0].icon,
                temp: tempF
            }];
            Array.prototype.unshift.apply(storedCities, pastCities);

            if(storedCities.length > 3){
                storedCities.pop();
                localStorage.setItem("cities", JSON.stringify(storedCities));
            }else{
                localStorage.setItem("cities", JSON.stringify(storedCities));
            }
            
            $('#past-search').empty();
            getFromLocal();
            
        };
    });
};

function clearCells() {
    $('#details').empty();
    $('#five-day').empty();
};

function getFromLocal(){
    localStorageCities = JSON.parse(localStorage.getItem('cities'));
    if (localStorageCities !== null) {
        storedCities = localStorageCities;
}
      
        for(i = 0; i < localStorageCities.length; i++){
            pastCityDiv = $('<div>').addClass('past-city').attr('data-city',localStorageCities[i].city);

            var iconurl = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/" + localStorageCities[i].image + ".svg";
            var pastIcon = $('<img>');
            pastIcon.attr('width', '30px');
            pastIcon.attr('height', '30px');
            pastIcon.attr('src', iconurl);
            

            var name = $('<h4>');
            name.text(`${localStorageCities[i].city}`);

            var temp = $('<p>');
            temp.text(`${localStorageCities[i].temp}°`);

            pastCityDiv.append(pastIcon, name, temp);

            $('#past-search').append(pastCityDiv);


        }




}

$(document).on('click', '.past-city', function(){
    var storedCity = $(this).data('city');
    cities.unshift(storedCity);
    clearCells();
    displayCurrentWeather();
});



getFromLocal()
