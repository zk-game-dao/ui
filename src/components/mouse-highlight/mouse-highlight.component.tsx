import classNames from 'classnames';
import { AnimatePresence, motion, useMotionValue } from 'framer-motion';
import { memo, PropsWithChildren, useState } from 'react';

export const MouseHighlightComponent = memo<PropsWithChildren<{ className?: string }>>(({ className, children }) => {
  const [hovered, setHovered] = useState(false);
  // const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onMouseMove={(event => {
        x.set(event.clientX);
        y.set(event.clientY);
      })}
      className={classNames(
        className,
        'relative',
        'overflow-hidden'
      )}

    >
      <AnimatePresence>
        {hovered &&
          <motion.div
            variants={{
              visible: { opacity: 1, scale: 1 },
              hidden: { opacity: 0, scale: 0.9 },
            }}
            initial="hidden"
            animate="visible"
            exit="hidden"
            style={{
              x,
              y,
            }}
            transition={{ duration: 0.8 }}
            className="bg-white/3 absolute rounded-full pointer-events-none size-128 blur-[128px] z-[-1] origin-center -translate-x-1/2 -translate-y-1/2"
          />
        }
        {children}
      </AnimatePresence>
    </motion.div>
  );
});
