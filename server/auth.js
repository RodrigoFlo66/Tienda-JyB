const { google } = require('googleapis');

//Agrega permisos a la cuenta de servicio para que utilice Google Drive
const SCOPES = ['https://www.googleapis.com/auth/drive'];

//Init del auth que necesita la key y los scopes
const auth = new google.auth.GoogleAuth({
    credentials: {
      "type": process.env.GOOGLE_TYPE,
      "project_id": process.env.GOOGLE_PROJECT_ID,
      "private_key_id": process.env.GOOGLE_PRIVATE_KEY_ID,
      "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC0eB7nW9aMOhL0\nhr+uaeaaPldr8qbn+AuGmbWIznTLE1hNi2/DyypPtbz/2CHyGx/z6PsPOgSKHyNA\nfkr3FfYTy/8x2N2hcO4+iDcRdhS9M+M7zxXMCFGb3IlzyUOTf4DmuFxcAv7AONTi\niid7EwJ7E/q9a6ZmpKTR3aKgYtCckweK+1CViaoDQfFFqqE+Iyzgws5ixti3sAh6\nw1G3Ww90cQ1Yktq0wLayeazf1oDX5veh/MYuUBn+3+zXkIrQgzhncjVAPAEf5PDr\nYU9WUwWcevzmF1Rinhqd01SfLFQGeh8TgrrJnJzlQOSVlYturhBA6uZUPlBb6U6i\n3qdeMwNPAgMBAAECggEAB34pQk/U05Ohr9dcZABvm53VAV1cwqrQx7DgEaMIxFm0\nQ9vzMvzfb9nK1BCEMEoiBH161wIAqD9stkPIFwQpaF8C5G3tncNTkPMU3ju51rUt\nzRDnBcaepMr+RfloPdqAXpPu+b8CFrcFV7aGtxxt8PA+a9jpWr+hPDlohCI2KRn7\nwYaflUXa9mdGrVOkCCMTwZQDxfAJvQJw0DxsoDzxKRTMbiM8p15fS+8rqUX2ST1x\nvX9ItnUyAcq3z/XNksVl+hyT5lChwD24FkoFVBwaBW0Ycnk1uWV9sJexy1J2hAW6\nt0cgVMUUsJ6UVoWPMJGFrsIh56/BJARUEd+fF6qRsQKBgQDovRDyJh1ZJGPmTCAD\nkytNfsgVSQKVYeS9zD/pM94syt99GBLkV+JrRoZdtS6kX616Fkv+SJL8zR6gAIqk\neR91G1Fsu92SYB7uIO55X0lHxi+FK3x8u0IUUHdCs7DTPyaSWxDm7qWh0HUrDkHn\n9M+BFy6endQUN/eyDZAT+PwPFwKBgQDGgawrc7WttMovC8OAnfl7Z6VbTegLihZi\n/Ewxyf8nJxRKcsWCZT1Bg52LJl0DNnxipLbgYiALsjROkE8L05T99QyN6dWhMIjr\njTC7O62fNd9IulrY6fM1PeTUk32Wj2sAQPlYDUKspOfcDC6Av1Rr8xcyLz/p7u5P\ngp0LUv6QiQKBgQCGYSP3rKolXi2QO0QAzGikRh+gqpcjSXKZY+VC8P/HPRvtTokZ\n7uR8rCvIz2Qu5E91vooCOEUmUgjsuWNTs9vF8hABiDdW3Mj/FWScD7hwCK5HZeRq\n4HQ25n71tGrUjhHnT01jCUf5NjNwuLq1A1UMZCY2z0o0olwSImKeJZTj4QKBgBnF\n6lG180e7amjTUS3Y1PSFz31cTx14b1GoykfInz05ILRN1IEKnfpsmT7g20C4iUvR\ncQEPHHQITixJJko1zWlvsJKYYqlMAOr8aPBWXkOGnhf2QidZsL8f6x8Ci1LKCi19\nQiKBjj+WJZh3aG5E6TQe2sskQVshL4XZQoSe4PhpAoGBAMk7vqykq+EF+72Cm7oC\nWcGy/pL7zeqabtHN1NHdjsL3j0i13J5rrgSq/srdGgbNz92QHdFXQrp8QyLvyBCY\nAzWB/vX0Vo7DF7uYaF5O4O51fvYJNXyzYMjAhZMGiCnlAqFyrzvaooIcjZcUKLlv\nxSp3uJG2W2NV63axWnGg9kFd\n-----END PRIVATE KEY-----\n",
      "client_email": process.env.GOOGLE_CLIENT_EMAIL,
      "client_id": process.env.GOOGLE_CLIENT_ID,
      "auth_uri": process.env.GOOGLE_AUTH_URI,
      "token_uri": process.env.GOOGLE_TOKEN_URI,
      "auth_provider_x509_cert_url": process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
      "client_x509_cert_url": process.env.GOOGLE_CLIENT_X509_CERT_URL
      }, 
    scopes: SCOPES
});

module.exports = { auth };