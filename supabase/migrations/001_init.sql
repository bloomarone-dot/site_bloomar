-- ============================================
-- BLOOMAR ONE — Migration initiale
-- ============================================

-- Table demandes (formulaires de contact et modal)
CREATE TABLE IF NOT EXISTS demandes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  nom text NOT NULL,
  email text NOT NULL,
  entreprise text,
  service text,
  message text,
  source text
);

-- Table avis (témoignages clients)
CREATE TABLE IF NOT EXISTS avis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  nom text NOT NULL,
  entreprise text,
  note integer CHECK (note >= 1 AND note <= 5),
  commentaire text,
  approved boolean DEFAULT false
);

-- Activer RLS
ALTER TABLE demandes ENABLE ROW LEVEL SECURITY;
ALTER TABLE avis ENABLE ROW LEVEL SECURITY;

-- Policies demandes : INSERT public, pas de SELECT
CREATE POLICY "demandes_insert" ON demandes
  FOR INSERT TO anon WITH CHECK (true);

-- Policies avis : INSERT public, SELECT uniquement si approved=true
CREATE POLICY "avis_insert" ON avis
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "avis_select" ON avis
  FOR SELECT TO anon USING (approved = true);
