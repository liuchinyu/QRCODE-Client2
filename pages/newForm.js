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
  const [numbers, setNumber] = useState(""); //大人領票張數
  const [kidNumbers, setKidNumber] = useState(""); //小孩人數
  const [currentUser, setCurrentUser] = useState("");

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
      setCompany(userData.type);
    }
  }, [userData]);

  const handelNumber = (e) => {
    setNumber(e.target.value);
  };
  const handelKidNumber = (e) => {
    setKidNumber(e.target.value);
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
    if (!kidNumbers) {
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
    if (numbers > ticket) {
      errorMessage += "領取票券大於可領取數量\n";
    } else if (numbers == 0) {
      errorMessage += "請輸入要領取的票券數量\n";
    } else {
      ticket_left = ticket - numbers; //紀錄剩餘張數
    }
    setMessage(errorMessage);
    if (errorMessage.length == 0) {
      let result = await axios.post(
        "http://localhost:8080/api/user/update_data",
        {
          password,
          ticket_left,
        },
        {
          headers: {
            Authorization: currentUser,
          },
        }
      );

      router.push({
        pathname: "/QRCodeGenerator",
        query: { company, names, seat, username, numbers, kidNumbers, emails },
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
          >
            回到身分驗證頁面
          </button>
        </div>
      )}
      {currentUser && (
        <div className="container md-container vh-90 position-relative d-flex justify-content-center align-items-center mt-4 overflow-hidden ">
          <div className="background-ticket-2"></div>
          <div className="content-form d-flex flex-wrap justify-content-center">
            <div className="row">
              <div className="col-12 d-flex justify-content-center">
                <h2 className="inform-lg-newForm inform-md-newForm inform-newForm">
                  ＊＊請確認當天出席人數再進行取票，每張入場電子票券僅限１位大人使用
                </h2>
                <h2 className="inform-lg-newForm-2 inform-md-newForm-2 inform-newForm-2">
                  ＊＊12歲以下的孩童可免費入場，請確實填寫人數以利安排座位
                </h2>
              </div>
              <div className="col-12 pb-lg-0 pb-md-2 pb-4">
                <h1 className="company-name-lg company-name-md company-name ">
                  {names}
                </h1>
              </div>

              <div className="col-6 d-flex justify-content-end pb-lg-6 pb-md-5 pb-2">
                <div className="btn-lg-form btn-md-form btn-form">
                  ＊領票人姓名：
                </div>
              </div>
              <div className="col-6">
                <input
                  type="text"
                  onChange={handelUserName}
                  className="btn btn-light btn-lg d-flex input-md-form input-form "
                  name="username"
                  id="username"
                  placeholder="輸入姓名"
                  required
                />
              </div>
              <div className="col-6 d-flex justify-content-end pb-lg-6 pb-md-5 pb-2">
                <div className="btn-lg-form btn-md-form btn-form">
                  ＊Email：
                </div>
              </div>
              <div className="col-6">
                <input
                  type="email"
                  onChange={handleEmail}
                  className="btn btn-light btn-lg d-flex input-md-form input-form "
                  placeholder="email"
                  required
                />
              </div>
              <div className="col-6 d-flex justify-content-end pb-lg-6 pb-md-5 pb-2">
                <div className="btn-lg-form btn-md-form btn-form">
                  ＊大人的人數：
                </div>
              </div>
              <div className="col-6">
                <input
                  type="number"
                  onChange={handelNumber}
                  className="btn btn-light btn-lg d-flex input-md-form input-form "
                  name="number"
                  id="number"
                  min="0"
                  placeholder="請輸入要領取的張數"
                  required
                />
              </div>
              <div className="col-6 d-flex justify-content-end pb-lg-6 pb-md-5 pb-2">
                <div className="btn-lg-form btn-md-form btn-form">
                  ＊12歲以下孩童的人數：
                </div>
              </div>
              <div className="col-6">
                <input
                  type="number"
                  onChange={handelKidNumber}
                  className="btn btn-light btn-lg d-flex input-md-form input-form"
                  name="number"
                  id="number"
                  min="0"
                  placeholder="若不攜帶孩童請填寫０"
                  required
                />
              </div>
              <div className="col-6 d-flex justify-content-end pb-lg-6 pb-md-5 pb-2 ">
                <div className="btn-lg-form btn-md-form btn-form">
                  ＊可領取的入場電子票券數量：
                </div>
              </div>
              <div className="col-6">
                <input
                  type="text"
                  onChange={handelNumber}
                  className="btn btn-light btn-lg d-flex input-lg-form input-md-form input-form "
                  name="number"
                  id="number"
                  value={ticket}
                  min="0"
                  readOnly
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
