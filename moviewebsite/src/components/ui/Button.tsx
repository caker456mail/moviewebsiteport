export const Button = ({
    title,
    isSelected,
    onClick,
    width,
    disable,
    type,
}: {    
    title: string;
    isSelected: boolean;
    onClick?: () => void;
    width?: string;
    disable?: boolean;
    type?: "button" | "submit" | "reset";
}) => {
    return (
        <button
            type={type?type : "button"}
            disabled={disable ? disable : false}
            onClick={onClick}
            style={{
                padding: "8px",
                backgroundColor: isSelected ? "#e50914" : "#222228",
                color: "#fff",
                border: isSelected
                    ? "1px solid #ff4d4d"
                    : "1px solid #2e2e36",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "0.8rem",
                fontWeight: isSelected ? "bold" : "normal",
                width: width
            }}
        >
            {title}
        </button>
    );
};