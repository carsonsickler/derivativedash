// Word families organized by difficulty level
// Each family contains: noun, verb, adjective, adverb

export const WORD_FAMILIES = {
  level1: [
    {
      noun: 'BEAUTY',
      verb: 'BEAUTIFY',
      adjective: 'BEAUTIFUL',
      adverb: 'BEAUTIFULLY',
      root: 'beauty'
    },
    {
      noun: 'INFORMATION',
      verb: 'INFORM',
      adjective: 'INFORMATIVE',
      adverb: 'INFORMATIVELY',
      root: 'inform'
    },
    {
      noun: 'COMPETITION',
      verb: 'COMPETE',
      adjective: 'COMPETITIVE',
      adverb: 'COMPETITIVELY',
      root: 'compete'
    },
    {
      noun: 'SUCCESS',
      verb: 'SUCCEED',
      adjective: 'SUCCESSFUL',
      adverb: 'SUCCESSFULLY',
      root: 'succeed'
    },
    {
      noun: 'DECISION',
      verb: 'DECIDE',
      adjective: 'DECISIVE',
      adverb: 'DECISIVELY',
      root: 'decide'
    },
    {
      noun: 'PROTECTION',
      verb: 'PROTECT',
      adjective: 'PROTECTIVE',
      adverb: 'PROTECTIVELY',
      root: 'protect'
    },
    {
      noun: 'EDUCATION',
      verb: 'EDUCATE',
      adjective: 'EDUCATIONAL',
      adverb: 'EDUCATIONALLY',
      root: 'educate'
    },
    {
      noun: 'CREATION',
      verb: 'CREATE',
      adjective: 'CREATIVE',
      adverb: 'CREATIVELY',
      root: 'create'
    }
  ],
  level2: [
    {
      noun: 'APPLICATION',
      verb: 'APPLY',
      adjective: 'APPLICABLE',
      adverb: 'APPLICABLY',
      root: 'apply',
      note: 'Change Y to I'
    },
    {
      noun: 'STRENGTH',
      verb: 'STRENGTHEN',
      adjective: 'STRONG',
      adverb: 'STRONGLY',
      root: 'strong',
      note: 'Internal change'
    },
    {
      noun: 'DEPTH',
      verb: 'DEEPEN',
      adjective: 'DEEP',
      adverb: 'DEEPLY',
      root: 'deep',
      note: 'Adjective → Verb'
    },
    {
      noun: 'MANAGEMENT',
      verb: 'MANAGE',
      adjective: 'MANAGEABLE',
      adverb: 'MANAGEABLY',
      root: 'manage',
      note: 'Multiple forms possible'
    },
    {
      noun: 'KNOWLEDGE',
      verb: 'KNOW',
      adjective: 'KNOWLEDGEABLE',
      adverb: 'KNOWLEDGEABLY',
      root: 'know',
      note: 'Irregular form'
    },
    {
      noun: 'WIDTH',
      verb: 'WIDEN',
      adjective: 'WIDE',
      adverb: 'WIDELY',
      root: 'wide',
      note: 'Internal change'
    },
    {
      noun: 'LENGTH',
      verb: 'LENGTHEN',
      adjective: 'LONG',
      adverb: 'LENGTHILY',
      root: 'long',
      note: 'Irregular form'
    },
    {
      noun: 'ARGUMENT',
      verb: 'ARGUE',
      adjective: 'ARGUABLE',
      adverb: 'ARGUABLY',
      root: 'argue',
      note: 'Drop E'
    }
  ],
  level3: [
    {
      noun: 'PATIENCE',
      verb: 'PATIENT',
      adjective: 'IMPATIENT',
      adverb: 'IMPATIENTLY',
      root: 'patient',
      note: 'Requires negative prefix',
      requiresPrefix: 'adjective'
    },
    {
      noun: 'IMPOSSIBILITY',
      verb: 'POSSIBLY',
      adjective: 'IMPOSSIBLE',
      adverb: 'IMPOSSIBLY',
      root: 'possible',
      note: 'Requires negative prefix',
      requiresPrefix: 'adjective'
    },
    {
      noun: 'DISAGREEMENT',
      verb: 'DISAGREE',
      adjective: 'DISAGREEABLE',
      adverb: 'DISAGREEABLY',
      root: 'agree',
      note: 'Requires negative prefix',
      requiresPrefix: 'verb'
    },
    {
      noun: 'UNHAPPINESS',
      verb: 'UNHAPPY',
      adjective: 'UNHAPPY',
      adverb: 'UNHAPPILY',
      root: 'happy',
      note: 'Requires negative prefix',
      requiresPrefix: 'adjective'
    },
    {
      noun: 'ILLEGALITY',
      verb: 'ILLEGALIZE',
      adjective: 'ILLEGAL',
      adverb: 'ILLEGALLY',
      root: 'legal',
      note: 'Requires negative prefix',
      requiresPrefix: 'adjective'
    },
    {
      noun: 'IRREGULARITY',
      verb: 'IRREGULARIZE',
      adjective: 'IRREGULAR',
      adverb: 'IRREGULARLY',
      root: 'regular',
      note: 'Requires negative prefix',
      requiresPrefix: 'adjective'
    },
    {
      noun: 'DISCOMFORT',
      verb: 'DISCOMFORT',
      adjective: 'UNCOMFORTABLE',
      adverb: 'UNCOMFORTABLY',
      root: 'comfort',
      note: 'Requires negative prefix',
      requiresPrefix: 'adjective'
    },
    {
      noun: 'INJUSTICE',
      verb: 'INJUSTICE',
      adjective: 'UNJUST',
      adverb: 'UNJUSTLY',
      root: 'just',
      note: 'Requires negative prefix',
      requiresPrefix: 'adjective'
    }
  ]
};

// Helper function to get all valid derivations for a word family
export function getAllDerivations(family) {
  return {
    nouns: [family.noun],
    verbs: [family.verb],
    adjectives: [family.adjective],
    adverbs: [family.adverb]
  };
}

// Helper function to check if a word is related to the root
export function isRelatedWord(word, family) {
  const normalizedWord = word.toUpperCase().trim();
  const root = family.root.toUpperCase();
  
  // Check if word contains the root
  if (normalizedWord.includes(root) || root.includes(normalizedWord.substring(0, root.length))) {
    return true;
  }
  
  // Check all family members
  const familyWords = [
    family.noun,
    family.verb,
    family.adjective,
    family.adverb
  ].map(w => w.toUpperCase());
  
  return familyWords.some(fw => 
    normalizedWord === fw || 
    fw.includes(normalizedWord) ||
    normalizedWord.includes(fw.substring(0, Math.min(normalizedWord.length, fw.length)))
  );
}

