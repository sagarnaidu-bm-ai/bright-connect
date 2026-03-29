import React from 'react';
import styles from './StepIndicator.module.css';

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3 7l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const StepIndicator = ({ steps = [], currentStep = 0 }) => {
  return (
    <div className={styles.container}>
      {steps.map((stepLabel, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;
        const isLast = index === steps.length - 1;

        let circleClass = styles.circleUpcoming;
        let labelClass = styles.labelUpcoming;
        if (isCompleted) {
          circleClass = styles.circleCompleted;
          labelClass = styles.labelCompleted;
        } else if (isActive) {
          circleClass = styles.circleActive;
          labelClass = styles.labelActive;
        }

        return (
          <div key={index} className={styles.step}>
            <div className={styles.circleRow}>
              {index > 0 && (
                <div
                  className={`${styles.line} ${isCompleted || isActive ? styles.lineCompleted : styles.lineUpcoming}`}
                />
              )}
              {index === 0 && <div className={`${styles.line} ${styles.lineHidden}`} />}
              <div className={`${styles.circle} ${circleClass}`}>
                {isCompleted ? <CheckIcon /> : index + 1}
              </div>
              {!isLast ? (
                <div
                  className={`${styles.line} ${isCompleted ? styles.lineCompleted : styles.lineUpcoming}`}
                />
              ) : (
                <div className={`${styles.line} ${styles.lineHidden}`} />
              )}
            </div>
            <span className={`${styles.label} ${labelClass}`}>{stepLabel}</span>
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;
