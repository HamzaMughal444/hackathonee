import { Calendar } from 'lucide-react';

const PageLoader = () => {
  return (
    <div className="page-loader">
      <div className="loader-content">
        <div className="loader-logo">
          <Calendar size={48} />
        </div>
        <h2>EventFlow</h2>
      </div>
    </div>
  );
};

export default PageLoader;
