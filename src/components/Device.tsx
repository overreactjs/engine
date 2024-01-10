import { useEffect, useLayoutEffect, useMemo } from "react";
import { FrameRate } from "./FrameRate";
import { useElement, useKeyAxis, useKeyPressed, useProperty, useRender, useShaker } from "../hooks";
import { DeviceMode, Size } from "../types";
import { DeviceContext } from "../context";

import "../styles/device.css";

type DeviceProps = {
  className?: string;
  children: React.ReactNode;
  mode?: DeviceMode;
  hideClose?: boolean;
  showFPS?: boolean;
  showInfo?: boolean;
  bg?: string;
};

/**
 * Device
 * ------
 * 
 * Try to mimic a real device, to improve the developer experience by allowing us to trigger shake
 * actions, adjust the device orientation, and track the dimensions.
 */
export const Device: React.FC<DeviceProps> = ({
  className = '',
  children,
  mode = 'desktop',
  bg = 'white',
  hideClose = false,
  showFPS = false,
  showInfo = false,
}) => {
  const device = useShaker();
  const screen = useElement<HTMLDivElement>();

  const size = useProperty<Size>([0, 0]);
  const angle = useProperty(0);
  
  useKeyPressed('Digit3', () => {
    device.shake();
  });

  useKeyAxis('Digit4', 'Digit5', (value) => {
    if (value !== 0) {
      angle.current += value * 2;
    }
  });

  useRender(() => {
    screen.setBaseStyles({ angle });
  });

  useLayoutEffect(() => {
    if (screen.ref.current) {
      const observer = new ResizeObserver((entries) => {
        size.current[0] = entries[0].contentRect.width;
        size.current[1] = entries[0].contentRect.height;
      });

      observer.observe(screen.ref.current);
    }
  }, [screen.ref, size]);

  useEffect(() => {
    const motion = DeviceMotionEvent as unknown as { requestPermission?: () => void };
    const orientation = DeviceOrientationEvent as unknown as { requestPermission?: () => void };
    motion.requestPermission?.();
    orientation.requestPermission?.();
  }, []);

  const context = useMemo(() => ({
    size,
  }), [size]);

  return (
    <DeviceContext.Provider value={context}>
      <div className={`device-outer device-${mode} ${className}`}>
        <div className="device-inner" ref={device.ref}>
          <div className="device-screen shadow-2xl" style={{ background: bg }} ref={screen.ref}>
            {children}
            {!hideClose && <Close />}
            {showFPS && <FrameRate />}
          </div>
        </div>
        {showInfo && (
          <div className="absolute left-8 bottom-8 text-white">
            <div>"1": Toggle debug mode</div>
            <div>"2": Pause/unpause</div>
            <div>"3": Shake device</div>
            <div>"4/5": Rotate device</div>
          </div>
        )}
      </div>
    </DeviceContext.Provider>
  );
};

const Close: React.FC = () => {
  return (
    <div className="absolute top-0 left-0 w-4 h-4 p-8 box-content mix-blend-difference" onClick={() => history.back()}>
      <svg className="w-full h-full" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.071 1.92896L1.92891 16.0711" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        <path d="M16.1422 16.1422L2.00002 2.00001" stroke="white" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    </div>
  );
};
