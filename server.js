'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
//var passport = require('passport');
var session = require('express-session');
var request = require('request');
var app = express();
require('dotenv').load();
//require('./app/config/passport')(passport);
//GET https://www.googleapis.com/customsearch/v1?q=grumpy+cat&cx=014623854566396067634%3As9nuuvh_xxs&fileType=jpg&key={YOUR_API_KEY}  014623854566396067634:s9nuuvh_xxs
mongoose.connect(process.env.MONGO_URI);

//scheema
var termSchema = mongoose.Schema({
    term: String, dateSearch:String
});

var termModel= mongoose.model('terms', termSchema);

app.get('/api/latest/imagesearch', function(req, res){
	termModel.find({}, { '_id': 0, 'term' :1,'dateSearch' :1}, {limit:10},function (err, data) {
	if (err) {console.log("Error in save"); res.end("Error with DB");  return ; }	
	res.end(JSON.stringify(data));	
	return;
	});
	});


app.get('/api/imagesearch/:search_term', function(req, res){
	//var results_arr = [];
	var now = new Date(); 
	termModel.create({ term: req.params.search_term ,dateSearch:now.toLocaleString()}, function (err, result) {
                if (err) {console.log("Error in save"); res.end("Error with DB");  return ; } //return {error:true};
                else {
                    console.log("Return after success in creating") 
                    return } //{error:false,redirect:false,data: result};
                }) 
    console.log(req.query.offset)            
	if (req.query.offset !== undefined )
	  {
	  	var ofset  = {'ofseting':true,page: req.query.offset};
	  	console.log(ofset)
	  
	  }
	else
		{
		 ofset  = {'ofseting':false};
		}

 var not_so_secret_api_key  = "AIzaSyD4Z4pibuXUvVEaRYkd3H4BbVSJYj8rhXc"
 var link= {"first_part": "https://www.googleapis.com/customsearch/v1?q=","second_part": "&cx=014623854566396067634%3As9nuuvh_xxs&fileType=jpg&&start=","last_part": "&key="}
 var search_term = req.params.search_term
 var num_page = 1;
 if (ofset.ofseting==true)
	num_page = ofset.page; //set the ofset for page results
 search_term = search_term.replace(" ","+" );
 console.log(link.first_part + search_term+link.second_part+num_page+link.last_part+ not_so_secret_api_key)
   request(link.first_part + search_term+link.second_part+num_page+link.last_part+ not_so_secret_api_key , function (error, response, body) {
  if (!error && response.statusCode == 200) { 
  	
  	var items_arr = JSON.parse(body).items;
  	//var img_links_arr = Object.keys(items)
  	items_arr.forEach(function (element, index, array) 
  	{
  		res.write( JSON.stringify( {"title":element.title,"original page":element.link,"thumbnail": element.pagemap.cse_thumbnail[0].src,"link":element.pagemap.cse_image[0].src} ) );
  		res.write("\n");
  		//results_arr.push ( {"title":element.title,"snippet":element.snippet,"thumbnail": element.pagemap.cse_thumbnail[0].src,"link":element.pagemap.cse_image[0].src}  );
  	}    
  	);
      } 
  else
   {
   	console.log ("Google returned Error wit response code: ", response.statusCode);
   }
   		
 res.end();
 }); 
	});


app.get('*', function(req, res){
 	res.end(req.url+ " is not a valid URL for this API");

});



var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});