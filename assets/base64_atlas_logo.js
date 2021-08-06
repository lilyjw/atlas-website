const MITRE_ATLAS_TM = 'image/png; base64, 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'

function MITRE_ATLAS_TM_LOGO () {
  return MITRE_ATLAS_TM
}

export { MITRE_ATLAS_TM_LOGO }
