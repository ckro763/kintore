"use client";
import Head from 'next/head';
import { useState, FormEvent } from 'react';

interface Record {
  date: string;
  value: number;
  result: string;
}

export default function Home() {
  // TODO: Work with databases
  const [records, setRecords] = useState<Record[]>([
    { date: '2024-12-28 14:00', value: 85, result: '成功' },
  ]);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const date = (form.elements.namedItem('date') as HTMLInputElement).value;
    const value = parseInt((form.elements.namedItem('value') as HTMLInputElement).value);
    const result = (form.elements.namedItem('result') as HTMLSelectElement).value;
    setRecords([...records, { date, value, result }]);
    form.reset();
    setIsPopupOpen(false);
  };

  return (
    <>
      <Head>
        <title>記録管理システム</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <header>
        <h1>untitle</h1>
          <a href="#" onClick={() => setIsPopupOpen(true)}>記録入力</a>
        {/* <nav>
          <a href="#list">記録一覧</a>
          <a href="#graph">グラフ表示</a>
          <a href="#calendar">カレンダー</a>
        </nav> */}
      </header>

      {isPopupOpen && (
        <div className="popup-overlay" onClick={() => setIsPopupOpen(false)}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <h2>記録入力</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="date">日付と時間:</label>
              <input type="datetime-local" id="date" name="date" required />

              <label htmlFor="value">数値:</label>
              <input type="number" id="value" name="value" required />

              <label htmlFor="result">成否:</label>
              <select id="result" name="result">
                <option value="success">成功</option>
                <option value="fail">失敗</option>
              </select>

              <button type="submit">保存</button>
              <button type="button" onClick={() => setIsPopupOpen(false)}>キャンセル</button>
            </form>
          </div>
        </div>
      )}

      <section id="list">
        {/* 4 debugging delete this later */}
        <h2>記録一覧</h2>
        <table>
          <thead>
            <tr>
              <th>日付</th>
              <th>数値</th>
              <th>成否</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr key={index}>
                <td>{record.date}</td>
                <td>{record.value}</td>
                <td>{record.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* write graph here */}
      <section id="graph">
        <h2>グラフ表示</h2>
        <div className="graph-container">
          <canvas id="line-chart"></canvas>
          <canvas id="pie-chart"></canvas>
        </div>
      </section>

      {/* this is a temporaly calender. change later, not google calender. */}
      <section id="calendar">
        <h2>カレンダー</h2>
        <div className="calendar-container">
          <iframe
            src="https://calendar.google.com/calendar/embed?src=ja.japanese%23holiday%40group.v.calendar.google.com&ctz=Asia/Tokyo"
            style={{ border: 0 }}
            width="800"
            height="600"
            frameBorder="0"
            scrolling="no"
          ></iframe>
        </div>
      </section>

      <footer>
        <p>footer</p>
      </footer>

      <style jsx>{`
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .popup {
          background: white;
          padding: 20px;
          color: black;
          border-radius: 8px;
          min-width: 300px;
        }
      `}</style>
    </>
  );
}
