import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

// import styles from "@/styles/Home.module.css";

export default function person() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState(""); //錯誤訊息
  const router = useRouter();

  const handelUserName = (e) => {
    setUsername(e.target.value);
  };

  // 判斷輸入的驗證碼是否存在
  const handleLogin = async (e) => {
    let password = username;
    let result = await axios.post(
      "http://localhost:8080/api/user/login_person",
      {
        password,
      }
    );

    if (result.data.length > 0) {
      alert("登入成功跳轉表單");
      router.push({
        pathname: "/newFormPer",
        query: { userData: JSON.stringify(result.data), password },
      });
    } else {
      //查無資料
      console.log("result", result);
      alert("識別碼輸入錯誤，請重新輸入");
    }
  };

  return (
    <div className="container mt-4">
      <div className="position-relative text-center">
        {/* 圖片 */}
        <Image
          src="/person.png" // 確保圖片路徑正確，放在 public 資料夾中
          alt="Example Image"
          width={600}
          height={300}
          className="img-fluid"
          style={{ width: "80vw", height: "auto" }}
        />
        <div
          className="position-absolute start-50 translate-middle-x"
          style={{
            color: "red",
            fontSize: "1.3rem",
            fontWeight: "bold",
            top: "25%",
          }}
        >
          請輸入取票識別碼進行線上取票
        </div>
        <button
          className="btn btn-lg position-absolute  "
          style={{
            backgroundColor: "lightgray",
            color: "black",
            fontSize: "1.3rem",
            fontWeight: "bold",
            top: "35%",
            left: "33%",
          }}
        >
          取票識別碼
        </button>
        <input
          type="text"
          onChange={handelUserName}
          name="username"
          id="username"
          className="form-control position-absolute"
          style={{
            color: "black",
            fontSize: "1.4rem",
            fontWeight: "bold",
            width: "15rem",
            top: "35%",
            left: "45%",
          }}
        />
      </div>
      <button
        className="btn btn-lg position-absolute "
        onClick={handleLogin}
        style={{
          color: "black",
          backgroundColor: "lightgray",
          fontSize: "1.3rem",
          fontWeight: "bold",
          top: "50%",
          left: "45%",
        }}
      >
        領取票券
      </button>

      {/* 按鈕放在圖片下方 */}
    </div>
  );
}
