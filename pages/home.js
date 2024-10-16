// pages/test.js
import React from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  const handleLogin = async (e) => {
    router.push({
      pathname: "/company",
    });
  };

  return (
    <div className="background-container position-relative d-flex justify-content-center align-items-center">
      <div className="background"></div>

      <div className="content">
        <button
          className="btn-entrance btn-md-entrance btn-lg-entrance"
          onClick={handleLogin}
        >
          線上取票入口
        </button>
      </div>
    </div>
  );
}
