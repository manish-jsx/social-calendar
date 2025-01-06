const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  // CORS is handled by the redirect rule in netlify.toml, no headers needed here.

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body);
    const { file, metadata } = body;

    if (!file || !file.base64 || !file.type) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid file data' }),
      };
    }

    // Initialize the Netlify Blobs store
    const store = getStore({
      name: 'social-calendar-uploads', // Replace with your store's name
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_AUTH_TOKEN,
    });

    const fileBuffer = Buffer.from(file.base64, 'base64');
    // Use the itemId from metadata as part of the key
    const fileId = `${metadata.itemId}-${Date.now()}`;

    // Store the file in Netlify Blobs
    await store.set(fileId, fileBuffer, {
      metadata: {
        type: file.type,
        ...metadata,
      },
    });

    // Return the URL of the uploaded file (the key is the fileId)
    const url = new URL(`/.netlify/blobs/${fileId}`, process.env.DEPLOY_URL).href;

    return {
      statusCode: 200,
      body: JSON.stringify({
        url,
        type: file.type,
        id: fileId, // Return the fileId as the ID
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