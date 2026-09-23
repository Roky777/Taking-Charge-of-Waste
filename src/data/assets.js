const wasteArt = (path) => new URL(`../../assets/GRADE 3/Taking Charge of Waste/${path}`, import.meta.url).href;
const levelArt = { level1: {
  leaves: wasteArt("green dustbin/dried_leaves.webp"), eggshells: wasteArt("green dustbin/egg_shells.webp"),
  onionpeels: wasteArt("green dustbin/onion_peels.webp"), apple: wasteArt("green dustbin/rotten_apple.webp"),
  metal: wasteArt("blue distbin/rust_metal.webp"), glass: wasteArt("blue distbin/glass.webp"),
  bottle: wasteArt("blue distbin/plastic_bottle.webp"), paper: wasteArt("blue distbin/paper.webp"),
  cloth: wasteArt("blue distbin/cloth.webp"), bulb: wasteArt("blue distbin/bulb.webp"),
} };

export function resolveMathArt(artId, assetSet) { return levelArt?.[assetSet]?.[artId] ?? levelArt.level1.leaves; }
const blankBin = "assets/ui/sorting-bin-blank.webp";
export const assets = {
  characters: {
    idle: "assets/characters/idle.webp",
    presentation: "assets/characters/final_presentation_clean.webp",
    correct: "assets/characters/modified_thubms_up.webp",
    nod: "assets/characters/updated_nod.webp",
    happy: "assets/characters/happy.webp",
    thinking: "assets/characters/thinking.webp",
    surprised: "assets/characters/surprised.webp",
    successDance: "assets/characters/moon_walk_normalized.webp",
  },
  backgrounds: {}, items: { math: levelArt.level1, mathByLevel: levelArt },
  ui: {
    success: ["assets/ui/start-background.webp", "assets/ui/image 18.webp", "assets/ui/success-star-1.webp", "assets/ui/success-star-2.webp", "assets/ui/success-star-3.webp"],
    conveyorRims: "assets/ui/conveyor-rims.webp", conveyorFrame: "assets/ui/conveyor-frame.webp", conveyorTrackMask: "assets/ui/conveyor-track.webp",
    sortingBins: { green: blankBin, blue: blankBin, special: blankBin }, boxLeaves: "assets/ui/ui-box-leaves.webp" }, audio: {}, fx: {},
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
