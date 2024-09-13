import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";

export default function newForm() {
  const router = useRouter();
  const [userData, setUserData] = useState("");
  const [password, setPassword] = useState("");

  const [names, setName] = useState(""); //公司名稱
  const [seat, setSeat] = useState(""); //座位
  const [ticket, setTicket] = useState(""); //剩餘票券
  const [message, setMessage] = useState(""); //錯誤訊息

  const [username, setUsername] = useState(""); //領票人
  const [emails, setEmail] = useState(""); //領票信箱
  const [numbers, setNumber] = useState(""); //領票張數

  useEffect(() => {
    if (router.isReady && router.query.userData) {
      // 接收並解析資料
      console.log("router.query.userData", JSON.parse(router.query.userData));
      setUserData(JSON.parse(router.query.userData));
      setPassword(router.query.password);
    }
  }, [router.query]);

  useEffect(() => {
    if (userData) {
      setName(userData[1]);
      setSeat(userData[3]);
    }
  }, [userData]);

  const handelNumber = (e) => {
    setNumber(e.target.value);
  };

  const handelUserName = (e) => {
    setUsername(e.target.value);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleLogin = async (e) => {
    setMessage("");
    let errorMessage = "";
    let ticket_left = 0;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //mail判斷式

    if (!numbers) {
      errorMessage += "請輸入領取票券\n";
    }
    if (!username) {
      errorMessage += "請輸入領票人姓名\n";
    }
    if (!emails) {
      errorMessage += "請輸入領票人信箱\n";
    } else if (!emailRegex.test(emails)) {
      errorMessage += "信箱格式不正確\n";
    }

    setMessage(errorMessage);
    if (errorMessage.length == 0) {
      let result = await axios.post(
        "http://localhost:8080/api/user/update_data",
        {
          password,
          ticket_left,
        }
      );

      router.push({
        pathname: "/QRCodeGenerator_person",
        query: { names, seat, username, numbers, emails },
      });
    } else {
      alert(errorMessage);
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
        <div className="row">
          <div className="col">
            <h1
              className="btn position-absolute start-50 translate-middle-x"
              style={{
                color: "black",
                backgroundColor: "lightgray",
                fontSize: "1.3rem",
                fontWeight: "bold",
                top: "5%",
                color: "red",
                width: "10rem",
              }}
            >
              {names}
            </h1>
          </div>

          <div className="col-6">
            <button
              className="btn position-absolute  "
              style={{
                color: "black",
                backgroundColor: "lightgray",
                fontSize: "1.1rem",
                fontWeight: "bold",
                top: "19%",
                left: "30%",
                width: "12rem",
              }}
            >
              ＊領票數量：
            </button>
          </div>
          <div className="col-6">
            <input
              type="number"
              onChange={handelNumber}
              className="btn btn-light btn-lg position-absolute col-4 "
              // className="form-control"
              name="number"
              id="number"
              min="0"
              placeholder="請輸入要領取的張數"
              style={{
                color: "black",
                fontSize: "1.1rem",
                fontWeight: "bold",
                top: "19%",
                left: "50%",
                width: "15rem",
              }}
              required
            />
          </div>
          <div className="col-6">
            <button
              className="btn btn-lg position-absolute  "
              style={{
                color: "black",
                backgroundColor: "lightgray",
                fontSize: "1.1rem",
                fontWeight: "bold",
                top: "32%",
                left: "30%",
                width: "12rem",
              }}
            >
              ＊領票人姓名：
            </button>
          </div>
          <div className="col-6">
            <input
              type="text"
              onChange={handelUserName}
              className="btn btn-light btn-lg position-absolute col-4 "
              // className="form-control"
              name="username"
              id="username"
              style={{
                color: "black",
                fontSize: "1.1rem",
                fontWeight: "bold",
                top: "32%",
                left: "50%",
                width: "15rem",
              }}
              required
            />
          </div>
          <div className="col-6">
            <button
              className="btn btn-lg  position-absolute  "
              style={{
                color: "black",
                backgroundColor: "lightgray",
                fontSize: "1.1rem",
                fontWeight: "bold",
                top: "45%",
                left: "30%",
                width: "12rem",
              }}
            >
              ＊Gmail：
            </button>
          </div>
          <div className="col-6">
            <input
              type="email"
              onChange={handleEmail}
              className="btn btn-light btn-lg position-absolute col-4 "
              // className="form-control"
              style={{
                color: "black",
                fontSize: "1.1rem",
                fontWeight: "bold",
                top: "45%",
                left: "50%",
                width: "15rem",
              }}
              required
            />
          </div>
        </div>
      </div>

      <button
        className="btn position-absolute "
        onClick={handleLogin}
        style={{
          color: "black",
          backgroundColor: "lightgray",
          fontSize: "1.1rem",
          fontWeight: "bold",
          top: "58%",
          left: "43%",
          width: "10rem",
        }}
      >
        取票
      </button>

      {/* 按鈕放在圖片下方 */}
    </div>
  );
}
