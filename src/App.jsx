import React, { useState } from "react";
import Axios from "axios";
import { FaSearch } from "react-icons/fa";
import { FcSpeaker } from "react-icons/fc";
import { ImSpinner2 } from "react-icons/im";

function App() {
  const [data, setData] = useState(null);
  const [searchWord, setSearchWord] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function getMeaning() {
    setLoading(true);
    Axios.get(
      `https://api.dictionaryapi.dev/api/v2/entries/en_US/${searchWord}`
    )
      .then((response) => {
        setData(response.data[0]);
        setError("");
      })
      .catch((err) => {
        setData(null);
        setError("Word not found. Please try another word.");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function playAudio() {
    if (
      data &&
      data.phonetics &&
      data.phonetics[0] &&
      data.phonetics[0].audio
    ) {
      let audio = new Audio(data.phonetics[0].audio);
      audio.play();
    } else {
      alert("No audio available for this word.");
    }
  }

  return (
    <div className="App relative flex justify-center flex-col items-center min-h-screen z-10">
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 object-cover w-full h-full z-0"
      >
        <source src="https://videos.pexels.com/video-files/2646392/2646392-sd_640_360_30fps.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
       <h1 className="text-5xl p-3 text-center font-serif text-gray-200 mb-8 relative z-10 transition-all animate-bounce">
        VaniSutra Dictionary
      </h1>
      <div className="searchBox flex mt-6 mb-4 relative z-10">
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => {
            setSearchWord(e.target.value);
          }}
          className="text-lg p-2 border border-gray-400 rounded-l-lg w-72 focus:outline-none focus:border-blue-600"
        />
        <button
          onClick={getMeaning}
          className="bg-blue-800 text-white p-2 rounded-r-lg hover:bg-blue-900 hover:scale-105 transition-transform duration-300"
        >
          <FaSearch size="20px" />
        </button>
      </div>

      {loading && (
        <ImSpinner2 className="animate-spin text-4xl text-blue-800 mt-4 relative z-10" />
      )}
      {error && <p className="text-red-600 relative z-10">{error}</p>}
      {data && (
        <div className="showResults bg-white p-6 shadow-lg rounded-lg text-left w-96 mt-6 relative z-10">
          <h2 className="text-3xl font-semibold text-blue-800 flex items-center">
            {data.word}
            <button
              onClick={playAudio}
              className="ml-2 hover:scale-110 transition-transform duration-300"
            >
              <FcSpeaker size="24px" />
            </button>
          </h2>
          {data.phonetic && (
            <p className="text-gray-500 text-lg mt-1">{data.phonetic}</p>
          )}
          {data.meanings.map((meaning, index) => (
            <div key={index} className="mt-4">
              <h4 className="text-xl font-semibold">Part of speech:</h4>
              <p className="text-lg">{meaning.partOfSpeech}</p>
              <h4 className="text-xl font-semibold mt-2">Definition:</h4>
              <p className="text-lg">{meaning.definitions[0].definition}</p>
              {meaning.definitions[0].example && (
                <p className="text-lg italic mt-1">
                  Example: "{meaning.definitions[0].example}"
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
