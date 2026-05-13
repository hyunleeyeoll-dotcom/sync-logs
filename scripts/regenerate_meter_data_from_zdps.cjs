#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const defaultZdpsRoot = path.resolve(
  repoRoot,
  '..',
  'BPSR-ZDPS-src',
  'BPSR-ZDPS'
);

const zdpsRoot = process.argv[2]
  ? path.resolve(process.argv[2])
  : defaultZdpsRoot;

const dataRoot = path.join(zdpsRoot, 'Data');
const meterDataRoot = path.join(repoRoot, 'src-tauri', 'meter-data');
const legacyCombinedPath = path.join(
  repoRoot,
  'raw-game-files',
  '4_Final',
  'CombinedTranslatedWithManualOverrides.json'
);

const cp1252Map = new Map([
  [0x20ac, 0x80],
  [0x201a, 0x82],
  [0x0192, 0x83],
  [0x201e, 0x84],
  [0x2026, 0x85],
  [0x2020, 0x86],
  [0x2021, 0x87],
  [0x02c6, 0x88],
  [0x2030, 0x89],
  [0x0160, 0x8a],
  [0x2039, 0x8b],
  [0x0152, 0x8c],
  [0x017d, 0x8e],
  [0x2018, 0x91],
  [0x2019, 0x92],
  [0x201c, 0x93],
  [0x201d, 0x94],
  [0x2022, 0x95],
  [0x2013, 0x96],
  [0x2014, 0x97],
  [0x02dc, 0x98],
  [0x2122, 0x99],
  [0x0161, 0x9a],
  [0x203a, 0x9b],
  [0x0153, 0x9c],
  [0x017e, 0x9e],
  [0x0178, 0x9f],
]);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  const nextContent = `${JSON.stringify(value, null, 2)}\n`;
  const tempPath = `${filePath}.tmp`;
  fs.writeFileSync(tempPath, nextContent, 'utf8');
  fs.renameSync(tempPath, filePath);
}

function sortedEntries(obj) {
  return Object.entries(obj).sort((a, b) => Number(a[0]) - Number(b[0]));
}

function hasMojibake(text) {
  return /[ÃÂÅÆÇÐÑØÙÚÛÜÝÞßà-ÿŒœŠšŽžŸ]/.test(text);
}

function decodeCp1252Utf8(text) {
  const bytes = [...text].map((ch) => {
    const codePoint = ch.codePointAt(0);
    if (codePoint <= 0xff) {
      return codePoint;
    }
    return cp1252Map.get(codePoint) ?? 0x3f;
  });
  return Buffer.from(bytes).toString('utf8').trim();
}

function normalizeText(value) {
  const text = typeof value === 'string' ? value.trim() : '';
  if (!text) {
    return '';
  }
  if (!hasMojibake(text)) {
    return text;
  }
  const decoded = decodeCp1252Utf8(text);
  if (!decoded || decoded.includes('�')) {
    return text;
  }
  return decoded;
}

function isAsciiish(text) {
  return /^[\x00-\x7F]*$/.test(text);
}

function looksUsefulEnglish(text) {
  if (!text) {
    return false;
  }
  if (/^Unknown Skill - #\d+$/i.test(text)) {
    return false;
  }
  return isAsciiish(text);
}

function firstUsefulEnglish(values) {
  for (const value of values) {
    const normalized = normalizeText(value);
    if (looksUsefulEnglish(normalized)) {
      return normalized;
    }
  }
  return '';
}

function firstNonEmpty(values) {
  for (const value of values) {
    const normalized = normalizeText(value);
    if (normalized) {
      return normalized;
    }
  }
  return '';
}

function getLegacyEntry(legacyCombined, id) {
  return legacyCombined[id] ?? null;
}

function getLegacySkillName(legacyEntry) {
  if (!legacyEntry) {
    return '';
  }
  return firstUsefulEnglish([
    legacyEntry.EnglishShortManualOverride,
    legacyEntry['SkillTable_Clean.json']?.EnglishShort,
    legacyEntry['RecountTable_Clean.json']?.EnglishShort,
    legacyEntry['skill_names_Clean.json']?.EnglishShort,
    legacyEntry['SkillTable_Clean.json']?.AIEnglishShort,
    legacyEntry['RecountTable_Clean.json']?.AIEnglishShort,
    legacyEntry['skill_names_Clean.json']?.AIEnglishShort,
  ]);
}

function getLegacyBuffNames(legacyEntry) {
  if (!legacyEntry) {
    return null;
  }

  const englishShort = firstUsefulEnglish([
    legacyEntry.EnglishShortManualOverride,
    legacyEntry['BuffTable_Clean.json']?.EnglishShort,
    legacyEntry['BuffTable_Clean.json']?.AIEnglishShort,
  ]);
  const englishLong = firstUsefulEnglish([
    legacyEntry.EnglishLongManualOverride,
    legacyEntry['BuffTable_Clean.json']?.EnglishLong,
    legacyEntry['BuffTable_Clean.json']?.AIEnglishLong,
    englishShort,
  ]);
  const chineseShort = firstNonEmpty([
    legacyEntry['BuffTable_Clean.json']?.ChineseShort,
  ]);

  if (!englishShort && !englishLong && !chineseShort) {
    return null;
  }

  return {
    chineseShort,
    englishShort,
    englishLong: englishLong || englishShort,
    aiEnglishShort: firstNonEmpty([
      legacyEntry['BuffTable_Clean.json']?.AIEnglishShort,
    ]),
    aiEnglishLong: firstNonEmpty([
      legacyEntry['BuffTable_Clean.json']?.AIEnglishLong,
    ]),
  };
}

function main() {
  if (!fs.existsSync(dataRoot)) {
    throw new Error(`ZDPS data folder not found: ${dataRoot}`);
  }
  if (!fs.existsSync(legacyCombinedPath)) {
    throw new Error(`Legacy translation data not found: ${legacyCombinedPath}`);
  }

  const skillTable = readJson(path.join(dataRoot, 'SkillTable.json'));
  const skillOverrides = readJson(path.join(dataRoot, 'SkillOverrides.en.json'));
  const buffTable = readJson(path.join(dataRoot, 'BuffTable.json'));
  const buffOverrides = readJson(path.join(dataRoot, 'BuffOverrides.en.json'));
  const monsterTable = readJson(path.join(dataRoot, 'MonsterTable.json'));
  const sceneTable = readJson(path.join(dataRoot, 'SceneTable.json'));
  const legacyCombined = readJson(legacyCombinedPath);

  const skillNames = {};
  let skillLegacyFallbacks = 0;
  for (const [id, skill] of sortedEntries(skillTable)) {
    const override = skillOverrides[id] ?? null;
    const legacy = getLegacyEntry(legacyCombined, id);
    const sourceName = firstNonEmpty([
      override?.Name,
      skill?.Name,
      skill?.NameDesign,
    ]);
    const legacyName = getLegacySkillName(legacy);

    let finalName = sourceName;
    if (!looksUsefulEnglish(sourceName) && legacyName) {
      finalName = legacyName;
      skillLegacyFallbacks += 1;
    }
    if (finalName) {
      skillNames[id] = finalName;
    }
  }
  for (const [id, override] of sortedEntries(skillOverrides)) {
    const sourceName = normalizeText(override?.Name);
    if (sourceName) {
      skillNames[id] = sourceName;
      continue;
    }
    const legacyName = getLegacySkillName(getLegacyEntry(legacyCombined, id));
    if (legacyName) {
      skillNames[id] = legacyName;
    }
  }

  const buffNames = {};
  let buffLegacyFallbacks = 0;
  for (const [id, buff] of sortedEntries(buffTable)) {
    const override = buffOverrides[id] ?? null;
    const legacy = getLegacyBuffNames(getLegacyEntry(legacyCombined, id));

    const sourceShort = firstNonEmpty([
      override?.Name,
      buff?.Name,
      buff?.NameDesign,
    ]);
    const sourceLong = firstNonEmpty([
      override?.Desc,
      buff?.Desc,
      sourceShort,
    ]);

    let englishShort = sourceShort;
    let englishLong = sourceLong;
    if (!looksUsefulEnglish(sourceShort) && legacy?.englishShort) {
      englishShort = legacy.englishShort;
      englishLong = legacy.englishLong || legacy.englishShort;
      buffLegacyFallbacks += 1;
    }

    if (englishShort) {
      buffNames[id] = {
        ChineseShort: legacy?.chineseShort || '',
        AIEnglishShort: legacy?.aiEnglishShort || '',
        AIEnglishLong: legacy?.aiEnglishLong || '',
        EnglishShort: englishShort,
        EnglishLong: englishLong || englishShort,
        hasEnglishShortAndLong:
          looksUsefulEnglish(englishShort) && looksUsefulEnglish(englishLong || englishShort),
      };
    }
  }
  for (const [id, override] of sortedEntries(buffOverrides)) {
    const legacy = getLegacyBuffNames(getLegacyEntry(legacyCombined, id));
    const sourceShort = normalizeText(override?.Name);
    const sourceLong = firstNonEmpty([override?.Desc, sourceShort]);

    const englishShort = looksUsefulEnglish(sourceShort)
      ? sourceShort
      : legacy?.englishShort || sourceShort;
    const englishLong = looksUsefulEnglish(sourceLong)
      ? sourceLong
      : legacy?.englishLong || englishShort;

    if (englishShort) {
      buffNames[id] = {
        ChineseShort: legacy?.chineseShort || '',
        AIEnglishShort: legacy?.aiEnglishShort || '',
        AIEnglishLong: legacy?.aiEnglishLong || '',
        EnglishShort: englishShort,
        EnglishLong: englishLong || englishShort,
        hasEnglishShortAndLong:
          looksUsefulEnglish(englishShort) && looksUsefulEnglish(englishLong || englishShort),
      };
    }
  }

  const monsterNames = {};
  const monsterBossNames = {};
  for (const [id, monster] of sortedEntries(monsterTable)) {
    const name = normalizeText(monster?.Name);
    if (!name) {
      continue;
    }
    monsterNames[id] = name;
    if (Number(monster?.MonsterType) === 2) {
      monsterBossNames[id] = name;
    }
  }

  const sceneNames = {};
  for (const [id, scene] of sortedEntries(sceneTable)) {
    const name = normalizeText(scene?.Name);
    if (name) {
      sceneNames[id] = name;
    }
  }

  writeJson(path.join(meterDataRoot, 'SkillName.json'), skillNames);
  writeJson(path.join(meterDataRoot, 'BuffName.json'), buffNames);
  writeJson(path.join(meterDataRoot, 'MonsterName.json'), monsterNames);
  writeJson(path.join(meterDataRoot, 'MonsterNameBoss.json'), monsterBossNames);
  writeJson(path.join(meterDataRoot, 'SceneName.json'), sceneNames);

  console.log(`ZDPS root: ${zdpsRoot}`);
  console.log(`Skill entries: ${Object.keys(skillNames).length}`);
  console.log(`Skill legacy English fallbacks: ${skillLegacyFallbacks}`);
  console.log(`Buff entries: ${Object.keys(buffNames).length}`);
  console.log(`Buff legacy English fallbacks: ${buffLegacyFallbacks}`);
  console.log(`Monster entries: ${Object.keys(monsterNames).length}`);
  console.log(`Boss monster entries: ${Object.keys(monsterBossNames).length}`);
  console.log(`Scene entries: ${Object.keys(sceneNames).length}`);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
