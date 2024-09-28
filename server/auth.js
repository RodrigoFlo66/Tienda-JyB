const { google } = require('googleapis');

//Agrega permisos a la cuenta de servicio para que utilice Google Drive
const SCOPES = ['https://www.googleapis.com/auth/drive'];

//Init del auth que necesita la key y los scopes
const auth = new google.auth.GoogleAuth({
    credentials: {
      "type": process.env.GOOGLE_TYPE,
      "project_id": process.env.GOOGLE_PROJECT_ID,
      "private_key_id": process.env.GOOGLE_PRIVATE_KEY_ID,
      "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC4Tqc9KA55/W4z\ncZ6iccTpXlMTC7mwwF+S3sxmA1wDcyNbYhg3XSv7m/qhFTUcDi+W5iABRO+vFhaK\nRAfuQRgUr+fA2PZvEvtfxUJ4idLCyI7CrBW4Y2IVOw/2MIp5w1mslGCToRyBiTA+\nAl4A0Wd4pflVaPTDJ7OPiNpk2bR6Jt2ZbwheAua6Nq47LhKMAGv3airg6eZDBqvW\nEJM49EtnpGkywB5XLnasZ5Ap773LuHtdHjtblXSidtFJKG1saTLvIYfDcCuw23q7\n0YouJoryNWC2lVZ70dDN71LzWFTji5PgnVHh71nvnjFr9KUUKFYDpHYAxGYRICUl\nbekEqqwfAgMBAAECggEACCcaiL8D3OuT+1yUStVDg5szi40iOqpXz/RhEEYnxNNM\nBhfRwGkzr96XeJaqkcIi4sbtNYEqJRGSD62wuB5TBV8+ni46wHETg4oDRbe7Bfi/\nL+dS0qQ6y3ugWiCNj5NPnS23E/C1hRlfc+7A38JjlFerLtcEtLlF3RyNpJZowFpy\na9LYtAKpjJYHlF7eiwxNnQ3nuZ1SSUTwphiYdCrBo5JmqJRAVkUaqjc6YGA7d+IN\nTdVNOZJS3cXUbVSaYjme5N/HtyWEJUod1YgFaWYUX7FTNhKDz2YKeKqU0XAwl8r5\niDJRkkcLAvh++YXiromyG8y3AkCl4EerjHfyFrb7WQKBgQD0Hj05H8hFdT19QBH8\n4m7xHJ/yM83w+qAlW0nG+YhWNJGBfiWBKUvdnwvtvyvJ8Qz7DP7T7hlbM3GbnxjA\nftdRkaLMNHmQ740oTfOAjIsTt1UzNXlzUcUC2LzrkDoBfSJSE5gZs6N2TnHVoHfw\nK77IJNrRWTlUp+jmG7/qa/8JhQKBgQDBRyiURGDRMqSUSkfkZQ5f+luX0xOqhgSw\nbAIAuQA9wiBlR2CEDeEaN1AaMgTfF44qwRnshDgnM3C/wt9lrhPEtdSDqsJjweaj\ns7r8K/Cc9Pa0UB+EryQKYpqQAaCpw+CeVKwM8kg+Owvd3k8Iwu/mOJxb5Jfcbv7s\nBIOlhnkeUwKBgHtKRmtyVMhXpP17/Vm11ogph9JgPZOGUJltWH6IikXXeOFon3Jz\nM+CzMegaE/iCqKamcpEAgIfiHG+XU33s0bxdjFYL7pW3lpgTfnafBKKphfs995+5\nXYHJiuiBx/n2g/3l7XyVkGnwxmc5CzoeLdWRX345zM2nm+WTgELZ1k2tAoGAUGKB\nDRFXVwqCCq7OMb6Z+O8OUxnVzxFIN/vj5VsML6Nih9zk1mdTXOzuYsa04fhRB5Ui\nbA0dsagiV478DLUWwbSCO3S0vnqxqxogRascuprjVGESisOw8KTL9eLHaHPwIsnC\neOv3gfJa4B8KrfEth4m59jofsu1zFsRV4G0KSMMCgYEA0MHUT1ws6M7HBIGNvAE2\n7fhDCQ8LgWt4RSlI3lSCZarktZOoFpP2P5inHAthOKLYzWPOOgRR+kUVX8SK0tX6\nN+rdWXohrkQbUZjzT93T8P3ClFYz1FozNr64QUae7taGMcRePVF2si1VVvDNliYa\nC1FJytWP3y7zWpkZNfv9hS4=\n-----END PRIVATE KEY-----\n",
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