import { useEffect, useLayoutEffect, useMemo } from "react";
import { FrameRate } from "./FrameRate";
import { useElement, useProperty } from "../hooks";
import { DeviceMode, Size } from "../types";
import { DeviceContext } from "../context";

import "../styles/device.css";

type DeviceProps = {
  className?: string;
  children: React.ReactNode;
  mode?: DeviceMode;
  showFPS?: boolean;
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
  showFPS = false,
}) => {
  const screen = useElement<HTMLDivElement>();
  const size = useProperty<Size>([0, 0]);

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
        <div className="device-inner">
          <div className="device-screen shadow-2xl" style={{ background: bg }} ref={screen.ref}>
            {children}
            {showFPS && <FrameRate />}
          </div>
        </div>
      </div>
    </DeviceContext.Provider>
  );
};
