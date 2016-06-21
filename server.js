var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var assert = require('assert');
var parser = require('mongo-parse');
var MongoClient = require('mongodb').MongoClient;
var r = [];
var x = [];
var y = [];
var url = 'mongodb://localhost:27017/reddit';
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static('.'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/" + "index.html");
});

app.get('/posts', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        redditPost(db, function() {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.json(r);
            r = [];
        });
    });

var redditPost = function(db, callback) {
    var cursor = db.collection('posts').find();
    cursor.each(function(err, doc) {
        if (doc != null) {
            r.push(doc);
        } else {
            callback();
        }
    });
};
});

app.post('/posts', function(req, res) {
	var t = req.body.id;
	var l = req.body.image_link;
    var c = req.body.link_title;
    var n = req.body.main_link;
	var lik = req.body.likes;
	var pt = req.body.post_time;
	var u = req.body.username;
	var im = req.body.image;
    var vi =  req.body.video;
	
MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
        newPosts(db, function() {
			res.send("success");
  });
});
  var newPosts = function(db, callback) {
	  db.collection('posts').insertOne(
	   {"_id":t,"image_link":l,"link_title": c,"likes": lik,"post_time": pt,"main_link":n,
	   "username":u,"image":im,"video":vi}, function(err, results) {
	 callback();
   });
};
});

app.put('/posts', function(req, res) {
	
	var t = req.body.id;
	var l = req.body.image_link;
    var c = req.body.link_title;
    var n = req.body.main_link;
	var lik = req.body.likes;
	var pt = req.body.post_time;
	var u = req.body.username;
	var im = req.body.image;
    var vi =  req.body.video;
	
MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
        updatePosts(db, function() {
			res.send("success");
  });
});
  var updatePosts = function(db, callback) {
	  db.collection('posts').replaceOne(
	   {_id:t},
	   {"image_link":l,"link_title": c,"likes": lik,"post_time": pt,"main_link":n,
	  "username":u,"image":im,"video":vi}, function(err, results) {
	 callback();
   });
};
});



app.post('/ifusers', function(req, res) {
	var username = req.body.name;
	var pwd = req.body.pwd;
	MongoClient.connect(url, function(err, db) {
        redditUsers(db, function() {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.json(x);
			x = [];
        });
    });
var redditUsers = function(db, callback) {
    var cursor = db.collection('users').find({ "name": username});
	cursor.each(function(err, doc) {
        if (doc != null) {
			x.push(doc);
        } else {
            callback();
        }
    });
};
});

app.post('/users', function(req, res) {
    var t = req.body._id;
    console.log(t);
    var l = req.body.name;
    var c = req.body.password;
    var n = req.body.notLikes;
    var likesset = req.body.likes;
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        updateUsers(db, function() {

        });
    });
    var updateUsers = function(db, callback) {

        if (n === null || n === 'undefined' || n === ""||typeof n === 'undefined') {
            db.collection('users').replaceOne({
                _id: t
            }, {
                "name": l,
                "password": c,
                "likes": likesset,
				"notLikes":[]
            }, function(err, results) {
                callback();
            });

        }else if(likesset === null || likesset === 'undefined' || likesset === "" ||typeof likesset === 'undefined') {
            db.collection('users').replaceOne({
                _id: t
            }, {
                "name": l,
                "password": c,
                "notLikes": n,
				"likes":[]
			}, function(err, results) {
                callback();
            });
        } else{db.collection('users').replaceOne({
                _id: t
            }, {
                "name": l,
                "password": c,
                "likes": likesset,
                "notLikes": n
            }, function(err, results) {
                callback();
            });
        }
		
	db.collection('users').findOneAndUpdate({_id:t}, {$pull:{"likes":"undefined"}},function(err, results) {
                callback();
            });
				
	db.collection('users').findOneAndUpdate({_id:t},{$pull:{"notLikes":"undefined"}},function(err, results) {
                callback();
            });
	
		
    };
});
app.post('/addmyposts', function(req, res) {
    var t = req.body.id;
	var l = req.body.name;
    var c = req.body.password;
    var n = req.body.notLikes;
	console.log(n);
    var p = req.body.posts;
	var likesset = req.body.likes;
	console.log(req);
	
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
        addPostArray(db, function() {
		
  });
});
   var addPostArray = function(db, callback) {
	  db.collection('users').replaceOne(
	   {_id:t},
	   {"name":l,"password": c,"likes": likesset,"notLikes": n, "posts":p}, function(err, results) {
	 callback();
   });
};
});
app.get('/users', function(req, res) {
var name =req.query.name;
    MongoClient.connect(url, function(err, db) {
        redditUsers(db, function() {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.json(y);
			y = [];
        });
    });
var redditUsers = function(db, callback) {
    var cursor = db.collection('users').find({ "name": name});
	cursor.each(function(err, doc) {
        if (doc != null) {
			y.push(doc);
        } else {
            callback();
        }
    });
};
});

app.get('/allusers', function(req, res) {
var name =req.query.name;
    MongoClient.connect(url, function(err, db) {
        redditUsers(db, function() {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.json(y);
			y = [];
        });
    });
var redditUsers = function(db, callback) {
    var cursor = db.collection('users').find({});
	cursor.each(function(err, doc) {
        if (doc != null) {
			y.push(doc);
        } else {
            callback();
        }
    });
};
});


app.put('/newuser', function(req, res) {
    //console.log(req);
	var t = req.body._id;
    var l = req.body.name;
	var c = req.body.password;
    //var n = req.body.notLikes;
    //var likesset = req.body.likes;
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
        insertUsers(db, function() {
		res.send("success");
  });
});
 var insertUsers = function(db, callback) {
   var number = db.collection('users').find();
  db.collection('users').insertOne(
	   {"_id":t,"name":l,"password": c}, function(err, results) {
	 //console.log(results);
      callback();
   });
};
});

app.listen(3000, function() {
    console.log("listening on port 3000");
});