import React from "react";
import PropTypes from "prop-types";
import ReactJson from "react-json-view";

import Word from "../Word/Word";

import css from "./Sentence.module.css";
import * as constants from "../../util/constants";

const Sentence = ({ sentence }) => {
  // TODO: Enable finding words that are actually multiple words (like "banana peel")
  const [wordData, setWordData] = React.useState(null);
  const [showSentenceData, setShowSentenceData] = React.useState(false);
  const [incorrectEnabled, setIncorrectEnabled] = React.useState(true);
  const [votedOn, setVotedOn] = React.useState([]);

  React.useEffect(() => {
    setIncorrectEnabled(true);
    setShowSentenceData(false);
    setWordData(null);
  }, [sentence]);

  React.useEffect(() => {
    setWordData(wordData);
  }, [wordData]);

  const handleWordClick = (wordObject) => {
    setWordData(wordObject);
    setShowSentenceData(false);
  };

  const handleSentenceDataClick = () => {
    setShowSentenceData(true);
    setWordData(null);
  };

  const handleIncorrectClick = (id) => {
    setIncorrectEnabled(false);
    fetch(`${constants.RANDSENSE_API_BASE}sentences/${id}/mark-incorrect/`, {
      method: "POST",
    });
  };

  const handleWordRemovalClick = wordData => {
    setVotedOn(votedOn.concat([wordData.pk]))
    fetch(`${constants.RANDSENSE_API_BASE}words/${wordData.category}/${wordData.pk}/vote-to-remove/`, {
      method: "POST",
    });
  };

  const words = sentence.base.map(word =>
    word.inflected || word.inflections.base || word.base
  );
  words[0] = words[0].charAt(0).toUpperCase().concat(words[0].slice(1))

  return (
    <>
      <div className={css.sentence}>
        {words.map((word, i) => (
          <Word
            key={i}
            word={word}
            onClick={() => handleWordClick(sentence.base[i])}
          />
        ))}
        <Word word={sentence.inflected[sentence.inflected.length - 1]}/>
      </div>
      <button className="appButton" onClick={handleSentenceDataClick}>
        See sentence data
      </button>
      <button
        className="appButton"
        onClick={() => handleIncorrectClick(sentence.id)}
        disabled={!incorrectEnabled}
      >
        {incorrectEnabled ? "Is this grammatically incorrect?" : "Thank you!"}
      </button>
      {showSentenceData && (
        <div className={css.data}>
          <ReactJson src={sentence} collapsed={1} theme={constants.JSON_VIEW_THEME}/>
        </div>
      )}
      {wordData && (
        <div className={css.data}>
          <ReactJson src={wordData} collapsed={1} theme={constants.JSON_VIEW_THEME}/>
          <button
            className="appButton"
            onClick={() => handleWordRemovalClick(wordData)}
            disabled={votedOn.includes(wordData.pk)}
          >
            {votedOn.includes(wordData.pk) ? "Thank you!" : "Vote to remove this word?"}
          </button>
        </div>
      )}
    </>
  );
};

Sentence.propTypes = {
  sentence: PropTypes.object.isRequired,
};

export default Sentence;
