const appEngine = {
    total: 0,
    pushToCart(amt) {
        this.total += amt;
        const domEl = document.getElementById('s-total');
        domEl.textContent = `₡${this.total.toLocaleString()}`;

        domEl.style.color = 'var(--code-org)';
        domEl.style.transform = 'scale(1.1)';
        setTimeout(() => {
            domEl.style.color = '';
            domEl.style.transform = 'none';
        }, 150);
    },
    resetCart() {
        this.total = 0;
        document.getElementById('s-total').textContent = '₡0';
    }
};

document.addEventListener("DOMContentLoaded", () => {

    const uiCtrl = {
        lang: document.getElementById('lang-ctrl'),
        theme: document.getElementById('theme-ctrl'),
        typer: document.querySelector('.typer-node'),
        nodes: document.querySelectorAll('.i18n'),
        wordsES: ["import sys", "npm run dev", "rails s -e production", "docker-compose up"],
        wordsEN: ["import sys", "npm run dev", "rails s -e production", "docker-compose up"],
        idx: 0, cIdx: 0, del: false, tid: null
    };

    function initTyper() {
        const pool = uiCtrl.lang.checked ? uiCtrl.wordsEN : uiCtrl.wordsES;
        const word = pool[uiCtrl.idx];

        if (uiCtrl.del) {
            uiCtrl.typer.textContent = word.substring(0, uiCtrl.cIdx - 1);
            uiCtrl.cIdx--;
        } else {
            uiCtrl.typer.textContent = word.substring(0, uiCtrl.cIdx + 1);
            uiCtrl.cIdx++;
        }

        let spd = uiCtrl.del ? 30 : 80;

        if (!uiCtrl.del && uiCtrl.cIdx === word.length) {
            spd = 2000;
            uiCtrl.del = true;
        } else if (uiCtrl.del && uiCtrl.cIdx === 0) {
            uiCtrl.del = false;
            uiCtrl.idx = (uiCtrl.idx + 1) % pool.length;
            spd = 500;
        }
        uiCtrl.tid = setTimeout(initTyper, spd);
    }

    initTyper();

    const vBtn = document.getElementById('v-trigger');
    const vStat = document.getElementById('v-status');

    vBtn.addEventListener('click', () => {
        vStat.className = 'status-badge done i18n';
        const isEn = uiCtrl.lang.checked;
        vStat.textContent = isEn ? 'Executed' : 'Ejecutado';
        vBtn.textContent = isEn ? 'Sys.OK' : 'Sys.OK';
        vBtn.style.background = '#10b981';
        vBtn.style.color = '#fff';
        vBtn.disabled = true;
    });

    const pClk = document.getElementById('py-clock');
    const pBtn = document.getElementById('py-trigger');
    const pLog = document.getElementById('py-logs');

    setInterval(() => {
        pClk.textContent = new Date().toLocaleTimeString('es-CR', { hour12: false });
    }, 1000);

    pBtn.addEventListener('click', () => {
        const t = new Date().toLocaleTimeString('es-CR', { hour12: false });
        const isEn = uiCtrl.lang.checked;
        const msg = isEn ? `[200 OK] Entry -> ${t}` : `[200 OK] Ingreso -> ${t}`;
        pLog.innerHTML = `<div>${msg}</div>` + pLog.innerHTML;
        pBtn.style.transform = 'scale(0.95)';
        setTimeout(() => pBtn.style.transform = 'none', 100);
    });

    const gBtn = document.getElementById('gold-trigger');
    gBtn.addEventListener('click', () => {
        const isEn = uiCtrl.lang.checked;
        gBtn.textContent = isEn ? 'Token Generated' : 'Token Generado';
        gBtn.style.background = '#10b981';
        gBtn.style.color = '#fff';
        gBtn.disabled = true;
    });

    const oBtn = document.getElementById('org-trigger');
    oBtn.addEventListener('click', () => {
        if(appEngine.total === 0) return;
        const isEn = uiCtrl.lang.checked;
        oBtn.textContent = isEn ? '201 Created' : '201 Created';
        oBtn.style.background = '#10b981';
        oBtn.style.color = '#fff';
        
        setTimeout(() => {
            appEngine.resetCart();
            oBtn.textContent = isEn ? 'Process Transaction' : 'Procesar Transacción';
            oBtn.style.background = '';
            oBtn.style.color = '';
        }, 1500);
    });

    uiCtrl.lang.addEventListener('change', (e) => {
        const isEn = e.target.checked;
        uiCtrl.nodes.forEach(el => {
            el.innerHTML = isEn ? el.getAttribute('data-en') : el.getAttribute('data-es');
        });

        clearTimeout(uiCtrl.tid);
        uiCtrl.idx = 0;
        uiCtrl.cIdx = 0;
        uiCtrl.del = false;
        uiCtrl.typer.textContent = '';
        initTyper();

        if(vBtn.disabled) {
            vStat.textContent = isEn ? 'Executed' : 'Ejecutado';
        }
        if(gBtn.disabled) {
            gBtn.textContent = isEn ? 'Token Generated' : 'Token Generado';
        }
    });

    uiCtrl.theme.addEventListener('change', (e) => {
        document.body.classList.toggle('light-mode', e.target.checked);
    });

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-reveal').forEach(el => obs.observe(el));
});