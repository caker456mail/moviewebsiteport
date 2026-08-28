export const Card = ({
    image,
    title,
    genre,
    BT,
    center,
    TEXTInfo,
}: {
    image?: string,
    title: string,
    genre?: string,
    center?: boolean,
    TEXTInfo?:React.ReactNode,
    BT?: React.ReactNode
}) => {
    return (


        <div
            style={{
                backgroundColor: "#18181c",
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid #2a2a30",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
        >
            <div
                style={{
                    height: "280px",
                    background: "#2e2e38",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#aaa",
                    fontSize: "0.9rem",
                }}
            >

                {image ? (
                    <img
                        src={image}
                        alt={title}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                        }}
                    />
                ) : (
                    <span>NO IMAGE</span>
                )}
            </div>

            <div style={{ padding: "16px" }}>
                <div style={{ 
                    margin: "auto", justifyItems: center?"center":"left"}}>
                    <h3
                        style={{
                            fontSize: "1.1rem",
                            margin: "0 0 8px 0",
                        }}
                    >
                        {title}
                    </h3>

                    <p
                        style={{
                            fontSize: "0.85rem",
                            color: "#aaa",
                            margin: "0 0 12px 0",
                        }}
                    >
                        {genre}
                    </p>
                    {TEXTInfo}
                </div>

                {BT}
            </div>
        </div>
    )
}
