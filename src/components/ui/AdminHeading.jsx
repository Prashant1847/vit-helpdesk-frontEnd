import React from 'react';
import styles from './AdminHeading.module.css';

const AdminHeading = ({title, description}) => {
    return (
        <div className={styles.dashboardHeader}>
            <h1>{title}</h1>
            <p>{description}</p>
        </div>
    )
}

export default AdminHeading;    
