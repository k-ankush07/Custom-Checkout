import "react-quill-new/dist/quill.snow.css";

export default function RichText({ richInputs }) {
    return (
        <div className="add-reviews-wraping">
            {richInputs && richInputs.length > 0 ? (
                richInputs.map((input, index) => (
                    <div key={index} className="richtext-item">
                        <div className="trustBages-section-heading">
                            <h3>{input.title || "Rich text"}</h3>
                        </div>
                        <div
                            className="richtext-description"
                            dangerouslySetInnerHTML={{
                                __html: input.description || "<p>No description</p>",
                            }}
                        />
                    </div>
                ))
            ) : (
                <p>No rich text content added yet.</p>
            )}
        </div>
    );
}
