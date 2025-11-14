import React from 'react';
import MediaRow from '../components/MediaRow';
import { animeData, showData, movieData } from '../data';

function HomePage() {
  return (
    <div>
      <MediaRow title="Suggested Anime" items={animeData} />
      <br></br>
      <MediaRow title="Suggested Shows" items={showData} />
      <MediaRow title="Suggested Movies" items={movieData} />
    </div>
  );
}

export default HomePage;