const fs = require('fs-extra');
const { createCanvas, loadImage } = require('canvas');
const glob = require('glob');
const path = require('path');
const sharp = require('sharp');

const inputFolder = './AH_img'; // Remplacez par le chemin de votre dossier d'entrée
const outputFolder = './output'; // Remplacez par le chemin de votre dossier de sortie
const Size = 16;

const invalidImages = [
    "alarm_off.png",
    "alarm_on.png",
    "axe.png",
    "axe_pattern.png",
    "bed_head_top.png",
    "bed_feet_top.png",
    "birch_trapdoor.png",
    "carpentry_bench.png",
    "comparator_off.png",
    "comparator_on.png",
    "corrupted_bed_head_top.png",
    "corrupted_bed_feet_top.png",
    "corsair_banner.png",
    "creeper_splush.png",
    "deer_0.png",
    "deer_1.png",
    "deer_2.png",
    "deer_3.png",
    "deer_4.png",
    "deer_5.png",
    "fastsword_pattern.png",
    "flower_totem.png",
    "hammer_pattern.png",
    "passifwither_head.png",
    "pickaxe.png",
    "petrock.png",
    "pickaxe_pattern.png",
    "repeater_off.png",
    "repeater_on.png",
    "shovel.png",
    "shovel_pattern.png",
    "sleigh.png",
    "SpikeAmethyst_1.png",
    "SpikeAmethyst_2.png",
    "SpikeDiamond_1.png",
    "SpikeDiamond_2.png",
    "SpikeGold_1.png",
    "SpikeGold_2.png",
    "SpikeIron_1.png",
    "SpikeIron_2.png",
    "SpikePaladium_1.png",
    "SpikePaladium_2.png",
    "SpikeTitane_1.png",
    "SpikeTitane_2.png",
    "SpikeWood_1.png",
    "SpikeWood_2.png",
    "sword.png",
    "sword_pattern.png",
    "totem.png",
    "berry_xp_bush_ripe_fast.png",
];

/**
 * Vérifie si l'image est carrée et ne contient pas de pixels transparents
 * @param {string} imagePath
 * @returns {Promise<boolean>}
 */
const isSquareAndOpaque = async (imagePath) => {
    const img = await loadImage(imagePath);
    if (invalidImages.includes(path.basename(imagePath))) return false;
    if (img.width !== Size || img.height !== Size) return false;

    const canvas = createCanvas(Size, Size);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] < 255) 
            return false;
    }

    return true;
};

/**
 * Applique une transformation isométrique
 * @param {Object} images - Objet contenant les images { top, side, front }
 * @param {number} scale
 * @returns {HTMLCanvasElement}
 */
const applyIsometricTransform = (images, scale) => {
    const isoWidth = 0.5;
    const skew = isoWidth * 2;
    const z = scale * Size / 2;
    const sideHeight = Size * 1.2;

    const canvas = createCanvas(Size * 2 * scale + 8, Size * scale + sideHeight * scale + 8);
    const ctx = canvas.getContext('2d');

    canvas.width = Size * 2 * scale;
    canvas.height = Size * scale + sideHeight * scale;

    if(images.top === undefined) {
        if(images.side) {
            images.top = images.side;
        } else if(images.front) {
            images.top = images.front;
        }
    }

    if(images.side === undefined) {
        if(images.front) {
            images.side = images.front;
        } else if(images.top) {
            images.side = images.top;
        }
    }

    // Dessiner la face supérieure
    if (images.top) {
        ctx.setTransform(1, -isoWidth, 1, isoWidth, 0, 0);
        ctx.drawImage(images.top, -z - 1, z, Size * scale, Size * scale + 1.5);
    }

    // Dessiner la face droite
    if (images.side) {
        ctx.setTransform(1, -isoWidth, 0, skew, 0, isoWidth);
        ctx.drawImage(images.side, Size * scale, Size * scale + z, Size * scale, sideHeight * scale);
    }

    // Dessiner la face gauche
    if (images.front) {
        ctx.setTransform(1, isoWidth, 0, skew, 0, 0);
        ctx.drawImage(images.front, 0, z, Size * scale, sideHeight * scale);
    } else if (images.side) {
        ctx.setTransform(1, isoWidth, 0, skew, 0, 0);
        ctx.drawImage(images.side, 0, z, Size * scale, sideHeight * scale);
    }

    return canvas;
};

/**
 * Applique une transformation isométrique habituelle
 * @param {HTMLImageElement} img
 * @param {number} scale
 * @returns {HTMLCanvasElement}
 */
const applyDefaultIsometricTransform = (img, scale) => {
    const isoWidth = 0.5;
    const skew = isoWidth * 2;
    const z = scale * Size / 2;
    const sideHeight = Size * 1.2;

    const canvas = createCanvas(Size * 2 * scale + 8, Size * scale + sideHeight * scale + 8);
    const ctx = canvas.getContext('2d');

    canvas.width = Size * 2 * scale;
    canvas.height = Size * scale + sideHeight * scale;

    // Dessiner la face supérieure
    ctx.setTransform(1, -isoWidth, 1, isoWidth, 0, 0);
    ctx.drawImage(img, -z - 1, z, Size * scale, Size * scale + 1.5);

    // Dessiner la face droite
    ctx.setTransform(1, -isoWidth, 0, skew, 0, isoWidth);
    ctx.drawImage(img, Size * scale, Size * scale + z, Size * scale, sideHeight * scale);

    // Dessiner la face gauche
    ctx.setTransform(1, isoWidth, 0, skew, 0, 0);
    ctx.drawImage(img, 0, z, Size * scale, sideHeight * scale);

    return canvas;
};

const convertPngToWebp = async (inputPath, outputPath) => {
    await sharp(inputPath)
        .webp({ lossless: true }) // Utiliser l'option lossless pour conserver la qualité
        .toFile(outputPath);
    console.log(`Image convertie en WebP : ${outputPath}`);
};

/**
 * Traite toutes les images du dossier
 */
const processImages = async () => {
    const files = glob.sync(`${inputFolder}/**/*.png`);

    for (const file of files) {
        const baseName = path.basename(file, path.extname(file));
        const baseName_short = path.basename(file.replace("_front", '').replace("_side", '').replace("_top", ''), path.extname(file.replace("_front", '').replace("_side", '').replace("_top", '')));
        const topFile = path.join(inputFolder, `${baseName_short}_top.png`);
        const sideFile = path.join(inputFolder, `${baseName_short}_side.png`);
        const frontFile = path.join(inputFolder, `${baseName_short}_front.png`);

        const images = {};
        if (fs.existsSync(topFile) && await isSquareAndOpaque(topFile)) {
            images.top = await loadImage(topFile);
        }
        if (fs.existsSync(sideFile) && await isSquareAndOpaque(sideFile)) {
            images.side = await loadImage(sideFile);
        }
        if (fs.existsSync(frontFile) && await isSquareAndOpaque(frontFile)) {
            images.front = await loadImage(frontFile);
        }

        if (Object.keys(images).length > 0) {
            const scale = 3; // Vous pouvez ajuster cette valeur pour changer la taille du rendu
            const canvas = applyIsometricTransform(images, scale);

            const outputPath = path.join(outputFolder, `${baseName}.webp`);
            const buffer = canvas.toBuffer('image/png');
            await sharp(buffer).toFile(outputPath);

            console.log(`Rendu isométrique sauvegardé : ${outputPath}`);
        } else {
            if (await isSquareAndOpaque(file)) {
                const img = await loadImage(file);
                const scale = 3; // Vous pouvez ajuster cette valeur pour changer la taille du rendu
                const canvas = applyDefaultIsometricTransform(img, scale);

                const outputPath = path.join(outputFolder, `${baseName}.webp`);
                const buffer = canvas.toBuffer('image/png');
                await sharp(buffer).toFile(outputPath);

                console.log(`Rendu isométrique habituel sauvegardé : ${outputPath}`);
            } else {
                const outputPath = path.join(outputFolder, `${baseName}.webp`);
                await convertPngToWebp(file, outputPath);
            }
        }
    }
};

// Assurez-vous que le dossier de sortie existe
fs.ensureDirSync(outputFolder);

processImages().then(() => {
    console.log('Traitement terminé.');
}).catch(err => {
    console.error('Erreur :', err);
});
