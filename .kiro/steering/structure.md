# Structure — FrankenLab

```
kiroween-2026-frankenlab/
├── PLAN.md                 # category choice, concept, user-only steps
├── README.md               # run/test/deploy instructions + Kiro usage write-up
├── LICENSE                 # MIT
├── .gitignore              # must NEVER ignore .kiro/
├── package.json            # type: module, test script only
├── index.html              # UI shell
├── styles.css              # Halloween lab theme
├── src/
│   ├── monster.js          # pure logic (catalog, RNG, names, stats, share codec)
│   ├── audio.js            # WebAudio synth (thunder/zap/creak)
│   └── app.js              # DOM wiring
├── tests/
│   └── test.mjs            # node:test contract — do not weaken to make it pass
└── .kiro/
    ├── specs/frankenlab/   # requirements.md, design.md, tasks.md
    ├── steering/           # product.md, tech.md, structure.md
    └── hooks/              # test-on-save.json
```

Conventions:
- Tests are the contract: fix implementation, never the tests.
- Keep functions small and pure where possible; DOM code stays in `app.js`.
- Commit-ready: every file must be valid and the test suite green before finishing.
