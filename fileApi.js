const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Upload failed');
  }

  return data.data;
};

export const getFileById = async (fileId) => {
  const response = await fetch(`${BASE_URL}/file/${fileId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'File not found');
  }

  return data.data;
};
