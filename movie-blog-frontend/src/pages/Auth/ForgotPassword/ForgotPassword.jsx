import React from "react";
import "./ForgotPassword.css";

const ForgotPassword = () => {
    return (
        <div className="forgot-password-container">
            <h1 className="forgot-password-title">Forgot Password</h1>
            <form className="forgot-password-form">
                <label className="forgot-password-label" htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    className="forgot-password-input"
                    placeholder="Enter your email"
                />
                <button type="submit" className="forgot-password-button">Send Reset Request</button>
            </form>
        </div>
    );
};

export default ForgotPassword;
