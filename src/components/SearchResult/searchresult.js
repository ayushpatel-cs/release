import React from 'react';
import { Microwave, Baby, Cigarette, PawPrint, Music } from 'lucide-react';
import styles from './searchresult.css';

const ListingPage = () => {
  return (
    <div className={`${styles.container} ${styles.primaryBg} max-w-4xl mx-auto p-4`}>
      <h1 className={`${styles.textPrimary} text-3xl font-bold mb-4`}>The Mark Atlanta</h1>
      
      <div className="grid grid-cols-3 gap-2 mb-4">
        {/* Placeholder for image gallery */}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className={`${styles.secondaryBg} h-40 rounded-lg`}></div>
        ))}
      </div>
      
      <div className="mb-4">
        <h2 className={`${styles.textPrimary} text-xl font-semibold mb-2`}>Location</h2>
        <div className={`${styles.secondaryBg} h-64 rounded-lg mb-2`}></div>
        <p className={`${styles.textPrimary} font-semibold`}>Midtown Atlanta, Georgia</p>
        <p className={`${styles.textSecondary} text-sm`}>
          Midtown is a busy commercial area and a vibrant arts hub. The High Museum of Art shows world-renowned works in a striking modern building, while Margaret Mitchell House offers tours of the former home of the "Gone With the Wind" author. Peachtree Street is a hotspot for comedy, bars and big-name shops, with eating options ranging from street food to fine dining. Large, leafy Piedmont Park offers walking trails.
        </p>
      </div>
      
      <div className="mb-4">
        <h2 className={`${styles.textPrimary} text-xl font-semibold mb-2`}>Things to know</h2>
        <ul className="space-y-1">
          <li className={`${styles.textSecondary} flex items-center`}><Microwave className="mr-2 h-4 w-4" /> Microwave included</li>
          <li className={`${styles.textSecondary} flex items-center`}><Baby className="mr-2 h-4 w-4" /> Not suitable for infants (under 2 years)</li>
          <li className={`${styles.textSecondary} flex items-center`}><Cigarette className="mr-2 h-4 w-4" /> No smoking</li>
          <li className={`${styles.textSecondary} flex items-center`}><PawPrint className="mr-2 h-4 w-4" /> No pets</li>
          <li className={`${styles.textSecondary} flex items-center`}><Music className="mr-2 h-4 w-4" /> No parties or events</li>
        </ul>
      </div>
      
      <div>
        <h2 className={`${styles.textPrimary} text-xl font-semibold mb-2`}>Information About Lister</h2>
        <div className="flex items-center">
          <div className={`${styles.secondaryBg} w-12 h-12 rounded-full mr-4`}></div>
          <div>
            <p className={`${styles.textPrimary} font-semibold`}>Abhinav Govindaraju</p>
            <p className={`${styles.textSecondary} text-sm`}>5.0 • 20 Reviews</p>
          </div>
        </div>
        <p className={`${styles.textSecondary} mt-2 text-sm`}>Abhinav Govindaraju is a student at Georgia Institute of Technology</p>
      </div>
      
      <button className={`${styles.button} mt-4 px-4 py-2 rounded`}>Book Now</button>
    </div>
  );
};

export default ListingPage;