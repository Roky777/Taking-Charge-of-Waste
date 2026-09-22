const wasteArt = (path) => new URL(`../../assets/GRADE 3/Taking Charge of Waste/${path}`, import.meta.url).href;
const levelArt = { level1: {
  leaves: wasteArt("green dustbin/dried_leaves.png"), eggshells: wasteArt("green dustbin/egg_shells.png"),
  onionpeels: wasteArt("green dustbin/onion_peels.png"), apple: wasteArt("green dustbin/rotten_apple.png"),
  metal: wasteArt("blue distbin/rust_metal.png"), glass: wasteArt("blue distbin/glass.png"),
  bottle: wasteArt("blue distbin/plastic_bottle.png"), paper: wasteArt("blue distbin/paper.png"),
  cloth: wasteArt("blue distbin/cloth.png"), bulb: wasteArt("blue distbin/bulb.png"),
} };

export function resolveMathArt(artId, assetSet) { return levelArt?.[assetSet]?.[artId] ?? levelArt.level1.leaves; }
const blankBin = "assets/ui/sorting-bin-blank.png";
export const assets = {
  characters: { idle: "assets/characters/idle.png", presentation: "assets/characters/final_presentation_clean.png" },
  backgrounds: {}, items: { math: levelArt.level1, mathByLevel: levelArt },
  ui: { conveyorRims: "assets/ui/conveyor-rims.png", conveyorFrame: "assets/ui/conveyor-frame.png", conveyorTrackMask: "assets/ui/conveyor-track.png",
    sortingBins: { green: blankBin, blue: blankBin }, boxLeaves: "assets/ui/ui-box-leaves.png" }, audio: {}, fx: {},
};
const imageRequests = new Map();
export function preloadImage(src) {
  if (!src) return Promise.resolve(); if (imageRequests.has(src)) return imageRequests.get(src);
  const request = new Promise((resolve) => { const image = new Image(); image.decoding = "async";
    image.onload = async () => { await image.decode?.().catch(() => {}); resolve({ src, loaded: true }); };
    image.onerror = () => resolve({ src, loaded: false }); image.src = src; });
  imageRequests.set(src, request); return request;
}
export function hydrateDeferredImages(root = document) {
  return Promise.all([...root.querySelectorAll("img[data-src]")].map((image) => { const src = image.dataset.src; delete image.dataset.src;
    image.src = src; return image.decode?.().catch(() => {}) ?? preloadImage(src); }));
}
export function preloadLevelAssets(level) {
  if (!level) return Promise.resolve([]);
  const urls = new Set([assets.ui.boxLeaves, ...level.items.map((entry) => resolveMathArt(entry.art, entry.assetSet)),
    ...level.bins.flatMap((entry) => [resolveMathArt(entry.art, entry.assetSet), assets.ui.sortingBins[entry.id] ?? blankBin])]);
  return Promise.all([...urls].map(preloadImage));
}
