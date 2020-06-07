const Bounds = {};

Bounds.append = (b, x, y) => { // bounds = [minx, miny, maxx, maxy]
  if (b.length === 0) {
    b.push(x);
    b.push(y);
    b.push(x);
    b.push(y);
    return;
  }
  if (x < b[0]) {
    b[0] = x;
  } else if (x > b[2]) {
    b[2] = x;
  }
  if (y < b[1]) {
    b[1] = y;
  } else if (y > b[3]) {
    b[3] = y;
  }
};
Bounds.contains = (b, x, y) => {
  return x >= b[0] && x <= b[2] && y >= b[1] && y <= b[3];
};

export default Bounds;
