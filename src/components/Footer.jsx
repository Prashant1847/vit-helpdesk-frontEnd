import React from 'react';
import '../styles/Footer.css';

const Footer = ({ pageType }) => {
    const getInstructions = () => {
        switch (pageType) {
            case 'post':
                return {
                    title: 'How to Submit a Query',
                    instructions: [
                        {
                            heading: 'Choose if You Want the Query to Be Public',
                            description: 'If enabled, your question (and admin response) may help others with the same issue. Personal details are always hidden.'
                        },
                        {
                            heading: 'Once you submit, you\'ll receive a confirmation email with your Query ID.',
                            description: 'Your Query ID is extremely important — save it! It acts as your tracking number and will be required if:\nYou need to check the status of your query\nYou want to reference it in a follow-up or future query\nYou reach out to the Help Desk for support'
                        },
                        {
                            heading: 'Submit and Relax 😌',
                        }
                    ]
                };
            case 'track':
                return {
                    title: 'Track Query Instructions',
                    instructions: [
                        {
                            heading: 'Pending Status',
                            description: 'Your query is submitted but hasn\'t been answered yet. Just wait — an admin will get to it soon.'
                        },
                        {
                            heading: 'In Progress Status',
                            description: 'An admin has seen your query and may be working on it. You might get a reply shortly.'
                        },
                        {
                            heading: 'Resolved Status',
                            description: 'A response has been posted for your query, and it\'s been marked as completed.\n If you still need help or something isn\'t clear, just send a follow-up message — you don\'t have to start over or submit a new query.'
                        },
                    ]
                };
            case 'trash':
                return {
                    title: 'Trash Management Guide',
                    instructions: [
                        {
                            heading: 'View Trashed Queries',
                            description: 'Access all queries that have been moved to the trash.'
                        },
                        {
                            heading: 'Use Advanced Filters',
                            description: 'Filter trashed queries by status, date range, query ID, email, or keywords.'
                        },
                        {
                            heading: 'Restore Queries',
                            description: 'Use the "Restore" button to move queries back to the active list.'
                        },
                        {
                            heading: 'Automatic Deletion',
                            description: 'Queries in trash are automatically deleted after 30 days.'
                        },
                        {
                            heading: 'Manage Space',
                            description: 'Regular cleanup helps maintain system performance.'
                        }
                    ]
                };
            default:
                return {
                    title: 'Page Instructions',
                    instructions: []
                };
        }
    };

    const { title, instructions } = getInstructions();

    return (
        <footer className="footer">
            <div className="footer-content">
                <h2>{title}</h2>
                <div className="instructions-list">
                    {instructions.map((instruction, index) => (
                        <div key={index} className="instruction-item">
                            <h3 className="instruction-heading">
                                <span className="instruction-number">{index + 1}.</span>
                                {instruction.heading}
                            </h3>
                            <p className="instruction-description">{instruction.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </footer>
    );
};

export default Footer; 