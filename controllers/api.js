'use strict';

const async = require('async');
const request = require('request');
const cheerio = require('cheerio');
const multer = require('multer');
const File = require('../models/File');
const path = require('path');

// const upload = multer({ dest: path.join(__dirname, 'uploads') });
const upload = multer({ dest: path.join(__dirname, '../uploads') });

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
 * File Upload API.
 */

exports.getFileUpload = (req, res) => {
  res.render('api/upload', {
    title: 'File Upload'
  });
};

// exports.postFileUpload = (req, res) => {
//   req.flash('success', { msg: 'File was uploaded successfully.' });
//   res.redirect('/api/upload');
// };

/**
 * POST /api/upload
 * File Upload API.
 */

exports.postFileUpload = (req, res, next) => {
  var uploader = upload.single('csvFile');

  uploader(req, res, function (err){
    console.log('req body: ', req.body);
    console.log('file ', req.file);

    const saveHandler = (err, newFile) => {
      if (err)
        return res.status(500).send('Error: ' + err);

      if (newFile)
        return res.status(200).send({status: 'File was uploaded successfully.'})
    }

    let file = new File({
      fileName: req.file.filename,
      originalFileName: req.file.originalname,
      path: req.file.path,
      uploadStartDate: req.body.uploadStartDate,
      emailColumn: req.body.emailColumn,
      // status: String,
      // duration: Number,
    });


    if(err) {
      console.log('error upload: ', err);
      file.status = 'Error: ' + err
      file.save(saveHandler)
      // return res.status(500).send('error: some reason here...')
    }

    file.save(saveHandler)

    // console.log('file ', req.file);
    // res.status(200).send({status: 'File was uploaded successfully.'})
  })
};

/**
 * GET /
 * Files index.
 */

exports.filesIndex = (req, res, next) => {
  File.find((err, files) => {
    res.render('api/files-index'), {
      title: 'File Index',
      files
    }
  })
}

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

