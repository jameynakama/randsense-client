import React from 'react';
import PropTypes from 'prop-types';
import ReactJson from 'react-json-view';

import Word from '../Word/Word';

import css from './Sentence.module.css';
import * as constants from '../../util/constants';

const Sentence = ({sentence}) => {
  // TODO: Enable finding words that are actually multiple words (like "banana peel")
  const [ wordData, setWordData ] = React.useState(null);
  const [ showSentenceData, setShowSentenceData ] = React.useState(false);
  const [ incorrectEnabled, setIncorrectEnabled ] = React.useState(true);

  React.useEffect(() => {
    setIncorrectEnabled(true);
  }, [sentence])

  const wordObjects = sentence.base;
  const inflectedWords = sentence.inflected.split(' ');

  const handleWordClick = wordObject => {
    setWordData(wordObject);
    setShowSentenceData(false);
  };

  const handleSentenceDataClick = () => {
    setShowSentenceData(true);
    setWordData(null);
  }

  const handleIncorrectClick = id => {
    setIncorrectEnabled(false);
    fetch(`${constants.RANDSENSE_API_BASE}sentences/${id}/`, {
      method: "PATCH"
    });
  }

  return (
    <>
      <div className={css.sentence}>
        {inflectedWords.map((word, i) =>
          <Word key={i} inflectedWord={word} onClick={() => handleWordClick(wordObjects[i])}/>
        )}
      </div>
      <button className="appButton" onClick={handleSentenceDataClick}>See sentence data</button>
      <button
        className="appButton"
        onClick={() => handleIncorrectClick(sentence.id)}
        disabled={!incorrectEnabled}>
          {incorrectEnabled ?
            "Is this grammatically incorrect?" :
            "Thank you!"
          }
        </button>
      {showSentenceData &&
        <div className={css.data}>
          <ReactJson src={sentence}/>
        </div>
      }
      {wordData &&
        <div className={css.data}>
          <ReactJson src={wordData} theme="summerfruit:inverted"/>
        </div>
      }
    </>
  );
};

Sentence.propTypes = {
  sentence: PropTypes.object.isRequired
};

export default Sentence;
