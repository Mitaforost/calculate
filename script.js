(function(){
    const tabs = document.querySelectorAll('.tab');
    const formSolid = document.getElementById('form-solid');
    const formTube = document.getElementById('form-tube');
    const modeSelect = document.getElementById('mode');
    const resultBox = document.getElementById('resultBox');
    const resultText = document.getElementById('resultText');

    tabs.forEach(tab => tab.addEventListener('click', () => {
        tabs.forEach(x => x.classList.remove('active'));
        tab.classList.add('active');
        if(tab.dataset.shape === 'solid'){
            formSolid.style.display = 'block';
            formTube.style.display = 'none';
        } else {
            formSolid.style.display = 'none';
            formTube.style.display = 'block';
        }
        clearResult();
    }));

    modeSelect.addEventListener('change', () => {
        const mode = modeSelect.value;
        document.getElementById('solid-weight-input').style.display = mode==='length' ? 'block' : 'none';
        document.getElementById('tube-weight-input').style.display  = mode==='length' ? 'block' : 'none';
        document.getElementById('solid-length-input').style.display = mode==='weight' ? 'block' : 'none';
        document.getElementById('tube-length-input').style.display  = mode==='weight' ? 'block' : 'none';
        clearResult();
    });

    document.getElementById('calc').addEventListener('click', () => {
        const shape = document.querySelector('.tab.active').dataset.shape;
        const density = Number(document.getElementById('alloy').value);
        const mode = modeSelect.value;

        try {
            if(shape === 'solid'){
                const d = Number(document.getElementById('solid-d').value);
                if(d <= 0) throw 'Диаметр должен быть > 0';

                if(mode === 'weight'){
                    const L = Number(document.getElementById('solid-l').value);
                    if(L <= 0) throw 'Длина должна быть > 0';
                    const m = solidMass(d, L, density);
                    showResult(`Масса: <b>${m.toFixed(4)}</b> кг`);
                } else {
                    const W = Number(document.getElementById('solid-w').value);
                    if(W <= 0) throw 'Вес должен быть > 0';
                    const L = solidLength(d, W, density);
                    showResult(`Длина: <b>${L.toFixed(4)}</b> м`);
                }

            } else {
                const Do = Number(document.getElementById('tube-do').value);
                const Di = Number(document.getElementById('tube-di').value);
                if(Di >= Do) throw 'Внутренний диаметр должен быть меньше наружного';

                if(mode === 'weight'){
                    const L = Number(document.getElementById('tube-l').value);
                    if(L <= 0) throw 'Длина должна быть > 0';
                    const m = tubeMass(Do, Di, L, density);
                    showResult(`Масса: <b>${m.toFixed(4)}</b> кг`);
                } else {
                    const W = Number(document.getElementById('tube-w').value);
                    if(W <= 0) throw 'Вес должен быть > 0';
                    const L = tubeLength(Do, Di, W, density);
                    showResult(`Длина: <b>${L.toFixed(4)}</b> м`);
                }
            }
        } catch(err){
            alert(err);
        }
    });

    document.getElementById('reset').addEventListener('click', () => {
        document.querySelectorAll('input').forEach(i => i.value = '');
        clearResult();
    });

    function clearResult(){ resultBox.style.display = 'none'; resultText.innerHTML = ''; }
    function showResult(html){ resultBox.style.display = 'block'; resultText.innerHTML = html; }

    // Formulas
    function solidMass(d_mm, L_m, density){
        const d = d_mm / 1000;
        const volume = Math.PI * (d/2)**2 * L_m;
        return volume * density;
    }
    function solidLength(d_mm, mass, density){
        const d = d_mm / 1000;
        const area = Math.PI * (d/2)**2;
        return mass / (area * density);
    }
    function tubeMass(Do_mm, Di_mm, L_m, density){
        const Do = Do_mm / 1000, Di = Di_mm / 1000;
        const area = Math.PI * (Do**2 - Di**2) / 4;
        return area * L_m * density;
    }
    function tubeLength(Do_mm, Di_mm, mass, density){
        const Do = Do_mm / 1000, Di = Di_mm / 1000;
        const area = Math.PI * (Do**2 - Di**2) / 4;
        return mass / (area * density);
    }
})();
