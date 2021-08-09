import React from 'react';

import * as constants from '../../util/constants';

import Sentence from '../Sentence/Sentence';

import css from './Home.module.css';

const Home = () => {
  const [ loading, setLoading ] = React.useState(false);
  const [ error, setError ] = React.useState(null);
  const [ sentence, setSentence ] = React.useState(null);

  const handleClick = () => {
    setLoading(true);

    fetch(`${constants.RANDSENSE_API_BASE}sentences/`, {
      method: "POST"
    })
      .then(response => response.json())
      .then(json => {
        setSentence(json);
        setLoading(false);
        setError(null);
      })
      .catch(error => {
        setError(error.toString());
        setLoading(false);
      })
  };

  return (
    <div className={css.wrapper}>
      <h1>RandSense</h1>
      <button className="appButton" onClick={handleClick} disabled={loading}>Generate sentence</button>
      {error &&
        <p className={css.error}>Error: {error}</p>
      }
      {sentence && !error &&
        <Sentence sentence={sentence}/>
      }
    </div>
  );
};

export default Home;
