import { useEffect, useMemo } from "react";
import { FrameRate } from "./FrameRate";
import { useElement, useProperty } from "../hooks";
import { Size } from "../types";
import { DeviceContext } from "../context";

type DeviceProps = {
  className?: string;
  children: React.ReactNode;
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
  bg = 'white',
  showFPS = false,
}) => {
  const screen = useElement<HTMLDivElement>();
  const size = useProperty<Size>([0, 0]);

  useEffect(() => {
    if (screen.ref.current) {
      const observer = new ResizeObserver((entries) => {
        size.current[0] = entries[0].contentRect.width;
        size.current[1] = entries[0].contentRect.height;
      });

      observer.observe(screen.ref.current);
    }
  }, [screen.ref, size]);

  useEffect(() => {
    console.log('requesting permissions...');
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
      <div className={`w-screen h-screen ${className}`} style={{ background: bg }} ref={screen.ref}>
        {children}
        {showFPS && <FrameRate />}
      </div>
    </DeviceContext.Provider>
  );
};
