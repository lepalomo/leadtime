import React from 'react';

interface SlideProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Slide: React.FC<SlideProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`slide ${className}`}>
      {title && <h2 className="slide-title">{title}</h2>}
      <div className="slide-content">
        {children}
      </div>
    </div>
  );
};

export default Slide;