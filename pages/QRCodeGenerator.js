import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import QRCode from "qrcode";
import Image from "next/image";

const QRCodePage = () => {
  const [qrCodeUrl, setQRCodeUrl] = useState("");
  const [names, setName] = useState(""); //公司名稱
  const [seat, setSeat] = useState(""); //座位
  const [username, setUsername] = useState(""); //領票人姓名
  const [emails, setEmail] = useState(""); //領票信箱
  const [numbers, setNumber] = useState(""); //領票張數

  const router = useRouter();
  let textToEncode = "";
  const emailSentRef = useRef(false);
  if (router.query) {
    textToEncode =
      "活動名稱：接棒未來 揮出夢想\n公司名稱：" +
      names +
      "\n領票人姓名：" +
      username +
      "\n座位區域：" +
      seat +
      "區\n" +
      "取票數量：" +
      numbers;
  }
  //儲存拋轉資料
  useEffect(() => {
    if (router.isReady && router.query) {
      setName(router.query.names);
      setSeat(router.query.seat);
      setUsername(router.query.username);
      setEmail(router.query.emails);
      setNumber(router.query.numbers);
    }
  }, [router.query]);

  useEffect(
    () => {
      if (textToEncode.trim() && names) {
        QRCode.toDataURL(
          textToEncode,
          {
            width: 256,
            margin: 2,
          },
          (err, url) => {
            if (err) {
              console.error(err);
              return;
            }
            setQRCodeUrl(url);

            // 檢查 email 是否已經發送過，確保只發送一次
            if (!emailSentRef.current) {
              sendEmailWithQRCode(url);
              emailSentRef.current = true; // 標記為已發送
            }
          }
        );
      }
    },
    [textToEncode],
    names
  );

  const sendEmailWithQRCode = async (qrCodeUrl) => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/user/user-send-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            qrCodeUrl,
            names,
            seat,
            username,
            numbers,
            emails,
          }),
        }
      );

      if (response.ok) {
        console.log("Email sent successfully");
      } else {
        console.error("Failed to send emails");
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  return (
    <div className="vh-90 position-relative d-flex justify-content-center align-items-center mt-4">
      <div className="background-ticket-2">
        <div className="d-flex justify-content-center">
          <div className="inform-qrcode-lg inform-qrcode-md inform-qrcode-sm inform-qrcode text-center">
            領票成功!
            <br />
            已將領取的入場電子票券QRCODE發送至 {emails}，請至信箱確認。
            <br />
            再請協助將入場電子票券轉發給其它出席人員，每個QRCODE僅限1人使用
            <br />
            活動當天於驗票口出示入場電子票券QRCODE即可進場，期待您的蒞臨!
          </div>
          {qrCodeUrl && (
            <div className="w-75">
              <div className="test2 d-flex w-75 justify-content-evenly">
                <p className="test">入場票券QRCODE1</p>
                <p className="test">入場票券QRCODE1</p>
              </div>
              <div className="test3 d-flex w-75 justify-content-evenly">
                <img src={qrCodeUrl} className="qrcode" alt="QR Code" />
                <img src={qrCodeUrl} className="qrcode" alt="QR Code" />
              </div>
            </div>
          )}
          <div className="service-lg service-md service">
            如有票券取得之相關問題，請隨時與我們聯繫，謝謝
            <br />
            客服電話：(02)2792-8788#502
            <br />
            客服信箱：xgen.org.tw@gmail.com
            <br />
            服務時間：週一到週五 09:00~18:00
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodePage;
