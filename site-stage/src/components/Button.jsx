export default function Button({ children, onClick, secondary, ...props}) {
    return (
        <button
        onClick={onClick}
        className={`app-button ${secondary ? 'app-button-secondary' : ''}`}
        {...props}
        >
            {children}
        </button>
    );
}
