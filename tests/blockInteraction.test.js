global.config = require("../blockConfig")
const Block = require("../src/js/block")
const  BlockKind = require("../src/js/blockKind")


test('Block collision', () => {
  const blockkind = new BlockKind(10, 20, "red");
  const b = new Block(blockkind, 0, 0);
  expect(b.collided(0, 0)).toBe(true);
  expect(b.collided(5, 10)).toBe(true);
  expect(b.collided(-5, -10)).toBe(true);
  expect(b.collided(-5.1, -10.1)).toBe(false);
  expect(b.collided(5.1, 10.1)).toBe(false);
  expect(b.collided(5.1, 0)).toBe(false);
});