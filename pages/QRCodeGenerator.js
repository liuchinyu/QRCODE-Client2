import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import QRCode from "qrcode";
import CustomAlert from "./customAlert";

const API_URL = "https://qrcode-server-438803.de.r.appspot.com/api/user/";
// const API_URL = "http://localhost:8080/api/user/";
// console.log(1);
const QRCodePage = () => {
  const [qrCodeUrl, setQRCodeUrl] = useState("");
  const [names, setName] = useState(""); //公司名稱
  const [seat, setSeat] = useState(""); //座位
  const [company, setCompany] = useState("");
  const [username, setUsername] = useState(""); //領票人姓名
  const [emails, setEmail] = useState(""); //領票信箱
  const [numbers, setNumber] = useState(""); //大人領票張數
  const [kidNumbers, setKidNumber] = useState(""); //小孩人數
  const [ticketNum, setTicket] = useState("");
  const [ticketLeft, setTicketLeft] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const router = useRouter();
  // 錯誤訊息
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  let textToEncode = "";

  useEffect(() => {
    setCurrentUser(JSON.parse(localStorage.getItem("user")));
  }, []);

  //回到身分判斷頁面
  const backToLogin = () => {
    router.push({
      pathname: "/company",
    });
  };

  const handleLogin = () => {
    setTimeout(() => {
      router.push({
        pathname: "/company",
      });
    }, 1000);
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const emailSentRef = useRef(false);

  if (router.query && router.query.company == "company") {
    textToEncode =
      "活動名稱：接棒未來 揮出夢想\n公司名稱：" +
      names +
      "\n領票人姓名：" +
      username;
  } else if (router.query && router.query.company == "person") {
    textToEncode =
      "活動名稱：接棒未來 揮出夢想\n捐贈人名稱：" +
      names +
      "\n領票人姓名：" +
      username;
  }
  //儲存拋轉資料
  useEffect(() => {
    if (router.isReady && router.query) {
      setCompany(router.query.company);
      setName(router.query.names);
      setSeat(router.query.seat);
      setUsername(router.query.username);
      setEmail(router.query.emails);
      setNumber(Number(router.query.numbers));
      setTicketLeft(Number(router.query.ticket_left));
      setKidNumber(Number(router.query.kidNumbers));
    }
  }, [router.query]);

  useEffect(() => {
    async function fetchDataAndGenerateQR() {
      // 取得當前最小的票券編號
      const response = await fetch(API_URL + "get-ticket-id");
      const data = await response.json();
      const numericData = Number(data);
      setTicket(numericData);

      let seat_data = "";
      let seatAreas = "";
      if (textToEncode.trim() && names && numbers && data) {
        const seat_info = await fetch(API_URL + "get-seat-number", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            qrCodeUrl,
            company,
            names,
            seat,
            username,
            numbers,
            ticketLeft,
            kidNumbers,
            emails,
            ticketNum,
          }),
        });
        seat_data = await seat_info.json();
        seatAreas = seat_data.seatAreas; // 獲取座位區域陣列
      }
      console.log("seat_data", seat_data);
      console.log("seatAreas", seatAreas);
      // 生成 QRCODE並發送郵件
      if (
        textToEncode.trim() &&
        names &&
        numbers &&
        data &&
        seatAreas &&
        seatAreas.length > 0
      ) {
        const qrPromises = Array.from(
          { length: numbers + kidNumbers },
          (_, index) => {
            const individualText = `${textToEncode}\n座位：${
              seatAreas[index].seat +
              "區" +
              seatAreas[index].seat_row +
              "排" +
              seatAreas[index].seat_number +
              "號"
            }\n票券號碼：${
              "XGEN" + (numericData + index + 1)
            }\n大人人數：${numbers}\n孩童人數：${kidNumbers}
            `;
            return new Promise((resolve, reject) => {
              QRCode.toDataURL(
                individualText,
                {
                  width: 256,
                  margin: 2,
                },
                (err, url) => {
                  if (err) reject(err);
                  else resolve(url);
                }
              );
            });
          }
        );

        Promise.all(qrPromises)
          .then((urls) => {
            setQRCodeUrl(urls);
            if (!emailSentRef.current) {
              sendEmailWithQRCode(urls, data);
              emailSentRef.current = true;
            }
          })
          .catch((err) => console.error(err));
      }
    }

    if (router.isReady && router.query) {
      fetchDataAndGenerateQR();
    }
  }, [router.isReady, router.query, textToEncode, names, numbers]);

  const sendEmailWithQRCode = async (qrCodeUrl, ticketNum) => {
    ticketNum = Number(ticketNum);
    try {
      if (currentUser) {
        const response = await fetch(API_URL + "user-send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            qrCodeUrl,
            company,
            names,
            seat,
            username,
            numbers,
            ticketLeft,
            kidNumbers,
            emails,
            ticketNum,
          }),
        });

        if (response.ok) {
          localStorage.removeItem("user");
        } else {
          setShowAlert(true);
          setAlertMessage("票券已全數領取完畢，如有問題請洽相關窗口，謝謝!");
          setCurrentUser("");
          localStorage.removeItem("user");
        }
      }
    } catch (error) {
      console.error("Server連接失敗", error);
    }
  };

  return (
    <>
      {showAlert && (
        <CustomAlert message={alertMessage} onClose={handleAlertClose} />
      )}

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
        <div className="background-container phone-hidden position-relative d-flex justify-content-center align-items-center">
          <div className="background-ticket-2"></div>
          <div className="d-flex flex-column align-items-center w-75">
            {numbers + kidNumbers == 1 && (
              <div className="inform-qrcode text-center">
                領票成功!已領取1張入場電子票券！
                <br />
                已將領取的入場電子票券QRCODE發送至 {emails}，請至信箱確認。
                <br />
                活動當天於驗票口出示入場電子票券QRCODE即可進場，期待您的蒞臨!
              </div>
            )}
            {numbers + kidNumbers > 1 && (
              <div className="inform-qrcode text-center">
                領票成功!已領取{numbers + kidNumbers}張入場電子票券！
                <br />
                已將領取的入場電子票券QRCODE發送至 {emails}，請至信箱確認。
                <br />
                請將入場電子票券轉發給其它出席人員，每個QRCODE僅限1人使用
                <br />
                活動當天於驗票口出示入場電子票券QRCODE即可進場，期待您的蒞臨!
              </div>
            )}
            <div className="service mt-4">
              如有票券取得之相關問題，請隨時與我們聯繫，謝謝
              <br />
              客服電話：(02)2792-8788#502
              <br />
              客服信箱：xgen.org.tw@gmail.com
              <br />
              服務時間：週一到週五 09:00~18:00
            </div>

            <button className="btn-login" onClick={handleLogin}>
              繼續取票
            </button>

            {qrCodeUrl.length > 0 && (
              <div className="qr-codes-container d-flex justify-content-center flex-wrap">
                {qrCodeUrl.map((url, index) => (
                  <div
                    key={index}
                    className="position-relative qr-code-item text-center my-4 "
                  >
                    <p className="qr-code-title qr-code-md-title mb-2">
                      入場票券QROCDE{index + 1}
                    </p>
                    <img
                      src={url}
                      className="qrcode pe-3"
                      alt={`QR Code ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default QRCodePage;
