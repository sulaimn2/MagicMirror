//movies.js

Module.register("movies", {
    defaults: {
        text: "Hello World!",
        animationSpeed: 1000,
        retryDelay: 2500,
        updateFrequency: 60*5*1000
    },

    start: function() {
        console.log(this.name + ' is started!');
        this.loaded = false;
        this.movies = null;
        this.scheduleUpdate(1000);

    },

    getStyles: function() {
        return ["movie_styles.css"];
    },

    getDom: function() {
        var wrapper = document.createElement("div");
        wrapper.className = "medium";
        wrapper.innerHTML = "Movies opening this week"

        var large = document.createElement("div");

        if (this.movies == null) {
            return wrapper;
        }

        for (i = 0; i < this.movies.length; i++) {
            var movie = document.createElement("span");
            movie.className = "dimmed light small";
            movie.innerHTML = " " + this.movies[i] + "<br>";
            large.appendChild(movie);
        }

        wrapper.appendChild(large);

        return wrapper;
    },

    processMovieResponse: function(JSONresults) {
        this.movies = [];
        for (i = 0; i < JSONresults.results.length, i < 5; i++) {
            var movie = JSONresults.results[i];
            if (movie.original_language == 'en') {
                this.movies.push(movie.original_title);
            }
        }
        console.log(this.movies);
        this.show(this.config.animationSpeed, { lockString: "movie_module_identifier" });
        this.loaded = true;
        this.updateDom(this.config.animationSpeed);

    },

    updateMovieList: function() {
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        var nextWeekDate = nextWeek.getFullYear() + '-' + (nextWeek.getMonth() + 1) + '-' + nextWeek.getDate();
        var url = 'http://api.themoviedb.org/3/discover/movie?api_key=d75905bcb2a9eef575bbaa98796b372b&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_date.gte=' + date + '&primary_release_date.lte=' + nextWeekDate;
        var self = this;
        var retry = true;

        var movieRequest = new XMLHttpRequest();
        movieRequest.open("GET", url, true);
        movieRequest.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    self.processMovieResponse(JSON.parse(this.response));
                    //console.log(this.response);
                } else if (this.status === 401) {
                    //self.updateDom(self.config.animationSpeed);

                    console.log(self.name + ": Incorrect APPID.");
                    retry = true;
                } else {
                    console.log(self.name + ": Could not load weather.");
                }

                if (retry) {
                    self.scheduleUpdate((self.loaded) ? -1 : self.config.retryDelay);
                }
            }
        };
        movieRequest.send();
    },

    scheduleUpdate: function(delay) {
        var nextLoad = this.config.updateFrequency;
        if (typeof delay !== "undefined" && delay >= 0) {
            nextLoad = delay;
        }
        var self = this;
        setTimeout(function() {
            self.updateMovieList();
        }, nextLoad);
    },
});

//api key: d75905bcb2a9eef575bbaa98796b372b
