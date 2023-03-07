import { useEffect, useRef, useState } from 'react';

/*
For React Hooks in React 18, a useEffect() with zero dependencies will be executed twice.

Here is a custom hook that can be used instead of useEffect(), with zero dependencies,
that will give the old (pre React 18) behaviour back, i.e. it works around the breaking change.
https://blog.ag-grid.com/avoiding-react-18-double-mount/
*/
export const useEffectOnce = (effect) => {
  const effectFn = useRef(effect);
  const destroyFn = useRef();
  const effectCalled = useRef(false);
  const rendered = useRef(false);
  const [, setVal] = useState(0);

  if (effectCalled.current) {
    rendered.current = true;
  }

  useEffect(() => {
    // only execute the effect first time around
    if (!effectCalled.current) {
      destroyFn.current = effectFn.current();
      effectCalled.current = true;
    }

    // this forces one render after the effect is run
    setVal((val) => val + 1);

    return () => {
      // if the comp didn't render since the useEffect was called,
      // we know it's the dummy React cycle
      if (!rendered.current) {
        return;
      }

      // otherwise this is not a dummy destroy, so call the destroy func
      if (destroyFn.current) {
        destroyFn.current();
      }
    };
  }, []);
};
