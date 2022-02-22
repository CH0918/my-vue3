import { reactive } from '../src/reactive';
import { effect } from '../src/effect';
describe('reactive', () => {
  test('Object', () => {
    const original = { foo: 1 };
    const observed = reactive(original);
    expect(observed).not.toBe(original);
    // expect(isReactive(observed)).toBe(true);
    // expect(isReactive(original)).toBe(false);
    // get
    // expect(observed.foo).toBe(1);
    // //     // has
    // expect('foo' in observed).toBe(true);
    // //     // ownKeys
    // expect(Object.keys(observed)).toEqual(['foo']);

    let bar;
    effect(() => {
      bar = observed.foo;
    });
    expect(bar).toBe(1);
    observed.foo = 2;
    expect(bar).toBe(2);
  });

  // test('nested reactives', () => {
  //   const original = {
  //     nested: {
  //       foo: 1,
  //     },
  //     array: [{ bar: 2 }],
  //   };
  //   const observed = reactive(original);
  //   expect(isReactive(observed.nested)).toBe(true);
  //   expect(isReactive(observed.array)).toBe(true);
  //   expect(isReactive(observed.array[0])).toBe(true);
  // });

  // test('toRaw', () => {
  //   const original = { foo: 1 };
  //   const observed = reactive(original);
  //   expect(toRaw(observed)).toBe(original);
  //   expect(toRaw(original)).toBe(original);
  // });
});
