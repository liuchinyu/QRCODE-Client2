// pages/test.js
import Image from "next/image";
import React from "react";
import { useRouter } from "next/router";

export default function identify() {
  const router = useRouter();
  const handleLogin = async (e) => {
    router.push({
      pathname: "/company",
    });
  };

  const handleToPerLogin = async (e) => {
    router.push({
      pathname: "/person",
    });
  };

  return (
    <div className="container mt-4">
      <div className="position-relative text-center">
        {/* 圖片 */}
        <Image
          src="/identify.png" // 確保圖片路徑正確，放在 public 資料夾中
          alt="Example Image"
          width={600}
          height={300}
          className="img-fluid"
          style={{ width: "80vw", height: "auto" }}
        />
        <button
          className="btn btn-lg position-absolute "
          onClick={handleLogin}
          style={{
            color: "black",
            backgroundColor: "lightgray",
            fontSize: "1.5rem",
            width: "10rem",
            fontWeight: "bold",
            top: "35%",
            left: "30%",
          }}
        >
          公司團體票
          <br />
          取票入口
        </button>
        <button
          className="btn btn-lg position-absolute "
          onClick={handleToPerLogin}
          style={{
            color: "black",
            backgroundColor: "lightgray",
            fontSize: "1.5rem",
            width: "10rem",
            fontWeight: "bold",
            top: "35%",
            left: "60%",
          }}
        >
          個人票
          <br />
          取票入口
        </button>
      </div>

      {/* 按鈕放在圖片下方 */}
    </div>
  );
}
