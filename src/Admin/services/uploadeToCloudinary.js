// services/uploadService.js

export const uploadImagesToCloudinary = async (imageFiles) => {
  const uploadedUrls = [];

  for (const file of imageFiles) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_pre"); // replace with your Cloudinary preset
    formData.append("cloud_name", "debysr2dg"); // replace with your Cloudinary cloud name

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/debysr2dg/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Image upload failed");
    }

    const data = await response.json();
    uploadedUrls.push(data.secure_url); // Cloudinary's hosted image URL
  }

  return uploadedUrls;
};
