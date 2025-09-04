import Tab from './Tab';

const TabGroup = ({ tabs, activeTab, onTabChange }) => {
    return (
        <div style={{
            display: "flex",
            borderBottom: "1px solid #ddd",
            marginBottom: "1.5rem",
            width: "100%"
        }}>
            {tabs.map(tab => (
                <Tab
                    key={tab.id}
                    label={tab.label}
                    isActive={activeTab === tab.id}
                    onClick={() => onTabChange(tab.id)}
                />
            ))}
        </div>
    );
};

export default TabGroup;