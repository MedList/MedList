import React from 'react';
import MediaCard from './MediaCard';
import '../styles/MediaRow.css';

function MediaRow({ title, items }) {
  return (
    <section className="media-row">
      <h2>{title}</h2>
      <div className="media-scroller">
        {items.map((item) => (
          <MediaCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

export default MediaRow;