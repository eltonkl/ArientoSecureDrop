//This file is used to determine what types of files
//can be uploaded in the dropzone.

//For now can only support upload of 3 files
Dropzone.options.fileUploader = {
  paramName: 'file',
  maxFilesize: 100, // MB
  maxFiles: 10,
  dictDefaultMessage: 'Drag an image here to upload, or click to select one',
  headers: {
    'x-csrf-token': document.querySelectorAll('meta[name=csrf-token]')[0].getAttributeNode('content').value,
  },
  acceptedFiles: 'image/jpeg, image/png, image/gif' //accepts only images now,
  init: function() {
    this.on('success', function( file, resp ){
      console.log( file );
      console.log( resp );
    });
  }
};
