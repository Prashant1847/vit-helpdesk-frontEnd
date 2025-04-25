import React from 'react';
import styles from './Message.module.css';
import FilePreview from './FilePreview';

const Message = ({ message, queryId }) => {
  console.log("message", message)
  return (
    <div
      className={`${styles.message} ${message.from === 'Admin' ? styles.adminMessage : styles.userMessage}`}
    >
      <div className={styles.messageBubble}>
        <div className={styles.messageContent}>
          <p>{message.message}</p>
          {message.files && message.files.length > 0 && (
            <div className={styles.messageFiles}>
              {message.files.map((file, fileIndex) => (
                <FilePreview key={fileIndex} file={file} queryId={queryId} />
              ))}
            </div>
          )}
        </div>
        <div className={styles.messageMeta}>
          <span className={styles.messageTime}>
            {new Date(message.timestamp).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Message; 