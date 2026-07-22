import useInView from '../../hook/useInView';
import features from '../../data/features';
import stats from '../../data/stats';
import styles from './AboutSection.module.css';

// Small internal helper: wraps any block in a fade-up animation that
// plays once when it scrolls into view. Keeping this here (instead of
// repeating the same three lines for header/features/stats) keeps the
// component body focused on layout, not animation plumbing.
function AnimateOnScroll({ children, className, delay = 0 }) {
  const [ref, isInView] = useInView({ threshold: 0.2 });

  return (
    <div
      ref={ref}
      className={`${className} ${styles.animatedBlock} ${
        isInView ? styles.animatedBlockVisible : ''
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function AboutSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <AnimateOnScroll className={styles.header}>
          <h2 className={styles.title}>Who We Are</h2>
          <p className={styles.description}>
            Lamma brings together fashion, electronics, accessories, and more
            in one place - carefully picked, fairly priced, and delivered
            fast.
          </p>
        </AnimateOnScroll>

        <div className={styles.featureGrid}>
          {features.map((feature, index) => {
            const FeatureIcon = feature.icon;
            const [firstWord, ...restWords] = feature.title.split(' ');
            const isFeatured = index === 1; // middle card gets the distinct look
            return (
              <AnimateOnScroll
                key={feature.id}
                className={`${styles.featureCard} ${
                  isFeatured ? styles.featureCardFeatured : ''
                }`}
                delay={index * 120}
              >
                <FeatureIcon className={styles.featureIcon} fontSize="large" />
                <h3 className={styles.featureTitle}>
                  <span className={styles.featureHighlight}>{firstWord}</span>{' '}
                  {restWords.join(' ')}
                </h3>
                <p className={styles.featureDescription}>
                  {feature.description}
                </p>
              </AnimateOnScroll>
            );
          })}
        </div>

        <div className={styles.statsRow}>
          {stats.map((stat, index) => (
            <AnimateOnScroll
              key={stat.id}
              className={styles.statCard}
              delay={index * 120}
            >
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutSection;