/* Bloomar Assist Interactive Conversational Engine */
        const aiDatabase = {
            finance: {
                name: "🤖 Bloomar Finance",
                questions: [
                    "Comment calculer mon seuil de rentabilité ?",
                    "Mon restaurant est-il rentable ?",
                    "C'est quoi le BFR et pourquoi mon cash manque ?",
                    "Comment fixer mon prix de vente ?",
                    "De combien de capital ai-je besoin pour lancer mon projet ?"
                ],
                responses: [
                    "C'est le niveau de chiffre d'affaires (CA) à atteindre pour couvrir vos charges. Formule : $Charges\\ Fixes / Taux\\ de\\ Marge$. Faisons une simulation ensemble :",
                    "Dans la restauration au Cameroun, la rentabilité repose sur la règle des 3 tiers : 30 à 35% pour les matières premières (achats au marché Mfoundi ou Sandaga), 30% pour le personnel, et le reste pour les charges fixes et votre bénéfice. Sentez-vous que vos coûts de matières premières dépassent ce seuil ?",
                    "Le Besoin en Fonds de Roulement (BFR), c'est l'argent bloqué entre le moment où vous achetez vos stocks et le moment où votre client vous paye. Si vos clients (souvent des grandes entreprises) vous payent à 60 jours, votre cash s'épuise vite, même si vous faites des ventes.",
                    "Ne fixez pas votre prix uniquement par rapport à la concurrence. Calculez votre coût de revient complet (Achat + Transport/Douane + Main d'œuvre) et appliquez un coefficient de marge. Pour du commerce général, on vise souvent un coefficient de 1,3 à 1,5.",
                    "En plus des investissements de départ (matériel, caution locale), vous devez prévoir au moins 3 à 6 mois de charges fixes en trésorerie de démarrage (le temps que les premiers clients paient). Sans cela, c'est la faillite technique rapide."
                ],
                options: [
                    ["Calculer le mien", "C'est quoi le taux de marge ?"],
                    ["Oui, les prix augmentent", "Non, mon problème est le volume"],
                    ["Comment réduire ce délai ?", "Calculer mon BFR"],
                    ["Exemple de calcul", "Revenir au menu"],
                    ["Demander un plan financier", "Revenir au menu"]
                ]
            },
            legal: {
                name: "⚖️ Bloomar Legal",
                questions: [
                    "Quelles sont les étapes pour créer une SARL au Cameroun ?",
                    "Quelle est la différence entre SARL et SAS ?",
                    "Que doit obligatoirement contenir un contrat de prestation ?",
                    "Comment postuler efficacement à un marché public au Cameroun ?",
                    "Un gérant de SARL peut-il être révoqué facilement ?"
                ],
                responses: [
                    "Depuis la réforme OHADA, vous pouvez créer une SARL avec un capital minimum libre (généralement 100 000 FCFA). Les étapes clés :\n1. Rédaction des statuts (sous seing privé ou chez le notaire).\n2. Dépôt du capital en banque ou chez le notaire.\n3. Formalités au CFCE pour obtenir le RCCM, la Patente et le NIU en 72h.",
                    "La SARL est idéale pour les structures familiales ou les petits projets (gérance simple). La SAS (Société Actions Simplifiée) offre une liberté totale dans les statuts : idéale si vous ouvrez le capital à des investisseurs.",
                    "Selon le droit OHADA, pour vous protéger des impayés, votre contrat doit mentionner : L'objet précis de la mission, les modalités de paiement (ex: 40% commande, 60% livraison), les pénalités de retard, et le tribunal compétent (ex: Yaoundé/Douala) en cas de litige.",
                    "Le dossier doit être irréprochable. Côté légal, il vous faut impérativement : l'attestation de non-redevance (ANR) valide, l'attestation CNPS, le quitus fiscal, et une caution de soumission bancaire. La moindre pièce expirée élimine le dossier d'office.",
                    "Oui, le gérant peut être révoqué par décision des associés représentant plus de la moitié des parts sociales. Attention cependant : si la révocation est décidée sans juste motif, le gérant peut réclamer des dommages-intérêts au tribunal."
                ],
                options: [
                    ["Combien ça coûte au total ?", "Télécharger un modèle"],
                    ["Choisir pour mon projet", "Revenir au menu"],
                    ["Voir un modèle de contrat", "Revenir au menu"],
                    ["Vérifier mes pièces légales", "Revenir au menu"],
                    ["Sécuriser une gérance", "Revenir au menu"]
                ]
            },
            compta: {
                name: "📚 Bloomar Compta",
                questions: [
                    "Quelles sont les obligations comptables minimales selon le SYSCOHADA ?",
                    "Comment comptabiliser l'achat d'un ordinateur de bureau ?",
                    "Pourquoi mon solde de caisse ne correspond pas à ma comptabilité ?",
                    "Comment se passe la clôture des comptes en fin d'année ?",
                    "Quelle de durée d'amortissement d'un véhicule de livraison ?"
                ],
                responses: [
                    "Toute PME au Cameroun doit tenir une comptabilité standardisée. Si votre CA est inférieur à 60 millions FCFA, vous êtes éligible au Système Minimal de Trésorerie (SMT) (un simple journal de caisse et banque suffit). Au-delà, le Système Normal est obligatoire avec Bilan, Compte de résultat et Notes annexes.",
                    "Un ordinateur n'est pas une charge courante, c'est une immobilisation. Selon le SYSCOHADA révisé, vous devez débiter le compte 2441 (Matériel informatique), débiter le compte 4451 (TVA récupérable sur immo) et créditer le compte 481 ou la banque.",
                    "C'est le problème classique des PME : les dépenses non documentées. Chaque sortie de caisse pour un 'achat rapide' doit faire l'objet d'un ticket de caisse ou d'un reçu signé. En comptabilité, pas de pièce justificative = pas de dépense.",
                    "L'exercice comptable se clôture au 31 décembre. Vous devez faire l'inventaire physique des stocks, comptabiliser les amortissements et provisions, et générer la liasse fiscale (DSF) à déposer au plus tard le 15 mars de l'année suivante à la DGI.",
                    "Selon les usages admis par l'administration fiscale camerounaise et le SYSCOHADA, un véhicule de transport ou de livraison s'amortit généralement en mode linéaire sur 4 ou 5 ans, soit un taux annuel de 20% à 25%."
                ],
                options: [
                    ["Quel est mon système ?", "Revenir au menu"],
                    ["Comment l'amortir ?", "Revenir au menu"],
                    ["Mettre en place un bon de caisse", "Revenir au menu"],
                    ["Aide pour la DSF", "Revenir au menu"],
                    ["Calculer l'amortissement", "Revenir au menu"]
                ]
            },
            fiscal: {
                name: "💰 Bloomar Fiscal",
                questions: [
                    "Quel est le taux réel de la TVA au Cameroun et qui la paie ?",
                    "Comment calculer mon acompte d'impôt mensuel ?",
                    "Qu'est-ce que l'Acompte sur Achat (AIR) ?",
                    "Quelles sont les sanctions en cas de retard de déclaration ?",
                    "Qui est soumis au Régime Réel au Cameroun ?"
                ],
                responses: [
                    "Le taux général de la TVA est de 19,25% (17,5% de principal + 10% de Centimes Additionnels Communaux). C'est le consommateur final qui la paie. Si vous êtes au régime Réel, vous la collectez sur vos ventes et vous la reversez à la DGI après déduction de la TVA payée.",
                    "L'acompte sur l'impôt sur le revenu se paie mensuellement avant le 15 du mois suivant. Le taux dépend de votre régime fiscal :\n- Régime Réel : 2,2% du CA mensuel.\n- Régime Simplifié : 3,3% du CA mensuel.\n(Taux incluant les CAC).",
                    "Si vous achetez des marchandises chez un grossiste ou un importateur, celui-ci retient à la source un pourcentage (entre 1% et 10% selon votre statut et le sien) au titre d'acompte sur vos impôts. Vous pourrez déduire ce montant lors de votre déclaration mensuelle.",
                    "La DGI camerounaise applique des pénalités strictes : 10% par mois de retard sur l'impôt dû (plafonné à 30% si bonne foi, ou 100% si manœuvre frauduleuse), plus un intérêt de retard de 0,5% par mois. Même une déclaration à zéro subit une amende.",
                    "Depuis la loi de finances, sont obligatoirement soumises au Régime Réel les entreprises qui réalisent un chiffre d'affaires annuel égal ou supérieur à 50 millions de FCFA. En dessous, vous relevez du Régime Simplifié ou des Institutions."
                ],
                options: [
                    ["Simuler un calcul de TVA", "Revenir au menu"],
                    ["Calculer mon acompte ce mois", "Revenir au menu"],
                    ["Comment le déduire ?", "Revenir au menu"],
                    ["Demander une assistance fiscale", "Revenir au menu"],
                    ["Vérifier mon régime fiscal", "Revenir au menu"]
                ]
            },
            advisor: {
                name: "📊 Business Advisor",
                questions: [
                    "Mon chiffre d'affaires baisse, que dois-je analyser en premier ?",
                    "Comment motiver mon équipe commerciale pour booster les ventes ?",
                    "Est-il rentable d'ouvrir un deuxième point de vente ?",
                    "Comment gérer la concurrence qui casse les prix ?",
                    "Comment digitaliser mon activité sans dépenser des millions ?"
                ],
                responses: [
                    "Une baisse de CA vient de trois facteurs possibles :\n1. Le volume (moins de clients).\n2. Le panier moyen (les clients achètent moins cher).\n3. La fréquence (ils achètent moins souvent).\nLequel de ces indicateurs a le plus chuté chez vous ces derniers mois ?",
                    "Au Cameroun, un commercial payé uniquement au fixe devient vite passif. Mettez en place une structure de rémunération : Un fixe de base décent + une commission progressive (ex: 2% sur le CA généré jusqu'à l'objectif, 5% au-delà). L'impact est immédiat.",
                    "Ouvrir un second site duplique vos charges fixes avant de dupliquer vos revenus. Vous devez vous assurer que votre premier point de vente est 'autonome' (il tourne sans votre présence physique) et que vous disposez d'une trésorerie d'au moins 6 mois pour financer le démarrage du second.",
                    "Si vous baissez vos prix pour vous aligner, vous tuez votre marge. Changez de terrain : offrez une meilleure expérience client, des délais de livraison garantis, ou un packaging premium. Le client accepte de payer plus cher s'il a la certitude de la qualité.",
                    "Ne commencez pas par un progiciel lourd. Utilisez des outils simples et locaux : un catalogue WhatsApp Business propre, un système de paiement Mobile Money intégré, et un tableur automatisé ou une application sur-mesure (type AppSheet) pour suivre vos stocks."
                ],
                options: [
                    ["Le nombre de clients", "Le panier moyen"],
                    ["Exemple de grille de commission", "Revenir au menu"],
                    ["Faire un diagnostic d'expansion", "Revenir au menu"],
                    ["Améliorer mon offre", "Revenir au menu"],
                    ["Découvrir nos solutions digitales", "Revenir au menu"]
                ]
            }
        };

        let currentAssistantKey = 'finance';
        let chatState = 'scenar'; // or capturing_cf, capturing_tm, capturing_tva, capturing_ca_acompte
        let tempCalculations = {};

        // Run chatbot initializing
        function initChatbot() {
            selectAssistant('finance');
        }

        function selectAssistant(key) {
            currentAssistantKey = key;
            chatState = 'scenar';
            tempCalculations = {};
            
            const keys = ['finance', 'legal', 'compta', 'fiscal', 'advisor'];
            keys.forEach(k => {
                const btn = document.getElementById(`btn-as-${k}`);
                if (k === key) {
                    btn.classList.add('bg-bloomar-violet/10', 'border-bloomar-violet/30');
                    btn.classList.remove('bg-slate-50', 'border-slate-200');
                } else {
                    btn.classList.remove('bg-bloomar-violet/10', 'border-bloomar-violet/30');
                    btn.classList.add('bg-slate-50', 'border-slate-200');
                }
            });

            const assistant = aiDatabase[key];
            document.getElementById('current-ai-name').innerText = assistant.name;

            const chatBody = document.getElementById('ai-chat-body');
            chatBody.innerHTML = `
                <div class="flex items-start space-x-3">
                    <div class="p-2 bg-bloomar-violet/10 text-bloomar-violet rounded-lg"><i data-lucide="bot" class="w-4 h-4"></i></div>
                    <div class="bg-white border border-slate-200 p-4 rounded-2xl max-w-[80%] space-y-2 text-slate-700 shadow-sm">
                        <p class="leading-relaxed">${typeof t === 'function' ? t('chatbot.welcome') : 'Bonjour ! Je suis'} <strong>${assistant.name}</strong>, ${typeof t === 'function' ? t('chatbot.welcomeRole') : "votre conseiller expert d'aide au pilotage."}</p>
                        <p class="text-[10px] text-slate-400 italic">${typeof t === 'function' ? t('chatbot.hint') : 'Cliquez sur une question ci-dessous ou posez votre propre question pour me tester.'}</p>
                    </div>
                </div>
            `;

            // Setup questions buttons
            const container = document.getElementById('preset-questions-container');
            container.innerHTML = '';
            assistant.questions.forEach((q, idx) => {
                const btn = document.createElement('button');
                btn.className = "text-[10px] bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 px-3 py-2 rounded-xl transition-all";
                btn.innerText = q;
                btn.onclick = () => triggerQuestionScenario(idx);
                container.appendChild(btn);
            });
            lucide.createIcons();
        }

        window.addEventListener('languageChanged', () => {
            if (typeof selectAssistant === 'function') selectAssistant(currentAssistantKey);
        });

        function triggerQuestionScenario(index) {
            const assistant = aiDatabase[currentAssistantKey];
            const question = assistant.questions[index];
            const response = assistant.responses[index];
            const opts = assistant.options[index];

            appendUserMessage(question);
            triggerAiResponseFlow(response, opts);
        }

        function triggerAiResponseFlow(text, options) {
            const chatBody = document.getElementById('ai-chat-body');
            const thinkingId = "thinking-" + Date.now();
            
            const thinkingHtml = `
                <div id="${thinkingId}" class="flex items-start space-x-3">
                    <div class="p-2 bg-slate-100 text-slate-400 rounded-lg"><i data-lucide="loader" class="w-4 h-4 animate-spin"></i></div>
                    <div class="bg-slate-100 p-3 rounded-2xl max-w-[80%] flex items-center space-x-1">
                        <div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>
                    </div>
                </div>
            `;
            chatBody.insertAdjacentHTML('beforeend', thinkingHtml);
            chatBody.scrollTop = chatBody.scrollHeight;
            lucide.createIcons();

            setTimeout(() => {
                const element = document.getElementById(thinkingId);
                if (element) element.remove();

                const formattedReply = text.replace(/\n/g, "<br>").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
                const replyHtml = `
                    <div class="flex items-start space-x-3">
                        <div class="p-2 bg-bloomar-violet/10 text-bloomar-violet rounded-lg"><i data-lucide="bot" class="w-4 h-4"></i></div>
                        <div class="bg-white border border-slate-200 p-4 rounded-2xl max-w-[80%] space-y-2 text-slate-700 shadow-sm">
                            <p class="leading-relaxed">${formattedReply}</p>
                        </div>
                    </div>
                `;
                chatBody.insertAdjacentHTML('beforeend', replyHtml);
                chatBody.scrollTop = chatBody.scrollHeight;

                // Load contextual buttons (the Guidage Prompting rule)
                const container = document.getElementById('preset-questions-container');
                container.innerHTML = '';
                if (options) {
                    options.forEach(opt => {
                        const btn = document.createElement('button');
                        btn.className = "text-[10px] bg-bloomar-violet/10 hover:bg-bloomar-violet text-bloomar-violet hover:text-white border border-bloomar-violet/20 px-3 py-2 rounded-xl transition-all font-bold";
                        btn.innerText = opt;
                        btn.onclick = () => handleContextualOptionClick(opt);
                        container.appendChild(btn);
                    });
                }
                lucide.createIcons();
            }, 1800);
        }

        function handleContextualOptionClick(optName) {
            appendUserMessage(optName);

            // Calculation and branches routings
            if (optName === "Calculer le mien") {
                chatState = 'capturing_cf';
                triggerAiResponseFlow("Prêtons-nous au jeu. Indiquez-moi d'abord le montant estimé de vos Charges Fixes mensuelles (loyer, salaires, abonnements, électricité) en FCFA. (Tapez juste le chiffre)", []);
            } else if (optName === "C'est quoi le taux de marge ?") {
                triggerAiResponseFlow("Le taux de marge, c'est le pourcentage que vous gagnez sur une vente après avoir payé le coût direct du produit.<br><br><strong>Exemple :</strong> Vous achetez un sac de ciment à 4 000 FCFA et vous le revendez à 5 000 FCFA. Votre marge brute est de 1 000 FCFA. Votre taux de marge est de : (1 000 / 5 000) * 100 = 20%. Plus ce taux est élevé, plus vite vous atteignez la rentabilité.", ["Calculer le mien", "Revenir au menu"]);
            } else if (optName === "Oui, les prix augmentent") {
                triggerAiResponseFlow("C’est l’effet de l’inflation sur les marchés à Douala et Yaoundé. Si vos coûts d'achats augmentent mais que vos prix de menu restent fixes, votre marge s'effondre. Vous avez deux leviers : renégocier avec vos fournisseurs ou réduire discrètement les portions ('shrinkflation') sans toucher au prix.", ["Demander un pré-diagnostic", "Revenir au menu"]);
            } else if (optName === "Simuler un calcul de TVA") {
                chatState = 'capturing_tva';
                triggerAiResponseFlow("Entrez le montant TTC (Toutes Taxes Comprises) d'une facture que vous souhaitez analyser (en FCFA) :", []);
            } else if (optName === "Calculer mon acompte ce mois") {
                chatState = 'capturing_ca_acompte';
                triggerAiResponseFlow("Quel est le Chiffre d'Affaires brut que vous avez réalisé ce mois-ci (en FCFA) ?", []);
            } else if (optName === "Télécharger un modèle" || optName === "Voir un modèle de contrat" || optName === "Demander un plan financier" || optName === "Aide pour la DSF") {
                triggerUniversalCaptureModal('modeles-sarl-legal');
            } else if (optName === "Combien ça coûte au total ?") {
                triggerAiResponseFlow("Pour une SARL au capital minimum (100 000 FCFA), les frais administratifs au CFCE s'élèvent à environ 50 000 à 70 000 FCFA. À cela s'ajoutent les honoraires professionnels.", ["Obtenir un devis", "Revenir au menu"]);
            } else if (optName === "Choisir pour mon projet") {
                triggerAiResponseFlow("Comptez-vous lever des fonds auprès d'investisseurs extérieurs (fonds d'investissement, business angels) dans les 24 prochains mois ?", ["Oui, c'est prévu", "Non, entre fondateurs"]);
            } else if (optName === "Oui, c'est prévu") {
                triggerAiResponseFlow("Optez pour la SAS. Elle permet de créer des actions de préférence et de protéger votre pouvoir de décision même si vous devenez minoritaire en capital.", ["Valider avec un juriste", "Revenir au menu"]);
            } else if (optName === "Non, entre fondateurs") {
                triggerAiResponseFlow("La SARL est plus simple, plus rassurante pour démarrer et parfaitement encadrée par la pratique locale au Cameroun.", ["Valider avec un juriste", "Revenir au menu"]);
            } else if (optName === "Vérifier mes pièces légales") {
                triggerAiResponseFlow("Disposez-vous de ces documents en cours de validité (moins de 3 mois) ?<br>- Une Attestation de Non-Redevance (ANR) ?<br>- Une attestation CNPS ?<br>- Un plan de localisation certifié ?<br>- Une attestation de solvabilité bancaire ?", ["Oui, tout est prêt", "Non, il m'en manque"]);
            } else if (optName === "Non, il m'en manque") {
                triggerAiResponseFlow("Attention, votre dossier sera rejeté d'office. Bloomar peut vous assister dans la course contre la montre pour centraliser ces pièces.", ["Aide pour mes pièces", "Revenir au menu"]);
            } else if (optName === "Sécuriser une gérance") {
                triggerAiResponseFlow("Prévoyez un préavis de révocation (ex: 3 mois) et définissez à l'avance ce qui constitue un 'juste motif' dans vos statuts.", ["Modifier mes statuts", "Revenir au menu"]);
            } else if (optName === "Demander un pré-diagnostic" || optName === "Obtenir un devis" || optName === "Valider avec un juriste" || optName === "Aide pour mes pièces" || optName === "Modifier mes statuts" || optName === "Confier ma fiscalité à Bloomar") {
                triggerUniversalCaptureModal('commercial-audit');
            } else if (optName === "Revenir au menu") {
                selectAssistant(currentAssistantKey);
            } else {
                // Default generic fallback routing inside categories
                triggerAiResponseFlow("Analyse d'orientation terminée. Pour aller plus loin dans la structuration de cette problématique, vous devriez en parler directement avec un expert.", ["Demander un pré-diagnostic", "Revenir au menu"]);
            }
        }

        // Catching user free inputs and applying prompt routers (Routing logic rule)
        function sendUserAiQuestion() {
            const input = document.getElementById('ai-user-input');
            const text = input.value.trim();
            if (!text) return;

            appendUserMessage(text);
            input.value = '';

            // 1. STATE MATH MACHINES (Capture of numerical variables rule)
            if (chatState === 'capturing_cf') {
                const num = parseFloat(text.replace(/[^0-9]/g, ''));
                if (isNaN(num)) {
                    triggerAiResponseFlow("Saisie invalide. Veuillez renseigner un chiffre entier pour les charges fixes (en FCFA) :", []);
                } else {
                    tempCalculations.cf = num;
                    chatState = 'capturing_tm';
                    triggerAiResponseFlow(`Charges fixes enregistrées : ${num.toLocaleString('fr-FR')} FCFA. Indiquez maintenant votre Taux de Marge sur coûts variables (en %). (Si vous ne le connaissez pas, tapez 30 pour du commerce ou 60 pour du service)`, []);
                }
                return;
            }

            if (chatState === 'capturing_tm') {
                const num = parseFloat(text.replace(/[^0-9]/g, ''));
                if (isNaN(num) || num <= 0 || num > 100) {
                    triggerAiResponseFlow("Saisie invalide. Veuillez renseigner un pourcentage de marge réaliste (entre 1 et 100) :", []);
                } else {
                    const cf = tempCalculations.cf;
                    const tmDec = num / 100;
                    const sr = Math.round(cf / tmDec);
                    const daily = Math.round(sr / 30);
                    chatState = 'scenar';
                    triggerAiResponseFlow(`Analyse terminée. Votre Seuil de Rentabilité est de <strong>${sr.toLocaleString('fr-FR')} FCFA</strong> par mois. Vous devez réaliser au moins <strong>${daily.toLocaleString('fr-FR')} FCFA</strong> de ventes par jour avant de faire du bénéfice. Est-ce que ce volume vous semble réalisable ?`, ["Oui, tout à fait", "Non, c'est trop haut"]);
                }
                return;
            }

            if (chatState === 'capturing_tva') {
                const num = parseFloat(text.replace(/[^0-9]/g, ''));
                if (isNaN(num)) {
                    triggerAiResponseFlow("Veuillez saisir un montant numérique TTC valide :", []);
                } else {
                    const ht = Math.round(num / 1.1925);
                    const tva = Math.round(num - ht);
                    chatState = 'scenar';
                    triggerAiResponseFlow(`Analyse fiscale : Sur une facture TTC de <strong>${num.toLocaleString('fr-FR')} FCFA</strong> :<br>- Le Hors Taxe (HT) est de : <strong>${ht.toLocaleString('fr-FR')} FCFA</strong><br>- La TVA collectée (19,25%) est de : <strong>${tva.toLocaleString('fr-FR')} FCFA</strong>.<br><br>Attention, cet argent est une dette envers l'État camerounais (DGI). Un bon gestionnaire isole ce cash sur un compte séparé !`, ["Comment déduire ma TVA ?", "Confier ma fiscalité à Bloomar"]);
                }
                return;
            }

            if (chatState === 'capturing_ca_acompte') {
                const num = parseFloat(text.replace(/[^0-9]/g, ''));
                if (isNaN(num)) {
                    triggerAiResponseFlow("Veuillez saisir un chiffre d'affaires numérique brut :", []);
                } else {
                    tempCalculations.ca = num;
                    chatState = 'selecting_regime';
                    triggerAiResponseFlow(`Note d'activité : ${num.toLocaleString('fr-FR')} FCFA. Sélectionnez maintenant votre régime d'imposition pour simuler la retenue :`, ["Régime Réel (2,2%)", "Régime Simplifié (3,3%)"]);
                }
                return;
            }

            // 2. TEXT KEYWORDS SEARCH FALLBACK ENGINE (Fallback and routing logic rule)
            const inputCleaned = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            
            // Localized custom scan (Fixed Bug: calling handleContextualOptionClick instead of missing triggerContextualOptionClick)
            if (inputCleaned.includes("seuil") || inputCleaned.includes("rentabilite") || inputCleaned.includes("marge")) {
                handleContextualOptionClick("Comment calculer mon seuil de rentabilité ?");
                return;
            }
            if (inputCleaned.includes("restaurant") || inputCleaned.includes("bouffe") || inputCleaned.includes("manger")) {
                handleContextualOptionClick("Mon restaurant est-il rentable ?");
                return;
            }
            if (inputCleaned.includes("bfr") || inputCleaned.includes("cash") || inputCleaned.includes("argent")) {
                handleContextualOptionClick("C'est quoi le BFR et pourquoi mon cash manque ?");
                return;
            }
            if (inputCleaned.includes("sarl") || inputCleaned.includes("creer") || inputCleaned.includes("statut")) {
                handleContextualOptionClick("Quelles sont les étapes pour créer une SARL au Cameroun ?");
                return;
            }
            if (inputCleaned.includes("tva") || inputCleaned.includes("impot") || inputCleaned.includes("taxe")) {
                handleContextualOptionClick("Quel est le taux réel de la TVA au Cameroun et qui la paie ?");
                return;
            }

            // Fallback node ID: FALLBACK_AUDIT trigger
            triggerAiResponseFlow("C’est une excellente question, et elle touche à des spécificités sectorielles pointues qui dépassent le cadre de mes simulations rapides en ligne.<br><br>Pour vous donner une réponse fiable et sécurisée par rapport à la réglementation de votre activité, cela nécessite l'œil d'un de nos experts Bloomar.<br><br>Je vous propose de réaliser un pré-diagnostic ou de solliciter un audit complet de votre dossier pour obtenir une feuille de route sur-mesure.", ["Demander un pré-diagnostic", "Revenir au menu"]);
        }

        function appendUserMessage(text) {
            const chatBody = document.getElementById('ai-chat-body');
            const msgHtml = `
                <div class="flex items-start space-x-3 justify-end">
                    <div class="bg-bloomar-violet p-4 rounded-2xl max-w-[80%] text-white shadow-md">
                        <p class="leading-relaxed">${text}</p>
                    </div>
                </div>
            `;
            chatBody.insertAdjacentHTML('beforeend', msgHtml);
            chatBody.scrollTop = chatBody.scrollHeight;
        }