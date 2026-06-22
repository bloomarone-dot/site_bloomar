/* In-memory cookie preferences state strictly compliant with non-local storage rules */
        let memoryCookieBannerState = null;

        /* Signature Game Rain Simulation with optimized, precise vector logo & 3 infinity circles rendering */
        (function() {
            const COULEURS = ['#a513e2', '#7216db', '#2972d1', '#0caaa6']; 
            const MAX_PARTICULES = 350; 
            
            let canvas, ctx;
            let particules = [];
            let pointsAncrage = [];
            let tempsAssemblage = false;
            let opaciteGlobale = 1.0; 
            let requeteAnimationId;
            let scores = 0;

            function initSignatureGame() {
                const heroSection = document.getElementById('accueil');
                if (!heroSection) return;

                heroSection.style.position = 'relative';
                heroSection.style.overflow = 'hidden';

                canvas = document.createElement('canvas');
                canvas.id = 'bloomar-hero-canvas';
                Object.assign(canvas.style, {
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    zIndex: '0'
                });
                heroSection.prepend(canvas);
                ctx = canvas.getContext('2d');
                
                resize();
                window.addEventListener('resize', resize);
                
                // Vector fallback instead of failing on CORS images: Draw vector text directly
                genererPointsAncrageDuLogoVectoriel();
                genererPluieInitiale();

                // Mouse click handler — limité à la zone hero
                canvas.style.pointerEvents = 'auto';
                canvas.addEventListener('mousedown', function(e) {
                    const rect = canvas.getBoundingClientRect();
                    const mouseX = e.clientX - rect.left;
                    const mouseY = e.clientY - rect.top;

                    particules.forEach((p, idx) => {
                        let dist = Math.hypot(p.x - mouseX, p.y - mouseY);
                        if (dist < p.radius + 15) {
                            // Pop particule
                            p.y = -(Math.random() * 200) - 20;
                            p.x = Math.random() * canvas.width;
                            scores += 10;
                            showToast(`Éclatement de rond ! Score : ${scores} pts`);
                        }
                    });
                });
            }

            function resize() {
                if (!canvas) return;
                const heroSection = document.getElementById('accueil');
                if (!heroSection) return;
                canvas.width = heroSection.offsetWidth;
                canvas.height = heroSection.offsetHeight;
            }

            // Draw clean virtual font pixels into the point matrix directly
            // Draw stylized graphic logo: BL∞MAR ONE with exactly the 3 circles symbolizing the signature/infinity sign!
            function genererPointsAncrageDuLogoVectoriel() {
                pointsAncrage = [];
                const tempCanvas = document.createElement('canvas');
                const tempCtx = tempCanvas.getContext('2d');
                tempCanvas.width = 600;
                tempCanvas.height = 150;
                
                // Draw text "BL"
                tempCtx.fillStyle = "#ffffff";
                tempCtx.font = "black 50px 'Inter', sans-serif";
                tempCtx.fillText("BL", 30, 95);
                
                // Draw text "MAR ONE"
                tempCtx.fillText("MAR ONE", 310, 95);

                // Draw the three beautiful interconnected circles of Bloomar One (Infinity symbol loop)
                tempCtx.strokeStyle = "#ffffff";
                tempCtx.lineWidth = 11;
                
                // Circle 1 (Left Loop of Infinity symbol)
                tempCtx.beginPath();
                tempCtx.arc(145, 78, 30, 0, Math.PI * 2);
                tempCtx.stroke();
                
                // Circle 2 (Right Loop of Infinity symbol)
                tempCtx.beginPath();
                tempCtx.arc(225, 78, 30, 0, Math.PI * 2);
                tempCtx.stroke();

                // Circle 3 (Central Connector Loop of Bloomar architecture)
                tempCtx.beginPath();
                tempCtx.arc(185, 78, 15, 0, Math.PI * 2);
                tempCtx.stroke();

                const imgData = tempCtx.getImageData(0, 0, 600, 150).data;
                const pas = 5;
                const centreX = canvas.width / 2 - 300;
                const centreY = canvas.height / 2 - 75;

                for (let y = 0; y < 150; y += pas) {
                    for (let x = 0; x < 600; x += pas) {
                        const index = (y * 600 + x) * 4;
                        if (imgData[index + 3] > 128) {
                            pointsAncrage.push({
                                x: x + centreX,
                                y: y + centreY,
                                couleur: COULEURS[Math.floor((x / 600) * COULEURS.length)]
                            });
                        }
                    }
                }
            }

            function genererPluieInitiale() {
                const w = canvas.width;
                const h = canvas.height;
                for (let i = 0; i < MAX_PARTICULES; i++) {
                    particules.push({
                        x: Math.random() * w,
                        y: -(Math.random() * 600) - 20,
                        radius: Math.random() * 5 + 4,
                        vitesseY: Math.random() * 2 + 1.5,
                        vitesseX: (Math.random() - 0.5) * 0.5,
                        modeAimant: false,
                        targetIndex: i % pointsAncrage.length
                    });
                }

                // Etape A: After 4.5 seconds of initial rain, assemble logo in watermark
                setTimeout(() => {
                    particules.forEach(p => p.modeAimant = true);
                    tempsAssemblage = true;
                    
                    // Etape B: Logo stays formed, fades out slowly to protect client performance
                    setTimeout(() => {
                        lancerDisparitionTotale();
                    }, 5000);
                }, 4500);
            }

            function lancerDisparitionTotale() {
                let fadeInterval = setInterval(() => {
                    opaciteGlobale -= 0.04;
                    if (opaciteGlobale <= 0) {
                        clearInterval(fadeInterval);
                        nettoyerCanvas();
                    }
                }, 30);
            }

            function nettoyerCanvas() {
                window.removeEventListener('resize', resize);
                particules = [];
                pointsAncrage = [];
                if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
            }

            function animer() {
                if (particules.length === 0) return;
                requeteAnimationId = requestAnimationFrame(animer);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.globalAlpha = opaciteGlobale;

                particules.forEach((p) => {
                    if (!p.modeAimant) {
                        p.y += p.vitesseY;
                        p.x += p.vitesseX;
                        if (p.y > canvas.height) {
                            p.y = -20;
                            p.x = Math.random() * canvas.width;
                        }
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                        ctx.fillStyle = COULEURS[p.targetIndex % COULEURS.length] + 'b3'; // Opacity 0.7
                        ctx.fill();
                    } else {
                        let cible = pointsAncrage[p.targetIndex];
                        if (cible) {
                            let dx = cible.x - p.x;
                            let dy = cible.y - p.y;
                            p.x += dx * 0.09; // Aimantation plus ferme et nette
                            p.y += dy * 0.09;
                            ctx.beginPath();
                            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                            ctx.fillStyle = cible.couleur + '66'; // Assemblé 40% opacité pour lisibilité maximale
                            ctx.fill();
                        }
                    }
                });
            }

            window.addEventListener('load', () => {
                initSignatureGame();
                animer();
            });
        })();

        /* Pricing database including "antifraude/mouchard" on all Premium levels */
        const pricingDataFR = {
            general: [
                {
                    title: "Plan TESTER",
                    price: "0 FCFA",
                    desc: "Accès d'essai complet pendant 14 jours pour explorer l'ensemble de notre plateforme.",
                    features: ["Tableau de bord financier de base", "Essais de modules SYSCOHADA", "Journal de caisse d'essai", "Frais MoMo standards", "Support standard"],
                    cta: "Lancer mon test"
                },
                {
                    title: "Plan STARTER",
                    price: "5 000 FCFA / mois",
                    desc: "Facturé 30 000 FCFA / 6 mois. La liasse comptable essentielle pour petite structure.",
                    features: ["Tableau de bord financier de base", "Journal de caisse numérique (Norme SYSCOHADA)", "Intégration Mobile Money (MTN MoMo & Orange Money)", "Calcul TVA basique", "Support standard par ticket"],
                    cta: "Choisir Starter"
                }
            ],
            restaurant: [
                {
                    title: "Essentiel",
                    price: "30 000 FCFA / 6 mois",
                    desc: "Le strict nécessaire pour la prise de commande courante.",
                    features: ["Prise de commandes sur place/à emporter", "Menu digital via QR Code dynamique", "Suivi des stocks de base (ingrédients)", "Support de caisse standard"],
                    cta: "Prendre l'Essentiel"
                },
                {
                    title: "Pro",
                    price: "114 000 FCFA / 6 mois",
                    desc: "Idéal pour équipes structurées et restaurants à haut volume.",
                    features: ["Multi-comptes serveurs & personnel de cuisine", "Suivi avancé des fiches techniques de production", "Déduction de stock automatisée par plat vendu", "Statistiques des plats les plus rentables"],
                    cta: "Prendre Pro"
                },
                {
                    title: "Premium (IA)",
                    price: "174 000 FCFA / 6 mois",
                    desc: "Intégration technologique absolue avec prévisions et protection.",
                    features: ["Prévisions automatisées par IA de tendances de ventes", "Anticipation des achats au marché Mfoundi/Sandaga", "Alerte intelligente prédictive de stock", "Module Antifraude & Mouchard d'activité de caisse"],
                    cta: "Choisir Premium"
                }
            ],
            boutique: [
                {
                    title: "Essentiel",
                    price: "30 000 FCFA / 6 mois",
                    desc: "Simplifiez vos ventes d'articles physiques au comptoir.",
                    features: ["Gestion de caisse (POS) simplifiée", "Catalogue d'articles avec codes-barres", "Suivi des entrées/sorties courantes", "Fiche client standard"],
                    cta: "Prendre l'Essentiel"
                },
                {
                    title: "Pro",
                    price: "60 000 FCFA / 6 mois",
                    desc: "Parfait pour le retail avec équipe de caissiers.",
                    features: ["Gestion des alertes de seuil de réapprovisionnement", "Historique clients et fidélité (remises, points)", "Multi-utilisateurs sécurisé (caissiers)", "Statistiques de performance d'équipe"],
                    cta: "Prendre Pro"
                },
                {
                    title: "Premium",
                    price: "120 000 FCFA / 6 mois",
                    desc: "Le contrôle absolu sur plusieurs points de vente physiques.",
                    features: ["Gestion de stock multi-boutiques (ex: Ydé et Douala)", "Transferts internes de stocks sécurisés", "Analyse de marge nette avancée par produit", "Système Antifraude / Mouchard de connexions suspectes"],
                    cta: "Choisir Premium"
                }
            ],
            ecole: [
                {
                    title: "Essentiel",
                    price: "80 000 FCFA / an",
                    desc: "La base comptable pour le suivi d'élèves.",
                    features: ["Base de données des élèves/étudiants et classes", "Suivi & encaissement scolarité (MoMo inclus)", "Émission de reçus numériques conformes", "Support par email"],
                    cta: "Prendre l'Essentiel"
                },
                {
                    title: "Pro",
                    price: "250 000 FCFA / an",
                    desc: "Suivez le parcours complet de l'établissement.",
                    features: ["Suivi des absences, notes et bulletins", "Portail Parents : consultation des paiements", "Suivi caisse des dépenses courantes de l'école", "Multi-utilisateurs enseignants"],
                    cta: "Prendre Pro"
                },
                {
                    title: "Premium",
                    price: "500 000 FCFA / an",
                    desc: "Optimisation administrative totale de l'établissement.",
                    features: ["Module E-learning complet : cours & devoirs", "Gestion RH : heures de vacation & fiches de paie", "IA : Détection du risque de décrochage/impayé", "Module Antifraude & Mouchard de validation bancaire"],
                    cta: "Choisir Premium"
                }
            ],
            hotel: [
                {
                    title: "Essentiel",
                    price: "100 000 FCFA / 6 mois",
                    desc: "Planification et check-in indispensables.",
                    features: ["Planning visuel des réservations (Calendrier)", "Enregistrement de check-in / check-out", "Facturation & encaissement de nuitées", "Facturation papier standard"],
                    cta: "Prendre l'Essentiel"
                },
                {
                    title: "Pro",
                    price: "200 000 FCFA / 6 mois",
                    desc: "Centralisation des encaissements annexes.",
                    features: ["Gestion des services reliés (Blanchisserie, Bar/Resto)", "Suivi ménage & entretien des chambres par le personnel", "Synchronisation de base avec plateformes (OTAs)", "Fiches clients réglementaires"],
                    cta: "Prendre Pro"
                },
                {
                    title: "Premium (IA)",
                    price: "500 000 FCFA / 6 mois",
                    desc: "Pilotage dynamique et sécurisé du resort.",
                    features: ["Dynamic Pricing par IA : Tarifs selon occupation/saison", "Rapports d'analyse financière avancée (RevPAR)", "Mouchard & Protection antifraude de validation de caution", "Automatisation des quittances de loyer"],
                    cta: "Choisir Premium"
                }
            ]
        };

        const pricingDataEN = {
            general: [
                { title: "TESTER Plan", price: "0 FCFA", desc: "Full 14-day trial to explore our entire platform.", features: ["Basic financial dashboard", "SYSCOHADA module trials", "Trial cash journal", "Standard MoMo fees", "Standard support"], cta: "Start my trial" },
                { title: "STARTER Plan", price: "5,000 FCFA / month", desc: "Billed 30,000 FCFA / 6 months. Essential accounting for small businesses.", features: ["Basic financial dashboard", "Digital cash journal (SYSCOHADA)", "Mobile Money integration (MTN MoMo & Orange Money)", "Basic VAT calculation", "Standard ticket support"], cta: "Choose Starter" }
            ],
            restaurant: [
                { title: "Essential", price: "30,000 FCFA / 6 months", desc: "Everything needed for daily order taking.", features: ["Dine-in/takeaway orders", "Digital menu via dynamic QR Code", "Basic ingredient stock tracking", "Standard POS support"], cta: "Get Essential" },
                { title: "Pro", price: "114,000 FCFA / 6 months", desc: "Ideal for structured teams and high-volume restaurants.", features: ["Multi-server & kitchen accounts", "Advanced recipe cost tracking", "Automated stock deduction per dish", "Most profitable dish statistics"], cta: "Get Pro" },
                { title: "Premium (AI)", price: "174,000 FCFA / 6 months", desc: "Full tech integration with forecasting and protection.", features: ["AI sales trend forecasting", "Market purchase anticipation", "Smart stock alerts", "Anti-fraud & cash activity monitoring"], cta: "Choose Premium" }
            ],
            boutique: [
                { title: "Essential", price: "30,000 FCFA / 6 months", desc: "Simplify in-store physical product sales.", features: ["Simplified POS", "Barcode product catalog", "Basic in/out tracking", "Standard customer file"], cta: "Get Essential" },
                { title: "Pro", price: "60,000 FCFA / 6 months", desc: "Perfect for retail with cashier teams.", features: ["Restock threshold alerts", "Customer history & loyalty", "Secure multi-user (cashiers)", "Team performance stats"], cta: "Get Pro" },
                { title: "Premium", price: "120,000 FCFA / 6 months", desc: "Full control across multiple store locations.", features: ["Multi-store inventory", "Secure internal stock transfers", "Advanced net margin analysis", "Anti-fraud / suspicious login monitoring"], cta: "Choose Premium" }
            ],
            ecole: [
                { title: "Essential", price: "80,000 FCFA / year", desc: "Accounting base for student tracking.", features: ["Student & class database", "Tuition tracking & collection (MoMo)", "Compliant digital receipts", "Email support"], cta: "Get Essential" },
                { title: "Pro", price: "250,000 FCFA / year", desc: "Track the full school journey.", features: ["Absence, grades & report cards", "Parent portal for payments", "School expense cash tracking", "Multi-user teachers"], cta: "Get Pro" },
                { title: "Premium", price: "500,000 FCFA / year", desc: "Full administrative optimization.", features: ["Full E-learning module", "HR: substitute hours & payroll", "AI: dropout/unpaid fee risk detection", "Anti-fraud bank validation module"], cta: "Choose Premium" }
            ],
            hotel: [
                { title: "Essential", price: "100,000 FCFA / 6 months", desc: "Essential planning and check-in.", features: ["Visual booking calendar", "Check-in / check-out registration", "Night billing & collection", "Standard paper invoicing"], cta: "Get Essential" },
                { title: "Pro", price: "200,000 FCFA / 6 months", desc: "Centralized ancillary revenue.", features: ["Linked services (Laundry, Bar/Restaurant)", "Housekeeping & room maintenance", "Basic OTA sync", "Regulatory guest files"], cta: "Get Pro" },
                { title: "Premium (AI)", price: "500,000 FCFA / 6 months", desc: "Dynamic and secure resort management.", features: ["AI dynamic pricing by occupancy/season", "Advanced financial analysis (RevPAR)", "Anti-fraud deposit validation", "Automated lease receipts"], cta: "Choose Premium" }
            ]
        };

        let pricingData = pricingDataFR;

        function syncPricingData() {
            pricingData = (typeof getLang === 'function' && getLang() === 'en') ? pricingDataEN : pricingDataFR;
        }
        window.syncPricingData = syncPricingData;
        syncPricingData();

        window.addEventListener('languageChanged', syncPricingData);