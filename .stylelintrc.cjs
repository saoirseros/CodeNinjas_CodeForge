module.exports = {
  extends: [
    "stylelint-config-recommended"
  ],
  rules: {
    // Allow Tailwind's at-rules such as @tailwind, @layer, @apply
    "at-rule-no-unknown": [
      true,
      {
        "ignoreAtRules": ["tailwind", "apply", "variants", "responsive", "screen", "layer"]
      }
    ]
  }
};
