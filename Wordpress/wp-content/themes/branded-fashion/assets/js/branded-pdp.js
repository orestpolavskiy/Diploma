document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.single-product form.cart .quantity').forEach(function (wrap) {
        if (wrap.dataset.steppered) return;
        wrap.dataset.steppered = '1';
        var input = wrap.querySelector('input.qty');
        if (!input) return;
        var minus = document.createElement('button');
        minus.type = 'button';
        minus.className = 'branded-qty-btn branded-qty-minus';
        minus.textContent = '−';
        var plus = document.createElement('button');
        plus.type = 'button';
        plus.className = 'branded-qty-btn branded-qty-plus';
        plus.textContent = '+';
        wrap.insertBefore(minus, input);
        wrap.appendChild(plus);
        function step(dir) {
            var val = parseInt(input.value, 10) || 1;
            var min = parseInt(input.min, 10) || 1;
            var max = parseInt(input.max, 10) || Infinity;
            val += dir;
            if (val < min) val = min;
            if (val > max) val = max;
            input.value = val;
            input.dispatchEvent(new Event('change', { bubbles: true }));
        }
        minus.addEventListener('click', function () { step(-1); });
        plus.addEventListener('click', function () { step(1); });
    });
});
