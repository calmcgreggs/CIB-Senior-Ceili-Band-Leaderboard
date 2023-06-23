import React, { useState, useContext, useEffect } from "react";
import {
  collection,
  connectFirestoreEmulator,
  Firestore,
  GeoPoint,
  getDocs,
  getFirestore,
  Timestamp,
} from "firebase/firestore";
import firebase, { initializeApp } from "firebase/app";
import FlipMove from "react-flip-move";

interface bandresults {
  Name: String;
  Points: number[];
  Style?: string;
}

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcarkkHPDbQbxOhPZGPpK_uCshX1zfTc4",
  authDomain: "seniorceiliband.firebaseapp.com",
  databaseURL:
    "https://seniorceiliband-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "seniorceiliband",
  storageBucket: "seniorceiliband.appspot.com",
  messagingSenderId: "758207916155",
  appId: "1:758207916155:web:2ffb82e239d2a684835ade",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore();
connectFirestoreEmulator(db, "127.0.0.1", 8080);

function compare(a: bandresults, b: bandresults) {
  const atotal = a.Points.reduce(
    (partial, a) => partial + (a == -1 ? 0 : a),
    0
  );
  const btotal = b.Points.reduce(
    (partial, a) => partial + (a == -1 ? 0 : a),
    0
  );
  if (atotal < btotal) {
    return 1;
  } else if (atotal > btotal) {
    return -1;
  } else {
    if (a.Name > b.Name) {
      return 1;
    } else if (a.Name < b.Name) {
      return -1;
    } else {
      return 0;
    }
  }
}

const Leaderboard = () => {
  const [results, setResults] = useState<bandresults[]>([]);

  async function getResults() {
    if (db) {
      const data = await getDocs(collection(db, "results"));
      const re: bandresults[] = [];
      data.forEach((each) => {
        re.push({
          Name: each.data()["Name"],
          Points: each.data()["Points"],
          Style: each.data()["Style"],
        } as bandresults);
      });
      re.sort(compare);
      setResults(re);
    }
  }

  useEffect(() => {
    setInterval(() => {
      getResults();
    }, 500);
  });

  useEffect(() => {
    getResults();
  }, []);

  //   useEffect(() => {
  //     let backup = [
  //       {
  //         Name: "St Roch's Ceili Band",
  //         Points: [11, -1, -1, -1, 11],
  //         Style: "bg-red-600 text-white",
  //       },
  //       {
  //         Name: "St Patrick's CCE",
  //         Points: [5, -1, -1, -1, 5],
  //         Style: "bg-green-200",
  //       },
  //       {
  //         Name: "St James The Great Ceili Band",
  //         Points: [9, -1, -1, -1, 9],
  //         Style: "bg-green-500 text-white",
  //       },
  //     ] as bandresults[];
  //     backup.sort(compare);
  //     setResults(backup);
  //     console.log(results);
  //   }, []);
  return (
    <div className="w-full whitespace-nowrap text-6xl text-black font-light">
      <div className="flex flex-row my-10 mx-20">
        <div className=" rounded-xl px-40 w-[31vw] text-center font-extrabold mr-4">
          Band Name
        </div>
        {results.length > 0
          ? results[0].Points.map((p, i) => {
              return (
                <div className=" px-5 rounded-xl text-center flex ml-[6vw] font-extrabold">
                  <h1 className="m-auto w-[1vw]">{i + 1}</h1>
                </div>
              );
            })
          : ""}
        <div className=" px-5 rounded-xl text-center flex ml-20 font-extrabold">
          <h1 className="m-auto w-[10vw]">Total</h1>
        </div>
      </div>
      <FlipMove
        staggerDurationBy="30"
        duration={500}
        enterAnimation="accordionVertical"
        leaveAnimation="accordionVertical"
      >
        {results.map((e, i) => {
          return (
            <div
              className="flex flex-row w-full mx-10 h-10 my-10 text-5xl"
              key={i + 1}
            >
              <div
                className={
                  (e.Style ? e.Style : "bg-white text-black") +
                  " px-5 rounded-xl text-center flex h-fit mr-10 py-1"
                }
              >
                <h1 className="m-auto w-[32vw]">{e.Name}</h1>
              </div>
              {e.Points.map((point, ind) => {
                return (
                  <div
                    className={
                      (e.Style ? e.Style : "text-black bg-white") +
                      " px-5 rounded-xl text-center flex ml-10 h-fit py-1"
                    }
                    key={ind}
                  >
                    <h1 className="m-auto w-[5vw]">
                      {point == -1 ? "-" : point}
                    </h1>
                  </div>
                );
              })}
              <div
                className={
                  (e.Style ? e.Style : "text-black bg-white") +
                  " px-5 rounded-xl text-center flex ml-10 h-fit py-1"
                }
              >
                <h1 className="m-auto w-[10vw]">
                  {e.Points.reduce(
                    (partial, a) => partial + (a == -1 ? 0 : a),
                    0
                  )}
                </h1>
              </div>
            </div>
          );
        })}
      </FlipMove>
    </div>
  );
};

export default Leaderboard;
