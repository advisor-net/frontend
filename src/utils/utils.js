const splitIntoChunks = (size, aryIn) => {
  const ary = aryIn.slice();
  const result = [];
  while (ary.length > 0) result.push(ary.splice(0, size));
  return result;
};

export const addCommas = (numString) => {
  const numberString = numString.toString();
  const chunks = splitIntoChunks(
    3,
    parseInt(numberString, 10).toString().split('').reverse(),
  );

  const beforeDecimal = chunks
    .map((chunk) => chunk.join(''))
    .join(',')
    .split('')
    .reverse()
    .join('');

  const decimalIndex = numberString.indexOf('.');

  if (decimalIndex === -1) {
    return `${beforeDecimal}`;
  }
  return `${beforeDecimal}.${numberString.slice(decimalIndex + 1)}`;
};

export const formatPrice = (
  priceIn,
  decimalPlaces = 0,
  disableRounding = false,
) => {
  if (priceIn == null || Number.isNaN(priceIn)) {
    return '';
  }
  let price = parseFloat(priceIn);

  // custom logic for negative
  let negative = false;
  if (price < 0) {
    negative = true;
    price *= -1;
  }

  if (decimalPlaces) {
    if (!disableRounding) {
      // round to decimal places
      price = price.toFixed(decimalPlaces);
    } else {
      // truncate at decimal places
      price = (
        Math.floor(price * 10 ** decimalPlaces + 0.00001)
        / 10 ** decimalPlaces
      ).toFixed(decimalPlaces);
    }
  } else {
    // eslint-disable-next-line no-bitwise
    price = `${~~price}`;
  }

  if (negative) {
    return `$-${addCommas(price)}`;
  }
  return `$${addCommas(price)}`;
};

const abbreviationFormatter = (num, digits) => {
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'B' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find((obj) => num >= obj.value);
  return item
    ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol
    : '0';
};

export const formatLargePrice = (num, digits) => `$${abbreviationFormatter(num, digits)}`;

export const formatDateString = (inputDays) => {
  const years = Math.floor(inputDays / 365);
  const remainingDays = inputDays - years * 365;
  const months = Math.floor(remainingDays / 30);
  const days = remainingDays - months * 30;
  let yearString;
  let monthString;
  let dayString = '';
  const strings = [];
  if (years) {
    yearString = years > 0 ? `${years} years` : '1 year';
    strings.push(yearString);
  }
  if (months) {
    monthString = months > 0 ? `${months} months` : '1 month';
    strings.push(monthString);
  }
  if (days) {
    dayString = days > 0 ? `${days} days` : '1 day';
    strings.push(dayString);
  }
  return strings.join(', ') || '0 days';
};

export const toCamelCase = (str) => {
  if (str.includes(' ')) return str;
  return str.replace(/^([A-Z])|[\s-_](\w)/g, (match, p1, p2) => {
    if (p2) return p2.toUpperCase();
    return p1.toLowerCase();
  });
};

export const keysToCamelCase = (obj) => Object.keys(obj).reduce((acc, key) => {
  acc[toCamelCase(key)] = obj[key];
  return acc;
}, {});

export const isPrimitiveType = (a) => Object(a) !== a;

export const keysToCamelCaseDeep = (obj) => {
  if (isPrimitiveType(obj)) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((thing) => keysToCamelCaseDeep(thing));
  }
  return Object.keys(obj).reduce((acc, key) => {
    if (key === 'overrides' || key === 'metadata') {
      acc[key] = obj[key];
    } else if (typeof obj[key] === 'object') {
      acc[key.includes(' ') ? key : toCamelCase(key)] = keysToCamelCaseDeep(
        obj[key],
      );
    } else {
      acc[key.includes(' ') ? key : toCamelCase(key)] = obj[key];
    }
    return acc;
  }, {});
};

export const toSnakeCase = (str) => {
  if (str.includes(' ')) return str;
  return str.replace(/^([A-Z])|([A-Z])|[\s-](\w)/g, (match, p1, p2, p3) => {
    if (p2) return `_${p2.toLowerCase()}`;
    if (p3) return `_${p3.toLowerCase()}`;
    return p1.toLowerCase();
  });
};

export const keysToSnakeCase = (obj) => Object.keys(obj).reduce((acc, key) => {
  acc[toSnakeCase(key)] = obj[key];
  return acc;
}, {});

export const keysToSnakeCaseDeep = (obj) => {
  // base case -- primitives
  if (Object(obj) !== obj) {
    return obj;
  }
  if (obj instanceof Array) {
    return obj.map((element) => keysToSnakeCaseDeep(element));
  }
  return Object.keys(obj).reduce((acc, key) => {
    if (key === 'overrides' || key === 'metadata') {
      acc[key] = obj[key];
    } else if (obj[key] instanceof Object) {
      acc[key.includes(' ') ? key : toSnakeCase(key)] = keysToSnakeCaseDeep(
        obj[key],
      );
    } else {
      acc[key.includes(' ') ? key : toSnakeCase(key)] = obj[key];
    }
    return acc;
  }, {});
};

export const removeSpaces = (str) => str.replace(/\s/g, '');

export const flipObject = (data) => Object.fromEntries(
  Object
    .entries(data)
    .map(([key, value]) => [value, key]),
);
