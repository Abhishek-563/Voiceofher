export const uploadEvidenceToCloudinary = async (videoBlob) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const formData = new FormData();

  formData.append("file", videoBlob);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", "voice-of-her-evidence");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Cloudinary upload failed");
  }

  const data = await response.json();

  return data.secure_url;
};