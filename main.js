const PDFDocument = require('pdfkit');
const {Base64Encode} = require('base64-stream');
const fs = require('fs');
const base64 = require('base64topdf');

// Create a document
const createDoc = () => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    doc
      .font('fonts/Inter-Regular.ttf')
      .fontSize(25)
      .text('Some text with an embedded font!', 100, 100);

    doc.image('./images/img.png', {
      fit: [250, 300],
      align: 'center',
      valign: 'center',
    });

    doc
      .addPage()
      .fontSize(25)
      .text('Here is some vector graphics...', 100, 100);

    doc
      .save()
      .moveTo(100, 150)
      .lineTo(100, 250)
      .lineTo(200, 250)
      .fill('#FF3300');

    doc
      .scale(0.6)
      .translate(470, -380)
      .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
      .fill('red', 'even-odd')
      .restore();

    doc
      .addPage()
      .fillColor('blue')
      .text('Here is a link!', 100, 100)
      .underline(100, 100, 160, 27, {color: '#0000FF'})
      .link(100, 100, 160, 27, 'http://google.com/');

    let finalString = '';
    let stream = doc.pipe(new Base64Encode());
    let resp;
    doc.end();
    stream.on('data', function (chunk) {
      finalString += chunk;
    });

    stream.on('end', function () {
      console.log(finalString);
      base64.base64Decode(finalString, 'final.pdf');
    });

    resolve(finalString);
  });
};

createDoc().then(resp => {
  console.log(resp);
});
