// netlify/functions/getImages.js
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.handler = async (event, context) => {
  // Log your cloud name to verify that your environment variables are loaded.
  console.log("Connecting to Cloudinary account:", process.env.CLOUDINARY_CLOUD_NAME);
  try {
    // Get the folder from the query parameters, default to 'portraits'
    const folder = event.queryStringParameters.folder || 'portraits';

    // Use Cloudinary's Search API to search for images in the specified folder.
    const result = await cloudinary.search
      .expression(`folder:${folder}`)
      .max_results(50)
      .execute();

    console.log(`Successfully fetched ${result.resources.length} images from folder "${folder}".`);

    // Map the result to return only the fields you need.
    const images = result.resources.map(img => ({
      url: img.secure_url,
      public_id: img.public_id,
      format: img.format,
      width: img.width,
      height: img.height
    }));

    return {
      statusCode: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"  // Optional, for CORS
      },
      body: JSON.stringify({ images }),
    };
  } catch (error) {
    console.error('Error fetching images:', error);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
