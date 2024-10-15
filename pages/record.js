import { useState, useEffect } from "react";
import axios from "axios";

export default function record() {
  const [records, setRecords] = useState("");

  useEffect(() => {
    async function getRecord() {
      try {
        let result = await axios.get("http://localhost:8080/api/user/record");
        console.log("result.data", result.data);
        let result_arr = result.data;
        result_arr.map((t, index) => console.log(t));
        setRecords(result_arr);
      } catch (e) {
        console.log(e);
      }
    }
    getRecord();
  }, []);

  return (
    <>
      {records && (
        <div>
          <table className="table table-striped table-hover">
            <thead>
              <tr className="text-center">
                <th className="col-1">領票日期(年/月/日)</th>
                <th className="col-1">捐款人名稱</th>
                <th className="col-1">領票人姓名</th>
                <th className="col-1">領取張數</th>
                <th className="col-1">座位區域</th>
                <th>Gmail</th>
                <th>票券號碼</th>
                <th>QRCODE連結</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr key={index} className="text-center ">
                  <td>{record.get_ticket_date}</td>
                  <td>{record.donor}</td>
                  <td>{record.taker}</td>
                  <td>{record.ticket_count}</td>
                  <td>{record.seat}</td>
                  <td>{record.email}</td>
                  <td>{record.ticket_id}</td>
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
