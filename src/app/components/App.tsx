import React, { useState } from 'react';
import './App.css';

function App() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const newFiles = Array.from(event.target.files);
      setSelectedFiles(prevFiles => [...prevFiles, ...newFiles]);
      generatePreviews(newFiles);
    }
  };

  const generatePreviews = (files: File[]) => {
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && e.target.result && typeof e.target.result === 'string') {
          setPreviews(prevPreviews => [...prevPreviews, e.target.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const onCreate = () => {
    if (selectedFiles.length > 0) {
      parent.postMessage({ pluginMessage: { type: 'upload-images', files: selectedFiles } }, '*');
    } else {
      console.log('No files selected');
    }
  };

  const onCancel = () => {
    parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
  };

  const deleteImage = (index: number) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    setPreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
  };

  React.useEffect(() => {
    window.onmessage = (event) => {
      const { type, message } = event.data.pluginMessage;
      if (type === 'upload-images') {
        console.log(`Figma Says: ${message}`);
      }
    };
  }, []);

  return (
    <div className="p-4 w-full h-full mx-auto text-xs text-gray-800 flex flex-col" style={{ backgroundColor: '#fff', fontFamily: "'Inter', sans-serif" }}>
      <h2 className="text-base font-medium mb-4 text-center">Multiple Image Uploader</h2>
      <div className="mb-4">
        <label htmlFor="file-upload" className="block text-xs font-medium text-gray-700 mb-2">
          Choose images
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="block w-full text-xs text-gray-500
            file:mr-2 file:py-1 file:px-3
            file:rounded-md file:border-0
            file:text-xs file:font-medium
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>
      <p className="text-xs text-gray-600 mb-4">
        {selectedFiles.length > 0 ? `${selectedFiles.length} file(s) selected` : 'No files selected'}
      </p>
      
      {previews.length > 0 && (
        <div className="mb-4 flex flex-col w-full">
          <h3 className="text-sm font-medium mb-2">Image Previews</h3>
          <div className="flex flex-wrap w-full gap-4">
            {previews.map((preview, index) => (
              <div
                key={index}
                className="relative group"
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundColor: '#fff',
                  border: '1px solid #fff',
                  boxShadow: '0 0 6px 1px rgba(17, 17, 17, 0.25)',
                }}
              >
                <button
                  onClick={() => deleteImage(index)}
                  className="absolute top-1 right-1 text-white w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                >
                  ×
                </button>
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={onCreate}
          disabled={selectedFiles.length === 0}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-3 rounded-md
            text-xs transition-colors duration-200 ease-in-out
            disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          Upload
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-1 px-3 rounded-md
            text-xs transition-colors duration-200 ease-in-out"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default App;
