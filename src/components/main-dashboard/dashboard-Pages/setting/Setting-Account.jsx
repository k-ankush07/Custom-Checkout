import { useState, useEffect } from "react";
import whiteAccount from '../../../../images/white-account.webp';
import { useShopify } from "../ShopifyContext";

export default function SettingAccount() {
    const { ownerShop } = useShopify();

    const savedName = localStorage.getItem("ownername") || ownerShop || "";
    const [name, setName] = useState(savedName);

    const handleNameChange = (e) => {
        const newName = e.target.value;
        setName(newName);
        if (newName !== ownerShop) {
            localStorage.setItem("ownername", newName);
        }
    };

    const emailMain = localStorage.getItem("email");

    return (
        <div className="checkout-setting-wrp">
            <div className="checkout-setting-navgate">
                <p><span>Settings/</span>Account</p>
            </div>
            <div className="checkout-setting-webp">
                <div className="checkout-img active account">
                    <img src={whiteAccount} alt="" />
                </div>
                <div className="setting-title">
                    <p>User Information</p>
                </div>
            </div>
            <div className="checkout-setting-account-form">
                <div className="checkout-setting-input">
                    <label htmlFor="Name">Name</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={name} 
                        onChange={handleNameChange} 
                    />
                </div>
                <div className="checkout-setting-input">
                    <label htmlFor="Email">Email ID</label>
                    <input 
                        type="email" 
                        name="email" 
                        value={emailMain} 
                        readOnly 
                    />
                </div>
            </div>
        </div>
    );
}
