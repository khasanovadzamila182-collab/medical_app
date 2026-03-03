const fs = require('fs');

const path = 'src/context/AppContext.tsx';
let file = fs.readFileSync(path, 'utf8');

// Update UI dependencies for subStatus
file = file.replace(/needsWeight: \(\) => !state.childWeight \|\| state.childWeight <= 0,/g,
  `needsWeight: () => !state.selectedChildId,`
);

// Update context logic
file = file.replace(/setChildWeight: \(w\) => setState\(p => \(\{ \.\.\.p, childWeight: w \}\)\),/g,
  `setChildWeight: (w) => setState(p => ({ ...p, childWeight: w })),
        setChildrenInfo: (c: any[]) => setState(p => ({ ...p, childrenInfo: c })),
        setSelectedChildId: (id: number) => setState(p => ({ ...p, selectedChildId: id, childWeight: p.childrenInfo.find(c => c.id === id)?.weight || 0 })),`
);

fs.writeFileSync(path, file);

