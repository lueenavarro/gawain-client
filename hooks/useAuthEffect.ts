import { useAuth } from "contexts/auth";
import React, { useEffect } from "react";

export const useAuthEffect = (
  effect: React.EffectCallback,
  deps: React.DependencyList
) => {
  const { isAuthenticated, isLoading } = useAuth();
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      return effect();
    }
  }, [isAuthenticated, isLoading, ...deps]);
};
