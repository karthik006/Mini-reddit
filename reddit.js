/*globals $:false , jQuery:false*/
// Client-side code
/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
// Server-side code
/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
var main = function() {
    "use strict";

    var user = {
            "id": 0,
            "userName": "",
            "like": [],
            "notLike": []
        },
        username, pwd, like = [],
        notLike = [],
        len = [];

    function postFunction() {
        $("#logoutTopNav").hide();
        $("#loginTopNav").show();
        $("#mySavedPosts").hide();
        $.get("http://localhost:3000/posts", function(getData) {
            $("div.postsContainer").empty();
            getData.forEach(function(reddit) {
                var imgId = reddit._id;
                len.push(getData.length);
                var postsList = "<div id=" + imgId + " class ='postContent z-depth-1'>" +
                    "<div class = 'votes'>" +
                    "<img  id=" + imgId + " class='voteUpButton' src='image/up.png'>" +
                    "<img  id=" + imgId + " class='voteUpButtonDisabled' src='image/upDisabled.png' style='opacity:0.4; display: none;'>" + "<br>" +
                    "<strong id =" + imgId + " class='votesNum'>" + reddit.likes + "</strong>" + "<br>" +
                    "<img  id=" + imgId + " class='voteDownButton' src='image/down.png'>" +
                    "<img  id=" + imgId + " class='voteDownButtonDisabled' src='image/downDisabled.png' style='opacity:0.4; display: none;'>" +
                    "</div>" + "<div class='image'>" + "<a href=" + JSON.stringify(reddit.main_link) + ">" +
                    "<img autoplay='true' src=" + JSON.stringify(reddit.image_link) + " class='postimage'>" + "</a>" + "</div>" +
                    "<div class='Content-List'>" +
                    "<a href=" + JSON.stringify(reddit.main_link) + ">" +
                    "<p class='postname'>" + reddit.link_title + "</p>" +
                    "<div class='subtitles'>" + "<p class='username'>By " + reddit.username + "</p>" +
                    "<p class='time'>" + timeSince(new Date(reddit.post_time)) + "</p>" + "</div>" + "</a>" +
                    "<img  id=" + imgId + " class='facebook_Button' src='image/share.png'>" +
                    "</div>";
                $(postsList).appendTo('div.postsContainer');
                $("#postform")[0].reset();
                $("ul.pagination").empty();
                pages(getData.length);
            }); //end of foreach function
            //session storage variable




            if (sessionStorage.getItem('user')) {
                user.id = sessionStorage.getItem('id');
                user.userName = sessionStorage.getItem('user');
                username = sessionStorage.getItem('user');
                pwd = sessionStorage.getItem('password');
                var a, b, x, y;
                a = sessionStorage.getItem('like');
                b = sessionStorage.getItem('notLike');


                x = a.replace(/^,|,$/g, '');
                y = b.replace(/^,|,$/g, '');
                
                $("#user").text("Welcome, " + username); //adding the username to the header nav bar.
                $("#logoutTopNav").show();
                $("#loginTopNav").hide();
                $("#signUp").hide();
                $("#mySavedPosts").show();

                like = x.split(',');



                //check if the array is empty or not--karthik
                like.forEach(function(element) {
                    if (element !== "") {
                        $("#" + element + ".voteUpButton").hide();
                        $("#" + element + ".voteUpButtonDisabled").show();
                    }
                });


                notLike = y.split(',');


                //check if the array is empty or not--karthik
                notLike.forEach(function(element) {
                    if (element !== "") {
                        $("#" + element + ".voteDownButton").hide();
                        $("#" + element + ".voteDownButtonDisabled").show();
                    }
                });
            }



            //facebook share	  
            $("img.facebook_Button").on("click", function() {
                if (username) {
                    var $mainlink = $("div #" + this.id + "").find('a').attr('href');

                    FB.ui({
                            method: 'share',
                            href: $mainlink,
                        },
                        // callback
                        function(response) {
                            if (response && !response.error_message) {
                                var $toastContent = $('<span>Posted successfully</span>');
                                Materialize.toast($toastContent, 4000);
                            } else {
                                var $toastContenterror = $('<span>OoPs Something went wrong!Post couldnot be shared</span>');
                                Materialize.toast($toastContenterror, 4000);
                            }
                        }
                    );
                } else {
                    var $login = $('<span>Oops!! you need to log  in first</span>');
                    Materialize.toast($login, 4000);
                }
            });


            //facebook login
            $("img#fb_login").on("click", function() {
                FB.login(function(response) {
                    if (response.authResponse) {
                        FB.api('/me', function(response) {
                            
                            var x = response.name;

                            getname(x);
                        });

                        function getname(name) {
                            var us = name.toLowerCase();
                            
                            var pwd = "fbuser";

                            $.ajax({
                                url: "http://localhost:3000/allusers",
                                type: "GET",
                                dataType: "Json",
                                contentType: 'application/json',
                                success: function(result) {
                                    var t = result.length;

                                    var j1 = {
                                        "name": us
                                    };
                                    $.ajax({
                                        url: "http://localhost:3000/users",
                                        type: "GET",
                                        contentType: "Application/Json",
                                        data: j1,
                                        success: function(result) {

                                            if (result.length === 0) {
                                                var j2 = {
                                                    "_id": t + 1,
                                                    "name": us,
                                                    "password": pwd
                                                }; //"likes":like,"notLikes":notLike
                                                $.ajax({
                                                    type: "PUT",
                                                    data: j2,
                                                    url: "http://localhost:3000/newuser",
                                                    success: function() {
                                                      
                                                        alert("Registered successfully ,Use password: fbuser and your facebook username to login next time ");
                                                        $('#modal3').closeModal();
                                                        $("div").removeClass("lean-overlay");
                                                        like = [];
                                                        notLike = [];

                                                        $.get("http://localhost:3000/allusers", function(data) {

                                                            var length = data.length;
                                                            $("#user").text("Welcome, " + us); //adding the username to the header nav bar.
                                                            $("#mySavedPosts").show();
                                                            $("#logoutTopNav").show();
                                                            $("#loginTopNav").hide();
                                                            $("#signUp").hide();
                                                            sessionStorage.setItem('id', length);
                                                            sessionStorage.setItem('user', us);
                                                            sessionStorage.setItem('password', pwd);
                                                            sessionStorage.setItem('like', like);
                                                            sessionStorage.setItem('notLike', notLike);
                                                            location.reload(true);
                                                            showUserHistory();
                                                        });
                                                    },
                                                });
                                            } else {
                                                alert("Sorry,It looks like the user already exist ,Login with your credentials or use facebook login credentials");
                                                document.getElementById("reguser").value = "";
                                                document.getElementById("regpass").value = "";
                                                document.getElementById("confirmpass").value = "";
                                                $('#modal3').closeModal();
                                                $("div").removeClass("lean-overlay");


                                            }
                                        }

                                    });
                                }
                            });
                        }
                    } else {
                        console.log('User cancelled login or did not fully authorize.');
                    }
                });
            });




            function clickLike() { //like functionality
                $("img.voteUpButton").on("click", function() {

                    var $imgId = this.id,
                        main_link, link_title, timePost, imageValue, videoValue, postingUser, image_link,
                        result = $("#" + this.id + ".votesNum").text();

                    if (username) { // check if the user loged in before letting user to change the Likes status.
                        //if the like button and not like button, both are off:
                        if (like[0] === isNaN || like[0] === null || like[0] === "" || like[0] === "undefined") {
                            like.shift(1);
                        }

                        if (!like.includes(this.id) && !notLike.includes(this.id)) {

                            like.push(this.id); // push the post Id to the like list.
                            //write the like array content to the json file.


                            var dt1 = JSON.stringify(like);
                            var dt2 = JSON.stringify(notLike);

                            //var result = test.slice(1,-1);
                            var userId = user.id;
                            
                            $.ajax({
                                type: "POST",
                                url: "http://localhost:3000/users/",

                                data: {
                                    "_id": user.id,
                                    "name": user.userName,
                                    "password": pwd,
                                    "likes": like,
                                    "notLikes": notLike
                                }
                            });
                            //hide the like button and show the blurrd like button:
                            $("#" + this.id + ".voteUpButton").hide();
                            $("#" + this.id + ".voteUpButtonDisabled").show();
                            result++; // result is the number of likes after increasing or decreasing
                        }

                        //if the post is already not liked before:
                        else if (notLike.includes(this.id)) {

                            if (notLike[0] === isNaN || notLike[0] === null || notLike[0] === "" || notLike[0] === "undefined") {
                                notLike.shift(1);
                            }
                            notLike.splice(notLike.indexOf(this.id), 1); //take the id from not like list.
                            like.push(this.id); //push the id to the like list.
                            //writting the like array to the json file.

                            var dt4 = JSON.stringify(like);
                            var dt5 = JSON.stringify(notLike);

                            $.ajax({
                                type: "POST",
                                url: "http://localhost:3000/users/",

                                data: {
                                    "_id": user.id,
                                    "name": user.userName,
                                    "password": pwd,
                                    "likes": like,
                                    "notLikes": notLike
                                }
                            });
                            $("#" + this.id + ".voteUpButton").hide();
                            $("#" + this.id + ".voteUpButtonDisabled").show();
                            $("#" + this.id + ".voteDownButton").show();
                            $("#" + this.id + ".voteDownButtonDisabled").hide();
                            result++;
                            result++;
                        }

                        sessionStorage.setItem('like', like);
                        sessionStorage.setItem('notLike', notLike);
                        $("#" + this.id + ".votesNum").text(result); //updating the html with the new "Likes" value
                        //get request to get other reddit.json elements by using only the ID:
                        main_link = getData[this.id - 1].main_link;
                        link_title = getData[this.id - 1].link_title;
                        image_link = getData[this.id - 1].image_link;
                        timePost = getData[this.id - 1].post_time;
                        postingUser = getData[this.id - 1].username;
                        imageValue = getData[this.id - 1].image;
                        videoValue = getData[this.id - 1].video;

                        $.ajax({
                            type: "PUT",
                            url: "http://localhost:3000/posts/",
                            data: {
                                "id": $imgId,
                                "image_link": image_link,
                                "likes": result,
                                "link_title": link_title,
                                "main_link": main_link,
                                "post": "submitted",
                                "post_time": timePost,
                                "username": postingUser,
                                "image": imageValue,
                                "video": videoValue

                            }
                        });
                    } else { //check if not loged in, then it want let the user to do likes or not likes.
                        var $login = $('<span>Oops!! you need to log  in first</span>');
                        Materialize.toast($login, 4000);
                    }
                });
                //end of like up event.
            } //end of clickLike function.

            function clickNotLike() { //unlike functionality
                $("img.voteDownButton").on("click", function() {
                    var $imgId = this.id,
                        main_link, link_title, imageValue, videoValue, timePost, postingUser, image_link, result = $("#" + this.id + ".votesNum").text();

                    if (username) { // check if the user loged in before letting user to change the Likes status.


                        if (notLike[0] === isNaN || notLike[0] === null || notLike[0] === "" || notLike[0] === "undefined") {
                            notLike.shift(1);
                        }
                        if (!notLike.includes(this.id) && !like.includes(this.id)) {
                            notLike.push(this.id);
                            //writting the content of notlike array to the json file.



                            $.ajax({
                                type: "POST",
                                url: "http://localhost:3000/users/",

                                data: {
                                    "_id": user.id,
                                    "name": user.userName,
                                    "password": pwd,
                                    "likes": like,
                                    "notLikes": notLike
                                }
                            });
                            $("#" + this.id + ".voteDownButton").hide();
                            $("#" + this.id + ".voteDownButtonDisabled").show();
                            result--; // result is the number of likes after increasing or decreasing
                        } else if (like.includes(this.id)) {
                            like.splice(like.indexOf(this.id), 1);
                            notLike.push(this.id);
                            if (notLike[0] === isNaN || notLike[0] === null || notLike[0] === "" || notLike === "undefined") {
                                notLike.shift(1);
                            }

                            $.ajax({
                                type: "POST",
                                url: "http://localhost:3000/users/",

                                data: {
                                    "_id": user.id,
                                    "name": user.userName,
                                    "password": pwd,
                                    "likes": like,
                                    "notLikes": notLike
                                }
                            });
                            $("#" + this.id + ".voteDownButton").hide();
                            $("#" + this.id + ".voteDownButtonDisabled").show();
                            $("#" + this.id + ".voteUpButton").show();
                            $("#" + this.id + ".voteUpButtonDisabled").hide();
                            result--;
                            result--;
                        }
                        sessionStorage.setItem('like', like);
                        sessionStorage.setItem('notLike', notLike);

                        $("#" + this.id + ".votesNum").text(result); //updating the html with the new "Likes" value
                        //get request to get other reddit.json elements by using only the ID:
                        main_link = getData[this.id - 1].main_link;
                        link_title = getData[this.id - 1].link_title;
                        image_link = getData[this.id - 1].image_link;
                        timePost = getData[this.id - 1].post_time;
                        postingUser = getData[this.id - 1].username;
                        imageValue = getData[this.id - 1].image;
                        videoValue = getData[this.id - 1].video;

                        $.ajax({
                            type: "PUT",
                            url: "http://localhost:3000/posts/",
                            data: {
                                "id": $imgId,
                                "image_link": image_link,
                                "likes": result,
                                "link_title": link_title,
                                "main_link": main_link,
                                "post": "submitted",
                                "post_time": timePost,
                                "username": postingUser,
                                "image": imageValue,
                                "video": videoValue

                            }
                        });
                    } else {
                        var $login = $('<span>Oops!! you need to log  in first</span>');
                        Materialize.toast($login, 4000);
                    }
                }); //end of like down event.
            } //end of clickNotLike function.
            pages(getData.length);
            $(".button-collapse").sideNav();
            $('.modal-trigger').leanModal();
            $('.tooltipped').tooltip({
                delay: 50
            });




            //Newest tab click event:
            $("ul.tabs li:nth-child(1) a").on("click", function() {
                var newest = getData;
                $("div.postsContainer").empty();
                newest.forEach(function(reddit) {
                    var imgId = reddit._id;
                    var postsList = "<div class ='postContent z-depth-1'>" +
                        "<div class = 'votes'>" +
                        "<img  id=" + imgId + " class='voteUpButton' src='image/up.png'>" +
                        "<img  id=" + imgId + " class='voteUpButtonDisabled' src='image/upDisabled.png' style='opacity:0.4; display: none;'>" + "<br>" +
                        "<strong id =" + reddit._id + " class='votesNum'>" + reddit.likes + "</strong>" + "<br>" +
                        "<img  id=" + imgId + " class='voteDownButton' src='image/down.png'>" +
                        "<img  id=" + imgId + " class='voteDownButtonDisabled' src='image/downDisabled.png' style='opacity:0.4; display: none;'>" +
                        "</div>" + "<div class='image'>" + "<a href=" + JSON.stringify(reddit.main_link) + ">" +
                        "<img autoplay='true' src=" + JSON.stringify(reddit.image_link) + " class='postimage'>" + "</a>" + "</div>" +
                        "<div class='Content-List'>" +
                        "<a href=" + JSON.stringify(reddit.main_link) + ">" +
                        "<p class='postname'>" + reddit.link_title + "</p>" +
                        "<div class='subtitles'>" + "<p class='username'>By " + reddit.username + "</p>" +
                        "<p class='time'>" + timeSince(new Date(reddit.post_time)) + "</p>" + "</div>" + "</a>" +
                        "</div>";
                    $(postsList).prependTo('div.postsContainer');
                    $("ul.pagination").empty();
                    pages(getData.length);
                });
                showUserHistory();
                clickLike();
                clickNotLike();

            });

            //Oldest tab click event:
            $("ul.tabs li:nth-child(2) a").on("click", function() {
                location.reload(true);
                var oldest = getData;
                $("div.postsContainer").empty();
                oldest.forEach(function(reddit) {
                    var imgId = reddit._id;
                    var postsList = "<div class ='postContent z-depth-1'>" +
                        "<div class = 'votes'>" +
                        "<img  id=" + imgId + " class='voteUpButton' src='image/up.png'>" +
                        "<img  id=" + imgId + " class='voteUpButtonDisabled' src='image/upDisabled.png' style='opacity:0.4; display: none;'>" + "<br>" +
                        "<strong id =" + reddit._id + " class='votesNum'>" + reddit.likes + "</strong>" + "<br>" +
                        "<img  id=" + imgId + " class='voteDownButton' src='image/down.png'>" +
                        "<img  id=" + imgId + " class='voteDownButtonDisabled' src='image/downDisabled.png' style='opacity:0.4; display: none;'>" +
                        "</div>" + "<div class='image'>" + "<a href=" + JSON.stringify(reddit.main_link) + ">" +
                        "<img autoplay='true' src=" + JSON.stringify(reddit.image_link) + " class='postimage'>" + "</a>" + "</div>" +
                        "<div class='Content-List'>" +
                        "<a href=" + JSON.stringify(reddit.main_link) + ">" +
                        "<p class='postname'>" + reddit.link_title + "</p>" +
                        "<div class='subtitles'>" + "<p class='username'>By " + reddit.username + "</p>" +
                        "<p class='time'>" + timeSince(new Date(reddit.post_time)) + "</p>" + "</div>" + "</a>" +
                        "<img  id=" + imgId + " class='facebook_Button' src='image/share.png' >" +
                        "</div>";
                    $(postsList).appendTo('div.postsContainer');
                    $("ul.pagination").empty();
                    pages(getData.length);
                });
                showUserHistory();
                clickLike();
                clickNotLike();

            });

            //trending tab click event:
            $("ul.tabs li:nth-child(3) a").on("click", function() {
                var trending = getData.concat();
                $("div.postsContainer").empty(); //to get a new copy of (getData array) without affecting the original array.
                trending.sort(function(a, b) {
                    return b.likes - a.likes;
                });

                trending.forEach(function(reddit) {
                    var imgId = reddit._id;
                    var postsList = "<div class ='postContent z-depth-1'>" +
                        "<div class = 'votes'>" +
                        "<img  id=" + imgId + " class='voteUpButton' src='image/up.png'>" +
                        "<img  id=" + imgId + " class='voteUpButtonDisabled' src='image/upDisabled.png' style='opacity:0.4; display: none;'>" + "<br>" +
                        "<strong id =" + reddit._id + " class='votesNum'>" + reddit.likes + "</strong>" + "<br>" +
                        "<img  id=" + imgId + " class='voteDownButton' src='image/down.png'>" +
                        "<img  id=" + imgId + " class='voteDownButtonDisabled' src='image/downDisabled.png' style='opacity:0.4; display: none;'>" +
                        "</div>" + "<div class='image'>" + "<a href=" + JSON.stringify(reddit.main_link) + ">" +
                        "<img autoplay='true' src=" + JSON.stringify(reddit.image_link) + " class='postimage'>" + "</a>" + "</div>" +
                        "<div class='Content-List'>" +
                        "<a href=" + JSON.stringify(reddit.main_link) + ">" +
                        "<p class='postname'>" + reddit.link_title + "</p>" +
                        "<div class='subtitles'>" + "<p class='username'>By " + reddit.username + "</p>" +
                        "<p class='time'>" + timeSince(new Date(reddit.post_time)) + "</p>" + "</div>" + "</a>" +

                        +"</div>";
                    $(postsList).appendTo('div.postsContainer');
                    $("ul.pagination").empty();
                    pages(getData.length);
                });
                showUserHistory();
                clickLike();
                clickNotLike();

            });
            //mypost clickevent
            $("#mySavedPosts").on("click", function() {
                // var mypost=getData.concat();//to get a new copy of (getData array) without affecting the original array.
                $("div.postsContainer").empty();
                getData.forEach(function(reddit) {
                    if (reddit.username === username) {
                        var imgId = reddit._id;
                        var postsList = "<div class ='postContent z-depth-1'>" +
                            "<div class = 'votes'>" +
                            "<img  id=" + imgId + " class='voteUpButton' src='image/up.png'>" +
                            "<img  id=" + imgId + " class='voteUpButtonDisabled' src='image/upDisabled.png' style='opacity:0.4; display: none;'>" + "<br>" +
                            "<strong id =" + reddit._id + " class='votesNum'>" + reddit.likes + "</strong>" + "<br>" +
                            "<img  id=" + imgId + " class='voteDownButton' src='image/down.png'>" +
                            "<img  id=" + imgId + " class='voteDownButtonDisabled' src='image/downDisabled.png' style='opacity:0.4; display: none;'>" +
                            "</div>" + "<div class='image'>" + "<a href=" + JSON.stringify(reddit.main_link) + ">" +
                            "<img id=" + imgId + " src=" + JSON.stringify(reddit.image_link) + " class='postimage'>" + "</a>" + "</div>" +
                            "<div class='Content-List'>" +
                            "<a href=" + JSON.stringify(reddit.main_link) + ">" +
                            "<p class='postname'>" + reddit.link_title + "</p>" +
                            "<div class='subtitles'>" + "<p class='username'>By " + reddit.username + "</p>" +
                            "<p class='time'>" + timeSince(new Date(reddit.post_time)) + "</p>"
                        "</div>" + "</a>" +
                        "</div>";
                        $(postsList).prependTo('div.postsContainer');
                    }
                    $("ul.pagination").empty();
                    pages(getData.length);
                }); //forEach ending
                //$("ul.pagination").empty();
                like.forEach(function(element) {
                    if (element !== "") {
                        $("#" + element + ".voteUpButton").hide();
                        $("#" + element + ".voteUpButtonDisabled").show();
                    }
                });
                notLike.forEach(function(element) {
                    if (element !== "") {
                        $("#" + element + ".voteDownButton").hide();
                        $("#" + element + ".voteDownButtonDisabled").show();
                    }
                });
                clickLike();
                clickNotLike();
            });
            clickLike();
            clickNotLike();

            //pages(getData.length);
        }); //end of $.get function

    } //end of my function

    //For video validation
    function imageurlvalidation(image_link) {
        var media = {};
        if (image_link.match('https?://(www.)?youtube|youtu\.be')) {
            var youtube_id;
            if (image_link.match('embed')) {
                youtube_id = image_link.split(/embed\//)[1].split('"')[0];
            } else {
                youtube_id = image_link.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0];
            }
            media.type = "youtube";
            media.id = youtube_id;
            return media;
        } else if (image_link.match('https?://(player.)?vimeo\.com')) {
            var regExp = /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/,
                parseUrl = regExp.exec(image_link);
            media.id = parseUrl[5];
            media.type = "vimeo";
            return media;
        } else {
            media.type = "imgur";
            return media;
        }
    }
    //End ----
    //function login
    function login() {
        $("#login").on("click", function() {
            //initilaizing user object to zero.
            username = document.getElementById("username").value;
            pwd = document.getElementById("password").value;
            
            if (username === "") {
                alert("OOPS! Please enter your username");
            } else if (pwd === "") {
                alert("OOPS! Please enter your password");
            } else {
                $.ajax({
                    url: "http://localhost:3000/ifusers",
                    type: "POST",
                    dataType: "Json",
                    contentType: 'application/json',
                    data: JSON.stringify({
                        "name": username,
                        "password": pwd

                    }),
                    success: function(result) {
                        if (result.length === 0 || result[0].name !== username || result[0].password !== pwd) {
                            alert("Sorry! login failed, Please check your username and password");
                        } else {
                            $('#modal2').closeModal();
                            //new line
                            $("div").removeClass("lean-overlay");
                            $("input#username").val(""); //new line
                            $("input#password").val(""); //new line
                            alert("Welcome !login Successful");
                            //tempObject to store initial get request value, in order to parse it later, then store in in user object.
                            var tempObject = result[0];
                            

                            user.id = tempObject._id;
                            user.userName = tempObject.name;

                            like = tempObject.likes;
                            notLike = tempObject.notLikes;

                            if (like === undefined) {
                                like = [];
                            } else if (notLike === undefined) {
                                notLike = [];
                            }

                            if (like !== undefined) {
                                for (var i = 0, l = like.length; i < l; i++) {
                                    if (typeof(like[i]) == 'undefined') {
                                        like.splice(i, 1);
                                    }
                                };
                            } else if (notLike !== undefined) {
                                for (var i = 0, l = notLike.length; i < l; i++) {
                                    if (typeof(notLike[i]) == 'undefined') {
                                        notLike.splice(i, 1);
                                    }
                                }

                            }

                            sessionStorage.setItem('id', user.id);
                            sessionStorage.setItem('user', username);
                            sessionStorage.setItem('password', pwd);
                            sessionStorage.setItem('like', like);
                            sessionStorage.setItem('notLike', notLike);
                            $("#user").text("Welcome, " + username); //adding the username to the header nav bar.
                            $("#mySavedPosts").show();
                            $("#logoutTopNav").show();
                            $("#loginTopNav").hide();
                            $("#signUp").hide();
                            location.reload(true);
                            showUserHistory();
                            //for usertab after log in

                            //end
                            showUserHistory();
                        }
                    },
                    failure: function(errMsg) {
                        alert(errMsg);
                    }
                });
            }

        });
    }

    function showUserHistory() {
        //reflect the data from mongodb file, into the html page:
        if (typeof like !== 'undefined' || typeof notLike !== 'undefined') {
            if (like.length > 0 || notLike.length > 0 || like.indexOf(0) !== "" || notLike.indexOf(0) !== "" || like.indexOf(0) !== undefined || notLike.indexOf(0) !== undefined || like.indexOf(0) !== isNaN || notLike.indexOf(0) !== isNaN) {
                


                like.forEach(function(element) {
                    if (element !== "") {
                        $("#" + element + ".voteUpButton").hide();
                        $("#" + element + ".voteUpButtonDisabled").show();
                    }
                });

                notLike.forEach(function(element) {
                    if (element !== "") {
                        $("#" + element + ".voteDownButton").hide();
                        $("#" + element + ".voteDownButtonDisabled").show();
                    }
                });
            } else {
                return;
            }
        } else {
            return;
        }
    }


    function register() {
        //register functionality
        $("#Register").on("click", function() {
            var username = document.getElementById("reguser").value;
            var pass = document.getElementById("regpass").value;
            var confirm = document.getElementById("confirmpass").value;
            if (username === "" || pass === "" || confirm === "") {
                alert("OOPS! Please fill up the missing values !!");
            } else if (pass !== confirm) {
                alert("Sorry passwords doesnt match");
            } else if (username.length < 4 && pass.length < 4) {
                alert("Too short!! Please enter atleast 4 characters for Username and Password");
            } else if (username !== "" && pass !== "" && confirm !== "" && username.length >= 4 && pass.length >= 4) {
                var us = document.getElementById("reguser").value;
                var pass1 = document.getElementById("regpass").value;
                $.ajax({
                    url: "http://localhost:3000/allusers",
                    type: "GET",
                    dataType: "Json",
                    contentType: 'application/json',
                    success: function(result) {
                        var t = result.length;
                        t++;
                        var j1 = {
                            "name": us
                        };
                        $.ajax({
                            url: "http://localhost:3000/users",
                            type: "GET",
                            contentType: "Application/Json",
                            data: j1,
                            success: function(result) {
                                
                                if (result.length === 0) {

                                    var j2 = {
                                        "_id": t,
                                        "name": us,
                                        "password": pass1
                                    }; //"likes":like,"notLikes":notLike
                                    $.ajax({
                                        type: "PUT",
                                        data: j2,
                                        url: "http://localhost:3000/newuser",
                                        success: function() {
                                            alert("Congrats!!Registered successfully");
                                            document.getElementById("reguser").value = "";
                                            document.getElementById("regpass").value = "";
                                            document.getElementById("confirmpass").value = "";
                                            $('#modal3').closeModal();
                                            $("div").removeClass("lean-overlay");


                                            $.get("http://localhost:3000/allusers", function(data) {
                                                
                                                var length = data.length;
                                                $("#user").text("Welcome, " + us); //adding the username to the header nav bar.
                                                $("#mySavedPosts").show();
                                                $("#logoutTopNav").show();
                                                $("#loginTopNav").hide();
                                                $("#signUp").hide();
                                                sessionStorage.setItem('id', length);
                                                sessionStorage.setItem('user', username);
                                                sessionStorage.setItem('password', pass);
                                                sessionStorage.setItem('like', like);
                                                sessionStorage.setItem('notLike', notLike);
                                                location.reload(true);
                                                showUserHistory();


                                            });

                                        },
                                    });
                                } else {
                                    alert("Sorry,It looks like the user already exist");
                                    document.getElementById("reguser").value = "";
                                    document.getElementById("regpass").value = "";
                                    document.getElementById("confirmpass").value = "";
                                }
                            }
                        });
                    }
                });

            }
        });
    }

    //Start- hovering action on posts
    $("div").on("mouseover", "div.postContent", function() {
        $(this).addClass("z-depth-2");
    });

    $("div").on("mouseleave", "div.postContent", function() {
        $(this).removeClass("z-depth-2");
    });
    //End- hovering action on posts

    //Start- thumb up/down hovering
    $("div").on("mouseover", "i.material-icons.play ", function() {
        $(this).css("color", "black");
    });
    $("div").on("mouseleave", "i.material-icons.play", function() {
        $(this).css("color", "lightgrey");
    });
    $("div").on("mouseover", "i.material-icons.pause ", function() {
        $(this).css("color", "black");
    });
    $("div").on("mouseleave", "i.material-icons.pause", function() {
        $(this).css("color", "darkgrey");
    });
    //dynamic search function
    function search() {
        $("#search").keyup(function() {

            // Retrieve the input field text and reset the count to zero
            var filter = $(this).val(),
                count = 0;

            // Loop through the comment list
            $(".postContent").each(function() {

                // If the list item does not contain the text phrase fade it out
                if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                    $(this).fadeOut();

                    // Show the list item if the phrase matches and increase the count by 1
                } else {

                    $(this).show();
                    count++;
                }
                $("ul.pagination").empty();
                
                pages(len[0]);
            });

            /*if (filter === "") {
                $('.postsContainer').empty();
                postFunction();
            }*/
        });

    } //end of search function

    function timeSince(date) {

        var seconds = Math.floor((new Date() - date) / 1000);

        var interval = Math.floor(seconds / 31536000);

        if (interval > 1) {
            return interval + " years ago";
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
            return interval + " months ago";
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
            return interval + " days ago";
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
            return interval + " hours ago";
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
            return interval + " minutes ago";
        }
        return Math.floor(seconds) + " seconds ago";
    } //end of function timesince

    //Start- for postform validation

    jQuery.validator.setDefaults({
        ignore: ".ignore",
        debug: true,
        success: "valid"

    });
    $("#postform").validate({
        rules: {
            field: {
                required: false,
                url: true
            }
        }

    });
    $("#postform").submit(function() {
        $(this).submit(function() {

            return false;
        });
        $(this).find("input[type='submit']").attr('disabled', 'disabled').val('submiting');
        return true;
    });


    $("a.postnews").on("click", function() {
        var form = $("#postform");
        form.validate(); //End- post form validation
        //Start- JQuery code for post fields
        $('#input1').val("");
        $("#input2").val('');
        $("div#imageinput").replaceWith("<div class='addimage'><a class='imgurl btn waves-effect waves-light grey'>Add Image URL</a></div>");
        $("div#videoinput").replaceWith("<div class='addvideo'><a class='videourl btn waves-effect waves-light grey'>Add Video URL</a></div> ");
        if (username) {
            $("#postbutton").unbind("click").click(function(element) {


                if ($("#input1").val() === "" || $("#input2").val() === "") {
                    element.preventDefault();
                    setTimeout(fade_out, 5000);
                    $("#spanbutton").css({
                        "visibility": "visible",
                        "display": "inline"
                    }).text("Enter input");

                    function fade_out() {
                        $("#spanbutton").fadeOut().empty();
                    }
                } else {
                    if (form.valid() === true) {

                        var date = new Date();
                        $("#spanbutton").css({
                            "visibility": "visible"
                        }).text("");
                        //in case the users third and fourth input field is empty or undefined do this
                        if ((($("#input3").val() === undefined) || ($("#input3").val() === "")) && ((($("#input4").val() === undefined) || $("#input4").val() === ""))) {
                            element.preventDefault();
                            $.get("http://localhost:3000/posts", function(getData) {
                               
                                var x = getData.length;
                                x = x + 1;
                                
                                $.post("http://localhost:3000/posts", {
                                    "id": x,
                                    "link_title": $("#input1").val(),
                                    "main_link": $("#input2").val(),
                                    "image_link": "image/noimage.jpg",
                                    "likes": 0,
                                    "post_time": date,
                                    "image": 0,
                                    "video": 0,
                                    "username": username
                                }, function() {
                                    postFunction();
                                    $.get("http://localhost:3000/posts", function(getData) {
                                        var userposts = [];
                                        
                                        getData.forEach(function(reddit) {
                                            if (reddit.username === username) {
                                                userposts.push(reddit._id);
                                            }
                                        }); //forEach ending
                                        
                                        $.ajax({
                                            type: "POST",
                                            url: "http://localhost:3000/addmyposts",
                                            data: {
                                                "id": user.id,
                                                "name": user.userName,
                                                "password": pwd,
                                                "likes": like,
                                                "notLikes": notLike,
                                                "posts": userposts
                                            }
                                        });
                                        //ajax PUT ending
                                    }); //getData ending
                                });
                                $('#modal1').closeModal();
                                $("div").removeClass("lean-overlay");

                                element.stopImmediatePropagation();
                                return false;
                            });

                        } else if (($("#input3").val() !== undefined) && ($("#input4").val() === undefined)) {
                            var image = $("#input3").val();
                            if (image.match("^https?://(?:[a-z0-9\-]+\.)+[a-z]{2,6}(?:/[^/#?]+)+\.(?:gif|.png|.jpg|.jpeg|.tif|.tiff|.bmp)$")) {
                                $.get("http://localhost:3000/posts", function(getData) {
                                  
                                    var y = getData.length;
                                    y = y + 1;
                                    
                                    $.post("http://localhost:3000/posts", {
                                        "id": y,
                                        "link_title": $("#input1").val(),
                                        "main_link": $("#input2").val(),
                                        "image_link": $("#input3").val(),
                                        "image": 1,
                                        "video": 0,
                                        "likes": 0,
                                        "post_time": date,
                                        "username": username
                                    }, function() {
                                        $.get("http://localhost:3000/posts", function(getData) {
                                            var userpostsi = [];
                                            getData.forEach(function(reddit) {
                                                if (reddit.username === username) {
                                                    userpostsi.push(reddit._id);
                                                }
                                            }); //forEach ending
                                        });

                                        $.ajax({
                                            type: "POST",
                                            url: "http://localhost:3000/addmyposts",
                                            data: {
                                                "id": user.id,
                                                "name": user.userName,
                                                "password": pwd,
                                                "likes": like,
                                                "notLikes": notLike,
                                                "posts": userpostsi
                                            }
                                        }); //ajax PUT ending
                                    }); //getData ending
                                    element.preventDefault();
                                    postFunction();
                                    $('#modal1').closeModal();
                                    $("div").removeClass("lean-overlay");
                                });
                            } else {

                                // element.preventDefault();
                                setTimeout(fade_out2, 5000);

                                function fade_out2() {
                                    $("#spanbutton").fadeOut().empty();
                                }
                                $("#spanbutton").css({
                                    "visibility": "visible",
                                    "display": "inline"
                                }).text("Accepts only gif/.png/.jpeg/.jpg/.tif/.tiff/.bmp image formats");
                            }
                        } else {
                            var videourl = $("#input4").val();

                            if ((videourl.match('https?://(www.)?youtube|youtu\.be')) || (videourl.match('https?://(player.)?vimeo\.com')) || (videourl.match("^https?://(?:[a-z0-9\-]+\.)+[a-z]{2,6}(?:/[^/#?]+)+\.(?:gifv)$"))) {


                                $.get("http://localhost:3000/posts", function(getData) {
                                  
                                    var z = getData.length;
                                    z = z + 1;
                                    
                                    $.post("http://localhost:3000/posts", {
                                        "id": z,
                                        "link_title": $("#input1").val(),
                                        "main_link": $("#input2").val(),
                                        "image_link": "image/vimage.jpg",
                                        "image": 0,
                                        "video": 1,
                                        "likes": 0,
                                        "post_time": date,
                                        "username": username
                                    }, function() {
                                        $.get("http://localhost:3000/posts", function(getData) {
                                            var userpostsz = [];
                                            getData.forEach(function(reddit) {
                                                if (reddit.username === username) {
                                                    userpostsz.push(reddit._id);
                                                }
                                            }); //forEach ending
                                        });

                                        $.ajax({
                                            type: "POST",
                                            url: "http://localhost:3000/addmyposts",
                                            data: {
                                                "id": user.id,
                                                "name": user.userName,
                                                "password": pwd,
                                                "likes": like,
                                                "notLikes": notLike,
                                                "posts": userpostsz
                                            }
                                        }); //ajax PUT ending
                                    }); //getData ending //getData ending
                                    element.preventDefault();
                                    postFunction();
                                    $('#modal1').closeModal();
                                    $("div").removeClass("lean-overlay");
                                });
                                element.preventDefault();
                                $("div#imageinput").replaceWith("<div class='addimage'><a class='imgurl btn waves-effect waves-light grey'>Add Image URL</a></div>");
                                $("div#videoinput").replaceWith("<div class='addvideo'><a class='videourl btn waves-effect waves-light grey'>Add Video URL</a></div> ");

                            } else {

                                element.preventDefault();
                                setTimeout(fade_out3, 5000);

                                function fade_out3() {
                                    $("#spanbutton").fadeOut().empty();
                                }
                                $("#spanbutton").css({
                                    "visibility": "visible",
                                    "display": "inline"
                                }).text("Accepts Video URL's only from youtube/vimeo/.gifv formats");
                            }
                        }
                    }
                }
            });

        } else {
            //element.preventDefault();

            //$('#modal2').openModal();
            $('#modal1').closeModal();
            var $toastContent = $('<span>Sorry!! You need to login first</span>');
            Materialize.toast($toastContent, 4000);

            $("div").removeClass("lean-overlay");

        }
    });
    //End-code for post fields

    $("div").on("click", ".addimage", function() {
        $("div#videoinput").replaceWith("<div class='addvideo'><a class='videourl btn waves-effect waves-light grey'>Add Video URL</a></div> ");
        $("div.addimage").replaceWith("<div id='imageinput'><input class='input-field ignore' required='false' placeholder='Image URL' name='input3' type='url' id='input3'></div>");
    });
    $("div").on("click", ".addvideo", function() {
        $("div#imageinput").replaceWith("<div class='addimage'><a class='imgurl btn waves-effect waves-light grey'>Add Image URL</a></div>");
        $("div.addvideo").replaceWith("<div id='videoinput' ><input class='input-field ignore' required='false' placeholder='Video URL' name='input4' type='url' id='input4'></div>");
    });

    //Pagination start
    function pages(totalnumofitems) {
        var numofitems_page = 20,
            numofpages = Math.ceil(totalnumofitems / numofitems_page),
            pagenumbers;
        //  $("div.postsContainer").children().hide();
        $("ul.pagination").empty();
        for (var i = 1; i <= numofpages; i++) {
            pagenumbers = "<li class='waves-effect'>" + i + "</li>";
            $(pagenumbers).appendTo("ul.pagination");
        }
        $("div.postsContainer").children().hide();
        $("div.postsContainer div:nth-child(-n+20)").slice(0).show();
        $("ul.pagination").on("click", "li", function() {
            var page = $(this).text(),
                x = page * 20,
                y = (page - 1) * 20;
            $("li").removeClass("pages");
            $(this).addClass("pages");
            $("div.postsContainer").children().hide();
            $("div.postsContainer div.postContent").slice(y, x).show();
        });
    } //End of Pagination
    //logout function
    function logout() {
        $("#logoutTopNav").on("click", function() {
            //clearing user data befor loging out & refreshing the page.
            username = "";
            user.id = 0;
            user.userName = "";
            like = [];
            notLike = [];
            len = [];
            sessionStorage.clear();
            $("#mySavedPosts").hide();
            location.reload(true);
            //Removing of user posts tab
        });
    } //end of logout function

    $("#homepage").on("click", function() {

        postFunction();
    });
    search();
    login();
    register();
    logout();
    postFunction();
}; //end of main function

$(document).ready(main);