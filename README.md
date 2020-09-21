# weather-dashboard
## Javascript Web App 

![Contents](https://img.shields.io/github/languages/top/dan-gentile/weather-dashboard)
![Last-Commit](https://img.shields.io/github/last-commit/dan-gentile/weather-dashboard)

### Table of Contents


- [General Info](#general-info)
- [Technologies](#Technologies)
- [Deployment](#Deployment)
- [Screenshots](#screen-shots)


### General Info
Your very own weather dashboard powered by OpenWeather API! Search via city, city and country code or in the US city, state code and country code! This app will also store the data from your last three cities so you can see current weather, give them a click and the app will bring the data main part of the dashboard. Currently there is an API key in the code so it will run in the browser but in the future this will be gone and you will need to get an API Key from OpenWeather [Deployment](#Deployment). The site layout is mobile first, and responsive using CSS Grid. 


This project was built using the following:
- HTML
- CSS
- Javascript
- Jquery 

Link to page: <https://dan-gentile.github.io/weather-dashboard/>

### Technologies

This Projects used:
- [Javascript](https://www.javascript.com/)
- [OpenWeather API](https://openweathermap.org/)
- [Jquery](https://jquery.com/)
- [Moment.js](https://momentjs.com/)
- [Fontawesome](https://fontawesome.com/)
- [Google-Fonts](https://fonts.google.com/)

### Deployment 
Clone Repo, add you own OpenWeather API key, then launch in browser. The ability to search by state code is only available for US cities and requires you to search as the following 'CITY NAME', 'STATE CODE', US failure to do so may result in an error and a cannot find message appearing. If you just search via CITY NAME the largest city with that name will be your choice. To make sure you are in the correct country you can also search using the following 'CITY NAME', 'COUNTRY CODE'. However if you click on a past city it will search the api by just CITY NAME and COUNTRY CODE. 

Get an API key Here!
<https://home.openweathermap.org/users/sign_up>

### Screen Shots 

--App Page--
<img width="1721" alt="Screen Shot 2020-09-20 at 1 47 56 PM" src="https://user-images.githubusercontent.com/68626350/93721956-24b0b900-fb48-11ea-9b86-75bcd7e2b0e0.png">





### Code Snippets 
Main API request 
~~~
$.ajax({
        url: queryURL,
        method: "GET",
        error: function () {
            // remove page content
            $('#basic').empty();
            $('#img-div').empty();
            $('#main-weather').css('visibility', 'hidden');
            // show error message
            $('.popup-overlay, .popup-content').addClass('active');
            // close error message
            $(".close, .popup-overlay").on("click", function () {
                $(".popup-overlay, .popup-content").removeClass("active");
            });

        },
        success: function (response) {
            console.log(response)
            basicWeather();
            detailedWeather();
            displayFiveDayForecast();
            // allowing for the data to be received before storing
            setTimeout(function () {
                storeItems();
            }, 10)
~~~
 Creating the UV Index 
~~~
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
~~~
Storing the Data to local Storage 
~~~
function storeItems() {
    var temp = parseInt(response.main.temp);
    var tempF = Math.floor(((temp - 273.15) * 1.80) + 32);
    var pastCities = [{
        city: response.name,
        image: response.weather[0].icon,
        temp: tempF,
        country: response.sys.country

    }];
    Array.prototype.unshift.apply(storedCities, pastCities);

    if (storedCities.length > 3) {
        storedCities.pop();
        localStorage.setItem("cities", JSON.stringify(storedCities));
    } else {
        localStorage.setItem("cities", JSON.stringify(storedCities));
    }

    $('#past-search').empty();
    getFromLocal();

};
~~~

### Authors 
- Dan Gentile 

### License 
- Open Source 
