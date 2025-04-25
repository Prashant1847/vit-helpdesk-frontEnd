import React from 'react';
import styles from './FilePreview.module.css';

const FilePreview = ({ file, queryId }) => {
  const isImage = file.mimetype.startsWith('image/');
  const fileUrl = `${import.meta.env.VITE_BASE_URL}/uploads/${queryId}/${file.filename}`;

  return (
    <div className={styles.filePreview}>
      {isImage ? (
        <a href={fileUrl} target="_blank" rel="noopener noreferrer">
          <img src={fileUrl} alt={file.originalname} className={styles.previewImage} />
        </a>
      ) : (
        <a href={fileUrl} target="_blank" rel="noopener noreferrer">
          <i className="fas fa-file-download"></i>
          <span>{file.originalname}</span>
        </a>
      )}
    </div>
  );
};

export default FilePreview; 