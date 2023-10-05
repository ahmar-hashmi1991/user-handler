export function compareAppsVersions(versionA:string, versionB:string): number {
    const partsA = versionA.split('.').map(Number);
    const partsB = versionB.split('.').map(Number);
  
    for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
      const partA = partsA[i] || 0;
      const partB = partsB[i] || 0;
  
      if (partA < partB) {
        return -1;
      } else if (partA > partB) {
        return 1;
      }
    }
  
    return 0;
}