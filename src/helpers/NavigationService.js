import * as React from 'react';

export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

export const reset = (name) => {
  navigationRef.current?.resetRoot({
    index: 0,
    routes: [{name}],
  });
};
