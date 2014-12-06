
postSubmitMethodCallbacks.push(function(post) {
    uploadFiles(post);
    return post;
});

postAfterSubmitMethodCallbacks.push(function(post){
    return post;
});

postEditMethodCallbacks.push(function(post){
    return post;
});

postAfterEditMethodCallbacks.push(function(post) {
    return post;

});

function uploadFiles(doc) {
  var self = this;

  // Loop through all hidden file inputs in the form.
  var totalFiles = 0;
  var arrayFields = {};
  $('.cfsaf-hidden').each(function () {
    var elem = $(this);

    // Get schema key that this input is for
    var key = elem.attr("data-schema-key");

    // no matter what, we want to delete the dummyId value
    delete doc[key];

    // Get list of files that were attached for this key
    var fileList = elem.data("cfsaf_files");

    // If we have some attached files
    if (fileList) {
      // add all files to total count
      totalFiles += fileList.length;
    }

    // Otherwise it might be a multiple files field
    else {
      var fileListList = elem.data("cfsaf_files_multi");
      if (fileListList) {
        // make a note that it's an array field
        arrayFields[key] = true;
        // add all files to total count
        _.each(fileListList, function (fileList) {
          totalFiles += fileList.length;
        });
        // prep the array
        doc[key] = [];
      }
    }
  });

  // If no files were attached anywhere on the form, we're done.
  // We pass back the doc synchronously
  if (totalFiles === 0) {
    return doc;
  }
  
  // Create the callback that will be called either
  // upon file insert error or upon each file being uploaded.
  var doneFiles = 0;
  var failedFiles = 0;
  function cb(error, fileObj, key) {
    // Increment the done files count
    doneFiles++;

    // Increment the failed files count if it failed
    if (error) {
      failedFiles++;
    }

    // If it didn't fail, set the new ID as the property value in the doc,
    // or push it into the array of IDs if it's a multiple files field.
    else {
      if (arrayFields[key]) {
        doc[key].push(fileObj._id);
      } else {
        doc[key] = fileObj._id;
      }
    }

  }

  // Loop through all hidden file fields, inserting
  // and uploading all files that have been attached to them.
  $('.cfsaf-hidden').each(function () {
    var elem = $(this);

    // Get schema key that this input is for
    var key = elem.attr("data-schema-key");

    // Get the FS.Collection instance
    var fsCollectionName = elem.attr("data-cfs-collection");
    var fsCollection = FS._collections[fsCollectionName];

    // Loop through all files that were attached to this field
    function loopFileList(fileList) {
      _.each(fileList, function (file) {
        // Create the FS.File instance
        var fileObj = new FS.File(file);

        // Listen for the "uploaded" event on this file, so that we
        // can call our callback. We want to wait until uploaded rather
        // than just inserted. XXX Maybe should wait for stored?
        fileObj.once("uploaded", function () {
          // track successful uploads so we can delete them if any
          // of the other files fail to upload
          var uploadedFiles = elem.data("cfsaf_uploaded-files") || [];
          uploadedFiles.push(fileObj);
          elem.data("cfsaf_uploaded-files", uploadedFiles);
          // call callback
          cb(null, fileObj, key);
        });

        // Insert the FS.File instance into the FS.Collection
        fsCollection.insert(fileObj, function (error, fileObj) {
          // call callback if insert/upload failed
          if (error) {
            cb(error, fileObj, key);
          }
          // TODO progress bar during uploads
        });
      });
    }

    // single fields first
    loopFileList(elem.data("cfsaf_files"));
    // then multiple fields
    _.each(elem.data("cfsaf_files_multi"), function (fileList) {
      loopFileList(fileList);
    });
  });

}
