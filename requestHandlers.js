var querystring = require("querystring");
var fs = require("fs");
var formidable = require("formidable");

function start(res) {
    console.log("Request handler 'start' was called.");

    var body = '<html>'+
	'<head>'+
	'<meta http-equiv="Content-Type" '+
	'content="text/html; charset=UTF-8" />'+
	'</head>'+
	'<body>'+
	'<form action="/upload" enctype="multipart/form-data" '+
	'method="post">'+
	'<input type="file" name="upload" multiple="multiple">'+
	'<input type="submit" value="Upload file" />'+
	'</form>'+
	'</body>'+
	'</html>';

    res.writeHead(200, {"Content-Type": "text/html"});
    res.write(body);
    res.end();
}

function upload(res, req) {
    console.log("Request handler 'upload' was called.");

    var form = new formidable.IncomingForm();
    console.log("about to parse");
    form.parse(req, function(err, fields, files) {
	console.log("parsing done");

	console.log(files.upload.path);
	console.log(files.upload.name);
	var ufilename = files.upload.name.toLowerCase();
	console.log(ufilename);
	ufilename = "./" + ufilename;
	fs.rename(files.upload.path, ufilename, function(err) {
	    if (err) {
		fs.unlink(ufilename);
		fs.rename(files.upload.path, ufilename);
	    }
	});

	res.writeHead(200, {"Content-Type": "text/html"});
	res.write("received image:<br/>");
	res.write("<img src='/show' />");
	res.end();
    });
}

function show(res) {
    console.log("Request handler 'show' was called.");
    res.writeHead(200, {"Content-Type": "image/png"});
    fs.createReadStream("./test.png").pipe(res);
}

exports.start = start;
exports.upload = upload;
exports.show = show;
