import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import CustomAlert from "./customAlert";

// const API_URL = "https://qrcode-server-438803.de.r.appspot.com/api/user/";
const API_URL = "http://localhost:8080/api/user/";

export default function newForm() {
  const router = useRouter();
  const [userData, setUserData] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");

  const [names, setName] = useState(""); //公司名稱
  const [seat, setSeat] = useState(""); //座位
  const [ticket, setTicket] = useState(""); //剩餘票券
  let [seatRest, setSeatRest] = useState(""); //剩餘座位
  let [bufferRest, setBufferRest] = useState(""); //剩餘Buffer區座位
  let [bufferNum, setBufferNum] = useState(0);
  const [message, setMessage] = useState(""); //錯誤訊息
  const [username, setUsername] = useState(""); //領票人
  const [emails, setEmail] = useState(""); //領票信箱
  const [numbers, setNumber] = useState(""); //大人領票張數
  const [kidNumbers, setKidNumber] = useState(""); //小孩人數

  const [currentUser, setCurrentUser] = useState("");

  //儲存訊息
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  //判斷是否有登入過
  useEffect(() => {
    setCurrentUser(JSON.parse(localStorage.getItem("user")));
  }, []);

  useEffect(() => {
    if (router.isReady && router.query.userData) {
      // 接收並解析資料
      setUserData(JSON.parse(router.query.userData));
      setPassword(router.query.password);
      let test_data = JSON.parse(router.query.userData);
    }
  }, [router.query, router.query.ticket]);

  useEffect(() => {
    if (userData) {
      setName(userData.name);
      setSeat(userData.seat);
      setTicket(userData.ticket_rest);
      setSeatRest(userData.seat_rest);
      setBufferRest(userData.buffer_rest);
      setCompany(userData.type);
    }
  }, [userData]);

  const handelNumber = (e) => {
    setNumber(parseInt(e.target.value));
  };
  const handelKidNumber = (e) => {
    setKidNumber(parseInt(e.target.value));
  };
  const handelUserName = (e) => {
    setUsername(e.target.value);
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  //回到身分判斷頁面
  const backToLogin = () => {
    router.push({
      pathname: "/company",
    });
  };

  const handleLogin = async (e) => {
    setMessage("");
    let errorMessage = "";
    let ticket_left = 0;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //mail判斷式

    if (!numbers) {
      errorMessage += "請輸入領取票券\n";
    }
    if (!kidNumbers && kidNumbers != 0) {
      errorMessage += "請輸入12歲以下孩童人數，若不攜帶孩童請輸入0\n";
    }
    if (!username) {
      errorMessage += "請輸入領票人姓名\n";
    }
    if (!emails) {
      errorMessage += "請輸入領票人信箱\n";
    } else if (!emailRegex.test(emails)) {
      errorMessage += "信箱格式不正確\n";
    }
    if (numbers + kidNumbers > seatRest) {
      if (numbers + kidNumbers > seatRest + bufferRest) {
        errorMessage +=
          "欲領取票券大於目前剩餘座位，如有問題請洽相關窗口，謝謝!\n";
      } else {
        bufferNum = numbers + kidNumbers - seatRest;
        console.log("bufferNum", bufferNum);
        bufferRest -= bufferNum;
        console.log("bufferRest", bufferRest);
      }
      // setJumpBuffer
    } else {
      seatRest = seatRest - numbers - kidNumbers;
    }
    console.log("seatRest", seatRest);
    console.log("bufferRest", bufferRest);

    if (numbers > ticket) {
      errorMessage += "領取票券大於可領取數量\n";
    } else if (numbers == 0) {
      errorMessage += "請輸入要領取的票券數量\n";
    } else {
      ticket_left = ticket - numbers; //紀錄剩餘張數
    }
    setMessage(errorMessage);
    if (errorMessage.length == 0) {
      console.log("insert的seatRest", seatRest);
      // 有使用到buffer區
      if (bufferNum > 0) {
        let result = await axios.post(
          API_URL + "update_buffer_data",
          {
            bufferRest,
          },
          {
            headers: {
              Authorization: currentUser,
            },
          }
        );
      }

      if (seatRest > 0) {
        {
          let result = await axios.post(
            API_URL + "update_data",
            {
              password,
              ticket_left,
              seatRest,
            },
            {
              headers: {
                Authorization: currentUser,
              },
            }
          );
        }
      }

      router.push({
        pathname: "/QRCodeGenerator",
        query: {
          company,
          names,
          seat,
          username,
          numbers,
          ticket_left,
          kidNumbers,
          emails,
        },
      });
    } else {
      setAlertMessage(errorMessage);
      setShowAlert(true);
    }
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const returnNumber = (num) => {
    if (isNaN(num)) return 0;
    else return num;
  };

  return (
    <>
      {!currentUser && (
        <div>
          <p>您必須先進行身份驗證</p>
          <button
            className="btn btn-primary btn-lh backToLogin"
            onClick={backToLogin}
          >
            回到身份驗證頁面
          </button>
        </div>
      )}
      {currentUser && (
        <div className="background-container position-relative d-flex justify-content-center align-items-center overflow-hidden ">
          <div className="background-ticket-2 background-phone2"></div>
          <div className="content-form d-flex flex-wrap justify-content-center">
            <div className="row">
              <div className="col-12 d-flex justify-content-center">
                {/* 手機以上 */}
                <h2 className="d-none d-sm-block inform-newForm">
                  ＊＊請確認當天出席人數再進行取票，每張入場電子票券僅限１位大人使用
                </h2>
                {/* 手機 */}
                <h2 className="d-sm-none inform-newForm">
                  請確認當天出席人數再進行取票<br></br>
                  每張入場電子票券僅限１位大人使用
                </h2>
                <h2 className="d-none d-sm-block inform-newForm-2">
                  ＊＊12歲以下的孩童可免費入場，請確實填寫人數以利安排座位
                </h2>
                <h2 className="d-sm-none inform-newForm-2">
                  12歲以下的孩童可免費入場，請確實填寫人數以利安排座位
                </h2>
              </div>
              <div className="col-12 pb-lg-0 pb-md-2 pb-4">
                <h1 className="company-name">{names}</h1>
              </div>

              <div className="col-6 d-flex justify-content-end pb-lg-6 pb-md-5 pb-1 phone-5">
                <div className="btn-form">＊領票人姓名：</div>
              </div>
              <div className="col-6">
                <input
                  type="text"
                  onChange={handelUserName}
                  className="btn btn-light btn-lg d-flex input-form"
                  name="username"
                  id="username"
                  required
                />
              </div>
              <div className="col-6 d-flex justify-content-end pb-lg-6 pb-md-5 pb-1 phone-5">
                <div className="btn-form">＊Email：</div>
              </div>
              <div className="col-6">
                <input
                  type="email"
                  onChange={handleEmail}
                  className="btn btn-light btn-lg d-flex input-form font-lg"
                  required
                />
              </div>
              <div className="col-6 d-flex justify-content-end pb-lg-6 pb-md-5 pb-1 phone-5">
                <div className="btn-form">＊大人的人數：</div>
              </div>
              <div className="col-6">
                <input
                  type="number"
                  onChange={handelNumber}
                  className="btn btn-light btn-lg d-flex input-form "
                  name="number"
                  id="number"
                  min="0"
                  required
                />
              </div>
              <div className="col-6 d-flex justify-content-end pb-lg-6 pb-md-5 pb-1 phone-5">
                <div className="btn-form">＊12歲以下孩童的人數：</div>
              </div>
              <div className="col-6">
                <input
                  type="number"
                  onChange={handelKidNumber}
                  className="btn btn-light btn-lg d-flex input-form"
                  name="number"
                  id="number"
                  min="0"
                  placeholder="若不攜帶孩童請填寫０"
                  required
                />
              </div>
              <div className="col-6 d-flex justify-content-end pb-lg-6 pb-md-5 pb-1 phone-5">
                <div className="btn-form btn-yellow">
                  ＊入場電子票券數量總計：
                </div>
              </div>
              <div className="col-6">
                <input
                  type="text"
                  onChange={handelNumber}
                  className="btn btn-light btn-lg d-flex input-form limit"
                  name="number"
                  id="number"
                  value={returnNumber(numbers) + returnNumber(kidNumbers)}
                  min="0"
                  readOnly
                  required
                />
              </div>

              <div className="col-12 d-flex justify-content-center">
                <button className="btn-get-form" onClick={handleLogin}>
                  確認取票
                </button>
              </div>
            </div>
          </div>
          {/* --------------------------------------------------------------------------------------- */}
        </div>
      )}
      <p className="text position-absolute">
        如有票券取得之相關問題，請隨時與我們聯繫，謝謝
        <br />
        客服電話：(02)2792-8788#502
        <br />
        客服信箱：xgen.org.tw@gmail.com
        <br />
        服務時間：週一到週五 09:00~18:00
      </p>
      {showAlert && (
        <CustomAlert message={alertMessage} onClose={handleAlertClose} />
      )}
    </>
  );
}
