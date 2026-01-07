import { useState, useEffect } from "react";

export default function Contact({ handleChange, handleEdit,setInput }) {
  const [storedMobile, setStoredMobile] = useState("");
  const [storedEmail, setStoredEmail] = useState("");

  useEffect(() => {
    const savedMobile = localStorage.getItem("mobileNumber") || "";
    const savedEmail = localStorage.getItem("loginEmail") || "";

    setStoredMobile(savedMobile);
    setStoredEmail(savedEmail);
    setInput(savedEmail || savedMobile);
  }, [setInput]);

  const handleInputChange = (e) => {
    const { value } = e.target;
    setInput(value);

    if (storedEmail) {
      setStoredEmail(value);
      localStorage.setItem("loginEmail", value);
    } else {
      setStoredMobile(value);
      localStorage.setItem("mobileNumber", value);
    }

    handleChange(e);
  };

  const onEditClick = () => {
    handleEdit(); 
  };

  return (
    <div className="checkout-contact checkout-h2 checkout-v2">
      <div className="checkout-contact-wraped">
        {storedEmail && <p>Hey! Welcome back  {storedEmail}</p>}
        {!storedEmail && storedMobile && <p>Hey! Welcome back  {storedMobile}</p>}
        {!storedEmail && !storedMobile && <p>No contact info saved</p>}
      </div>
      <div className="edit-contact-btn" onClick={onEditClick}>Edit</div>
    </div>
  );
}
