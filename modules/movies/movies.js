//movies.js

Module.register("helloworld", {
    defaults: {
        text: "Hello World!"
    },

    getDom: function() {
        var wrapper = document.createElement("div");
        wrapper.innerHTML = this.getData();
        return wrapper;
    },

    getData: function() {
        var http = require('http');
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        var nextWeekDate = nextWeek.getFullYear() + '-' + (nextWeek.getMonth() + 1) + '-' + nextWeek.getDate();

        var queryString = '/3/discover/movie?api_key=d75905bcb2a9eef575bbaa98796b372b&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_date.gte=' + date + '&primary_release_date.lte=' + nextWeekDate;

        var options = {
            host: 'api.themoviedb.org',
            path: queryString
        };

        callback = function(response) {
            var str = '';

            //another chunk of data has been recieved, so append it to `str`
            response.on('data', function(chunk) {
                str += chunk;
            });

            //the whole response has been recieved, so we just print it out here
            response.on('end', function() {

                var JSONresults = JSON.parse(str);
                var movies = [];
                for (i = 0; i < JSONresults.results.length; i++) {
                    var movie = JSONresults.results[i];
                    if (movie.original_language == 'en') {
                        movies.push(movie.original_title);
                    }
                }
                console.log(movies);
            });
        }

        var req = http.request(options, callback).end();

        return req;

    }
});

//api key: d75905bcb2a9eef575bbaa98796b372b
