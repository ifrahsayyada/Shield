const StatusCard = ({ title, children, variant = "default" }) => {
    return (
        <div className={`card card-${variant}`}>
            <h3>{title}</h3>
            <div className="card-content">{children}</div>
        </div>
    );
};

export default StatusCard;
