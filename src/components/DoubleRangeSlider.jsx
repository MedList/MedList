import React, { useEffect, useState, useRef, useCallback } from 'react';
import '../styles/DoubleSlider.css';

const DoubleRangeSlider = ({ min, max, onChange, title, step = 1, initialMin, initialMax }) => {
  const [minVal, setMinVal] = useState(initialMin || min);
  const [maxVal, setMaxVal] = useState(initialMax || max);
  
  const [minInput, setMinInput] = useState(initialMin || min);
  const [maxInput, setMaxInput] = useState(initialMax || max);

  const range = useRef(null);

  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
    
    if (onChange) {
      onChange({ min: minVal, max: maxVal });
    }
  }, [minVal, maxVal, getPercent, onChange]);

  const stepUpMin = () => {
    const newVal = Math.min(minVal + step, maxVal - step);
    setMinVal(newVal);
    setMinInput(newVal);
  };

  const stepDownMin = () => {
    const newVal = Math.max(minVal - step, min);
    setMinVal(newVal);
    setMinInput(newVal);
  };

  const stepUpMax = () => {
    const newVal = Math.min(maxVal + step, max);
    setMaxVal(newVal);
    setMaxInput(newVal);
  };

  const stepDownMax = () => {
    const newVal = Math.max(maxVal - step, minVal + step);
    setMaxVal(newVal);
    setMaxInput(newVal);
  };

  const commitMinChange = () => {
    let value = Number(minInput);
    value = Math.max(value, min);
    value = Math.min(value, maxVal - step);
    setMinVal(value);
    setMinInput(value);
  };

  const commitMaxChange = () => {
    let value = Number(maxInput);
    value = Math.min(value, max);
    value = Math.max(value, minVal + step);
    setMaxVal(value);
    setMaxInput(value);
  };

  const handleKeyDown = (e, type) => {
    if (e.key === 'Enter') {
      if (type === 'min') commitMinChange();
      if (type === 'max') commitMaxChange();
      e.target.blur();
    }
  };


  const handleMinSliderChange = (event) => {
    const value = Math.min(Number(event.target.value), maxVal - step);
    setMinVal(value);
    setMinInput(value);
  };

  const handleMaxSliderChange = (event) => {
    const value = Math.max(Number(event.target.value), minVal + step);
    setMaxVal(value);
    setMaxInput(value);
  };

  return (
    <div className="container">
      <div className="input-row">
        <span>{title}</span>
        <div style={{display:'flex', gap:'10px', alignItems: 'center'}}>
           
           <div className="custom-num-container">
             <input 
              type="number" 
              className="number-input"
              value={minInput} 
              onChange={(e) => setMinInput(e.target.value)}
              onBlur={commitMinChange}
              onKeyDown={(e) => handleKeyDown(e, 'min')}
            />
            <div className="spinner-col">
              <button className="spin-btn" onClick={stepUpMin}>
                <svg viewBox="0 0 24 24"><path d="M7 14l5-5 5 5z"/></svg>
              </button>
              <button className="spin-btn" onClick={stepDownMin}>
                <svg viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
              </button>
            </div>
           </div>

          <span>-</span>

          <div className="custom-num-container">
            <input 
              type="number" 
              className="number-input"
              value={maxInput} 
              onChange={(e) => setMaxInput(e.target.value)}
              onBlur={commitMaxChange}
              onKeyDown={(e) => handleKeyDown(e, 'max')}
            />
            <div className="spinner-col">
              <button className="spin-btn" onClick={stepUpMax}>
                <svg viewBox="0 0 24 24"><path d="M7 14l5-5 5 5z"/></svg>
              </button>
              <button className="spin-btn" onClick={stepDownMax}>
                <svg viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
              </button>
            </div>
          </div>

        </div>
      </div>

      <div className="double-slider-wrapper">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minVal}
          onChange={handleMinSliderChange}
          className={`thumb thumb--left ${minVal > max - 100 ? "thumb--zindex-5" : "thumb--zindex-3"}`}
        />
        
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxVal}
          onChange={handleMaxSliderChange}
          className="thumb thumb--right thumb--zindex-4"
        />

        <div className="slider">
          <div className="slider-track" />
          <div ref={range} className="slider-range" />
        </div>
      </div>
    </div>
  );
};

export default DoubleRangeSlider;