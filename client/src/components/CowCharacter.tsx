import { useEffect, useRef } from 'react';

type CowAnimation = 'floating' | 'shooting' | 'celebrating';

interface CowCharacterProps {
  animation: CowAnimation;
}

export default function CowCharacter({ animation }: CowCharacterProps) {
  const cowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cowRef.current) return;

    // Remove all animation classes
    cowRef.current.classList.remove('cow-shooting', 'cow-celebrating');

    // Add the appropriate animation class
    if (animation === 'shooting') {
      cowRef.current.classList.add('cow-shooting');
    } else if (animation === 'celebrating') {
      cowRef.current.classList.add('cow-celebrating');
    }
  }, [animation]);

  return (
    <div ref={cowRef} className="cow-container" data-testid="cow-character">
      {/* Cow Ears */}
      <div className="cow-ears">
        <div className="cow-ear ear-left">
          <div className="ear-inner" />
        </div>
        <div className="cow-ear ear-right">
          <div className="ear-inner" />
        </div>
      </div>

      {/* Cow Horns */}
      <div className="cow-horns">
        <div className="horn horn-left" />
        <div className="horn horn-right" />
      </div>

      {/* Cow Body */}
      <div className="cow-body">
        {/* Spots */}
        <div className="cow-spots">
          <div className="cow-spot spot1" />
          <div className="cow-spot spot2" />
          <div className="cow-spot spot3" />
          <div className="cow-spot spot4" />
        </div>

        {/* Eyes */}
        <div className="cow-eyes">
          <div className="cow-eye eye-left">
            <div className="eye-pupil">
              <div className="eye-shine" />
            </div>
          </div>
          <div className="cow-eye eye-right">
            <div className="eye-pupil">
              <div className="eye-shine" />
            </div>
          </div>
        </div>

        {/* Cheeks */}
        <div className="cow-cheeks">
          <div className="cheek cheek-left" />
          <div className="cheek cheek-right" />
        </div>

        {/* Snout */}
        <div className="cow-snout">
          <div className="cow-nostrils">
            <div className="nostril nostril-left" />
            <div className="nostril nostril-right" />
          </div>
        </div>
      </div>
    </div>
  );
}
