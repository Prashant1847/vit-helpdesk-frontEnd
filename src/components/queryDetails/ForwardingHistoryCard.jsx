import React from 'react';
import styles from './ForwardingHistoryCard.module.css';

const ForwardingHistoryCard = ({ event }) => {
  return (
    <div className={styles.timelineEvent}>
      <div className={styles.timelineMarker}></div>
      <div className={styles.timelineContent}>
        <div className={styles.eventHeader}>
          <span className={styles.departmentFlow}>
            {event.from} → {event.to}
          </span>
          <span className={styles.eventDate}>
            {new Date(event.forwardedAt).toLocaleDateString()} at {new Date(event.forwardedAt).toLocaleTimeString()}
          </span>
        </div>
        <div className={styles.eventDetails}>
          <div className={styles.forwardedBy}>
            <div className={styles.adminName}>Forwarded by: {event.forwardedBy.name}</div>
            <div className={styles.adminEmail}>{event.forwardedBy.email}</div>
          </div>
          {event.note && <p className={styles.forwardNoteText}>{event.note}</p>}
        </div>
      </div>
    </div>
  );
};

export default ForwardingHistoryCard; 