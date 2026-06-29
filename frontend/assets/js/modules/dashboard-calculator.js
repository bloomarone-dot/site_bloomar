/* Moteur de Calcul & Dynamic Render (Fixed Bug: No canvas dependency) */
        const baseCA = 12450000;
        const fixedCosts = 2500000;
        const baseVariables = 1620000;

        function updateHeroDashboard(sliderValue) {
            let mult = sliderValue / 100;
            document.getElementById('slider-val').innerText = `${sliderValue}% ${sliderValue === 100 ? '(Base)' : ''}`;

            let nouveauCA = Math.round(baseCA * mult);
            let nouvellesVariables = Math.round(baseVariables * mult);
            let nouvellesDepenses = fixedCosts + nouvellesVariables;
            let nouveauBenefice = nouveauCA - nouvellesDepenses;

            // Values updating
            document.getElementById('ca-valeur').innerText = formatFCFA(nouveauCA);
            document.getElementById('depenses-valeur').innerText = formatFCFA(nouvellesDepenses);
            document.getElementById('benefice-valeur').innerText = formatFCFA(nouveauBenefice);

            // Detail viewports synchronization
            document.getElementById('lbl-re-c').innerText = formatFCFA(nouveauCA);
            document.getElementById('lbl-de-c').innerText = formatFCFA(nouvellesDepenses);
            document.getElementById('calc-couts-var').innerText = formatFCFA(nouvellesVariables);

            // Tendency colors & icons updating
            updateTrendsVisuals(sliderValue);

            // Recalculating & drawing SVG curve coordinates dynamically (Fixed Chart.js rendering crash)
            updateSvgCurve(mult);

            // Recalculating & rendering Donut segments dynamically (Fixed overlapping layers bug)
            updateDonutChart(nouveauCA, fixedCosts, nouvellesVariables, nouveauBenefice);
        }

        function updateTrendsVisuals(sliderValue) {
            const caTrend = document.getElementById('ca-tendance');
            const depTrend = document.getElementById('depenses-tendance');
            const benTrend = document.getElementById('benefice-tendance');

            if (sliderValue >= 100) {
                caTrend.className = "text-[9px] text-emerald-600 font-semibold flex items-center mt-0.5";
                caTrend.innerHTML = `<i data-lucide="trending-up" class="w-2.5 h-2.5 mr-0.5"></i>+${((sliderValue - 100)/10 + 12.5).toFixed(1)}%`;
                
                depTrend.className = "text-[9px] text-rose-600 font-semibold flex items-center mt-0.5";
                depTrend.innerHTML = `<i data-lucide="trending-up" class="w-2.5 h-2.5 mr-0.5"></i>+${((sliderValue - 100)/20 + 4.3).toFixed(1)}%`;

                benTrend.className = "text-[9px] text-emerald-600 font-semibold flex items-center mt-0.5";
                benTrend.innerHTML = `<i data-lucide="trending-up" class="w-2.5 h-2.5 mr-0.5"></i>+${((sliderValue - 100)/8 + 8.7).toFixed(1)}%`;
            } else {
                caTrend.className = "text-[9px] text-rose-600 font-semibold flex items-center mt-0.5";
                caTrend.innerHTML = `<i data-lucide="trending-down" class="w-2.5 h-2.5 mr-0.5"></i>-${((100 - sliderValue)/10 + 1.2).toFixed(1)}%`;

                depTrend.className = "text-[9px] text-emerald-600 font-semibold flex items-center mt-0.5";
                depTrend.innerHTML = `<i data-lucide="trending-down" class="w-2.5 h-2.5 mr-0.5"></i>-${((100 - sliderValue)/20 + 1.5).toFixed(1)}%`;

                benTrend.className = "text-[9px] text-rose-600 font-semibold flex items-center mt-0.5";
                benTrend.innerHTML = `<i data-lucide="trending-down" class="w-2.5 h-2.5 mr-0.5"></i>-${((100 - sliderValue)/8 + 2.1).toFixed(1)}%`;
            }
            lucide.createIcons();
        }

        function updateSvgCurve(mult) {
            // Mapping mult to SVG space coordinates beautifully
            let y4 = Math.max(5, Math.min(95, 90 - 70 * mult));
            let y3 = Math.max(15, Math.min(95, 90 - 35 * mult));
            let y2 = Math.max(30, Math.min(95, 90 - 12 * mult));

            document.getElementById('graph-courbe-ca').setAttribute('d', `M 0,90 C 133,${y2} 266,${y3} 400,${y4}`);
            document.getElementById('graph-point-2').setAttribute('cy', y2);
            document.getElementById('graph-point-3').setAttribute('cy', y3);
            document.getElementById('graph-point-actuel').setAttribute('cy', y4);
        }

        function updateDonutChart(ca, fixes, variables, benefice) {
            const total = fixes + variables + Math.max(0, benefice);
            const pFixes = fixes / total;
            const pVariables = variables / total;
            const pProfit = Math.max(0, benefice) / total;

            const c = 188.4; // 2 * PI * 30

            // Stacking segments cleanly via calculated offsets
            const fEl = document.getElementById('donut-fixes');
            const vEl = document.getElementById('donut-variables');
            const bEl = document.getElementById('donut-benefice');

            fEl.setAttribute('stroke-dasharray', `${pFixes * c} ${c}`);
            fEl.setAttribute('stroke-dashoffset', '0');

            vEl.setAttribute('stroke-dasharray', `${pVariables * c} ${c}`);
            vEl.setAttribute('stroke-dashoffset', `${-(pFixes * c)}`);

            bEl.setAttribute('stroke-dasharray', `${pProfit * c} ${c}`);
            bEl.setAttribute('stroke-dashoffset', `${-((pFixes + pVariables) * c)}`);

            // Tooltip update
            const marginPct = Math.round((benefice / ca) * 100);
            document.getElementById('donut-txt-pourcent').innerText = `${marginPct >= 0 ? marginPct : 0}%`;
        }

        function formatFCFA(val) {
            return val.toLocaleString('fr-FR') + " FCFA";
        }

        // Dummy standard Chart.js init to avoid throwing console errors, but disabled
        function initHeroChart() {
            // Fully managed natively by direct SVG manipulation now!
        }

        // Listener for the slider
        document.addEventListener('DOMContentLoaded', () => {
            const page = document.body.dataset.page;

            const slider = document.getElementById('hero-activity-slider');
            if (slider) {
                slider.addEventListener('input', (e) => updateHeroDashboard(e.target.value));
                updateHeroDashboard(100);
            }

            if (page === 'assist' && typeof initChatbot === 'function') initChatbot();
            if (page === 'tarifs' && typeof renderPricing === 'function') renderPricing('general');
            if (page === 'a-propos' && typeof setupStorytellingObserver === 'function') setupStorytellingObserver();

            if (typeof lucide !== 'undefined') lucide.createIcons();
        });