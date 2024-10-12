import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";

import axios from "axios";

export default function company() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState(""); //錯誤訊息
  const router = useRouter();

  const handelUserName = (e) => {
    setUsername(e.target.value);
  };

  // 判斷輸入的驗證碼是否存在
  const handleLogin = async (e) => {
    let password = username;
    try {
      let result = await axios.post("http://localhost:8080/api/user/login", {
        password,
      });
      // result會有jwt token
      // console.log("result", result.data);
      if (result.data.data.length > 0) {
        localStorage.setItem("user", JSON.stringify(result.data));
        alert("登入成功跳轉表單");
        router.push({
          pathname: "/newForm",
          query: { userData: JSON.stringify(result.data.data), password },
        });
      } else {
        //查無資料
        alert("識別碼輸入錯誤，請重新輸入");
      }
    } catch (e) {
      alert("登入失敗，請稍後再試");
    }
  };

  return (
    <div className="container vh-90 position-relative d-flex justify-content-center align-items-center mt-4">
      <div className="background-ticket"></div>
      <div className="content d-flex flex-wrap justify-content-center">
        <div className="inform-lg inform-md inform">
          請輸入取票識別碼進行線上取票
        </div>
        <button className="btn-ticket btn-md-ticket">取票識別碼</button>
        <input
          type="text"
          onChange={handelUserName}
          name="username"
          id="username"
          className="form-control form-md-control"
        />
        <button
          className="btn-lg-get-ticket btn-md-get-ticket btn-get-ticket"
          onClick={handleLogin}
        >
          領取票券
        </button>
      </div>
    </div>
  );
}
