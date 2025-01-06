// const { getStore } = require('@netlify/blobs');

// exports.handler = async (event) => {
//   // CORS is handled by the redirect rule in netlify.toml, no headers needed here.
//   const siteId = process.env.NETLIFY_SITE_ID;
//   const token = process.env.NETLIFY_AUTH_TOKEN;

//   console.log('Site ID:', siteId);
//   console.log('Token:', token ? 'Token present' : 'Token missing');


//   if (event.httpMethod !== 'POST') {
//     return {
//       statusCode: 405,
//       body: JSON.stringify({ error: 'Method not allowed' }),
//     };
//   }

//   try {
//     const body = JSON.parse(event.body);
//     const { file, metadata } = body;

//     if (!file || !file.base64 || !file.type) {
//       return {
//         statusCode: 400,
//         body: JSON.stringify({ error: 'Invalid file data' }),
//       };
//     }

//     // Initialize the Netlify Blobs store
//     const store = getStore({
//       name: 'social-calendar-uploads', // Replace with your store's name
//       siteID: process.env.NETLIFY_SITE_ID,
//       token: process.env.NETLIFY_AUTH_TOKEN,
//     });

//     const fileBuffer = Buffer.from(file.base64, 'base64');
//     // Use the itemId from metadata as part of the key
//     const fileId = `${metadata.itemId}-${Date.now()}`;

//     // Store the file in Netlify Blobs
//     await store.set(fileId, fileBuffer, {
//       metadata: {
//         type: file.type,
//         ...metadata,
//       },
//     });

//     // Return the URL of the uploaded file (the key is the fileId)
//     const url = new URL(`/.netlify/blobs/${fileId}`, process.env.DEPLOY_URL).href;

//     return {
//       statusCode: 200,
//       body: JSON.stringify({
//         url,
//         type: file.type,
//         id: fileId, // Return the fileId as the ID
//       }),
//     };
//   } catch (error) {
//     console.error('Error handling upload:', error);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({
//         error: 'Failed to process upload',
//         details: error.message,
//         stack: error.stack,
//       }),
//     };
//   }
// };

const { getStore } = require('@netlify/blobs');
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
  const storeName = 'social-calendar-uploads'; // Your store name
  const siteId = process.env.NETLIFY_SITE_ID;
  const token = process.env.NETLIFY_AUTH_TOKEN;

  if (!siteId || !token) {
    console.error('Missing environment variables NETLIFY_SITE_ID or NETLIFY_AUTH_TOKEN');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing environment variables for Netlify configuration' }),
    };
  }

  const store = getStore({
    name: storeName,
    siteID: siteId,
    token: token,
  });

  try {
    const body = JSON.parse(event.body);
    const { file, metadata } = body;

    if (!file) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'File is required' }),
      };
    }

    const { type, base64 } = file;
    const fileBuffer = Buffer.from(base64, 'base64');
    const fileId = `${metadata.itemId}-${Date.now()}`;

    await store.set(fileId, fileBuffer, {
      metadata: {
        type,
        ...metadata,
      },
    });

    // Construct the correct URL to access the blob
    const url = `https://${siteId}.blob.storage.netlify.com/${storeName}/${fileId}`;

    return {
      statusCode: 200,
      body: JSON.stringify({
        url, // Return the actual URL
        type,
        id: fileId,
      }),
    };
  } catch (error) {
    console.error('Error handling upload:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to process upload',
        details: error.message,
        stack: error.stack,
      }),
    };
  }
};