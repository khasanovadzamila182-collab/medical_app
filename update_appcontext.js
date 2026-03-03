const fs = require('fs');

const path = 'src/context/AppContext.tsx';
let file = fs.readFileSync(path, 'utf8');

// Update AppContext 1/3: interfaces
file = file.replace(/childName: string;\n    childWeight: number;\n    childAgeMonths: number;/g, 
  `childrenInfo: any[];
    selectedChildId: number | null;
    childName: string;
    childWeight: number;
    childAgeMonths: number;`
);

// Update AppContext 2/3: defaults
file = file.replace(/childName: "",\n        childWeight: 0,\n        childAgeMonths: 0,/g,
  `childrenInfo: [],
        selectedChildId: null,
        childName: "",
        childWeight: 0,
        childAgeMonths: 0,`
);

// Update AppContext 3/3: login mapping
file = file.replace(/childName: data\.child\?\.name \|\| prev\.childName,\n                    childWeight: data\.child\?\.weight \|\| prev\.childWeight,\n                    childAgeMonths: data\.child\?\.ageMonths \|\| prev\.childAgeMonths,/g,
  `childrenInfo: data.children || [],
                    selectedChildId: data.selectedChildId !== undefined ? data.selectedChildId : null,
                    childName: data.children?.length ? data.children[0].name : prev.childName,
                    childWeight: data.children?.length ? data.children[0].weight : prev.childWeight,
                    childAgeMonths: data.children?.length ? data.children[0].ageMonths : prev.childAgeMonths,`
);

fs.writeFileSync(path, file);

