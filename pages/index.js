// pages/test.js
import React from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  // console.log()
  const handleLogin = async (e) => {
    router.push({
      pathname: "/company",
    });
  };

  return (
    <div className="background-container position-relative d-flex justify-content-center align-items-center">
      <div className="background background-phone"></div>

      <div className="content">
        <button className="btn-entrance" onClick={handleLogin}>
          線上取票入口
        </button>
      </div>
      <p className="text position-absolute">
        如有票券取得之相關問題，請隨時與我們聯繫，謝謝
        <br />
        客服電話：(02)2792-8788#502
        <br />
        客服信箱：xgen.org.tw@gmail.com
        <br />
        服務時間：週一到週五 09:00~18:00
      </p>
    </div>
  );
}
