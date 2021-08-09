import React from "react";
import PropTypes from "prop-types";

import css from "./Word.module.css";

const Word = ({ inflectedWord, onClick }) => {
  return (
    <span className={css.wrapper}>
      <button onClick={onClick}>{inflectedWord}</button>
    </span>
  );
};

Word.propTypes = {
  inflectedWord: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Word;
