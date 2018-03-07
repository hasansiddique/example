import CircularJSON from 'circular-json';

const storage = {
  get: (key) => {
    try {
      const serialized = localStorage.getItem(key);
      if (serialized === null) {
        return undefined;
      }
      return CircularJSON.parse(serialized);
    } catch (err) {
      return undefined;
    }
  },
  set: (key, value) => {
    try {
      const serialized = CircularJSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (err) {
      /* eslint-disable no-console */
      console.error(err);
      /* eslint-enable no-console */
    }
  },

  clear: () => {
    try {
      localStorage.clear();
    } catch (err) {
      /* eslint-disable no-console */
      console.error(err);
      /* eslint-enable no-console */
    }
  },
};

export default storage;
