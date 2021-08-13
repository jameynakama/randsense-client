import React from "react";
import PropTypes from "prop-types";
import classnames from 'classnames';

import css from "./Word.module.css";

const PUNCTUATION = [ ".", ",", ";" ];

const Word = ({ word, onClick }) => {
  const classes = classnames(PUNCTUATION.includes(word) && css.punctuation);
  return (
    <span className={css.wrapper}>
      {onClick ?
        <button className={classes} onClick={onClick}>{word}</button>
        :
        <span className={classes}>{word}</span>
      }
    </span>
  );
};

Word.propTypes = {
  isPunctuation: PropTypes.bool,
  onClick: PropTypes.func,
  word: PropTypes.string.isRequired
};

Word.defaultProps = {
  isPunctuation: false,
  onClick: null
};

export default Word;
