import { useState } from "react";
import { useRouter } from "next/router";
import CustomAlert from "./customAlert";
import axios from "axios";

const API_URL = "https://qrcode-server-438803.de.r.appspot.com/api/user/";
// const API_URL = "http://localhost:8080/api/user/";
// console.log(1);
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
        // 加總Buffer區現有的座位數量
        let getBuffer = await axios.get(API_URL + "getBufferNum");
        let getBufferNum = getBuffer.data;
        result.data.data.buffer_rest = getBufferNum.data;
        console.log("result.data.data", result.data.data);
        setLoginData({
          userData: JSON.stringify(result.data.data),
          password: password,
        });
      } else {
        //查無資料
        setAlertMessage("識別碼輸入錯誤，請重新再輸入一次");
        setShowAlert(true);
      }
    } catch (e) {
      console.log(e);
      console.log("E.message", e.message);
      setAlertMessage("識別碼輸入錯誤，請重新再輸入一次");
      // setAlertMessage("網站維護中，不好意思請見諒");
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
      <div className="background-ticket background-phone2"></div>
      <div className="content d-flex flex-wrap justify-content-center">
        <div className="inform">請輸入取票識別碼進行線上取票</div>
        <button className="btn-ticket">取票識別碼</button>
        <input
          type="text"
          onChange={handelUserName}
          name="username"
          id="username"
          className="form-control text-center"
        />
        <button className="btn-get-ticket" onClick={handleLogin}>
          領取票券
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
      {/* 驗證碼輸入錯誤訊息 */}
      {showAlert && (
        <CustomAlert message={alertMessage} onClose={handleAlertClose} />
      )}
    </div>
  );
}
