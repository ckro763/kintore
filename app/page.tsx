"use client";
import Head from 'next/head';
import { useState, FormEvent } from 'react';
import { UserDocument } from '@/lib/firestore';
import { useSession } from 'next-auth/react';
import Login from './components/Login';
import Logout from './components/Logout';
import { GeneratedGraph } from './components/graphGenerator';

interface Record {
  date: string;
  type: string;
  value: number; 
}

export default function Home() {
  // User link by google account
  const { data: session, status } = useSession();
  // TODO: Work with databases -> firestore

  const [records, setRecords] = useState<Record[]>([
    { date: '2024-12-28 14:00',type: "something" ,value: 85},
  ]);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    let date = (form.elements.namedItem('date') as HTMLInputElement).value;
    if (date === "") {
      const now = new Date();
      date = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    } 
    date = date.replace("T", " ");


    const type = (form.elements.namedItem('type') as HTMLSelectElement).value;
    const value = parseInt((form.elements.namedItem('value') as HTMLInputElement).value);
    setRecords([...records, { date, type, value }]);
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
        <h1>untitled</h1>
          <button onClick={() => setIsPopupOpen(true)}>記録入力</button>
        {/* <nav>
          <a href="#list">記録一覧</a>
          <a href="#graph">グラフ表示</a>
          <a href="#calendar">カレンダー</a>
        </nav> */}
      </header>
      {status === 'authenticated' ? (
        <div>
          <p>expires: {session.expires}</p>
          <p>name: {session.user?.name}</p>
          <p>email: {session.user?.email}</p>
          <p>id: {session.user?.id}</p>
          <p>data: {session.user.account}</p>
          <div>
            <Logout />
          </div>
        </div>
      ) : (
        <Login />
      )}
      {isPopupOpen && (
        <div className="popup-overlay" onClick={() => setIsPopupOpen(false)}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <h2>記録入力</h2>
            <form onSubmit={handleSubmit}>
              <div>
              <label htmlFor="date">date, time:</label>
                <input type="datetime-local" id="date" name="date" />
              </div>
              <div>
              <label htmlFor="type">type:</label>
              <select id="type" name="type">
                <option value="something">something</option>
                <option value="another">another</option>
              </select>

              <label htmlFor="value">amount:</label>
              <input type="number" id="value" name="value" required />
              </div>


              <button type="submit">save</button>
              <button type="button" onClick={() => setIsPopupOpen(false)}>cancel</button>
            </form>
          </div>
        </div>
      )}

      <section id="list">
        {/* 4 debugging, delete it later */}
        <h2>record</h2>
        <table>
          <thead>
            <tr>
              <th>date</th>
              <th>type</th>
              <th>amount</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr key={index}>
                <td>{record.date}</td>
                <td>{record.type}</td>
                <td>{record.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* write graph here */}
      <section id="graph">
        <h2>グラフ表示</h2>
        <GeneratedGraph/>
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
