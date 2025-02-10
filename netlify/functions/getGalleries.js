// netlify/functions/getGalleries.js

const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.handler = async (event, context) => {
  console.log("Connecting to Cloudinary account:", process.env.CLOUDINARY_CLOUD_NAME);

  try {
    // Fetch the root folders in your Cloudinary account.
    // (This assumes that your gallery folders are stored at the root level.)
    const foldersResult = await cloudinary.api.root_folders();
    const allFolders = foldersResult.folders || [];

    // Filter to keep only folders that follow the gallery naming convention ("gallery_<name>")
    const galleryFolders = allFolders.filter(folder =>
      folder.name.startsWith("gallery_")
    );

    // For each gallery folder, fetch the first image (to use as the cover image)
    const galleries = await Promise.all(
      galleryFolders.map(async folder => {
        // Use Cloudinary's Search API to fetch up to one image from the folder.
        const searchResult = await cloudinary.search
          .expression(`folder:${folder.name}`)
          .max_results(1)
          .execute();

        // If at least one image is found, take its secure URL as the cover image.
        const coverImage =
          searchResult.resources && searchResult.resources.length > 0
            ? searchResult.resources[0].secure_url
            : null;

        // Extract the gallery's display name by removing the "gallery_" prefix.
        const galleryName = folder.name.substring("gallery_".length);

        return {
          galleryName,     // e.g. "portraits" if folder is "gallery_portraits"
          folder: folder.name, // The full folder name (used when linking to the gallery page)
          coverImage,      // URL for the first image in the folder (or null if none found)
        };
      })
    );

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        // Include CORS header if your frontend is hosted elsewhere.
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ galleries }),
    };

  } catch (error) {
    console.error("Error fetching galleries:", error);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
