import test from "node:test";
import assert from "node:assert";

const calculateReadiness = (
  strong,
  moderate,
  missing
) => {
  const total =
    strong +
    moderate +
    missing;

  if (total === 0) {
    return 0;
  }

  const score =
    (
      strong * 100 +
      moderate * 50 +
      missing * 0
    ) / total;

  return Math.round(score);
};

test(
  "readiness should be 100 when every skill is strong",
  () => {
    assert.strictEqual(
      calculateReadiness(
        5,
        0,
        0
      ),
      100
    );
  }
);

test(
  "readiness should be 50 with only moderate skills",
  () => {
    assert.strictEqual(
      calculateReadiness(
        0,
        5,
        0
      ),
      50
    );
  }
);

test(
  "readiness should be 0 with only missing skills",
  () => {
    assert.strictEqual(
      calculateReadiness(
        0,
        0,
        5
      ),
      0
    );
  }
);