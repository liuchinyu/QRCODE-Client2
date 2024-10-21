import React from "react";

const CustomAlert = ({ message, onClose }) => {
  return (
    <div className="custom-alert">
      <div className="alert-content">
        <pre>{message}</pre>
        <button onClick={onClose}>確定</button>
      </div>
      <style jsx>{`
        .custom-alert {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .alert-content {
          background-color: white;
          padding: 20px;
          border-radius: 5px;
          text-align: center;
        }
        pre {
          white-space: pre-wrap;
          word-wrap: break-word;
          font-family: inherit;
          margin: 0;
        }
        button {
          margin-top: 10px;
          padding: 5px 10px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 3px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default CustomAlert;
