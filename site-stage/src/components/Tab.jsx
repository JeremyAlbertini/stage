const Tab = ({ label, isActive, onClick}) => {
    return (
        <div
            onClick={onClick}
            style={{
                padding: "1rem 2rem",
                cursor: "pointer",
                borderBottom: isActive ? "3px solid #4A25AA" : "none",
                color: isActive ? "4A25AA" : "#666",
                fontWeight: isActive ? "bold" : "normal",
                transition: "all 0.1s"
            }}
        >
            {label}
        </div>
    );
};

export default Tab;