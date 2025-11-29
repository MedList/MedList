import React from 'react';
import MediaCard from './MediaCard';
import '../styles/MediaRow.css';

function MediaRow({ title, items }) {
  let category = 'anime';

  if (title.toLowerCase().includes('movie')) {
    category = 'movies';
  } else if (title.toLowerCase().includes('show')) {
    category = 'shows';
  } else if (title.toLowerCase().includes('anime')) {
    category = 'anime';
  }

  return (
    <div className="media-row-wrapper">
      <hr />
      <section className="media-row">
        <h2>{title}</h2>
        <div className="media-scroller">
          {items.map((item) => (
            <MediaCard 
              key={item.id} 
              item={item} 
              category={category} 
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default MediaRow;