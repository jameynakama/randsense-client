import React from 'react';
import PropTypes from 'prop-types';
import ReactJson from 'react-json-view';
import classnames from 'classnames';

import Word from '../Word/Word';

import css from './Sentence.module.css';

const Sentence = ({sentence}) => {
  // TODO: Enable finding words that are actually multiple words (like "banana peel")
  const [ wordData, setWordData ] = React.useState(null);
  const [ showSentenceData, setShowSentenceData ] = React.useState(false);

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

  return (
    <>
      <div className={css.sentence}>
        {inflectedWords.map((word, i) =>
          <Word key={i} inflectedWord={word} onClick={() => handleWordClick(wordObjects[i])}/>
        )}
      </div>
      <button className="appButton" onClick={handleSentenceDataClick}>See sentence data</button>
      <button className="appButton" >Is this grammatically incorrect?</button>
      {showSentenceData &&
        <div className={classnames(css.data, css.sentenceData)}>
          <ReactJson src={sentence}/>
        </div>
      }
      {wordData &&
        <div className={classnames(css.data, css.wordData)}>
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
