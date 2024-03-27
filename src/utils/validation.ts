import dayjs from 'dayjs';

/**
 * 校验文件是否符合要求。若不符合要求，则抛出错误
 * @param type
 * @param file
 */
const validateFile = (type: 'pic' | 'file', file: File) => {
  // 判断是否存在扩展名
  if (!file.name.includes('.')) {
    throw new TypeError('Filename must contain extension');
  }
  // 如果是图片，判断是否是图片格式
  if (
      type === 'pic' &&
      !['jpg', 'jpeg', 'png'].includes(file.name.split('.').pop()!)
  ) {
    throw new TypeError('Image must be in jpg, jpeg or png format');
  }
};

/**
 * 校验时间字符串是否符合要求。若不符合要求，则抛出错误
 * @param type
 * @param timeString
 */
const validateTimeString = (
    type: 'datetime' | 'date' | 'time',
    timeString: string,
) => {
  switch (type) {
    case 'datetime':
      if (
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(timeString) &&
          dayjs(timeString).isValid()
      ) {
        throw new TypeError('Invalid datetime format');
      }
      break;
    case 'date':
      if (
          /^\d{4}-\d{2}-\d{2}$/.test(timeString) &&
          dayjs(timeString).isValid()
      ) {
        throw new TypeError('Invalid date format');
      }
      break;
    case 'time':
      if (
          /^\d{2}:\d{2}:\d{2}$/.test(timeString) &&
          dayjs(timeString).isValid()
      ) {
        throw new TypeError('Invalid time format');
      }
  }
};

/**
 * 校验选择项是否符合要求。若不符合要求，则抛出错误
 * @param type
 * @param value
 */
const validateSelection = (type: string[], value: string) => {
  if (!type.includes(value)) {
    throw new TypeError(
        `Expected value to be one of ${type.join(', ')}, but got ${value}`,
    );
  }
};

/**
 * 校验 ProfileEntry 的 value 是否符合要求。若不符合要求，则抛出错误
 * @param type
 * @param value
 */
export function validateProfileEntry(
    type: 'pic' | 'file',
    value: File | File[],
): void;
export function validateProfileEntry(
    type: 'number',
    value: number | number[],
): void;
export function validateProfileEntry(
    type: 'boolean',
    value: boolean | boolean[],
): void;
export function validateProfileEntry(
    type: 'text' | 'datetime' | 'date' | 'time' | string[],
    value: string | string[],
): void;
export function validateProfileEntry(
    type: Account.CommonProfileSchemaEntry['type'],
    value:
        | File
        | number
        | boolean
        | string
        | Array<File | number | boolean | string>,
) {
  const validateValue = (
      type: Account.CommonProfileSchemaEntry['type'],
      value: File | number | boolean | string,
  ) => {
    switch (type) {
      case 'pic':
      case 'file':
        // 校验文件是否符合要求
        validateFile(type, value as File);
        break;
      case 'datetime':
      case 'date':
      case 'time':
        // 校验时间字符串是否符合要求
        validateTimeString(type, value as string);
        break;
      case 'text':
      case 'number':
      case 'boolean':
        // 这几个不需要额外校验
        break;
      default:
        // 校验 Selection 类型的 entry.value 是否在 schemaEntry.type 中
        validateSelection(type, value as string);
    }
  };

  if (Array.isArray(value)) {
    // 如果是数组，校验数组中的每一项
    for (const item of value) {
      validateValue(type, item);
    }
  } else {
    // 如果不是数组，直接校验
    validateValue(type, value);
  }
}

export const defaultProfileValue = {
  pic: '',
  file: '',
  datetime: '1990-01-01T00:00:00',
  date: '1990-01-01',
  time: '00:00:00',
  text: '',
  number: '',
  boolean: true


}
export type profileType = 'pic' | 'file' | 'datetime' | 'date' | 'time' | 'text' | 'number' | 'boolean'
