const fs = require('fs');

let file = fs.readFileSync('src/app/api/auth/route.ts', 'utf8');
file = file.replace(
    /subStatus: true,/g,
    '' // Remove prev broken replacements just in case
);
file = file.replace(
    /isAdmin: shouldBeAdmin,([\s]+)},([\s]+)include: { children: true },/g,
    'isAdmin: shouldBeAdmin,\n                    subStatus: true,\n                },\n                include: { children: true },'
);
file = file.replace(
    /lastActive: new Date\(\),/g,
    'lastActive: new Date(),\n                    subStatus: true,'
);
file = file.replace(
    /child: user\.children\[0\] \|\| null,/g,
    'children: user.children,\n            selectedChildId: user.selectedChildId,'
);
fs.writeFileSync('src/app/api/auth/route.ts', file);
