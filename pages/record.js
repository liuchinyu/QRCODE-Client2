import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://qrcode-server-438803.de.r.appspot.com/api/user/";
// const API_URL = "http://localhost:8080/api/user/";

export default function record() {
  const [records, setRecords] = useState("");

  //從RecordDB取得資料
  useEffect(() => {
    async function getRecord() {
      try {
        let result = await axios.get(API_URL + "record");
        let result_arr = result.data;
        // result_arr.map((t, index) => console.log(t));
        setRecords(result_arr);
      } catch (e) {
        console.log(e);
      }
    }
    getRecord();
  }, []);

  const formatDate = (dateString) => {
    if (dateString) {
      const [month, day, year] = dateString.split("/");
      return `${year}/${month}/${day}`;
    } else {
      return "";
    }
  };

  return (
    <>
      {records && (
        <div>
          <table className="table table-striped table-hover">
            <thead>
              <tr className="text-center">
                <th>領票日期(年/月/日)</th>
                <th>捐款人名稱</th>
                <th>領票人姓名</th>
                <th>大人人數</th>
                <th>孩童人數</th>
                <th>領取入場電子票券的張數</th>
                <th>票券剩餘張數</th>
                <th>Buffer區</th>
                <th>座位區域</th>
                <th>座位排數</th>
                <th>座位編號</th>
                <th>空位</th>
                <th>Gmail</th>
                <th>票券號碼</th>
                <th>QRCODE連結</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr key={index} className="text-center ">
                  <td>{formatDate(record.get_ticket_date)}</td>
                  <td>{record.donor}</td>
                  <td>{record.taker}</td>
                  <td>{record.ticket_count}</td>
                  <td>{record.ticket_kid}</td>
                  <td>{record.ticket_count + record.ticket_kid}</td>
                  <td>{record.ticket_left}</td>
                  <td>{record.buffer_area ? "是" : "否"}</td>
                  <td>{record.seat_area}</td>
                  <td>{record.seat_row}</td>
                  <td>{record.seat_number}</td>
                  <td>{record.row_available ? "是" : "否"}</td>
                  <td className="mx-w1">{record.email}</td>
                  <td>XGEN{record.ticket_id}</td>
                  <td className="mx-w1">{record.url}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
