import React, { useState, useContext, useEffect } from "react";
import {
  addDoc,
  collection,
  connectFirestoreEmulator,
  deleteDoc,
  doc,
  Firestore,
  GeoPoint,
  getDocs,
  getFirestore,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import firebase, { initializeApp } from "firebase/app";

import styles from "../data/styles.json";

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

const Results = () => {
  const [results, setResults] = useState<bandresults[]>([]);

  const [password, setPassword] = useState("");

  const [pass, setPass] = useState<String>();

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
      setResults(re);
    }
  }

  //@ts-ignore
  async function addResult(result: bandresults) {
    if (db) {
      const resultsRef = doc(db, "results", result.Name as string);
      await setDoc(resultsRef, {
        Name: result.Name,
        Points: new Array(adj).fill(-1),
        Style: result.Style,
      } as bandresults);
    }
  }

  //@ts-ignore
  async function updatePoints(result: bandresults) {
    if (db) {
      const resultsRef = doc(db, "results", result.Name as string);
      await setDoc(resultsRef, {
        Name: result.Name,
        Points: result.Points,
        Style: result.Style,
      });
    }
  }

  const [adj, setAdj] = useState(5);

  // //@ts-ignore
  // async function addResult(result: bandresults) {
  //   if (db) {
  //     const resultRef = doc(db, "results", result.Name as string);
  //     await setDoc(resultRef, {
  //       Name: result.Name,
  //       Points: [],
  //       Style: result.Style,
  //     } as bandresults);
  //   }
  // }

  async function deleteBand(result: bandresults) {
    await deleteDoc(doc(db, "results", result.Name as string));
  }

  useEffect(() => {
    results.forEach((each) => {
      if (each.Points.reduce((partial, a) => partial + (a < 0 ? 0 : a), 0) > 0)
        updatePoints(each);
    });
  }, [results]);

  const [locked, setLocked] = useState(true);

  return (
    <div className="flex flex-row">
      <button
        className="absolute w-screen bg-red-600 bottom-0 text-white"
        onClick={async () => {
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
            re.forEach((each) => {
              deleteBand(each);
            });
          }

          window.location.reload();
        }}
      >
        Delete All Bands
      </button>
      {locked ? (
        <div className="w-screen">
          <div className="">
            <h2 className="w-full text-3xl font-bold leading-tight text-center">
              Add the bands
            </h2>

            <div className=" ml-20 mt-20">
              <label className="mr-20 mt-52">Number of Adjudicators</label>
              <input
                className="text-black"
                type="number"
                value={adj}
                onChange={(e) => {
                  setAdj(
                    isNaN(parseInt(e.target.value))
                      ? 5
                      : parseInt(e.target.value)
                  );
                }}
              ></input>
            </div>

            {results.length > 1
              ? results.map((r, i) => {
                  return (
                    <div
                      key={i}
                      className="flex flex-row mt-10 [&>input]:ml-20 [&>label]:ml-32"
                    >
                      <label htmlFor="name" className="block mb-1 ml-1">
                        Name
                      </label>
                      <select
                        id="Band"
                        placeholder="Name"
                        name="Band"
                        required
                        value={results[i].Name as string}
                        onChange={(e) => {
                          setResults(
                            results.map((band, index) => {
                              if (index == i) {
                                return {
                                  ...band,
                                  Name: e.target.value,
                                  Style: styles.bands.find(
                                    (elem) => elem.Name == e.target.value
                                  )?.Style,
                                };
                              } else {
                                return band;
                              }
                            })
                          );
                        }}
                        className="text-black block w-[30vw] p-2 rounded focus:outline-none focus:ring focus:ring-opacity-25 focus:ring-violet-400 dark:bg-gray-800 bg-white ml-20 mb-1"
                      >
                        {styles.bands.map((each) => {
                          return <option value={each.Name}>{each.Name}</option>;
                        })}
                      </select>
                      <input
                        id="Band"
                        type="text"
                        placeholder="Name"
                        name="Band"
                        required
                        value={results[i].Name as string}
                        onChange={(e) => {
                          setResults(
                            results.map((band, index) => {
                              if (index == i) {
                                return { ...band, Name: e.target.value };
                              } else {
                                return band;
                              }
                            })
                          );
                        }}
                        className="text-black block w-[30vw] p-2 rounded focus:outline-none focus:ring focus:ring-opacity-25 focus:ring-violet-400 dark:bg-gray-800"
                      />
                      <label htmlFor="email" className=" block mb-1 ml-1">
                        Style
                      </label>
                      <input
                        id="Style"
                        type="text"
                        placeholder="Style (Leave Blank If Not Calum)"
                        required
                        value={results[i].Style as string}
                        name="Style"
                        onChange={(e) => {
                          setResults(
                            results.map((band, index) => {
                              if (index == i) {
                                return { ...band, Style: e.target.value };
                              } else {
                                return band;
                              }
                            })
                          );
                        }}
                        className=" text-black block w-[30vw] p-2 rounded focus:outline-none focus:ring focus:ring-opacity-25 focus:ring-violet-400 dark:bg-gray-800"
                      />
                    </div>
                  );
                })
              : ""}
            <div className="mt-10 ml-20">
              <button
                className="bg-white rounded-xl text-black px-10 py-5"
                onClick={() => {
                  if (results.length == 0) {
                    const x = {
                      Name: "",
                      Points: [],
                      Style: "",
                    } as bandresults;
                    setResults([x]);
                  } else {
                    let re = results;
                    const x = {
                      Name: "",
                      Points: [],
                      Style: "",
                    } as bandresults;
                    setResults([...re, x]);
                  }
                }}
              >
                Add a New Band
              </button>
              <button
                className="bg-white rounded-xl text-black px-10 py-5 ml-20"
                onClick={() => {
                  setResults(
                    results.map((each) => {
                      return { ...each, Points: new Array(adj).fill(-1) };
                    })
                  );

                  results.forEach((each, i) => {
                    addResult(each);
                  });
                  if (results.length > 1) setLocked(false);
                }}
              >
                Continue to Points Entry
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center w-full">
          <h2 className="w-full text-3xl font-bold leading-tight text-center">
            Input The Points
          </h2>

          <div>
            {results.length > 1 ? (
              <div>
                <div className="flex flex-row mt-10 justify-center ml-[11vw] gap-20 [&>*]:w-[10vw]">
                  {new Array(adj).fill(0).map((each, i) => {
                    return <h1>Adjudicator {i + 1}</h1>;
                  })}
                </div>
                {results.map((each, bandid) => {
                  return (
                    <div
                      className="flex flex-row mt-10 justify-center"
                      key={bandid}
                    >
                      <h1 className="my-auto mr-20 w-[10vw]">{each.Name}</h1>
                      {each.Points.map((points, i) => {
                        return (
                          <input
                            type="text"
                            value={points == -1 ? "" : points}
                            className="text-black mr-5"
                            onChange={(e) => {
                              setResults(
                                results.map((b, index) => {
                                  if (bandid == index) {
                                    return {
                                      ...b,
                                      Points: b.Points.map((p, pointsindex) => {
                                        if (pointsindex == i) {
                                          return isNaN(parseInt(e.target.value))
                                            ? -1
                                            : parseInt(e.target.value);
                                        } else {
                                          return p;
                                        }
                                      }),
                                    };
                                  } else {
                                    return b;
                                  }
                                })
                              );
                            }}
                          ></input>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ) : (
              ""
            )}
          </div>
          <button
            className="bg-white text-black rounded-xl px-20 py-10 mt-20 mx-40"
            onClick={() => {
              setResults(
                results.map((each) => {
                  return {
                    ...each,
                    Points: each.Points.map((point) => {
                      return -1;
                    }),
                  };
                })
              );
            }}
          >
            Clear All Scores
          </button>
          <button
            className="bg-white text-black rounded-xl px-20 py-10 mt-20"
            onClick={() => {
              results.forEach((each) => {
                deleteBand(each);
              });
              window.location.reload();
            }}
          >
            Delete All
          </button>
        </div>
      )}
    </div>
  );
};

export default Results;
