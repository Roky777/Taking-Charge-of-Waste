const item = (name, art, answer) => ({ name, art, answer });

const LEVELS = [{
  title: "Taking Charge of Waste",
  instruction: "Sort each waste item into the correct dustbin.",
  showNames: true,
  maxOnBelt: 4,
  bins: [
    { id: "green", label: "Green", art: "leaves" },
    { id: "blue", label: "Blue", art: "bottle" },
  ],
  items: [
    item("Dried leaves", "leaves", "green"), item("Eggshells", "eggshells", "green"),
    item("Onion peels", "onionpeels", "green"), item("Rotten apple", "apple", "green"),
    item("Rust metal", "metal", "blue"), item("Glass", "glass", "blue"),
    item("Plastic bottle", "bottle", "blue"), item("Paper", "paper", "blue"),
    item("Cloth", "cloth", "blue"), item("Broken light bulb", "bulb", "blue"),
  ],
}];

function buildTutorial(level) {
  const demonstration = level.items[0];
  const interactive = level.items.find((entry) => entry.answer !== demonstration.answer) ?? level.items[1];
  const labelFor = (entry) => level.bins.find((bin) => bin.id === entry.answer)?.label ?? entry.answer;
  return {
    concept: level.title, intro: level.instruction, mandatory: true,
    steps: [
      { type: "concept", instruction: level.instruction },
      { type: "demonstration", objectName: demonstration.name, instruction: `${demonstration.name} → ${labelFor(demonstration)}` },
      { type: "interactive", objectName: interactive.name, instruction: `Sort ${interactive.name}!`, allowHints: true },
      { type: "completion", instruction: "You're ready!" },
    ],
  };
}

export const MATH_LEVELS = LEVELS.map((level, index) => ({
  ...level, goal: level.items.length, requiredCorrectPerItem: 1, assetSet: `level${index + 1}`,
  bins: level.bins.map((entry) => ({ ...entry, assetSet: `level${index + 1}` })),
  items: level.items.map((entry) => ({ ...entry, assetSet: `level${index + 1}` })), tutorial: buildTutorial(level),
}));

export const getLevel = (index) => MATH_LEVELS[index];
