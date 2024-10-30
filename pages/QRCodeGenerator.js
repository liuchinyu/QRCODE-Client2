//--新檔
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import QRCode from "qrcode";

const API_URL = "https://qrcode-server-438803.de.r.appspot.com/api/user/";

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
    router.push({
      pathname: "/company",
    });
  };

  const emailSentRef = useRef(false);
  if (router.query && router.query.company == "company") {
    textToEncode =
      "活動名稱：接棒未來 揮出夢想\n公司名稱：" +
      names +
      "\n領票人姓名：" +
      username +
      "\n大人人數：" +
      numbers +
      "\n孩童人數：" +
      kidNumbers +
      "\n座位區域：" +
      seat +
      "區";
  } else if (router.query && router.query.company == "person") {
    textToEncode =
      "活動名稱：接棒未來 揮出夢想\n捐贈人名稱：" +
      names +
      "\n領票人姓名：" +
      username +
      "\n大人人數：" +
      numbers +
      "\n孩童人數：" +
      kidNumbers +
      "\n座位區域：" +
      seat +
      "區";
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
      const response = await fetch(API_URL + "get-ticket-id");
      const data = await response.json();
      const numericData = Number(data);
      setTicket(numericData);

      // 生成 QRCODE並發送郵件
      if (textToEncode.trim() && names && numbers && data) {
        const qrPromises = Array.from(
          { length: numbers + kidNumbers },
          (_, index) => {
            const individualText = `${textToEncode}\n票券號碼：${
              "XGEN" + (numericData + index + 1)
            }`;
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
          console.error("郵件發送失敗");
        }
      }
    } catch (error) {
      console.error("Server連接失敗", error);
    }
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
        <div className="background-container position-relative d-flex justify-content-center align-items-center">
          <div className="background-ticket-2"></div>
          <div className="d-flex flex-column align-items-center w-75">
            {numbers + kidNumbers == 1 && (
              <div className="inform-qrcode-lg inform-qrcode-md inform-qrcode-sm inform-qrcode text-center">
                領票成功!已領取1張入場電子票券！
                <br />
                已將領取的入場電子票券QRCODE發送至 {emails}，請至信箱確認。
                <br />
                活動當天於驗票口出示入場電子票券QRCODE即可進場，期待您的蒞臨!
                <br />
                *大人入場需出示入場電子票券，12歲以下的孩童可直接入場
              </div>
            )}
            {numbers + kidNumbers > 1 && (
              <div className="inform-qrcode-lg inform-qrcode-md inform-qrcode-sm inform-qrcode text-center">
                領票成功!已領取{numbers + kidNumbers}張入場電子票券！
                <br />
                已將領取的入場電子票券QRCODE發送至 {emails}，請至信箱確認。
                <br />
                請將入場電子票券轉發給其它出席人員，每個QRCODE僅限1人使用
                <br />
                活動當天於驗票口出示入場電子票券QRCODE即可進場，期待您的蒞臨!
                <br />
                *大人入場需出示入場電子票券，12歲以下的孩童可直接入場
              </div>
            )}
            <div className="service-lg service-md service-sm service mt-4">
              如有票券取得之相關問題，請隨時與我們聯繫，謝謝
              <br />
              客服電話：(02)2792-8788#502
              <br />
              客服信箱：xgen.org.tw@gmail.com
              <br />
              服務時間：週一到週五 09:00~18:00
            </div>

            <button
              className="btn-login btn-md-get-ticket btn-get-ticket"
              onClick={handleLogin}
            >
              繼續取票
            </button>

            {qrCodeUrl.length > 0 && (
              <div className="qr-codes-container qr-codes-lg-container qr-codes-md-container d-flex justify-content-center flex-wrap">
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
