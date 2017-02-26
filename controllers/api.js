'use strict';

const async = require('async');
const request = require('request');
const cheerio = require('cheerio');
const multer = require('multer');
const File = require('../models/File');
const path = require('path');

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
    // console.log('req body: ', req.body);
    // console.log('file ', req.file);

    const saveHandler = (err, newFile) => {
      if (err)
        return res.status(500).send('Error: ' + err);

      if (newFile)
        return res.status(200).send({status: 'File was uploaded successfully.'})
    }

    let file = new File({
      storageName:      req.file.filename,
      originalName:     req.file.originalname,
      path:             req.file.path,
      size:             req.file.size,
      uploadStartDate:  req.body.uploadStartDate,
      emailColumn:      req.body.emailColumn,
    });

    if(err) {
      // console.log('error upload: ', err);
      file.status = 'Error: File not uploaded. ' + String(err)
      file.save(saveHandler)
    }

    file.status = 'OK'
    file.save(saveHandler)
  })
};

/**
 * DELETE /api/upload
 * File Upload API.
 */
exports.deleteFileUpload = (req, res) => {
  console.log('delete req params:', req.params.id)

  const deleteHandler = (err, result) => {
    if (err) {
      req.flash('error', { msg: 'Error uploading the file.' });
      res.redirect('/api/files/index');
    }
    console.log('delete result: ', result)

    req.flash('success', { msg: 'Success deleting the file.' });
    res.redirect('/api/files/index');
  }

  // File.find({'id': req.params.id}, deleteHandler).exec()
  File.findOneAndRemove(
    { _id : req.params.id },
    deleteHandler
  )
}

/**
 * GET /
 * Files index.
 */

exports.filesIndex = (req, res) => {
  File.find((err, files) => {
    res.render('api/files-index', {
      title: 'File Index',
      files: files
    });
  });
}
