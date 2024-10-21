import { useState } from "react";
import { useRouter } from "next/router";
import CustomAlert from "./customAlert";
import axios from "axios";

const API_URL = "https://qrcode-server-438803.de.r.appspot.com/api/user/";

export default function company() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState(""); //錯誤訊息
  const router = useRouter();

  // 儲存訊息動態
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  // 設定資料卡控，待按下傳送後才跳轉表單
  const [loginData, setLoginData] = useState(null);
  const handelUserName = (e) => {
    setUsername(e.target.value);
  };

  // 判斷輸入的驗證碼是否存在
  const handleLogin = async (e) => {
    let password = username;
    try {
      let result = await axios.post(API_URL + "login", {
        password,
      });

      if (result.data.data) {
        localStorage.setItem("user", JSON.stringify(result.data.token));
        setAlertMessage("登入成功跳轉表單");
        setLoginSuccess(true);
        setShowAlert(true);
        setLoginData({
          userData: JSON.stringify(result.data.data),
          password: password,
        });
      } else {
        //查無資料
        setAlertMessage("識別碼輸入錯誤，請重新輸入");
        setShowAlert(true);
      }
    } catch (e) {
      console.log(e);
      console.log("E.message", e.message);
      setAlertMessage("識別碼輸入錯誤，請重新輸入");
      setShowAlert(true);
    }
  };
  const handleAlertClose = () => {
    setShowAlert(false);
    if (loginSuccess && loginData) {
      router.push({
        pathname: "/newForm",
        query: loginData,
      });
    }
  };

  return (
    <div className="background-container position-relative d-flex justify-content-center align-items-center">
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
      {showAlert && (
        <CustomAlert message={alertMessage} onClose={handleAlertClose} />
      )}
    </div>
  );
}
