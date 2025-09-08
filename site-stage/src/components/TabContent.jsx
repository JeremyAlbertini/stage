const TabContent = ({id, activeTab, children }) => {
    if (activeTab != id) return null;

    return (
        <div className="tab-content admin-card">
            {children}
        </div>
    );
};

export default TabContent;