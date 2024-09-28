// pages/test.js
import Image from "next/image";
import React from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  const handleLogin = async (e) => {
    router.push({
      pathname: "/identify",
    });
  };

  return (
    <div className="container vh-90 position-relative d-flex justify-content-center align-items-center mt-4">
      <div className="background"></div>
      <div className="content">
        <button
          className="btn btn-lg"
          onClick={handleLogin}
          style={{
            fontSize: "1.5rem",
            width: "10rem",
            fontWeight: "bold",
            color: "red",
            backgroundColor: "lightgray",
          }}
        >
          線上取票
        </button>
      </div>
    </div>
  );
}
