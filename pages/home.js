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
    <div className="container mt-4">
      <div className="position-relative text-center">
        {/* 圖片 */}
        <Image
          src="/home.png" // 確保圖片路徑正確，放在 public 資料夾中
          alt="Example Image"
          width={600}
          height={300}
          className="img-fluid"
          style={{ width: "80vw", height: "auto" }}
        />

        {/* 文字放在圖片上方 */}
        <h1
          className="position-absolute start-50 translate-middle-x"
          style={{
            color: "black",
            fontSize: "2rem",
            fontWeight: "bold",
            top: "40%",
          }}
        >
          活動名稱:接捧未來 揮出夢想
        </h1>

        <div className="position-absolute top-50 start-50 translate-middle mt-5">
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

      {/* 按鈕放在圖片下方 */}
    </div>
  );
}
