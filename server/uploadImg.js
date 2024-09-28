const { google } = require('googleapis');
const streamifier = require('streamifier');
const {auth} = require('./auth');

async function createAndUploadFile(auth, fileImg) {
    //Init cliente drive
    if (!fileImg) {
        console.log("No se ha recibido ningún archivo");
        return;
      }
    const driveService = google.drive({ version: 'v3', auth });
    const fileStream = streamifier.createReadStream(fileImg.buffer);

    //Metadata del archivo
    let fileMetadata = {
        'name': fileImg.originalname,
        'parents': ['1yLNe8L0MFtpzLMLV4tz41s1tl_5X7mFF']
    };

    //Definicion del media.
    let media = {
        mimeType: fileImg.mimetype,
        body: fileStream
    };
    
    let response = await driveService.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id'
    });

    //Handle la respuesta
    switch (response.status) {
        case 200:
            const fileIdResponse = response.data.id;
            return getDirectLink();
        default:
            return "Error";
    }
    //Obtener enlace directo
    async function getDirectLink() {
        const file = await driveService.files.get({
            fileId: response.data.id,
            fields: 'webContentLink'
        });
        const directLink = file.data.webContentLink.replace('&export=download', '');
        return directLink;
    }
}

module.exports = {
    createAndUploadFile
};

createAndUploadFile(auth).catch(console.error);