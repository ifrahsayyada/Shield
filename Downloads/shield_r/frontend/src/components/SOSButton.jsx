const SOSButton = ({ onClick, label = "Trigger SOS" }) => {
    return (
        <button className="sos-button" onClick={onClick}>
            {label}
        </button>
    );
};

export default SOSButton;
