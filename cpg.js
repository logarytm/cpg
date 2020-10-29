(function IIFE() {
    'use strict';

    window.cpg = {
        generate(e) {
            const baseColorString = document.getElementById('base_color').value;
            let baseColor;

            try {
                baseColor = new Color({ color: baseColorString, type: 'hex' });
            } catch {
                alert('Color must be in hex format');
                return;
            }

            // alert('L = ' + baseColor.lchab[0]);

            const variants = [
                { L: 90, aC: 1.00 },
                { L: 80, aC: 1.05 },
                { L: 70, aC: 1.10 },
                { L: 60, aC: 1.15 },
                { L: 50, aC: 1.20 },
                { L: 40, aC: 1.15 },
                { L: 30, aC: 1.10 },
                { L: 20, aC: 0.90 },
                { L: 10, aC: 0.80 },
            ];

            const $preview = document.getElementById('preview');
            $preview.innerHTML = '';

            const prefix = document.getElementById('prefix').value;

            const colors = variants.map((variant) => {
                const newLchab = baseColor.lchab.slice();
                newLchab[0] = variant.L;
                newLchab[1] = baseColor.lchab[1] * variant.aC;

                const color = new Color({ color: newLchab, type: 'lchab' });

                let maxIterations = 200;
                while (color.rgb.some((ch) => ch < 0 || ch > 255) && maxIterations--) {
                    color.lchab = setKey(color.lchab, 1, color.lchab[1] - .5);
                }

                return color;
            });

            colors.forEach((color) => {
                const $previewElement = document.createElement('div');
                $previewElement.style.width = '60px';
                $previewElement.style.height = '24px';
                $previewElement.style.backgroundColor = color.rgbString;
                $preview.appendChild($previewElement);
            });

            document.getElementById('sass_variables').textContent = colors
                .map((color, index) => {
                    return `$${prefix}${index.toString().padStart(2, '0')}: ${color.hexString};`;
                })
                .join('\n');

            e.preventDefault();
            return false;
        },
    };

    function setKey(array, key, value) {
        const clone = array.slice();
        clone[key] = value;

        return clone;
    }
})();
