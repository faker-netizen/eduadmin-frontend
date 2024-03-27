export const DAY_OF_WEEK = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
] as const;

export const COMMON_PROFILE_SCHEMA_ENTRY_TYPE_LITERALS = [
  'pic',
  'file',
  'text',
  'number',
  'boolean',
  'datetime',
  'date',
  'time',
] as const;

/**
 * 判断是否是string literal形式的CommonProfileSchemaEntryType
 * @param type
 */
export const isStringLiteralCommonProfileSchemaEntryType = (
  type: string,
): type is (typeof COMMON_PROFILE_SCHEMA_ENTRY_TYPE_LITERALS)[number] =>
  COMMON_PROFILE_SCHEMA_ENTRY_TYPE_LITERALS.includes(
    type as (typeof COMMON_PROFILE_SCHEMA_ENTRY_TYPE_LITERALS)[number],
  );
