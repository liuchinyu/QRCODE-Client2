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
            setQRCodeUrl(url); //產生QRCODE的Data URL

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
    <div className="container mt-4">
      <div className="position-relative text-center">
        {/* 圖片 */}
        <Image
          src="/identify.png" // 確保圖片路徑正確，放在 public 資料夾中
          alt="QRCODE"
          width={600}
          height={300}
          className="img-fluid"
          style={{ width: "80vw", height: "auto" }}
        />
      </div>
      <div className="row">
        <div className="col">
          <div
            className="position-absolute start-50 translate-middle-x"
            style={{
              color: "red",
              fontSize: "1.3rem",
              fontWeight: "bold",
              top: "15%",
              textAlign: "center",
              width: "100%",
            }}
          >
            領票成功!
            <br />
            已將票券發送至 {emails}，請至信箱確認。
            <br />
            請妥善保存QRCODE憑證，活動當天將下方QRCODE於驗票口出示，期待您的蒞臨!
          </div>
        </div>
        <div className="col">
          <div>
            {qrCodeUrl && (
              <img
                src={qrCodeUrl}
                className="position-absolute"
                alt="QR Code"
                style={{
                  color: "black",
                  fontSize: "1.3rem",
                  fontWeight: "bold",
                  top: "38%",
                  left: "44%",
                  width: "10rem",
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodePage;
