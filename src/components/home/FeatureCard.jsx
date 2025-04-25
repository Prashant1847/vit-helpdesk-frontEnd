import React from 'react';
import styles from './FeatureCard.module.css';

const FeatureCard = ({index, Icon, title, description, iconColor}) => {
    return (
        <div key={index} className={styles.featureCard}>
            <div className={styles.featureIcon} style={{color: iconColor}}><Icon /></div>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
    )
}

export default FeatureCard;

