import { forwardRef } from 'react';

const CowCharacter = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref} className="cow-container" data-testid="cow-character">
      <div className="cow-ears">
        <div className="cow-ear ear-left">
          <div className="ear-inner"></div>
        </div>
        <div className="cow-ear ear-right">
          <div className="ear-inner"></div>
        </div>
      </div>
      
      <div className="cow-horns">
        <div className="horn horn-left"></div>
        <div className="horn horn-right"></div>
      </div>
      
      <div className="cow-body">
        <div className="cow-spots">
          <div className="cow-spot spot1"></div>
          <div className="cow-spot spot2"></div>
          <div className="cow-spot spot3"></div>
          <div className="cow-spot spot4"></div>
        </div>
        
        <div className="cow-eyes">
          <div className="cow-eye eye-left">
            <div className="eye-pupil">
              <div className="eye-shine"></div>
            </div>
          </div>
          <div className="cow-eye eye-right">
            <div className="eye-pupil">
              <div className="eye-shine"></div>
            </div>
          </div>
        </div>
        
        <div className="cow-cheeks">
          <div className="cheek cheek-left"></div>
          <div className="cheek cheek-right"></div>
        </div>
        
        <div className="cow-snout">
          <div className="cow-nostrils">
            <div className="nostril nostril-left"></div>
            <div className="nostril nostril-right"></div>
          </div>
        </div>
      </div>
    </div>
  );
});

CowCharacter.displayName = 'CowCharacter';

export default CowCharacter;
