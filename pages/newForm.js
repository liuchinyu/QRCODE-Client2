import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";

export default function newForm() {
  const router = useRouter();
  const [userData, setUserData] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");

  const [names, setName] = useState(""); //公司名稱
  const [seat, setSeat] = useState(""); //座位
  const [ticket, setTicket] = useState(""); //剩餘票券
  const [message, setMessage] = useState(""); //錯誤訊息

  const [username, setUsername] = useState(""); //領票人
  const [emails, setEmail] = useState(""); //領票信箱
  const [numbers, setNumber] = useState(""); //領票張數
  const [currentUser, setCurrentUser] = useState("");

  //判斷是否有登入過
  useEffect(() => {
    setCurrentUser(JSON.parse(localStorage.getItem("user")));
    // console.log("currentUser", JSON.parse(localStorage.getItem("user")).token); //有成功get到item
  }, []);

  useEffect(() => {
    if (router.isReady && router.query.userData) {
      // 接收並解析資料
      setUserData(JSON.parse(router.query.userData));
      setPassword(router.query.password);
    }
  }, [router.query, router.query.ticket]);

  useEffect(() => {
    if (userData) {
      setName(userData[1]);
      setSeat(userData[4]);
      setTicket(userData[3]);
      setCompany(userData[0]);
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
    if (!username) {
      errorMessage += "請輸入領票人姓名\n";
    }
    if (!emails) {
      errorMessage += "請輸入領票人信箱\n";
    } else if (!emailRegex.test(emails)) {
      errorMessage += "信箱格式不正確\n";
    }
    if (numbers > ticket) {
      errorMessage += "領取票券大於可領取數量\n";
    } else if (numbers == 0) {
      errorMessage += "請輸入要領取的票券數量\n";
    } else {
      ticket_left = ticket - numbers; //紀錄剩餘張數
    }
    setMessage(errorMessage);
    if (errorMessage.length == 0) {
      // console.log("正是階段....", currentUser.token);
      let result = await axios.post(
        "http://localhost:8080/api/user/update_data",
        {
          password,
          ticket_left,
        },
        {
          headers: {
            Authorization: currentUser.token,
          },
        }
      );

      router.push({
        pathname: "/QRCodeGenerator",
        query: { company, names, seat, username, numbers, emails },
      });
    } else {
      alert(errorMessage);
    }
  };

  return (
    <>
      {!currentUser && (
        <div>
          <p>您必須先進行身分驗證</p>
          <button
            className="btn btn-primary btn-lh backToLogin"
            onClick={backToLogin}
            // onClick={handelTakeToLogin}
          >
            回到身分驗證頁面
          </button>
        </div>
      )}
      {currentUser && (
        <div className="container vh-90 position-relative d-flex justify-content-center align-items-center mt-4 overflow-hidden ">
          <div className="background-ticket-2"></div>
          <div className="content-form d-flex flex-wrap justify-content-center">
            <div className="row">
              <div className="col-12 d-flex justify-content-center">
                <h2 className="inform-lg-newForm inform-md-newForm inform-newForm">
                  ＊＊請確認出席人數再進行取票，每張電子票券僅限１人使用
                </h2>
              </div>
              <div className="col-12 pb-lg-0 pb-md-2 pb-4">
                <h1 className="company-name-lg company-name-md company-name ">
                  {names}
                </h1>
              </div>

              <div className="col-6 d-flex justify-content-end pb-lg-4 pe-5 pb-md-3 pb-2">
                <div className="btn-lg-form btn-md-form btn-form">
                  ＊需領取的數量：
                </div>
              </div>
              <div className="col-6">
                <input
                  type="number"
                  onChange={handelNumber}
                  className="btn btn-light btn-lg d-flex input-md-form input-form"
                  name="number"
                  id="number"
                  min="0"
                  // placeholder="請輸入要領取的張數"
                  required
                />
              </div>
              <div className="col-6 d-flex justify-content-end pb-lg-4 pe-5 pb-md-3 pb-2">
                <div className="btn-lg-form btn-md-form btn-form">
                  ＊領票人姓名：
                </div>
              </div>
              <div className="col-6">
                <input
                  type="text"
                  onChange={handelUserName}
                  className="btn btn-light btn-lg d-flex input-md-form input-form"
                  // className="form-control"
                  name="username"
                  id="username"
                  // placeholder="輸入姓名"
                  required
                />
              </div>
              <div className="col-6 d-flex justify-content-end pb-lg-4 pe-5 pb-md-3 pb-2">
                <div className="btn-lg-form btn-md-form btn-form">
                  ＊Gmail：
                </div>
              </div>
              <div className="col-6">
                <input
                  type="email"
                  onChange={handleEmail}
                  className="btn btn-light btn-lg d-flex input-md-form input-form"
                  // placeholder="gmail"
                  required
                />
              </div>
              <div className="col-12 d-flex justify-content-center">
                <button
                  className="btn-form btn-get-lg-form btn-get-md-form btn-get-form"
                  onClick={handleLogin}
                >
                  確認取票
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
