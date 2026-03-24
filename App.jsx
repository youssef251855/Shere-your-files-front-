import { useState } from 'react';
import UploadCard from './components/UploadCard';
import FileResultCard from './components/FileResultCard';
import './App.css';

export default function App() {
  const [uploadedFile, setUploadedFile] = useState(null);

  return (
    <div className="page">
      <div className="container">
        <UploadCard onUploadSuccess={setUploadedFile} />
        <FileResultCard uploadedFile={uploadedFile} />
      </div>
    </div>
  );
}
