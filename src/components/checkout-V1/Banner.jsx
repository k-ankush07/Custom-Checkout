const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

export default function Banner({
    logo, hideLogo,
    sidelogo, hideSideLogo, selectedOption
}) {
    
    return (
      <div className="checkout-page-banner-sections">
       <div className="checkout-page-banner-imges" >
            <div className="checkout-logo logo">
                {!hideLogo && logo && (
                    <img
                        src={
                            typeof logo === "string"
                                ? logo.startsWith("http")
                                    ? logo
                                    : `${apiBaseUrl}${logo.startsWith("/") ? "" : "/"}${logo}`
                                : URL.createObjectURL(logo)
                        }
                        alt="Main Logo"
                        
                        onLoad={typeof logo !== "string" ? () => URL.revokeObjectURL(logo) : undefined}
                    />
                )}
            </div>

            {selectedOption !== "pro" && (<div className="checkout-logo side-logo">
                {!hideSideLogo && sidelogo && (
                    <div className="checkout-logo wrapp-logo">
                        <img
                        src={
                            typeof sidelogo === "string"
                                ? sidelogo.startsWith("http")
                                    ? sidelogo
                                    : `${apiBaseUrl}${sidelogo.startsWith("/") ? "" : "/"}${sidelogo}`
                                : URL.createObjectURL(sidelogo)
                        }
                        alt="Side Logo"
                      
                        onLoad={typeof sidelogo !== "string" ? () => URL.revokeObjectURL(sidelogo) : undefined}
                    />
                    </div>
                )}
            </div>
            )}
        </div> 
      </div>
    );
}
