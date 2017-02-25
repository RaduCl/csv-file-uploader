'use strict';

const async = require('async');
const request = require('request');
const cheerio = require('cheerio');

/**
 * GET /api
 * List of API examples.
 */
exports.getApi = (req, res) => {
  res.render('api/index', {
    title: 'Upload API'
  });
};

/**
 * GET /api/upload
 * File Upload API example.
 */

exports.getFileUpload = (req, res) => {
  res.render('api/upload', {
    title: 'File Upload'
  });
};

exports.postFileUpload = (req, res) => {
  req.flash('success', { msg: 'File was uploaded successfully.' });
  res.redirect('/api/upload');
};

/**
 * GET /api/scraping
 * Web scraping example using Cheerio library.
 */
exports.getScraping = (req, res, next) => {
  request.get('https://news.ycombinator.com/', (err, request, body) => {
    if (err) { return next(err); }
    const $ = cheerio.load(body);
    const links = [];
    $('.title a[href^="http"], a[href^="https"]').each((index, element) => {
      links.push($(element));
    });
    res.render('api/scraping', {
      title: 'Web Scraping',
      links
    });
  });
};

exports.getGoogleMaps = (req, res) => {
  res.render('api/google-maps', {
    title: 'Google Maps API'
  });
};


// const LineInputStream = require("line-input-stream"),
// const fs = require("fs"),
// const mongoose = require("mongoose"),
// const Schema = mongoose.Schema;

// const entrySchema = new Schema({},{ strict: false })

// const Entry = mongoose.model( "Schema", entrySchema );

// const stream = LineInputStream(fs.createReadStream("data.txt",{ flags: "r" }));

// stream.setDelimiter("\n");

// mongoose.connection.on("open",function(err,conn) { 

//   // lower level method, needs connection
//   var bulk = Entry.collection.initializeOrderedBulkOp();
//   var counter = 0;

//   stream.on("error",function(err) {
//       console.log(err); // or otherwise deal with it
//   });

//   stream.on("line",function(line) {

//     async.series(
//       [
//         function(callback) {
//           var row = line.split(",");     // split the lines on delimiter
//           var obj = {};             
//           // other manipulation

//           bulk.insert(obj);  // Bulk is okay if you don't need schema
//                              // defaults. Or can just set them.

//           counter++;

//           if ( counter % 1000 == 0 ) {
//             bulk.execute(function(err,result) {
//               if (err) throw err;   // or do something
//               // possibly do something with result
//               bulk = Entry.collection.initializeOrderedBulkOp();
//               callback();
//             });
//           } else {
//             callback();
//           }
//         }
//       ],
//       function (err) {
//         // each iteration is done
//       }
//     );

//   });

//   stream.on("end",function() {

//     if ( counter % 1000 != 0 )
//       bulk.execute(function(err,result) {
//         if (err) throw err;   // or something
//         // maybe look at result
//       });
//   });

// });

