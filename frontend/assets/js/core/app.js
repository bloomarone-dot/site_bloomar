/* Storytelling Background Color Switcher and IntersectionObserver */
        function setupStorytellingObserver() {
            const blocks = document.querySelectorAll('.story-block');
            const container = document.querySelector('.story-container');

            const options = {
                root: null,
                threshold: 0.15,
                rootMargin: "0px 0px -40px 0px"
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && container) {
                        if (entry.target.classList.contains('section-light')) {
                            container.classList.add('light-mode');
                        } else if (entry.target.classList.contains('section-dark')) {
                            container.classList.remove('light-mode');
                        }
                    }
                });
            }, options);

            blocks.forEach(b => observer.observe(b));
        }

        /* Pricing Tab Switchers */
        let activeTarifCategory = 'general';
        let activeMetierSector = 'restaurant';

        function switchTarifCategory(cat) {
            activeTarifCategory = cat;
            const tabGen = document.getElementById('tab-tr-general');
            const tabSpec = document.getElementById('tab-tr-specialise');
            const metiersSub = document.getElementById('sub-tabs-metiers');

            if (cat === 'general') {
                tabGen.className = 'tarifs-tab tarifs-tab--active';
                tabSpec.className = 'tarifs-tab';
                tabGen.setAttribute('aria-selected', 'true');
                tabSpec.setAttribute('aria-selected', 'false');
                metiersSub.classList.remove('is-visible');
                renderPricing('general');
            } else {
                tabSpec.className = 'tarifs-tab tarifs-tab--active';
                tabGen.className = 'tarifs-tab';
                tabSpec.setAttribute('aria-selected', 'true');
                tabGen.setAttribute('aria-selected', 'false');
                metiersSub.classList.add('is-visible');
                renderPricing(activeMetierSector);
            }
        }

        function switchMetierSector(sector) {
            activeMetierSector = sector;
            const sectors = ['restaurant', 'boutique', 'ecole', 'hotel'];
            sectors.forEach(s => {
                const btn = document.getElementById(`tab-tr-${s}`);
                if (!btn) return;
                btn.className = s === sector
                    ? 'tarifs-metier-tab tarifs-metier-tab--active'
                    : 'tarifs-metier-tab';
            });
            renderPricing(sector);
        }

        function renderPricing(key) {
            const container = document.getElementById('pricing-grid-container');
            if (!container || !pricingData[key]) return;
            container.innerHTML = '';
            const list = pricingData[key];

            list.forEach(p => {
                const isPremium = p.title.toLowerCase().includes('premium');
                const card = document.createElement('article');
                card.className = 'tarifs-card' + (isPremium ? ' tarifs-card--featured' : '');

                const badgeHtml = isPremium
                    ? '<span class="tarifs-card__badge"><i data-lucide="shield-alert" class="w-2.5 h-2.5 inline"></i> Antifraude</span>'
                    : '';

                let featuresHtml = '';
                p.features.forEach(f => {
                    featuresHtml += `<li><i data-lucide="check" class="w-3.5 h-3.5"></i><span>${f}</span></li>`;
                });

                card.innerHTML = `
                    ${badgeHtml}
                    <div>
                        <span class="tarifs-card__label">Accès membre</span>
                        <h3 class="tarifs-card__title">${p.title}</h3>
                        <p class="tarifs-card__price">${p.price}</p>
                        <p class="tarifs-card__desc">${p.desc}</p>
                        <div class="tarifs-card__divider"></div>
                        <ul class="tarifs-card__features">${featuresHtml}</ul>
                    </div>
                    <button type="button" onclick="triggerUniversalCaptureModal('offre-premium')" class="tarifs-card__cta ${isPremium ? 'tarifs-card__cta--primary' : 'tarifs-card__cta--secondary'}">
                        ${p.cta}
                    </button>
                `;
                container.appendChild(card);
            });
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        /* Table Accordions Logic */
        let accordionsOpen = false;
        function toggleAccordion(id) {
            const el = document.getElementById(id);
            if (!el) return;
            el.classList.toggle('is-open');
        }

        function toggleAllTableAccordions() {
            const ids = ['acc-caisse', 'acc-stocks', 'acc-compta', 'acc-metier', 'acc-ia'];
            const btn = document.getElementById('btn-toggle-all-text');
            accordionsOpen = !accordionsOpen;

            ids.forEach(id => {
                const el = document.getElementById(id);
                if (!el) return;
                el.classList.toggle('is-open', accordionsOpen);
            });
            if (btn) btn.innerText = accordionsOpen ? 'Tout replier' : 'Tout déplier';
        }

        /* Lead Capture & Resources popups logic */
        let currentDownloadContext = '';

        function triggerUniversalCaptureModal(context) {
            currentDownloadContext = context;
            document.getElementById('capture-popup-modal').classList.remove('hidden');
        }

        function closeUniversalCaptureModal() {
            document.getElementById('capture-popup-modal').classList.add('hidden');
        }

        /* handleUniversalCaptureSubmit → défini dans api.js */

        /* Cookie consent → cookie-consent.js (BloomarCookieConsent) */

        /* Modal Developers Beta Access */
        function openDeveloperModal() {
            document.getElementById('developer-modal').classList.remove('hidden');
        }

        function closeDeveloperModal() {
            document.getElementById('developer-modal').classList.add('hidden');
        }

        /* handleDevLeadSubmit et handleLeadSubmit → définis dans api.js */

        function toggleMobileMenu() {
            const menu = document.getElementById('mobile-menu');
            menu.classList.toggle('hidden');
        }

        function showToast(message) {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');
            toast.className = "flex items-center space-x-3 px-4 py-3 bg-bloomar-navy text-white rounded-xl shadow-2xl text-xs font-semibold border border-slate-700 transform translate-y-2 opacity-0 transition-all duration-300";
            toast.innerHTML = `
                <i data-lucide="info" class="w-4 h-4 text-bloomar-turquoise"></i>
                <span>${message}</span>
            `;
            container.appendChild(toast);
            lucide.createIcons();

            setTimeout(() => {
                toast.classList.remove('translate-y-2', 'opacity-0');
            }, 10);

            setTimeout(() => {
                toast.classList.add('translate-y-2', 'opacity-0');
                setTimeout(() => { toast.remove(); }, 300);
            }, 4000);
        }

        function refreshPricingDisplay() {
            const key = activeTarifCategory === 'general' ? 'general' : activeMetierSector;
            renderPricing(key);
        }
        window.refreshPricingDisplay = refreshPricingDisplay;

        window.addEventListener('languageChanged', () => {
            if (typeof syncPricingData === 'function') syncPricingData();
            refreshPricingDisplay();
        });
        let currentSimSectorKey = 'resto';
        const simSectorPresets = {
            resto: {
                ca: 8000000,
                marge: 65,
                fixes: 2500000,
                metric4: 45,
                metric4Label: "Clients servis par jour",
                metric4Unit: "clients",
                caLabel: "CA Prévisionnel Mensuel (FCFA)",
                adviceGood: "Votre taux de marge de 65% correspond à la norme idéale SYSCOHADA pour la restauration. Vos coûts d'achat au marché Mfoundi/Sandaga sont optimisés.",
                adviceBad: "Attention : Vos charges fixes ou l'inflation sur les matières premières réduisent votre bénéfice. Songez à renégocier les achats en gros."
            },
            boutique: {
                ca: 5000000,
                marge: 40,
                fixes: 1200000,
                metric4: 20,
                metric4Label: "Nombre de Caissiers / Personnel",
                metric4Unit: "collaborateurs",
                caLabel: "Ventes Mensuelles Boutique (FCFA)",
                adviceGood: "Vos ventes de boutique génèrent un point mort bas et sécurisant. Le suivi de vos codes-barres préviendra les ruptures.",
                adviceBad: "Le commerce de retail requiert une rotation rapide des stocks. Abaissez vos coûts fixes de fonctionnement."
            },
            ecole: {
                ca: 15000000,
                marge: 75,
                fixes: 5000000,
                metric4: 120,
                metric4Label: "Nombre d'écoliers inscrits",
                metric4Unit: "élèves",
                caLabel: "Total Écolages Annuels (FCFA)",
                adviceGood: "Une marge de 75% est excellente pour le secteur éducatif. Cela vous permet d'investir sereinement dans la formation des enseignants.",
                adviceBad: "Risque accru d'impayés d'écolage détecté : Notre module d'IA vous aidera à identifier précocement les élèves à risque de décrochage financier."
            },
            hotel: {
                ca: 12000000,
                marge: 80,
                fixes: 4500000,
                metric4: 60,
                metric4Label: "Taux d'Occupation Estimé (%)",
                metric4Unit: "%",
                caLabel: "Revenus Hébergement & Nuitées (FCFA)",
                adviceGood: "Votre seuil de rentabilité hôtelier est franchi dès le milieu du mois. Nos fonctionnalités de tarification dynamique optimiseront vos nuitées inoccupées.",
                adviceBad: "Taux d'occupation trop bas pour couvrir l'entretien des chambres. Réduisez temporairement vos frais de maintenance ou offrez des packages promotionnels."
            }
        };

        function openFullSimulatorModal() {
            document.getElementById('full-simulator-modal').classList.remove('hidden');
            setSimulatorSector('resto'); // sector default
        }

        function closeFullSimulatorModal() {
            document.getElementById('full-simulator-modal').classList.add('hidden');
        }

        function setSimulatorSector(key) {
            currentSimSectorKey = key;
            const sectors = ['resto', 'boutique', 'ecole', 'hotel'];
            sectors.forEach(s => {
                const btn = document.getElementById(`sim-sec-${s}`);
                if (s === key) {
                    btn.className = "px-4 py-2 bg-bloomar-violet text-white text-xs font-bold rounded-xl transition-all shadow-md";
                } else {
                    btn.className = "px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-bold rounded-xl transition-all";
                }
            });

            // Preset values loading
            const preset = simSectorPresets[key];
            document.getElementById('sim-slide-ca').value = preset.ca;
            document.getElementById('sim-slide-marge').value = preset.marge;
            document.getElementById('sim-slide-fixes').value = preset.fixes;
            document.getElementById('sim-slide-metric4').value = preset.metric4;

            // Labels update
            document.getElementById('sim-lbl-ca').innerText = preset.caLabel;
            document.getElementById('sim-lbl-metric4').innerText = preset.metric4Label;

            // Limits adjusting for sector specific parameters
            if (key === 'ecole') {
                document.getElementById('sim-slide-metric4').min = 10;
                document.getElementById('sim-slide-metric4').max = 1000;
            } else if (key === 'boutique') {
                document.getElementById('sim-slide-metric4').min = 1;
                document.getElementById('sim-slide-metric4').max = 50;
            } else if (key === 'hotel') {
                document.getElementById('sim-slide-metric4').min = 5;
                document.getElementById('sim-slide-metric4').max = 100;
            } else {
                document.getElementById('sim-slide-metric4').min = 5;
                document.getElementById('sim-slide-metric4').max = 300;
            }

            runLivePmeSimulation();
        }

        function runLivePmeSimulation() {
            const ca = parseFloat(document.getElementById('sim-slide-ca').value);
            const margePct = parseFloat(document.getElementById('sim-slide-marge').value);
            const fixes = parseFloat(document.getElementById('sim-slide-fixes').value);
            const metric4 = parseFloat(document.getElementById('sim-slide-metric4').value);

            const preset = simSectorPresets[currentSimSectorKey];

            // Values labels update
            document.getElementById('sim-val-ca').innerText = ca.toLocaleString('fr-FR') + " FCFA";
            document.getElementById('sim-val-marge').innerText = margePct + "%";
            document.getElementById('sim-val-fixes').innerText = fixes.toLocaleString('fr-FR') + " FCFA";
            document.getElementById('sim-val-metric4').innerText = `${metric4} ${preset.metric4Unit}`;

            // Model logic calculations
            const margeDec = margePct / 100;
            const pm = Math.round(fixes / margeDec);
            const benefice = Math.round(ca - (ca * (1 - margeDec) + fixes));
            const bfr = Math.round(ca * 0.2); // average estimation standard
            const safetyTrésorerie = Math.round(fixes * 3); // 3 months of fixes

            // Interface labels updates
            document.getElementById('sim-res-benefice').innerText = (benefice >= 0 ? benefice.toLocaleString('fr-FR') : "Pertes : " + Math.abs(benefice).toLocaleString('fr-FR')) + " F";
            document.getElementById('sim-res-benefice').className = benefice >= 0 ? "text-xs font-black text-bloomar-turquoise mt-0.5" : "text-xs font-black text-rose-500 mt-0.5";
            document.getElementById('sim-res-pm').innerText = pm.toLocaleString('fr-FR') + " F";
            document.getElementById('sim-res-bfr').innerText = bfr.toLocaleString('fr-FR') + " F";
            document.getElementById('sim-res-safety').innerText = safetyTrésorerie.toLocaleString('fr-FR') + " F";

            // Advice update
            const adviceBox = document.getElementById('sim-expert-advice-txt');
            if (benefice >= 0) {
                adviceBox.innerHTML = `<strong>💡 Modèle de réussite :</strong> ${preset.adviceGood}`;
            } else {
                adviceBox.innerHTML = `<strong>⚠️ Alerte d'écart :</strong> ${preset.adviceBad}`;
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            const page = document.body.dataset.page;
            if (page === 'tarifs' && typeof renderPricing === 'function') renderPricing('general');
        });