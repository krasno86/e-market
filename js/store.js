export const createStore = (reducer, initialState) => {
  let state = initialState;
  const listeners = [];

  const getState = () => state;

  const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      const idx = listeners.indexOf(listener);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  };

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach((listener) => listener(state, action));
    return action;
  };

  dispatch({ type: '@@INIT' });

  return {
    getState,
    dispatch,
    subscribe,
  };
};
