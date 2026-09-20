import test from "node:test";
import assert from "node:assert";

test(
  "basic server test",
  () => {
    const result = true;

    assert.strictEqual(
      result,
      true
    );
  }
);