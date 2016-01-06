var path = require('path');
var fs = require('fs');
var execSync = require('child_process').execSync;
var moment = require('moment');

var HOME_DIR = process.env.HOME;
//var DAYONE = path.join(HOME_DIR, 'Dropbox/Apps/Day\ One/Journal.dayone/entries/');
var dayonedir = execSync('ls ~/Library/Mobile\\ Documents/|grep dayoneapp').toString().replace(/\n/g, "");
console.log(dayonedir);
var DAYONE = path.join(HOME_DIR, 'Library/Mobile\ Documents/', dayonedir, '/Documents/Journal_dayone/entries/');
console.log(DAYONE);

var canvas = document.getElementById("notification");
var context = canvas.getContext("2d"); 
context.font = "bold 16px 'Arial'";
context.fillStyle = "#2e8b57";
context.fillText("Created new entry.", 30, 25, 200);


var myCodeMirror = CodeMirror.fromTextArea(document.getElementById("editor"), {
  mode: 'gfm',
  lineNumbers: true,
  theme: 'monokai',
  lineWrapping: true
});

require('electron').ipcRenderer.on('Send', function(event, message) {
  var entryText = myCodeMirror.doc.getValue();
  if(entryText) {
    var uuid = execSync('uuidgen').toString().replace(/-/g, "").replace(/\n/g, "");
    var now = moment.utc().format().replace(/\+.*/g, "Z");
    var entry =
      '<?xml version="1.0" encoding="UTF-8"?>' + '\n' +
      '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">' + '\n' +
      '<plist version="1.0">' + '\n' +
      '<dict>' + '\n' +
      '     <key>Creation Date</key>' + '\n' +
      '     <date>' + now + '</date>' + '\n' +
      '     <key>Entry Text</key>' + '\n' +
      '     <string>' + entryText + '</string>' + '\n' +
      '     <key>Starred</key>' + '\n' +
      '     <false/>' + '\n' +
      '     <key>Time Zone</key>' + '\n' +
      '     <string>Asia/Tokyo</string>' + '\n' +
      '     <key>UUID</key>' + '\n' +
      '     <string>' + uuid + '</string>' + '\n' +
      '</dict>' + '\n' +
      '</plist>';
      
    var entryFileName = uuid + '.doentry';
    var fileName = path.join(DAYONE, entryFileName);
    //console.log(fileName);
    fs.writeFile(fileName, entry, function(err) {
      if (err) {
        alert(err);
      } else {
        canvas.style.zIndex = 1;
        setTimeout(function() {
          canvas.style.zIndex = -1;
        }, 1000);
      }
    });
    myCodeMirror.doc.setValue("");
  }
});
