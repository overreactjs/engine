import { Property } from "../types"

export const PlaceholderProperty = <T>(value: T): Property<T> => {
  return {
    current: value,
    invalidated: true,
    listen: () => () => {},
  }
};
