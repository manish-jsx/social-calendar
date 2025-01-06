const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
    const store = getStore({
        name: 'social-calendar-uploads',
        siteID: process.env.NETLIFY_SITE_ID,
        token: process.env.NETLIFY_AUTH_TOKEN
    });

    const body = JSON.parse(event.body);

    try {
        const { file, metadata } = body;
        if (!file) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'File is required' }),
            };
        }
        const { type, base64 } = file;
        const fileBuffer = Buffer.from(base64, 'base64');
        const fileId = `${item.id}-${Date.now()}`;

        await store.set(fileId, fileBuffer, {
            metadata: {
                type,
                ...metadata,
            },
        });

        const url = await store.getURL(fileId);

        return {
            statusCode: 200,
            body: JSON.stringify({
                url,
                type,
            }),
        };
    } catch (error) {
        console.error('Error uploading file:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to upload file' }),
        };
    }
};