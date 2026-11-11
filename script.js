const inputs = document.querySelectorAll('.inputs');
const placeholders = document.querySelectorAll('.input-placeholder');
const copyImgParents = document.querySelectorAll('.icon-parent');
const copyImgIcons = document.querySelectorAll('.copy-icon');
const hexInput = document.querySelector('#hex-input');
const rgbInput = document.querySelector('#rgb-input');
const hslInput = document.querySelector('#hsl-input');
const invalidHex = document.querySelector('#invalid-hex');
const invalidRgb = document.querySelector('#invalid-rgb');
const invalidHsl = document.querySelector('#invalid-hsl');
let R, G, B;
let isIconWhite = false;
const theEvent = new Event('colorCodeCalc');

// placeholders go up!:
function updatePlaceholders() {
    inputs.forEach((input, index) => {
        placeholders[index].classList.toggle(
            'input-placeholder-sec',
            input.value.trim() !== ''
        );
    });
}
inputs.forEach(input => {
    input.addEventListener('input', updatePlaceholders);
});
document.addEventListener('colorCodeCalc', updatePlaceholders);


// if you fill the hex input:
hexInput.addEventListener('input', () => {
    let hex = hexInput.value.trim();

    const hexRegex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;

    if (!hexRegex.test(hex)) {
        invalidHex.style.opacity = '1';
    } else {
        invalidHex.style.opacity = '0';

        if (document.activeElement === hexInput) {
            // 3 digit hex to 6 digit:
            if (hex.length === 4) {
                hex = '#' + [...hex.slice(1)].map(char => char + char).join('');
            }

            //changing the color of css:
            setcolor(hex);

            // devideing the colors and turning them into decimal: 
            R = parseInt(hex.slice(1, 3), 16);
            G = parseInt(hex.slice(3, 5), 16);
            B = parseInt(hex.slice(5, 7), 16);

            // rgb output
            rgbInput.value = `rgb(${R}, ${G}, ${B})`;

            // hsl output
            const hslObj = rgbToHsl(R, G, B);
            hslInput.value = `hsl(${hslObj.h}, ${hslObj.s}%, ${hslObj.l}%)`;

            document.dispatchEvent(theEvent);
        }

    }
});

// if you fill the rgb input:
rgbInput.addEventListener('input', () => {
    let rgb = rgbInput.value.trim();

    // removing spaces:
    rgb = rgb.replace(/\s/g, "");

    const rgbRegex = /^rgb\(\s*(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\s*,\s*(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\s*,\s*(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\s*\)$/i;


    if (!rgbRegex.test(rgb)) {
        invalidRgb.style.opacity = '1';
    } else {
        invalidRgb.style.opacity = '0';

        if (document.activeElement === rgbInput) {
            let rgbR = Number(rgb.match(/\d+/g)[0]);
            let rgbG = Number(rgb.match(/\d+/g)[1]);
            let rgbB = Number(rgb.match(/\d+/g)[2]);

            // hex calculate:
            R = rgbR.toString(16).padStart(2, "0");
            G = rgbG.toString(16).padStart(2, "0");
            B = rgbB.toString(16).padStart(2, "0");

            // hex output:
            const fullHex = '#' + R + G + B;
            hexInput.value = fullHex;

            // hsl output
            const hslObj = rgbToHsl(rgbR, rgbG, rgbB);
            hslInput.value = `hsl(${hslObj.h}, ${hslObj.s}%, ${hslObj.l}%)`;

            //changing the color of css:
            setcolor(fullHex);

            document.dispatchEvent(theEvent);
        }

    }

})

// if you fill the hsl input:
hslInput.addEventListener('input', () => {
    let hsl = hslInput.value.trim();

    // removing spaces:
    hsl = hsl.replace(/\s/g, '');

    // HSL validation
    const hslRegex = /^hsl\((\d+(?:\.\d+)?),(\d+(?:\.\d+)?)%,(\d+(?:\.\d+)?)%\)$/i;

    const match = hsl.match(hslRegex);

    if (!match) {
        invalidHsl.style.opacity = '1';
        return;
    }

    // extracting numbers:
    const [h, s, l] = match.slice(1).map(Number);

    if (h > 360 || s > 100 || l > 100) {
        invalidHsl.style.opacity = '1';
        return;
    }

    invalidHsl.style.opacity = '0';

    if (document.activeElement === hslInput) {

        // HSL to RGB
        const rgbObj = hslToRgb(h, s, l);

        R = rgbObj.r;
        G = rgbObj.g;
        B = rgbObj.b;

        // RGB output
        rgbInput.value = `rgb(${R}, ${G}, ${B})`;

        // RGB to HEX
        const hexR = R.toString(16).padStart(2, '0');
        const hexG = G.toString(16).padStart(2, '0');
        const hexB = B.toString(16).padStart(2, '0');

        const fullHex = `#${hexR}${hexG}${hexB}`;

        // HEX output
        hexInput.value = fullHex;

        // Changing the color of CSS
        setcolor(fullHex);

        document.dispatchEvent(theEvent);
    }
});

// if the color is dark, icons go white:
// (I know its not a good way to tell if the color is dark or not :| But it kind of works! you know ... )
document.addEventListener('colorCodeCalc', () => {
    if (R <= 100 && G <= 100 && B <= 100) {
        copyImgIcons.forEach(icon => {
            icon.src = 'images/copy-icon-white.png';
        })
        isIconWhite = true;
    } else {
        copyImgIcons.forEach(icon => {
            icon.src = 'images/copy-icon.png';
        })
        isIconWhite = false;
    }
})


// copy button click:
const timers = [];

copyImgParents.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        // copy the input text to clipboard:
        copyText(inputs[index].value);

        // change the copy icon to check and back!:
        clearTimeout(timers[index]);

        if (isIconWhite) {
            copyImgIcons[index].src = 'images/check-white.webp';
        } else {
            copyImgIcons[index].src = 'images/check.webp';
        }

        timers[index] = setTimeout(() => {
            if (isIconWhite) {
                copyImgIcons[index].src = 'images/copy-icon-white.png';
            } else {
                copyImgIcons[index].src = 'images/copy-icon.png';
            }
        }, 2000);
    });
});


function rgbToHsl(r, g, b) {
    // Normalize RGB values
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    const delta = max - min;

    // Calculate Lightness
    let l = (max + min) / 2;

    // Calculate Saturation
    let s = 0;

    if (delta !== 0) {
        s = delta / (1 - Math.abs(2 * l - 1));
    }

    // Calculate Hue
    let h = 0;

    if (delta !== 0) {
        if (max === r) {
            h = 60 * (((g - b) / delta) % 6);
        } else if (max === g) {
            h = 60 * ((b - r) / delta + 2);
        } else {
            h = 60 * ((r - g) / delta + 4);
        }
    }

    // Ensure Hue is positive
    if (h < 0) h += 360;

    return {
        h: Math.round(h),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

function hslToRgb(h, s, l) {
    // Normalize hsl values
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        const hueToRgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;

            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;

            return p;
        };

        r = hueToRgb(p, q, h + 1 / 3);
        g = hueToRgb(p, q, h);
        b = hueToRgb(p, q, h - 1 / 3);
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

async function copyText(text) {
    await navigator.clipboard.writeText(text);
}

function setcolor(hexCode) {
    document.documentElement.style.setProperty('--user-color', hexCode);
}