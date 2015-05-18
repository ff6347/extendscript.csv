/*!
 *
 * This is CSV.jsx
 * A collection of functions for reading CSV.
 * As used in Locations.jsx
 *
 * License
 * Copyright (c) 2014 Fabian "fabiantheblind" Morón Zirfas
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify
 * copies of the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies
 * or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
 * OR THE USE OR OTHER DEALNGS IN THE SOFTWARE.
 *
 * see also http://www.opensource.org/licenses/mit-license.php
 */
// if(DEBUG === undefined){
//   var DEBUG = true;
// }else{
//   DEBUG = true;
// }
CSV = function() {};
// END OF CSV.js

/**
 * This is a string prototype function
 * found here http://www.greywyvern.com/?post=258
 * @param  {String} sep is the separator we use only ,
 * @return {Array}     returns an Array of strings
 */
// String.prototype.splitCSV = function(sep) {
//   for (var foo = this.split(sep = sep || ","), x = foo.length - 1, tl; x >= 0; x--) {
//     if (foo[x].replace(/"\s+$/, '"').charAt(foo[x].length - 1) === '"') {
//       if ((tl = foo[x].replace(/^\s+"/, '"')).length > 1 && tl.charAt(0) === '"') {
//         foo[x] = foo[x].replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"');
//       } else if (x) {
//         foo.splice(x - 1, 2, [foo[x - 1], foo[x]].join(sep));
//       } else foo = foo.shift().split(sep).concat(foo);
//     } else foo[x].replace(/""/g, '"');
//   } return foo;
// };


// Dont use prototypes?
// for the time beeing YES
// Makes problems with other scripts
// or we need to use a unique prefix! like ftb_splitCSV
CSV.Utilities = {};

CSV.Utilities.split_csv = function(sep, the_string) {

  for (var foo = the_string.split(sep = sep || ","), x = foo.length - 1, tl; x >= 0; x--) {
    if (foo[x].replace(/"\s+$/, '"').charAt(foo[x].length - 1) === '"') {
      if ((tl = foo[x].replace(/^\s+"/, '"')).length > 1 && tl.charAt(0) === '"') {
        foo[x] = foo[x].replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"');
      } else if (x) {
        foo.splice(x - 1, 2, [foo[x - 1], foo[x]].join(sep));
      } else foo = foo.shift().split(sep).concat(foo);
    } else foo[x].replace(/""/g, '"');
  }
  return foo;
};

CSV.readFile = function(){

  var csvfile = File.openDialog("Select your CSV file");
  if (csvfile !== null) {
    csvfile.open('r');
    var content = csvfile.read();
    csvfile.close();
    return content;
  } else {
    if (DEBUG) $.writeln("user aborted CSV.readFile");
  }

};
CSV.toJSON = function(csvFile, useDialog, separator) {
  var textFile;
  var result = [];
  if (useDialog) {
    textFile = File.openDialog("Select a CSV or TSV file to import.", "*.*", false);
  } else {
    textFile = csvFile;
  }
  var textLines = [];
  if (textFile !== null) {
    textFile.open('r', undefined, undefined);
    while (!textFile.eof) {
      textLines[textLines.length] = textFile.readln();
    }
    textFile.close();
  }
  if (textLines.length < 1) {
    alert("ERROR Reading file");
    return null;
  } else {

    $.writeln(textLines);
    // var lines=csv.split("\n");
    var headers = CSV.Utilities.split_csv(separator, textLines[0]);
    if(DEBUG) $.writeln(headers);
    for (var i = 1; i < textLines.length; i++) {

      var obj = {};
      var currentline = CSV.Utilities.split_csv( separator, textLines[i]);

      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }
      if (DEBUG) $.writeln(obj.toSource());
      result.push(obj);

    }

  }
  // alert(result[0].toSource());
  //return result; //JavaScript object
  return result; //JSON
};

/**
 * this reads in a file
 * line by line
 * @return {Array of String}
 */

CSV.reader = {
  read_in_txt: function() {

    var textFile = File.openDialog("Select a text file to import.", "*.*", false);
    var textLines = [];
    if (textFile !== null) {
      textFile.open('r', undefined, undefined);
      while (!textFile.eof) {
        textLines[textLines.length] = textFile.readln();
      }
      textFile.close();
    }
    if (textLines.length < 1) {
      alert("ERROR Reading file");
      return null;
    } else {
      return textLines;
    }
  },

  /**
   * gets lines of strings and creates the data we need from
   * CSV Header and content
   * @param  {Array of String} textLines are , or \t separated values
   * @return {Object}
   */
  textlines_to_data: function(textLines, separator) {

    var data = {};
    data.fields = [];
    data.keys = [];

    for (var i = 0; i < textLines.length; i++) {

      var line_arr = CSV.Utilities.split_csv(separator, textLines[i]);
      if (i === 0) {
        for (var j = 0; j < line_arr.length; j++) {
          data.keys[j] = line_arr[j];
        }

      } else {
        var obj_str = "";
        for (var k = 0; k < line_arr.length; k++) {
          if (k !== line_arr.length - 1) {
            obj_str += 'field_' + k + ':"' + line_arr[k] + '",';
          } else {
            obj_str += 'field_' + k + ':"' + line_arr[k] + '"';
          }
        }
        // var parsedData = JSON.parse("{"+ obj_str+"}");
        data.fields.push(eval("({" + obj_str + "})")); // jshint ignore:line

      }
    }
    return data;
  }


};