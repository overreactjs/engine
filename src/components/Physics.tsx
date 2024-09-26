import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Engine, Composite, Events, Body } from "matter-js";
import { PhysicsContext } from "../context";
import { useEventListeners, useProperty, useUpdate } from "../hooks";
import { PhysicsEvent, PhysicsEventType, PhysicsUpdateFunction } from "../types";

type PhysicsProps = {
  children: React.ReactNode;
}

/**
 * Physics
 * -------
 * 
 * Setup the physics engine (using matter-js), and provide functions for registering new physical
 * bodies via context.
 */
export const Physics: React.FC<PhysicsProps> = ({ children }) => {
  const engine = useProperty(Engine.create());
  const updaters = useRef<Map<Matter.Body, PhysicsUpdateFunction>>(new Map());
  
  /**
   * Register function is used to add (and remove) physics bodies to (and from) the system. Each
   * body is paired with an update function, which is called each time the body moves, allowing
   * its properties (such as position and rotation) to be synced with other elements.
   */
  const register = useCallback((body: Matter.Body, fn: PhysicsUpdateFunction) => {
    Composite.add(engine.current.world, body);
    updaters.current.set(body, fn);

    return () => {
      Composite.remove(engine.current.world, body)
      updaters.current.delete(body);
    };
  }, [engine]);

  /**
   * Set the angle of gravity.
   */
  const setGravity = useCallback((x: number, y: number) => {
    engine.current.gravity.x = x;
    engine.current.gravity.y = y;
  }, [engine]);

  /**
   * Set the velocity of a physics body.
   */
  const setVelocity = useCallback((body: Matter.Body, x: number, y: number) => {
    Body.setVelocity(body, { x, y });
  }, []);

  /**
   * 
   */
  const { addEventListener, removeEventListener, fireEvent } = useEventListeners<PhysicsEventType, PhysicsEvent>();
  const handleCollision = useCallback((event: Matter.IEventCollision<Engine>) => {
    fireEvent('collision', event);
  }, [fireEvent]);

  /**
   * 
   */
  useEffect(() => {
    const e = engine.current;
    Events.on(e, 'collisionStart', handleCollision);
    return () => Events.off(e, 'collisionStart', handleCollision);
  }, [engine, handleCollision]);

  /**
   * Each frame, play the physics system forwards, then call all of the update functions.
   */
  useUpdate((delta) => {
    Engine.update(engine.current, delta);
    
    for (const [body, update] of updaters.current) {
      update(body);
    }
  });

  const context = useMemo(() => ({
    engine, register, setGravity, setVelocity, addEventListener, removeEventListener
  }), [engine, register, setGravity, setVelocity, addEventListener, removeEventListener]);

  return (
    <PhysicsContext.Provider value={context}>
      {children}
    </PhysicsContext.Provider>
  );
};
