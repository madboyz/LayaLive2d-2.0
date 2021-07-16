window.Laya=window.Laya||{};

(function (Laya) {
  'use strict';

  var Live2DCubismFramework;
  (function (Live2DCubismFramework) {
      class csmString {
          constructor(s) {
              this.s = s;
          }
          append(c, length) {
              this.s += length !== undefined ? c.substr(0, length) : c;
              return this;
          }
          expansion(length, v) {
              for (let i = 0; i < length; i++) {
                  this.append(v);
              }
              return this;
          }
          getBytes() {
              return encodeURIComponent(this.s).replace(/%../g, 'x').length;
          }
          getLength() {
              return this.s.length;
          }
          isLess(s) {
              return this.s < s.s;
          }
          isGreat(s) {
              return this.s > s.s;
          }
          isEqual(s) {
              return this.s == s;
          }
          isEmpty() {
              return this.s.length == 0;
          }
      }
      Live2DCubismFramework.csmString = csmString;
  })(Live2DCubismFramework || (Live2DCubismFramework = {}));

  const CubismLogPrint = (level, fmt, args) => {
      Live2DCubismFramework$1.CubismDebug.print(level, '[CSM]' + fmt, args);
  };
  const CubismLogPrintIn = (level, fmt, args) => {
      CubismLogPrint(level, fmt + '\n', args);
  };
  const CSM_ASSERT = (expr) => {
      console.assert && console.assert(expr);
  };
  let CubismLogDebug;
  let CubismLogInfo;
  let CubismLogWarning;
  {
      CubismLogDebug = (fmt, ...args) => {
          CubismLogPrintIn(LogLevel.LogLevel_Debug, '[D]' + fmt, args);
      };
      CubismLogInfo = (fmt, ...args) => {
          CubismLogPrintIn(LogLevel.LogLevel_Info, '[I]' + fmt, args);
      };
      CubismLogWarning = (fmt, ...args) => {
          CubismLogPrintIn(LogLevel.LogLevel_Warning, '[W]' + fmt, args);
      };
  }
  var Live2DCubismFramework$1;
  (function (Live2DCubismFramework) {
      class CubismDebug {
          static print(logLevel, format, args) {
              if (logLevel < Live2DCubismFramework$9.CubismFramework.getLoggingLevel()) {
                  return;
              }
              const logPrint = Live2DCubismFramework$9.CubismFramework.coreLogFunction;
              if (!logPrint)
                  return;
              const buffer = format.replace(/\{(\d+)\}/g, (m, k) => {
                  return args[k];
              });
              logPrint(buffer);
          }
          static dumpBytes(logLevel, data, length) {
              for (let i = 0; i < length; i++) {
                  if (i % 16 == 0 && i > 0)
                      this.print(logLevel, '\n');
                  else if (i % 8 == 0 && i > 0)
                      this.print(logLevel, '  ');
                  this.print(logLevel, '{0} ', [data[i] & 0xff]);
              }
              this.print(logLevel, '\n');
          }
          constructor() { }
      }
      Live2DCubismFramework.CubismDebug = CubismDebug;
  })(Live2DCubismFramework$1 || (Live2DCubismFramework$1 = {}));

  var Live2DCubismFramework$2;
  (function (Live2DCubismFramework) {
      class csmPair {
          constructor(key, value) {
              this.first = key == undefined ? null : key;
              this.second = value == undefined ? null : value;
          }
      }
      Live2DCubismFramework.csmPair = csmPair;
      class csmMap {
          constructor(size) {
              if (size != undefined) {
                  if (size < 1) {
                      this._keyValues = [];
                      this._dummyValue = null;
                      this._size = 0;
                  }
                  else {
                      this._keyValues = new Array(size);
                      this._size = size;
                  }
              }
              else {
                  this._keyValues = [];
                  this._dummyValue = null;
                  this._size = 0;
              }
          }
          release() {
              this.clear();
          }
          appendKey(key) {
              this.prepareCapacity(this._size + 1, false);
              this._keyValues[this._size] = new csmPair(key);
              this._size += 1;
          }
          getValue(key) {
              let found = -1;
              for (let i = 0; i < this._size; i++) {
                  if (this._keyValues[i].first == key) {
                      found = i;
                      break;
                  }
              }
              if (found >= 0) {
                  return this._keyValues[found].second;
              }
              else {
                  this.appendKey(key);
                  return this._keyValues[this._size - 1].second;
              }
          }
          setValue(key, value) {
              let found = -1;
              for (let i = 0; i < this._size; i++) {
                  if (this._keyValues[i].first == key) {
                      found = i;
                      break;
                  }
              }
              if (found >= 0) {
                  this._keyValues[found].second = value;
              }
              else {
                  this.appendKey(key);
                  this._keyValues[this._size - 1].second = value;
              }
          }
          isExist(key) {
              for (let i = 0; i < this._size; i++) {
                  if (this._keyValues[i].first == key) {
                      return true;
                  }
              }
              return false;
          }
          clear() {
              this._keyValues = void 0;
              this._keyValues = null;
              this._keyValues = [];
              this._size = 0;
          }
          getSize() {
              return this._size;
          }
          prepareCapacity(newSize, fitToSize) {
              if (newSize > this._keyValues.length) {
                  if (this._keyValues.length == 0) {
                      if (!fitToSize && newSize < csmMap.DefaultSize)
                          newSize = csmMap.DefaultSize;
                      this._keyValues.length = newSize;
                  }
                  else {
                      if (!fitToSize && newSize < this._keyValues.length * 2)
                          newSize = this._keyValues.length * 2;
                      this._keyValues.length = newSize;
                  }
              }
          }
          begin() {
              const ite = new iterator(this, 0);
              return ite;
          }
          end() {
              const ite = new iterator(this, this._size);
              return ite;
          }
          erase(ite) {
              const index = ite._index;
              if (index < 0 || this._size <= index) {
                  return ite;
              }
              this._keyValues.splice(index, 1);
              --this._size;
              const ite2 = new iterator(this, index);
              return ite2;
          }
          dumpAsInt() {
              for (let i = 0; i < this._size; i++) {
                  CubismLogDebug('{0} ,', this._keyValues[i]);
                  CubismLogDebug('\n');
              }
          }
      }
      csmMap.DefaultSize = 10;
      Live2DCubismFramework.csmMap = csmMap;
      class iterator {
          constructor(v, idx) {
              this._map = v != undefined ? v : new csmMap();
              this._index = idx != undefined ? idx : 0;
          }
          set(ite) {
              this._index = ite._index;
              this._map = ite._map;
              return this;
          }
          preIncrement() {
              ++this._index;
              return this;
          }
          preDecrement() {
              --this._index;
              return this;
          }
          increment() {
              const iteold = new iterator(this._map, this._index++);
              this._map = iteold._map;
              this._index = iteold._index;
              return this;
          }
          decrement() {
              const iteold = new iterator(this._map, this._index);
              this._map = iteold._map;
              this._index = iteold._index;
              return this;
          }
          ptr() {
              return this._map._keyValues[this._index];
          }
          notEqual(ite) {
              return this._index != ite._index || this._map != ite._map;
          }
      }
      Live2DCubismFramework.iterator = iterator;
  })(Live2DCubismFramework$2 || (Live2DCubismFramework$2 = {}));

  var Live2DCubismFramework$3;
  (function (Live2DCubismFramework) {
      class csmVector {
          constructor(initialCapacity = 0) {
              if (initialCapacity < 1) {
                  this._ptr = [];
                  this._capacity = 0;
                  this._size = 0;
              }
              else {
                  this._ptr = new Array(initialCapacity);
                  this._capacity = initialCapacity;
                  this._size = 0;
              }
          }
          at(index) {
              return this._ptr[index];
          }
          set(index, value) {
              this._ptr[index] = value;
          }
          get(offset = 0) {
              const ret = new Array();
              for (let i = offset; i < this._size; i++) {
                  ret.push(this._ptr[i]);
              }
              return ret;
          }
          pushBack(value) {
              if (this._size >= this._capacity) {
                  this.prepareCapacity(this._capacity == 0 ? csmVector.s_defaultSize : this._capacity * 2);
              }
              this._ptr[this._size++] = value;
          }
          clear() {
              this._ptr.length = 0;
              this._size = 0;
          }
          getSize() {
              return this._size;
          }
          assign(newSize, value) {
              const curSize = this._size;
              if (curSize < newSize) {
                  this.prepareCapacity(newSize);
              }
              for (let i = 0; i < newSize; i++) {
                  this._ptr[i] = value;
              }
              this._size = newSize;
          }
          resize(newSize, value = null) {
              this.updateSize(newSize, value, true);
          }
          updateSize(newSize, value = null, callPlacementNew = true) {
              const curSize = this._size;
              if (curSize < newSize) {
                  this.prepareCapacity(newSize);
                  if (callPlacementNew) {
                      for (let i = this._size; i < newSize; i++) {
                          if (typeof value == 'function') {
                              this._ptr[i] = JSON.parse(JSON.stringify(new value()));
                          }
                          else {
                              this._ptr[i] = value;
                          }
                      }
                  }
                  else {
                      for (let i = this._size; i < newSize; i++) {
                          this._ptr[i] = value;
                      }
                  }
              }
              else {
                  const sub = this._size - newSize;
                  this._ptr.splice(this._size - sub, sub);
              }
              this._size = newSize;
          }
          insert(position, begin, end) {
              let dstSi = position._index;
              const srcSi = begin._index;
              const srcEi = end._index;
              const addCount = srcEi - srcSi;
              this.prepareCapacity(this._size + addCount);
              const addSize = this._size - dstSi;
              if (addSize > 0) {
                  for (let i = 0; i < addSize; i++) {
                      this._ptr.splice(dstSi + i, 0, null);
                  }
              }
              for (let i = srcSi; i < srcEi; i++, dstSi++) {
                  this._ptr[dstSi] = begin._vector._ptr[i];
              }
              this._size = this._size + addCount;
          }
          remove(index) {
              if (index < 0 || this._size <= index) {
                  return false;
              }
              this._ptr.splice(index, 1);
              --this._size;
              return true;
          }
          erase(ite) {
              const index = ite._index;
              if (index < 0 || this._size <= index) {
                  return ite;
              }
              this._ptr.splice(index, 1);
              --this._size;
              const ite2 = new iterator(this, index);
              return ite2;
          }
          prepareCapacity(newSize) {
              if (newSize > this._capacity) {
                  if (this._capacity == 0) {
                      this._ptr = new Array(newSize);
                      this._capacity = newSize;
                  }
                  else {
                      this._ptr.length = newSize;
                      this._capacity = newSize;
                  }
              }
          }
          begin() {
              const ite = this._size == 0 ? this.end() : new iterator(this, 0);
              return ite;
          }
          end() {
              const ite = new iterator(this, this._size);
              return ite;
          }
          getOffset(offset) {
              const newVector = new csmVector();
              newVector._ptr = this.get(offset);
              newVector._size = this.get(offset).length;
              newVector._capacity = this.get(offset).length;
              return newVector;
          }
      }
      csmVector.s_defaultSize = 10;
      Live2DCubismFramework.csmVector = csmVector;
      class iterator {
          constructor(v, index) {
              this._vector = v != undefined ? v : null;
              this._index = index != undefined ? index : 0;
          }
          set(ite) {
              this._index = ite._index;
              this._vector = ite._vector;
              return this;
          }
          preIncrement() {
              ++this._index;
              return this;
          }
          preDecrement() {
              --this._index;
              return this;
          }
          increment() {
              const iteold = new iterator(this._vector, this._index++);
              this._vector = iteold._vector;
              this._index = iteold._index;
              return this;
          }
          decrement() {
              const iteold = new iterator(this._vector, this._index--);
              this._vector = iteold._vector;
              this._index = iteold._index;
              return this;
          }
          ptr() {
              return this._vector._ptr[this._index];
          }
          substitution(ite) {
              this._index = ite._index;
              this._vector = ite._vector;
              return this;
          }
          notEqual(ite) {
              return this._index != ite._index || this._vector != ite._vector;
          }
      }
      Live2DCubismFramework.iterator = iterator;
  })(Live2DCubismFramework$3 || (Live2DCubismFramework$3 = {}));

  var csmVector = Live2DCubismFramework$3.csmVector;
  var csmMap = Live2DCubismFramework$2.csmMap;
  var csmString = Live2DCubismFramework.csmString;
  var Live2DCubismFramework$4;
  (function (Live2DCubismFramework) {
      const CSM_JSON_ERROR_TYPE_MISMATCH = 'Error: type mismatch';
      const CSM_JSON_ERROR_INDEX_OF_BOUNDS = 'Error: index out of bounds';
      class Value {
          constructor() { }
          getRawString(defaultValue, indent) {
              return this.getString(defaultValue, indent);
          }
          toInt(defaultValue = 0) {
              return defaultValue;
          }
          toFloat(defaultValue = 0) {
              return defaultValue;
          }
          toBoolean(defaultValue = false) {
              return defaultValue;
          }
          getSize() {
              return 0;
          }
          getArray(defaultValue = null) {
              return defaultValue;
          }
          getVector(defaultValue) {
              return defaultValue;
          }
          getMap(defaultValue) {
              return defaultValue;
          }
          getValueByIndex(index) {
              return Value.errorValue.setErrorNotForClientCall(CSM_JSON_ERROR_TYPE_MISMATCH);
          }
          getValueByString(s) {
              return Value.nullValue.setErrorNotForClientCall(CSM_JSON_ERROR_TYPE_MISMATCH);
          }
          getKeys() {
              return Value.s_dummyKeys;
          }
          isError() {
              return false;
          }
          isNull() {
              return false;
          }
          isBool() {
              return false;
          }
          isFloat() {
              return false;
          }
          isString() {
              return false;
          }
          isArray() {
              return false;
          }
          isMap() {
              return false;
          }
          equals(value) {
              return false;
          }
          isStatic() {
              return false;
          }
          setErrorNotForClientCall(errorStr) {
              return JsonError.errorValue;
          }
          static staticInitializeNotForClientCall() {
              JsonBoolean.trueValue = new JsonBoolean(true);
              JsonBoolean.falseValue = new JsonBoolean(false);
              JsonError.errorValue = new JsonError('ERROR', true);
              this.nullValue = new JsonNullvalue();
              Value.s_dummyKeys = new csmVector();
          }
          static staticReleaseNotForClientCall() {
              JsonBoolean.trueValue = null;
              JsonBoolean.falseValue = null;
              JsonError.errorValue = null;
              Value.nullValue = null;
              Value.s_dummyKeys = null;
              JsonBoolean.trueValue = null;
              JsonBoolean.falseValue = null;
              JsonError.errorValue = null;
              Value.nullValue = null;
              Value.s_dummyKeys = null;
          }
      }
      Live2DCubismFramework.Value = Value;
      class CubismJson {
          constructor(buffer, length) {
              this._error = null;
              this._lineCount = 0;
              this._root = null;
              if (buffer != undefined) {
                  this.parseBytes(buffer, length);
              }
          }
          static create(buffer, size) {
              const json = new CubismJson();
              const succeeded = json.parseBytes(buffer, size);
              if (!succeeded) {
                  CubismJson.delete(json);
                  return null;
              }
              else {
                  return json;
              }
          }
          static delete(instance) {
          }
          getRoot() {
              return this._root;
          }
          arrayBufferToString(buffer) {
              const uint8Array = new Uint8Array(buffer);
              let str = '';
              for (let i = 0, len = uint8Array.length; i < len; ++i) {
                  str += '%' + this.pad(uint8Array[i].toString(16));
              }
              str = decodeURIComponent(str);
              return str;
          }
          pad(n) {
              return n.length < 2 ? '0' + n : n;
          }
          parseBytes(buffer, size) {
              const endPos = new Array(1);
              const decodeBuffer = this.arrayBufferToString(buffer);
              this._root = this.parseValue(decodeBuffer, size, 0, endPos);
              if (this._error) {
                  let strbuf = '\0';
                  strbuf = 'Json parse error : @line ' + (this._lineCount + 1) + '\n';
                  this._root = new JsonString(strbuf);
                  CubismLogInfo('{0}', this._root.getRawString());
                  return false;
              }
              else if (this._root == null) {
                  this._root = new JsonError(new csmString(this._error), false);
                  return false;
              }
              return true;
          }
          getParseError() {
              return this._error;
          }
          checkEndOfFile() {
              return this._root.getArray()[1].equals('EOF');
          }
          parseValue(buffer, length, begin, outEndPos) {
              if (this._error)
                  return null;
              let o = null;
              let i = begin;
              let f;
              for (; i < length; i++) {
                  const c = buffer[i];
                  switch (c) {
                      case '-':
                      case '.':
                      case '0':
                      case '1':
                      case '2':
                      case '3':
                      case '4':
                      case '5':
                      case '6':
                      case '7':
                      case '8':
                      case '9': {
                          const afterString = new Array(1);
                          f = strtod(buffer.slice(i), afterString);
                          outEndPos[0] = buffer.indexOf(afterString[0]);
                          return new JsonFloat(f);
                      }
                      case '"':
                          return new JsonString(this.parseString(buffer, length, i + 1, outEndPos));
                      case '[':
                          o = this.parseArray(buffer, length, i + 1, outEndPos);
                          return o;
                      case '{':
                          o = this.parseObject(buffer, length, i + 1, outEndPos);
                          return o;
                      case 'n':
                          if (i + 3 < length) {
                              o = new JsonNullvalue();
                              outEndPos[0] = i + 4;
                          }
                          else {
                              this._error = 'parse null';
                          }
                          return o;
                      case 't':
                          if (i + 3 < length) {
                              o = JsonBoolean.trueValue;
                              outEndPos[0] = i + 4;
                          }
                          else {
                              this._error = 'parse true';
                          }
                          return o;
                      case 'f':
                          if (i + 4 < length) {
                              o = JsonBoolean.falseValue;
                              outEndPos[0] = i + 5;
                          }
                          else {
                              this._error = "illegal ',' position";
                          }
                          return o;
                      case ',':
                          this._error = "illegal ',' position";
                          return null;
                      case ']':
                          outEndPos[0] = i;
                          return null;
                      case '\n':
                          this._lineCount++;
                  }
              }
              this._error = 'illegal end of value';
              return null;
          }
          parseString(string, length, begin, outEndPos) {
              if (this._error)
                  return null;
              let i = begin;
              let c, c2;
              const ret = new csmString('');
              let bufStart = begin;
              for (; i < length; i++) {
                  c = string[i];
                  switch (c) {
                      case '"': {
                          outEndPos[0] = i + 1;
                          ret.append(string.slice(bufStart), i - bufStart);
                          return ret.s;
                      }
                      case '//': {
                          i++;
                          if (i - 1 > bufStart) {
                              ret.append(string.slice(bufStart), i - bufStart);
                          }
                          bufStart = i + 1;
                          if (i < length) {
                              c2 = string[i];
                              switch (c2) {
                                  case '\\':
                                      ret.expansion(1, '\\');
                                      break;
                                  case '"':
                                      ret.expansion(1, '"');
                                      break;
                                  case '/':
                                      ret.expansion(1, '/');
                                      break;
                                  case 'b':
                                      ret.expansion(1, '\b');
                                      break;
                                  case 'f':
                                      ret.expansion(1, '\f');
                                      break;
                                  case 'n':
                                      ret.expansion(1, '\n');
                                      break;
                                  case 'r':
                                      ret.expansion(1, '\r');
                                      break;
                                  case 't':
                                      ret.expansion(1, '\t');
                                      break;
                                  case 'u':
                                      this._error = 'parse string/unicord escape not supported';
                                      break;
                              }
                          }
                          else {
                              this._error = 'parse string/escape error';
                          }
                      }
                  }
              }
              this._error = 'parse string/illegal end';
              return null;
          }
          parseObject(buffer, length, begin, outEndPos) {
              if (this._error)
                  return null;
              const ret = new JsonMap();
              let key = '';
              let i = begin;
              let c = '';
              const localRetEndPos2 = Array(1);
              let ok = false;
              for (; i < length; i++) {
                  FOR_LOOP: for (; i < length; i++) {
                      c = buffer[i];
                      switch (c) {
                          case '"':
                              key = this.parseString(buffer, length, i + 1, localRetEndPos2);
                              if (this._error) {
                                  return null;
                              }
                              i = localRetEndPos2[0];
                              ok = true;
                              break FOR_LOOP;
                          case '}':
                              outEndPos[0] = i + 1;
                              return ret;
                          case ':':
                              this._error = "illegal ':' position";
                              break;
                          case '\n':
                              this._lineCount++;
                      }
                  }
                  if (!ok) {
                      this._error = 'key not found';
                      return null;
                  }
                  ok = false;
                  FOR_LOOP2: for (; i < length; i++) {
                      c = buffer[i];
                      switch (c) {
                          case ':':
                              ok = true;
                              i++;
                              break FOR_LOOP2;
                          case '}':
                              this._error = "illegal '}' position";
                              break;
                          case '\n':
                              this._lineCount++;
                      }
                  }
                  if (!ok) {
                      this._error = "':' not found";
                      return null;
                  }
                  const value = this.parseValue(buffer, length, i, localRetEndPos2);
                  if (this._error) {
                      return null;
                  }
                  i = localRetEndPos2[0];
                  ret.put(key, value);
                  FOR_LOOP3: for (; i < length; i++) {
                      c = buffer[i];
                      switch (c) {
                          case ',':
                              break FOR_LOOP3;
                          case '}':
                              outEndPos[0] = i + 1;
                              return ret;
                          case '\n':
                              this._lineCount++;
                      }
                  }
              }
              this._error = 'illegal end of perseObject';
              return null;
          }
          parseArray(buffer, length, begin, outEndPos) {
              if (this._error)
                  return null;
              let ret = new JsonArray();
              let i = begin;
              let c;
              const localRetEndpos2 = new Array(1);
              for (; i < length; i++) {
                  const value = this.parseValue(buffer, length, i, localRetEndpos2);
                  if (this._error) {
                      return null;
                  }
                  i = localRetEndpos2[0];
                  if (value) {
                      ret.add(value);
                  }
                  FOR_LOOP: for (; i < length; i++) {
                      c = buffer[i];
                      switch (c) {
                          case ',':
                              break FOR_LOOP;
                          case ']':
                              outEndPos[0] = i + 1;
                              return ret;
                          case '\n':
                              ++this._lineCount;
                      }
                  }
              }
              ret = void 0;
              this._error = 'illegal end of parseObject';
              return null;
          }
      }
      Live2DCubismFramework.CubismJson = CubismJson;
      class JsonFloat extends Value {
          constructor(v) {
              super();
              this._value = v;
          }
          isFloat() {
              return true;
          }
          getString(defaultValue, indent) {
              const strbuf = '\0';
              this._value = parseFloat(strbuf);
              this._stringBuffer = strbuf;
              return this._stringBuffer;
          }
          toInt(defaultValue = 0) {
              return parseInt(this._value.toString());
          }
          toFloat(defaultValue = 0.0) {
              return this._value;
          }
          equals(value) {
              if ('number' === typeof value) {
                  if (Math.round(value)) {
                      return false;
                  }
                  else {
                      return value == this._value;
                  }
              }
              return false;
          }
      }
      Live2DCubismFramework.JsonFloat = JsonFloat;
      class JsonBoolean extends Value {
          constructor(v) {
              super();
              this._boolValue = v;
          }
          isBool() {
              return true;
          }
          toBoolean(defaultValue = false) {
              return this._boolValue;
          }
          getString(defaultValue, indent) {
              this._stringBuffer = this._boolValue ? 'true' : 'false';
              return this._stringBuffer;
          }
          equals(value) {
              if ('boolean' === typeof value) {
                  return value == this._boolValue;
              }
              return false;
          }
          isStatic() {
              return true;
          }
      }
      Live2DCubismFramework.JsonBoolean = JsonBoolean;
      class JsonString extends Value {
          constructor(s) {
              super();
              if ('string' === typeof s) {
                  this._stringBuffer = s;
              }
              if (s instanceof csmString) {
                  this._stringBuffer = s.s;
              }
          }
          isString() {
              return true;
          }
          getString(defaultValue, indent) {
              return this._stringBuffer;
          }
          equals(value) {
              if ('string' === typeof value) {
                  return this._stringBuffer == value;
              }
              if (value instanceof csmString) {
                  return this._stringBuffer == value.s;
              }
              return false;
          }
      }
      Live2DCubismFramework.JsonString = JsonString;
      class JsonError extends JsonString {
          constructor(s, isStatic) {
              if ('string' === typeof s) {
                  super(s);
              }
              else {
                  super(s);
              }
              this._isStatic = isStatic;
          }
          isStatic() {
              return this._isStatic;
          }
          setErrorNotForClientCall(s) {
              this._stringBuffer = s;
              return this;
          }
          isError() {
              return true;
          }
      }
      Live2DCubismFramework.JsonError = JsonError;
      class JsonNullvalue extends Value {
          isNull() {
              return true;
          }
          getString(defaultValue, indent) {
              return this._stringBuffer;
          }
          isStatic() {
              return true;
          }
          constructor() {
              super();
              this._stringBuffer = 'NullValue';
          }
      }
      Live2DCubismFramework.JsonNullvalue = JsonNullvalue;
      class JsonArray extends Value {
          constructor() {
              super();
              this._array = new csmVector();
          }
          release() {
              for (let ite = this._array.begin(); ite.notEqual(this._array.end()); ite.preIncrement()) {
                  let v = ite.ptr();
                  if (v && !v.isStatic()) {
                      v = void 0;
                      v = null;
                  }
              }
          }
          isArray() {
              return true;
          }
          getValueByIndex(index) {
              if (index < 0 || this._array.getSize() <= index) {
                  return Value.errorValue.setErrorNotForClientCall(CSM_JSON_ERROR_INDEX_OF_BOUNDS);
              }
              const v = this._array.at(index);
              if (v == null) {
                  return Value.nullValue;
              }
              return v;
          }
          getValueByString(s) {
              return Value.errorValue.setErrorNotForClientCall(CSM_JSON_ERROR_TYPE_MISMATCH);
          }
          getString(defaultValue, indent) {
              const stringBuffer = indent + '[\n';
              for (let ite = this._array.begin(); ite.notEqual(this._array.end()); ite.increment()) {
                  const v = ite.ptr();
                  this._stringBuffer += indent + '' + v.getString(indent + ' ') + '\n';
              }
              this._stringBuffer = stringBuffer + indent + ']\n';
              return this._stringBuffer;
          }
          add(v) {
              this._array.pushBack(v);
          }
          getVector(defaultValue = null) {
              return this._array;
          }
          getSize() {
              return this._array.getSize();
          }
      }
      Live2DCubismFramework.JsonArray = JsonArray;
      class JsonMap extends Value {
          constructor() {
              super();
              this._map = new csmMap();
          }
          release() {
              const ite = this._map.begin();
              while (ite.notEqual(this._map.end())) {
                  let v = ite.ptr().second;
                  if (v && !v.isStatic()) {
                      v = void 0;
                      v = null;
                  }
                  ite.preIncrement();
              }
          }
          isMap() {
              return true;
          }
          getValueByString(s) {
              if (s instanceof csmString) {
                  const ret = this._map.getValue(s.s);
                  if (ret == null) {
                      return Value.nullValue;
                  }
                  return ret;
              }
              for (let iter = this._map.begin(); iter.notEqual(this._map.end()); iter.preIncrement()) {
                  if (iter.ptr().first == s) {
                      if (iter.ptr().second == null) {
                          return Value.nullValue;
                      }
                      return iter.ptr().second;
                  }
              }
              return Value.nullValue;
          }
          getValueByIndex(index) {
              return Value.errorValue.setErrorNotForClientCall(CSM_JSON_ERROR_TYPE_MISMATCH);
          }
          getString(defaultValue, indent) {
              this._stringBuffer = indent + '{\n';
              const ite = this._map.begin();
              while (ite.notEqual(this._map.end())) {
                  const key = ite.ptr().first;
                  const v = ite.ptr().second;
                  this._stringBuffer +=
                      indent + ' ' + key + ' : ' + v.getString(indent + '   ') + ' \n';
                  ite.preIncrement();
              }
              this._stringBuffer += indent + '}\n';
              return this._stringBuffer;
          }
          getMap(defaultValue) {
              return this._map;
          }
          put(key, v) {
              this._map.setValue(key, v);
          }
          getKeys() {
              if (!this._keys) {
                  this._keys = new csmVector();
                  const ite = this._map.begin();
                  while (ite.notEqual(this._map.end())) {
                      const key = ite.ptr().first;
                      this._keys.pushBack(key);
                      ite.preIncrement();
                  }
              }
              return this._keys;
          }
          getSize() {
              return this._keys.getSize();
          }
      }
      Live2DCubismFramework.JsonMap = JsonMap;
  })(Live2DCubismFramework$4 || (Live2DCubismFramework$4 = {}));

  var csmString$1 = Live2DCubismFramework.csmString;
  var Live2DCubismFramework$5;
  (function (Live2DCubismFramework) {
      class CubismId {
          constructor(id) {
              if (typeof id === 'string') {
                  this._id = new csmString$1(id);
                  return;
              }
              this._id = id;
          }
          getString() {
              return this._id;
          }
          isEqual(c) {
              if (typeof c === 'string') {
                  return this._id.isEqual(c);
              }
              else if (c instanceof csmString$1) {
                  return this._id.isEqual(c.s);
              }
              else if (c instanceof CubismId) {
                  return this._id.isEqual(c._id.s);
              }
              return false;
          }
          isNotEqual(c) {
              if (typeof c == 'string') {
                  return !this._id.isEqual(c);
              }
              else if (c instanceof csmString$1) {
                  return !this._id.isEqual(c.s);
              }
              else if (c instanceof CubismId) {
                  return !this._id.isEqual(c._id.s);
              }
              return false;
          }
      }
      Live2DCubismFramework.CubismId = CubismId;
  })(Live2DCubismFramework$5 || (Live2DCubismFramework$5 = {}));

  var CubismId = Live2DCubismFramework$5.CubismId;
  var csmVector$1 = Live2DCubismFramework$3.csmVector;
  var Live2DCubismFramework$6;
  (function (Live2DCubismFramework) {
      class CubismIdManager {
          constructor() {
              this._ids = new csmVector$1();
          }
          release() {
              for (let i = 0; i < this._ids.getSize(); ++i) {
                  this._ids.set(i, void 0);
              }
              this._ids = null;
          }
          registerIds(ids) {
              for (let i = 0; i < ids.length; i++) {
                  this.registerId(ids[i]);
              }
          }
          registerId(id) {
              let result = null;
              if ('string' == typeof id) {
                  if ((result = this.findId(id)) != null) {
                      return result;
                  }
                  result = new CubismId(id);
                  this._ids.pushBack(result);
              }
              else {
                  return this.registerId(id.s);
              }
              return result;
          }
          getId(id) {
              return this.registerId(id);
          }
          isExist(id) {
              if ('string' == typeof id) {
                  return this.findId(id) != null;
              }
              return this.isExist(id.s);
          }
          findId(id) {
              for (let i = 0; i < this._ids.getSize(); ++i) {
                  if (this._ids
                      .at(i)
                      .getString()
                      .isEqual(id)) {
                      return this._ids.at(i);
                  }
              }
              return null;
          }
      }
      Live2DCubismFramework.CubismIdManager = CubismIdManager;
  })(Live2DCubismFramework$6 || (Live2DCubismFramework$6 = {}));

  var Live2DCubismFramework$7;
  (function (Live2DCubismFramework) {
      class CubismMatrix44 {
          constructor() {
              this._tr = new Float32Array(16);
              this.loadIdentity();
          }
          static multiply(a, b, dst) {
              const c = new Float32Array([
                  0.0,
                  0.0,
                  0.0,
                  0.0,
                  0.0,
                  0.0,
                  0.0,
                  0.0,
                  0.0,
                  0.0,
                  0.0,
                  0.0,
                  0.0,
                  0.0,
                  0.0,
                  0.0
              ]);
              const n = 4;
              for (let i = 0; i < n; ++i) {
                  for (let j = 0; j < n; ++j) {
                      for (let k = 0; k < n; ++k) {
                          c[j + i * 4] += a[k + i * 4] * b[j + k * 4];
                      }
                  }
              }
              for (let i = 0; i < 16; ++i) {
                  dst[i] = c[i];
              }
          }
          loadIdentity() {
              const c = new Float32Array([
                  1.0, 0.0, 0.0, 0.0,
                  0.0, 1.0, 0.0, 0.0,
                  0.0, 0.0, 1.0, 0.0,
                  0.0, 0.0, 0.0, 1.0
              ]);
              this.setMatrix(c);
          }
          setMatrix(tr) {
              for (let i = 0; i < 16; ++i) {
                  this._tr[i] = tr[i];
              }
          }
          getArray() {
              return this._tr;
          }
          getScaleX() {
              return this._tr[0];
          }
          getScaleY() {
              return this._tr[5];
          }
          getTranslateX() {
              return this._tr[12];
          }
          getTranslateY() {
              return this._tr[13];
          }
          transformX(src) {
              return this._tr[0] * src + this._tr[12];
          }
          transformY(src) {
              return this._tr[5] * src + this._tr[13];
          }
          invertTransformX(src) {
              return (src - this._tr[12]) / this._tr[0];
          }
          invertTransformY(src) {
              return (src - this._tr[13]) / this._tr[5];
          }
          translateRelative(x, y) {
              const tr1 = new Float32Array([
                  1.0,
                  0.0,
                  0.0,
                  0.0,
                  0.0,
                  1.0,
                  0.0,
                  0.0,
                  0.0,
                  0.0,
                  1.0,
                  0.0,
                  x,
                  y,
                  0.0,
                  1.0
              ]);
              CubismMatrix44.multiply(tr1, this._tr, this._tr);
          }
          translate(x, y) {
              this._tr[12] = x;
              this._tr[13] = y;
          }
          translateX(x) {
              this._tr[12] = x;
          }
          translateY(y) {
              this._tr[13] = y;
          }
          scaleRelative(x, y) {
              const tr1 = new Float32Array([
                  x,
                  0.0,
                  0.0,
                  0.0,
                  0.0,
                  y,
                  0.0,
                  0.0,
                  0.0,
                  0.0,
                  1.0,
                  0.0,
                  0.0,
                  0.0,
                  0.0,
                  1.0
              ]);
              CubismMatrix44.multiply(tr1, this._tr, this._tr);
          }
          scale(x, y) {
              this._tr[0] = x;
              this._tr[5] = y;
          }
          scaleX(x) {
              this._tr[0] = x;
          }
          scaleY(y) {
              this._tr[5] = y;
          }
          multiplyByMatrix(m) {
              CubismMatrix44.multiply(m.getArray(), this._tr, this._tr);
          }
          clone() {
              const cloneMatrix = new CubismMatrix44();
              for (let i = 0; i < this._tr.length; i++) {
                  cloneMatrix._tr[i] = this._tr[i];
              }
              return cloneMatrix;
          }
      }
      Live2DCubismFramework.CubismMatrix44 = CubismMatrix44;
  })(Live2DCubismFramework$7 || (Live2DCubismFramework$7 = {}));

  var CubismMatrix44 = Live2DCubismFramework$7.CubismMatrix44;
  var Live2DCubismFramework$8;
  (function (Live2DCubismFramework) {
      class CubismRenderer {
          constructor() {
              this._isCulling = false;
              this._isPremultipliedAlpha = false;
              this._anisortopy = 0.0;
              this._model = null;
              this._modelColor = new CubismTextureColor();
              this._mvpMatrix4x4 = new CubismMatrix44();
              this._mvpMatrix4x4.loadIdentity();
          }
          static create() {
              return null;
          }
          static delete(renderer) {
          }
          initialize(model) {
              this._model = model;
          }
          drawModel() {
              if (this.getModel() == null)
                  return;
              this.doDrawModel();
          }
          setMvpMatrix(matrix44) {
              this._mvpMatrix4x4.setMatrix(matrix44.getArray());
          }
          getMvpMatrix() {
              return this._mvpMatrix4x4;
          }
          setModelColor(red, green, blue, alpha) {
              if (red < 0.0) {
                  red = 0.0;
              }
              else if (red > 1.0) {
                  red = 1.0;
              }
              if (green < 0.0) {
                  green = 0.0;
              }
              else if (green > 1.0) {
                  green = 1.0;
              }
              if (blue < 0.0) {
                  blue = 0.0;
              }
              else if (blue > 1.0) {
                  blue = 1.0;
              }
              if (alpha < 0.0) {
                  alpha = 0.0;
              }
              else if (alpha > 1.0) {
                  alpha = 1.0;
              }
              this._modelColor.R = red;
              this._modelColor.G = green;
              this._modelColor.B = blue;
              this._modelColor.A = alpha;
          }
          getModelColor() {
              return JSON.parse(JSON.stringify(this._modelColor));
          }
          setIsPremultipliedAlpha(enable) {
              this._isPremultipliedAlpha = enable;
          }
          isPremultipliedAlpha() {
              return this._isPremultipliedAlpha;
          }
          setIsCulling(culling) {
              this._isCulling = culling;
          }
          isCulling() {
              return this._isCulling;
          }
          setAnisotropy(n) {
              this._anisortopy = n;
          }
          getAnisotropy() {
              return this._anisortopy;
          }
          getModel() {
              return this._model;
          }
      }
      Live2DCubismFramework.CubismRenderer = CubismRenderer;
      let CubismBlendMode;
      (function (CubismBlendMode) {
          CubismBlendMode[CubismBlendMode["CubismBlendMode_Normal"] = 0] = "CubismBlendMode_Normal";
          CubismBlendMode[CubismBlendMode["CubismBlendMode_Additive"] = 1] = "CubismBlendMode_Additive";
          CubismBlendMode[CubismBlendMode["CubismBlendMode_Multiplicative"] = 2] = "CubismBlendMode_Multiplicative";
      })(CubismBlendMode = Live2DCubismFramework.CubismBlendMode || (Live2DCubismFramework.CubismBlendMode = {}));
      class CubismTextureColor {
          constructor() {
              this.R = 1.0;
              this.G = 1.0;
              this.B = 1.0;
              this.A = 1.0;
          }
      }
      Live2DCubismFramework.CubismTextureColor = CubismTextureColor;
  })(Live2DCubismFramework$8 || (Live2DCubismFramework$8 = {}));

  var Value = Live2DCubismFramework$4.Value;
  var CubismIdManager = Live2DCubismFramework$6.CubismIdManager;
  var CubismRenderer = Live2DCubismFramework$8.CubismRenderer;
  function strtod(s, endPtr) {
      let index = 0;
      for (let i = 1;; i++) {
          const testC = s.slice(i - 1, i);
          if (testC == 'e' || testC == '-' || testC == 'E') {
              continue;
          }
          const test = s.substring(0, i);
          const number = Number(test);
          if (isNaN(number)) {
              break;
          }
          index = i;
      }
      let d = parseFloat(s);
      if (isNaN(d)) {
          d = NaN;
      }
      endPtr[0] = s.slice(index);
      return d;
  }
  var Live2DCubismFramework$9;
  (function (Live2DCubismFramework) {
      let s_isStarted = false;
      let s_isInitialized = false;
      let s_option = null;
      let s_cubismIdManager = null;
      let Constant;
      (function (Constant) {
          Constant.vertexOffset = 0;
          Constant.vertexStep = 2;
      })(Constant = Live2DCubismFramework.Constant || (Live2DCubismFramework.Constant = {}));
      function csmDelete(address) {
          if (!address) {
              return;
          }
          address = void 0;
      }
      Live2DCubismFramework.csmDelete = csmDelete;
      class CubismFramework {
          static startUp(option = null) {
              if (s_isStarted) {
                  CubismLogInfo('CubismFramework.startUp() is already done.');
                  return s_isStarted;
              }
              s_option = option;
              if (s_option != null) {
                  Live2DCubismCore.Logging.csmSetLogFunction(s_option.logFunction);
              }
              s_isStarted = true;
              if (s_isStarted) {
                  const version = Live2DCubismCore.Version.csmGetVersion();
                  const major = (version & 0xff000000) >> 24;
                  const minor = (version & 0x00ff0000) >> 16;
                  const patch = version & 0x0000ffff;
                  const versionNumber = version;
                  CubismLogInfo(`Live2D Cubism Core version: {0}.{1}.{2} ({3})`, ('00' + major).slice(-2), ('00' + minor).slice(-2), ('0000' + patch).slice(-4), versionNumber);
              }
              CubismLogInfo('CubismFramework.startUp() is complete.');
              return s_isStarted;
          }
          static cleanUp() {
              s_isStarted = false;
              s_isInitialized = false;
              s_option = null;
              s_cubismIdManager = null;
          }
          static initialize() {
              CSM_ASSERT(s_isStarted);
              if (!s_isStarted) {
                  CubismLogWarning('CubismFramework is not started.');
                  return;
              }
              if (s_isInitialized) {
                  CubismLogWarning('CubismFramework.initialize() skipped, already initialized.');
                  return;
              }
              Value.staticInitializeNotForClientCall();
              s_cubismIdManager = new CubismIdManager();
              s_isInitialized = true;
              CubismLogInfo('CubismFramework.initialize() is complete.');
          }
          static dispose() {
              CSM_ASSERT(s_isStarted);
              if (!s_isStarted) {
                  CubismLogWarning('CubismFramework is not started.');
                  return;
              }
              if (!s_isInitialized) {
                  CubismLogWarning('CubismFramework.dispose() skipped, not initialized.');
                  return;
              }
              Value.staticReleaseNotForClientCall();
              s_cubismIdManager.release();
              s_cubismIdManager = null;
              CubismRenderer.staticRelease();
              s_isInitialized = false;
              CubismLogInfo('CubismFramework.dispose() is complete.');
          }
          static isStarted() {
              return s_isStarted;
          }
          static isInitialized() {
              return s_isInitialized;
          }
          static coreLogFunction(message) {
              if (!Live2DCubismCore.Logging.csmGetLogFunction()) {
                  return;
              }
              Live2DCubismCore.Logging.csmGetLogFunction()(message);
          }
          static getLoggingLevel() {
              if (s_option != null) {
                  return s_option.loggingLevel;
              }
              return LogLevel.LogLevel_Off;
          }
          static getIdManager() {
              return s_cubismIdManager;
          }
          constructor() { }
      }
      Live2DCubismFramework.CubismFramework = CubismFramework;
  })(Live2DCubismFramework$9 || (Live2DCubismFramework$9 = {}));
  class Option {
  }
  var LogLevel;
  (function (LogLevel) {
      LogLevel[LogLevel["LogLevel_Verbose"] = 0] = "LogLevel_Verbose";
      LogLevel[LogLevel["LogLevel_Debug"] = 1] = "LogLevel_Debug";
      LogLevel[LogLevel["LogLevel_Info"] = 2] = "LogLevel_Info";
      LogLevel[LogLevel["LogLevel_Warning"] = 3] = "LogLevel_Warning";
      LogLevel[LogLevel["LogLevel_Error"] = 4] = "LogLevel_Error";
      LogLevel[LogLevel["LogLevel_Off"] = 5] = "LogLevel_Off";
  })(LogLevel || (LogLevel = {}));

  var Csm_CubismFramework = Live2DCubismFramework$9.CubismFramework;
  class Delegate {
      constructor() {
          this._cubismOption = new Option();
      }
      static get instance() {
          if (!Delegate._instance) {
              Delegate._instance = new Delegate();
          }
          return Delegate._instance;
      }
      initializeCubism(logFunction = console.log, logginLevel = LogLevel.LogLevel_Verbose) {
          this._cubismOption.logFunction = logFunction;
          this._cubismOption.loggingLevel = logginLevel;
          Csm_CubismFramework.startUp(this._cubismOption);
          Csm_CubismFramework.initialize();
      }
      dispose() {
          Csm_CubismFramework.dispose();
      }
  }

  var Live2DCubismFramework$a;
  (function (Live2DCubismFramework) {
      class CubismVector2 {
          constructor(x, y) {
              this.x = x;
              this.y = y;
              this.x = x == undefined ? 0.0 : x;
              this.y = y == undefined ? 0.0 : y;
          }
          add(vector2) {
              const ret = new CubismVector2(0.0, 0.0);
              ret.x = this.x + vector2.x;
              ret.y = this.y + vector2.y;
              return ret;
          }
          substract(vector2) {
              const ret = new CubismVector2(0.0, 0.0);
              ret.x = this.x - vector2.x;
              ret.y = this.y - vector2.y;
              return ret;
          }
          multiply(vector2) {
              const ret = new CubismVector2(0.0, 0.0);
              ret.x = this.x * vector2.x;
              ret.y = this.y * vector2.y;
              return ret;
          }
          multiplyByScaler(scalar) {
              return this.multiply(new CubismVector2(scalar, scalar));
          }
          division(vector2) {
              const ret = new CubismVector2(0.0, 0.0);
              ret.x = this.x / vector2.x;
              ret.y = this.y / vector2.y;
              return ret;
          }
          divisionByScalar(scalar) {
              return this.division(new CubismVector2(scalar, scalar));
          }
          getLength() {
              return Math.sqrt(this.x * this.x + this.y * this.y);
          }
          getDistanceWith(a) {
              return Math.sqrt((this.x - a.x) * (this.x - a.x) + (this.y - a.y) * (this.y - a.y));
          }
          dot(a) {
              return this.x * a.x + this.y * a.y;
          }
          normalize() {
              const length = Math.pow(this.x * this.x + this.y * this.y, 0.5);
              this.x = this.x / length;
              this.y = this.y / length;
          }
          isEqual(rhs) {
              return this.x == rhs.x && this.y == rhs.y;
          }
          isNotEqual(rhs) {
              return !this.isEqual(rhs);
          }
      }
      Live2DCubismFramework.CubismVector2 = CubismVector2;
  })(Live2DCubismFramework$a || (Live2DCubismFramework$a = {}));

  var CubismVector2 = Live2DCubismFramework$a.CubismVector2;
  var Live2DCubismFramework$b;
  (function (Live2DCubismFramework) {
      class CubismMath {
          static range(value, min, max) {
              if (value < min) {
                  value = min;
              }
              else if (value > max) {
                  value = max;
              }
              return value;
          }
          static sin(x) {
              return Math.sin(x);
          }
          static cos(x) {
              return Math.cos(x);
          }
          static abs(x) {
              return Math.abs(x);
          }
          static sqrt(x) {
              return Math.sqrt(x);
          }
          static getEasingSine(value) {
              if (value < 0.0) {
                  return 0.0;
              }
              else if (value > 1.0) {
                  return 1.0;
              }
              return 0.5 - 0.5 * this.cos(value * Math.PI);
          }
          static max(left, right) {
              return left > right ? left : right;
          }
          static min(left, right) {
              return left > right ? right : left;
          }
          static degreesToRadian(degrees) {
              return (degrees / 180.0) * Math.PI;
          }
          static radianToDegrees(radian) {
              return (radian * 180.0) / Math.PI;
          }
          static directionToRadian(from, to) {
              const q1 = Math.atan2(to.y, to.x);
              const q2 = Math.atan2(from.y, from.x);
              let ret = q1 - q2;
              while (ret < -Math.PI) {
                  ret += Math.PI * 2.0;
              }
              while (ret > Math.PI) {
                  ret -= Math.PI * 2.0;
              }
              return ret;
          }
          static directionToDegrees(from, to) {
              const radian = this.directionToRadian(from, to);
              let degree = this.radianToDegrees(radian);
              if (to.x - from.x > 0.0) {
                  degree = -degree;
              }
              return degree;
          }
          static radianToDirection(totalAngle) {
              const ret = new CubismVector2();
              ret.x = this.sin(totalAngle);
              ret.y = this.cos(totalAngle);
              return ret;
          }
          constructor() { }
      }
      Live2DCubismFramework.CubismMath = CubismMath;
  })(Live2DCubismFramework$b || (Live2DCubismFramework$b = {}));

  var csmVector$2 = Live2DCubismFramework$3.csmVector;
  var CubismMath = Live2DCubismFramework$b.CubismMath;
  var Live2DCubismFramework$c;
  (function (Live2DCubismFramework) {
      class ACubismMotion {
          constructor() {
              this.setFinishedMotionHandler = (onFinishedMotionHandler) => (this._onFinishedMotion = onFinishedMotionHandler);
              this.getFinishedMotionHandler = () => this._onFinishedMotion;
              this._fadeInSeconds = -1.0;
              this._fadeOutSeconds = -1.0;
              this._weight = 1.0;
              this._offsetSeconds = 0.0;
              this._firedEventValues = new csmVector$2();
          }
          static delete(motion) {
              motion.release();
              motion = void 0;
              motion = null;
          }
          release() {
              this._weight = 0.0;
          }
          updateParameters(model, motionQueueEntry, userTimeSeconds) {
              if (!motionQueueEntry.isAvailable() || motionQueueEntry.isFinished()) {
                  return;
              }
              if (!motionQueueEntry.isStarted()) {
                  motionQueueEntry.setIsStarted(true);
                  motionQueueEntry.setStartTime(userTimeSeconds - this._offsetSeconds);
                  motionQueueEntry.setFadeInStartTime(userTimeSeconds);
                  const duration = this.getDuration();
                  if (motionQueueEntry.getEndTime() < 0) {
                      motionQueueEntry.setEndTime(duration <= 0 ? -1 : motionQueueEntry.getStartTime() + duration);
                  }
              }
              let fadeWeight = this._weight;
              const fadeIn = this._fadeInSeconds == 0.0
                  ? 1.0
                  : CubismMath.getEasingSine((userTimeSeconds - motionQueueEntry.getFadeInStartTime()) /
                      this._fadeInSeconds);
              const fadeOut = this._fadeOutSeconds == 0.0 || motionQueueEntry.getEndTime() < 0.0
                  ? 1.0
                  : CubismMath.getEasingSine((motionQueueEntry.getEndTime() - userTimeSeconds) /
                      this._fadeOutSeconds);
              fadeWeight = fadeWeight * fadeIn * fadeOut;
              motionQueueEntry.setState(userTimeSeconds, fadeWeight);
              CSM_ASSERT(0.0 <= fadeWeight && fadeWeight <= 1.0);
              this.doUpdateParameters(model, userTimeSeconds, fadeWeight, motionQueueEntry);
              if (motionQueueEntry.getEndTime() > 0 &&
                  motionQueueEntry.getEndTime() < userTimeSeconds) {
                  motionQueueEntry.setIsFinished(true);
              }
          }
          setFadeInTime(fadeInSeconds) {
              this._fadeInSeconds = fadeInSeconds;
          }
          setFadeOutTime(fadeOutSeconds) {
              this._fadeOutSeconds = fadeOutSeconds;
          }
          getFadeOutTime() {
              return this._fadeOutSeconds;
          }
          getFadeInTime() {
              return this._fadeInSeconds;
          }
          setWeight(weight) {
              this._weight = weight;
          }
          getWeight() {
              return this._weight;
          }
          getDuration() {
              return -1.0;
          }
          getLoopDuration() {
              return -1.0;
          }
          setOffsetTime(offsetSeconds) {
              this._offsetSeconds = offsetSeconds;
          }
          getFiredEvent(beforeCheckTimeSeconds, motionTimeSeconds) {
              return this._firedEventValues;
          }
      }
      Live2DCubismFramework.ACubismMotion = ACubismMotion;
  })(Live2DCubismFramework$c || (Live2DCubismFramework$c = {}));

  var ACubismMotion = Live2DCubismFramework$c.ACubismMotion;
  var Live2DCubismFramework$d;
  (function (Live2DCubismFramework) {
      class CubismMotionQueueEntry {
          constructor() {
              this._autoDelete = false;
              this._motion = null;
              this._available = true;
              this._finished = false;
              this._started = false;
              this._startTimeSeconds = -1.0;
              this._fadeInStartTimeSeconds = 0.0;
              this._endTimeSeconds = -1.0;
              this._stateTimeSeconds = 0.0;
              this._stateWeight = 0.0;
              this._lastEventCheckSeconds = 0.0;
              this._motionQueueEntryHandle = this;
          }
          release() {
              if (this._autoDelete && this._motion) {
                  ACubismMotion.delete(this._motion);
              }
          }
          startFadeout(fadeoutSeconds, userTimeSeconds) {
              const newEndTimeSeconds = userTimeSeconds + fadeoutSeconds;
              if (this._endTimeSeconds < 0.0 ||
                  newEndTimeSeconds < this._endTimeSeconds) {
                  this._endTimeSeconds = newEndTimeSeconds;
              }
          }
          isFinished() {
              return this._finished;
          }
          isStarted() {
              return this._started;
          }
          getStartTime() {
              return this._startTimeSeconds;
          }
          getFadeInStartTime() {
              return this._fadeInStartTimeSeconds;
          }
          getEndTime() {
              return this._endTimeSeconds;
          }
          setStartTime(startTime) {
              this._startTimeSeconds = startTime;
          }
          setFadeInStartTime(startTime) {
              this._fadeInStartTimeSeconds = startTime;
          }
          setEndTime(endTime) {
              this._endTimeSeconds = endTime;
          }
          setIsFinished(f) {
              this._finished = f;
          }
          setIsStarted(f) {
              this._started = f;
          }
          isAvailable() {
              return this._available;
          }
          setIsAvailable(v) {
              this._available = v;
          }
          setState(timeSeconds, weight) {
              this._stateTimeSeconds = timeSeconds;
              this._stateWeight = weight;
          }
          getStateTime() {
              return this._stateTimeSeconds;
          }
          getStateWeight() {
              return this._stateWeight;
          }
          getLastCheckEventTime() {
              return this._lastEventCheckSeconds;
          }
          setLastCheckEventTime(checkTime) {
              this._lastEventCheckSeconds = checkTime;
          }
      }
      Live2DCubismFramework.CubismMotionQueueEntry = CubismMotionQueueEntry;
  })(Live2DCubismFramework$d || (Live2DCubismFramework$d = {}));

  var csmVector$3 = Live2DCubismFramework$3.csmVector;
  var CubismMotionQueueEntry = Live2DCubismFramework$d.CubismMotionQueueEntry;
  var Live2DCubismFramework$e;
  (function (Live2DCubismFramework) {
      class CubismMotionQueueManager {
          constructor() {
              this._userTimeSeconds = 0.0;
              this._eventCallBack = null;
              this._eventCustomData = null;
              this._motions = new csmVector$3();
          }
          release() {
              for (let i = 0; i < this._motions.getSize(); ++i) {
                  if (this._motions.at(i)) {
                      this._motions.at(i).release();
                      this._motions.set(i, void 0);
                      this._motions.set(i, null);
                  }
              }
              this._motions = null;
          }
          startMotion(motion, autoDelete, userTimeSeconds) {
              if (motion == null) {
                  return Live2DCubismFramework.InvalidMotionQueueEntryHandleValue;
              }
              let motionQueueEntry = null;
              for (let i = 0; i < this._motions.getSize(); ++i) {
                  motionQueueEntry = this._motions.at(i);
                  if (motionQueueEntry == null) {
                      continue;
                  }
                  motionQueueEntry.startFadeout(motionQueueEntry._motion.getFadeOutTime(), userTimeSeconds);
              }
              motionQueueEntry = new CubismMotionQueueEntry();
              motionQueueEntry._autoDelete = autoDelete;
              motionQueueEntry._motion = motion;
              this._motions.pushBack(motionQueueEntry);
              return motionQueueEntry._motionQueueEntryHandle;
          }
          isFinished() {
              for (let ite = this._motions.begin(); ite.notEqual(this._motions.end());) {
                  let motionQueueEntry = ite.ptr();
                  if (motionQueueEntry == null) {
                      ite = this._motions.erase(ite);
                      continue;
                  }
                  const motion = motionQueueEntry._motion;
                  if (motion == null) {
                      motionQueueEntry.release();
                      motionQueueEntry = void 0;
                      motionQueueEntry = null;
                      ite = this._motions.erase(ite);
                      continue;
                  }
                  if (!motionQueueEntry.isFinished()) {
                      return false;
                  }
                  else {
                      ite.preIncrement();
                  }
              }
              return true;
          }
          isFinishedByHandle(motionQueueEntryNumber) {
              for (let ite = this._motions.begin(); ite.notEqual(this._motions.end()); ite.increment()) {
                  const motionQueueEntry = ite.ptr();
                  if (motionQueueEntry == null) {
                      continue;
                  }
                  if (motionQueueEntry._motionQueueEntryHandle == motionQueueEntryNumber &&
                      !motionQueueEntry.isFinished()) {
                      return false;
                  }
              }
              return true;
          }
          stopAllMotions() {
              for (let ite = this._motions.begin(); ite.notEqual(this._motions.end());) {
                  let motionQueueEntry = ite.ptr();
                  if (motionQueueEntry == null) {
                      ite = this._motions.erase(ite);
                      continue;
                  }
                  motionQueueEntry.release();
                  motionQueueEntry = void 0;
                  motionQueueEntry = null;
                  ite = this._motions.erase(ite);
              }
          }
          getCubismMotionQueueEntry(motionQueueEntryNumber) {
              for (let ite = this._motions.begin(); ite.notEqual(this._motions.end()); ite.preIncrement()) {
                  const motionQueueEntry = ite.ptr();
                  if (motionQueueEntry == null) {
                      continue;
                  }
                  if (motionQueueEntry._motionQueueEntryHandle == motionQueueEntryNumber) {
                      return motionQueueEntry;
                  }
              }
              return null;
          }
          setEventCallback(callback, customData = null) {
              this._eventCallBack = callback;
              this._eventCustomData = customData;
          }
          doUpdateMotion(model, userTimeSeconds) {
              let updated = false;
              for (let ite = this._motions.begin(); ite.notEqual(this._motions.end());) {
                  let motionQueueEntry = ite.ptr();
                  if (motionQueueEntry == null) {
                      ite = this._motions.erase(ite);
                      continue;
                  }
                  const motion = motionQueueEntry._motion;
                  if (motion == null) {
                      motionQueueEntry.release();
                      motionQueueEntry = void 0;
                      motionQueueEntry = null;
                      ite = this._motions.erase(ite);
                      continue;
                  }
                  motion.updateParameters(model, motionQueueEntry, userTimeSeconds);
                  updated = true;
                  const firedList = motion.getFiredEvent(motionQueueEntry.getLastCheckEventTime() -
                      motionQueueEntry.getStartTime(), userTimeSeconds - motionQueueEntry.getStartTime());
                  for (let i = 0; i < firedList.getSize(); ++i) {
                      this._eventCallBack(this, firedList.at(i), this._eventCustomData);
                  }
                  motionQueueEntry.setLastCheckEventTime(userTimeSeconds);
                  if (motionQueueEntry.isFinished()) {
                      motionQueueEntry.release();
                      motionQueueEntry = void 0;
                      motionQueueEntry = null;
                      ite = this._motions.erase(ite);
                  }
                  else {
                      ite.preIncrement();
                  }
              }
              return updated;
          }
      }
      Live2DCubismFramework.CubismMotionQueueManager = CubismMotionQueueManager;
      Live2DCubismFramework.InvalidMotionQueueEntryHandleValue = -1;
  })(Live2DCubismFramework$e || (Live2DCubismFramework$e = {}));

  var CubismMotionQueueManager = Live2DCubismFramework$e.CubismMotionQueueManager;
  var Live2DCubismFramework$f;
  (function (Live2DCubismFramework) {
      class CubismMotionManager extends CubismMotionQueueManager {
          constructor() {
              super();
              this._currentPriority = 0;
              this._reservePriority = 0;
          }
          getCurrentPriority() {
              return this._currentPriority;
          }
          getReservePriority() {
              return this._reservePriority;
          }
          setReservePriority(val) {
              this._reservePriority = val;
          }
          startMotionPriority(motion, autoDelete, priority) {
              if (priority == this._reservePriority) {
                  this._reservePriority = 0;
              }
              this._currentPriority = priority;
              return super.startMotion(motion, autoDelete, this._userTimeSeconds);
          }
          updateMotion(model, deltaTimeSeconds) {
              this._userTimeSeconds += deltaTimeSeconds;
              const updated = super.doUpdateMotion(model, this._userTimeSeconds);
              if (this.isFinished()) {
                  this._currentPriority = 0;
              }
              return updated;
          }
          reserveMotion(priority) {
              if (priority <= this._reservePriority ||
                  priority <= this._currentPriority) {
                  return false;
              }
              this._reservePriority = priority;
              return true;
          }
      }
      Live2DCubismFramework.CubismMotionManager = CubismMotionManager;
  })(Live2DCubismFramework$f || (Live2DCubismFramework$f = {}));

  var CubismMatrix44$1 = Live2DCubismFramework$7.CubismMatrix44;
  var Live2DCubismFramework$g;
  (function (Live2DCubismFramework) {
      class CubismModelMatrix extends CubismMatrix44$1 {
          constructor(w, h) {
              super();
              this._width = w !== undefined ? w : 0.0;
              this._height = h !== undefined ? h : 0.0;
              this.setHeight(1.0);
          }
          setWidth(w) {
              const scaleX = w / this._width;
              const scaleY = scaleX;
              this.scale(scaleX, scaleY);
          }
          setHeight(h) {
              const scaleX = h / this._height;
              const scaleY = scaleX;
              this.scale(scaleX, scaleY);
          }
          setPosition(x, y) {
              this.translate(x, y);
          }
          setCenterPosition(x, y) {
              this.centerX(x);
              this.centerY(y);
          }
          top(y) {
              this.setY(y);
          }
          bottom(y) {
              const h = this._height * this.getScaleY();
              this.translateY(y - h);
          }
          left(x) {
              this.setX(x);
          }
          right(x) {
              const w = this._width * this.getScaleX();
              this.translateX(x - w);
          }
          centerX(x) {
              const w = this._width * this.getScaleX();
              this.translateX(x - w / 2.0);
          }
          setX(x) {
              this.translateX(x);
          }
          centerY(y) {
              const h = this._height * this.getScaleY();
              this.translateY(y - h / 2.0);
          }
          setY(y) {
              this.translateY(y);
          }
          setupFromLayout(layout) {
              const keyWidth = 'width';
              const keyHeight = 'height';
              const keyX = 'x';
              const keyY = 'y';
              const keyCenterX = 'center_x';
              const keyCenterY = 'center_y';
              const keyTop = 'top';
              const keyBottom = 'bottom';
              const keyLeft = 'left';
              const keyRight = 'right';
              for (const ite = layout.begin(); ite.notEqual(layout.end()); ite.preIncrement()) {
                  const key = ite.ptr().first;
                  const value = ite.ptr().second;
                  if (key == keyWidth) {
                      this.setWidth(value);
                  }
                  else if (key == keyHeight) {
                      this.setHeight(value);
                  }
              }
              for (const ite = layout.begin(); ite.notEqual(layout.end()); ite.preIncrement()) {
                  const key = ite.ptr().first;
                  const value = ite.ptr().second;
                  if (key == keyX) {
                      this.setX(value);
                  }
                  else if (key == keyY) {
                      this.setY(value);
                  }
                  else if (key == keyCenterX) {
                      this.centerX(value);
                  }
                  else if (key == keyCenterY) {
                      this.centerY(value);
                  }
                  else if (key == keyTop) {
                      this.top(value);
                  }
                  else if (key == keyBottom) {
                      this.bottom(value);
                  }
                  else if (key == keyLeft) {
                      this.left(value);
                  }
                  else if (key == keyRight) {
                      this.right(value);
                  }
              }
          }
      }
      Live2DCubismFramework.CubismModelMatrix = CubismModelMatrix;
  })(Live2DCubismFramework$g || (Live2DCubismFramework$g = {}));

  var csmString$2 = Live2DCubismFramework.csmString;
  var CubismFramework = Live2DCubismFramework$9.CubismFramework;
  var CubismJson = Live2DCubismFramework$4.CubismJson;
  var Live2DCubismFramework$h;
  (function (Live2DCubismFramework) {
      const Meta = 'Meta';
      const Duration = 'Duration';
      const Loop = 'Loop';
      const CurveCount = 'CurveCount';
      const Fps = 'Fps';
      const TotalSegmentCount = 'TotalSegmentCount';
      const TotalPointCount = 'TotalPointCount';
      const Curves = 'Curves';
      const Target = 'Target';
      const Id = 'Id';
      const FadeInTime = 'FadeInTime';
      const FadeOutTime = 'FadeOutTime';
      const Segments = 'Segments';
      const UserData = 'UserData';
      const UserDataCount = 'UserDataCount';
      const TotalUserDataSize = 'TotalUserDataSize';
      const Time = 'Time';
      const Value = 'Value';
      class CubismMotionJson {
          constructor(buffer, size) {
              this._json = CubismJson.create(buffer, size);
          }
          release() {
              CubismJson.delete(this._json);
          }
          getMotionDuration() {
              return this._json
                  .getRoot()
                  .getValueByString(Meta)
                  .getValueByString(Duration)
                  .toFloat();
          }
          isMotionLoop() {
              return this._json
                  .getRoot()
                  .getValueByString(Meta)
                  .getValueByString(Loop)
                  .toBoolean();
          }
          getMotionCurveCount() {
              return this._json
                  .getRoot()
                  .getValueByString(Meta)
                  .getValueByString(CurveCount)
                  .toInt();
          }
          getMotionFps() {
              return this._json
                  .getRoot()
                  .getValueByString(Meta)
                  .getValueByString(Fps)
                  .toFloat();
          }
          getMotionTotalSegmentCount() {
              return this._json
                  .getRoot()
                  .getValueByString(Meta)
                  .getValueByString(TotalSegmentCount)
                  .toInt();
          }
          getMotionTotalPointCount() {
              return this._json
                  .getRoot()
                  .getValueByString(Meta)
                  .getValueByString(TotalPointCount)
                  .toInt();
          }
          isExistMotionFadeInTime() {
              return !this._json
                  .getRoot()
                  .getValueByString(Meta)
                  .getValueByString(FadeInTime)
                  .isNull();
          }
          isExistMotionFadeOutTime() {
              return !this._json
                  .getRoot()
                  .getValueByString(Meta)
                  .getValueByString(FadeOutTime)
                  .isNull();
          }
          getMotionFadeInTime() {
              return this._json
                  .getRoot()
                  .getValueByString(Meta)
                  .getValueByString(FadeInTime)
                  .toFloat();
          }
          getMotionFadeOutTime() {
              return this._json
                  .getRoot()
                  .getValueByString(Meta)
                  .getValueByString(FadeOutTime)
                  .toFloat();
          }
          getMotionCurveTarget(curveIndex) {
              return this._json
                  .getRoot()
                  .getValueByString(Curves)
                  .getValueByIndex(curveIndex)
                  .getValueByString(Target)
                  .getRawString();
          }
          getMotionCurveId(curveIndex) {
              return CubismFramework.getIdManager().getId(this._json
                  .getRoot()
                  .getValueByString(Curves)
                  .getValueByIndex(curveIndex)
                  .getValueByString(Id)
                  .getRawString());
          }
          isExistMotionCurveFadeInTime(curveIndex) {
              return !this._json
                  .getRoot()
                  .getValueByString(Curves)
                  .getValueByIndex(curveIndex)
                  .getValueByString(FadeInTime)
                  .isNull();
          }
          isExistMotionCurveFadeOutTime(curveIndex) {
              return !this._json
                  .getRoot()
                  .getValueByString(Curves)
                  .getValueByIndex(curveIndex)
                  .getValueByString(FadeOutTime)
                  .isNull();
          }
          getMotionCurveFadeInTime(curveIndex) {
              return this._json
                  .getRoot()
                  .getValueByString(Curves)
                  .getValueByIndex(curveIndex)
                  .getValueByString(FadeInTime)
                  .toFloat();
          }
          getMotionCurveFadeOutTime(curveIndex) {
              return this._json
                  .getRoot()
                  .getValueByString(Curves)
                  .getValueByIndex(curveIndex)
                  .getValueByString(FadeOutTime)
                  .toFloat();
          }
          getMotionCurveSegmentCount(curveIndex) {
              return this._json
                  .getRoot()
                  .getValueByString(Curves)
                  .getValueByIndex(curveIndex)
                  .getValueByString(Segments)
                  .getVector()
                  .getSize();
          }
          getMotionCurveSegment(curveIndex, segmentIndex) {
              return this._json
                  .getRoot()
                  .getValueByString(Curves)
                  .getValueByIndex(curveIndex)
                  .getValueByString(Segments)
                  .getValueByIndex(segmentIndex)
                  .toFloat();
          }
          getEventCount() {
              return this._json
                  .getRoot()
                  .getValueByString(Meta)
                  .getValueByString(UserDataCount)
                  .toInt();
          }
          getTotalEventValueSize() {
              return this._json
                  .getRoot()
                  .getValueByString(Meta)
                  .getValueByString(TotalUserDataSize)
                  .toInt();
          }
          getEventTime(userDataIndex) {
              return this._json
                  .getRoot()
                  .getValueByString(UserData)
                  .getValueByIndex(userDataIndex)
                  .getValueByString(Time)
                  .toInt();
          }
          getEventValue(userDataIndex) {
              return new csmString$2(this._json
                  .getRoot()
                  .getValueByString(UserData)
                  .getValueByIndex(userDataIndex)
                  .getValueByString(Value)
                  .getRawString());
          }
      }
      Live2DCubismFramework.CubismMotionJson = CubismMotionJson;
  })(Live2DCubismFramework$h || (Live2DCubismFramework$h = {}));

  var csmVector$4 = Live2DCubismFramework$3.csmVector;
  var Live2DCubismFramework$i;
  (function (Live2DCubismFramework) {
      let CubismMotionCurveTarget;
      (function (CubismMotionCurveTarget) {
          CubismMotionCurveTarget[CubismMotionCurveTarget["CubismMotionCurveTarget_Model"] = 0] = "CubismMotionCurveTarget_Model";
          CubismMotionCurveTarget[CubismMotionCurveTarget["CubismMotionCurveTarget_Parameter"] = 1] = "CubismMotionCurveTarget_Parameter";
          CubismMotionCurveTarget[CubismMotionCurveTarget["CubismMotionCurveTarget_PartOpacity"] = 2] = "CubismMotionCurveTarget_PartOpacity";
      })(CubismMotionCurveTarget = Live2DCubismFramework.CubismMotionCurveTarget || (Live2DCubismFramework.CubismMotionCurveTarget = {}));
      let CubismMotionSegmentType;
      (function (CubismMotionSegmentType) {
          CubismMotionSegmentType[CubismMotionSegmentType["CubismMotionSegmentType_Linear"] = 0] = "CubismMotionSegmentType_Linear";
          CubismMotionSegmentType[CubismMotionSegmentType["CubismMotionSegmentType_Bezier"] = 1] = "CubismMotionSegmentType_Bezier";
          CubismMotionSegmentType[CubismMotionSegmentType["CubismMotionSegmentType_Stepped"] = 2] = "CubismMotionSegmentType_Stepped";
          CubismMotionSegmentType[CubismMotionSegmentType["CubismMotionSegmentType_InverseStepped"] = 3] = "CubismMotionSegmentType_InverseStepped";
      })(CubismMotionSegmentType = Live2DCubismFramework.CubismMotionSegmentType || (Live2DCubismFramework.CubismMotionSegmentType = {}));
      class CubismMotionPoint {
          constructor() {
              this.time = 0.0;
              this.value = 0.0;
          }
      }
      Live2DCubismFramework.CubismMotionPoint = CubismMotionPoint;
      class CubismMotionSegment {
          constructor() {
              this.evaluate = null;
              this.basePointIndex = 0;
              this.segmentType = 0;
          }
      }
      Live2DCubismFramework.CubismMotionSegment = CubismMotionSegment;
      class CubismMotionCurve {
          constructor() {
              this.type = CubismMotionCurveTarget.CubismMotionCurveTarget_Model;
              this.segmentCount = 0;
              this.baseSegmentIndex = 0;
              this.fadeInTime = 0.0;
              this.fadeOutTime = 0.0;
          }
      }
      Live2DCubismFramework.CubismMotionCurve = CubismMotionCurve;
      class CubismMotionEvent {
          constructor() {
              this.fireTime = 0.0;
          }
      }
      Live2DCubismFramework.CubismMotionEvent = CubismMotionEvent;
      class CubismMotionData {
          constructor() {
              this.duration = 0.0;
              this.loop = false;
              this.curveCount = 0;
              this.eventCount = 0;
              this.fps = 0.0;
              this.curves = new csmVector$4();
              this.segments = new csmVector$4();
              this.points = new csmVector$4();
              this.events = new csmVector$4();
          }
      }
      Live2DCubismFramework.CubismMotionData = CubismMotionData;
  })(Live2DCubismFramework$i || (Live2DCubismFramework$i = {}));

  var csmString$3 = Live2DCubismFramework.csmString;
  var CubismMotionData = Live2DCubismFramework$i.CubismMotionData;
  var CubismMotionSegment = Live2DCubismFramework$i.CubismMotionSegment;
  var CubismMotionPoint = Live2DCubismFramework$i.CubismMotionPoint;
  var CubismMotionEvent = Live2DCubismFramework$i.CubismMotionEvent;
  var CubismMotionSegmentType = Live2DCubismFramework$i.CubismMotionSegmentType;
  var CubismMotionCurve = Live2DCubismFramework$i.CubismMotionCurve;
  var CubismMotionCurveTarget = Live2DCubismFramework$i.CubismMotionCurveTarget;
  var CubismMath$1 = Live2DCubismFramework$b.CubismMath;
  var CubismFramework$1 = Live2DCubismFramework$9.CubismFramework;
  var ACubismMotion$1 = Live2DCubismFramework$c.ACubismMotion;
  var CubismMotionJson = Live2DCubismFramework$h.CubismMotionJson;
  var Live2DCubismFramework$j;
  (function (Live2DCubismFramework) {
      const EffectNameEyeBlink = 'EyeBlink';
      const EffectNameLipSync = 'LipSync';
      const TargetNameModel = 'Model';
      const TargetNameParameter = 'Parameter';
      const TargetNamePartOpacity = 'PartOpacity';
      function lerpPoints(a, b, t) {
          const result = new CubismMotionPoint();
          result.time = a.time + (b.time - a.time) * t;
          result.value = a.value + (b.value - a.value) * t;
          return result;
      }
      function linearEvaluate(points, time) {
          let t = (time - points[0].time) / (points[1].time - points[0].time);
          if (t < 0.0) {
              t = 0.0;
          }
          return points[0].value + (points[1].value - points[0].value) * t;
      }
      function bezierEvaluate(points, time) {
          let t = (time - points[0].time) / (points[3].time - points[0].time);
          if (t < 0.0) {
              t = 0.0;
          }
          const p01 = lerpPoints(points[0], points[1], t);
          const p12 = lerpPoints(points[1], points[2], t);
          const p23 = lerpPoints(points[2], points[3], t);
          const p012 = lerpPoints(p01, p12, t);
          const p123 = lerpPoints(p12, p23, t);
          return lerpPoints(p012, p123, t).value;
      }
      function steppedEvaluate(points, time) {
          return points[0].value;
      }
      function inverseSteppedEvaluate(points, time) {
          return points[1].value;
      }
      function evaluateCurve(motionData, index, time) {
          const curve = motionData.curves.at(index);
          let target = -1;
          const totalSegmentCount = curve.baseSegmentIndex + curve.segmentCount;
          let pointPosition = 0;
          for (let i = curve.baseSegmentIndex; i < totalSegmentCount; ++i) {
              pointPosition =
                  motionData.segments.at(i).basePointIndex +
                      (motionData.segments.at(i).segmentType ==
                          CubismMotionSegmentType.CubismMotionSegmentType_Bezier
                          ? 3
                          : 1);
              if (motionData.points.at(pointPosition).time > time) {
                  target = i;
                  break;
              }
          }
          if (target == -1) {
              return motionData.points.at(pointPosition).value;
          }
          const segment = motionData.segments.at(target);
          return segment.evaluate(motionData.points.get(segment.basePointIndex), time);
      }
      class CubismMotion extends ACubismMotion$1 {
          constructor() {
              super();
              this._sourceFrameRate = 30.0;
              this._loopDurationSeconds = -1.0;
              this._isLoop = false;
              this._isLoopFadeIn = true;
              this._lastWeight = 0.0;
              this._motionData = null;
              this._modelCurveIdEyeBlink = null;
              this._modelCurveIdLipSync = null;
              this._eyeBlinkParameterIds = null;
              this._lipSyncParameterIds = null;
          }
          static create(buffer, size, onFinishedMotionHandler) {
              const ret = new CubismMotion();
              ret.parse(buffer, size);
              ret._sourceFrameRate = ret._motionData.fps;
              ret._loopDurationSeconds = ret._motionData.duration;
              ret._onFinishedMotion = onFinishedMotionHandler;
              return ret;
          }
          doUpdateParameters(model, userTimeSeconds, fadeWeight, motionQueueEntry) {
              if (this._modelCurveIdEyeBlink == null) {
                  this._modelCurveIdEyeBlink = CubismFramework$1.getIdManager().getId(EffectNameEyeBlink);
              }
              if (this._modelCurveIdLipSync == null) {
                  this._modelCurveIdLipSync = CubismFramework$1.getIdManager().getId(EffectNameLipSync);
              }
              let timeOffsetSeconds = userTimeSeconds - motionQueueEntry.getStartTime();
              if (timeOffsetSeconds < 0.0) {
                  timeOffsetSeconds = 0.0;
              }
              let lipSyncValue = Number.MAX_VALUE;
              let eyeBlinkValue = Number.MAX_VALUE;
              const MaxTargetSize = 64;
              let lipSyncFlags = 0;
              let eyeBlinkFlags = 0;
              if (this._eyeBlinkParameterIds.getSize() > MaxTargetSize) {
                  CubismLogDebug('too many eye blink targets : {0}', this._eyeBlinkParameterIds.getSize());
              }
              if (this._lipSyncParameterIds.getSize() > MaxTargetSize) {
                  CubismLogDebug('too many lip sync targets : {0}', this._lipSyncParameterIds.getSize());
              }
              const tmpFadeIn = this._fadeInSeconds <= 0.0
                  ? 1.0
                  : CubismMath$1.getEasingSine((userTimeSeconds - motionQueueEntry.getFadeInStartTime()) /
                      this._fadeInSeconds);
              const tmpFadeOut = this._fadeOutSeconds <= 0.0 || motionQueueEntry.getEndTime() < 0.0
                  ? 1.0
                  : CubismMath$1.getEasingSine((motionQueueEntry.getEndTime() - userTimeSeconds) /
                      this._fadeOutSeconds);
              let value;
              let c, parameterIndex;
              let time = timeOffsetSeconds;
              if (this._isLoop) {
                  while (time > this._motionData.duration) {
                      time -= this._motionData.duration;
                  }
              }
              const curves = this._motionData.curves;
              for (c = 0; c < this._motionData.curveCount &&
                  curves.at(c).type ==
                      CubismMotionCurveTarget.CubismMotionCurveTarget_Model; ++c) {
                  value = evaluateCurve(this._motionData, c, time);
                  if (curves.at(c).id == this._modelCurveIdEyeBlink) {
                      eyeBlinkValue = value;
                  }
                  else if (curves.at(c).id == this._modelCurveIdLipSync) {
                      lipSyncValue = value;
                  }
              }
              for (; c < this._motionData.curveCount &&
                  curves.at(c).type ==
                      CubismMotionCurveTarget.CubismMotionCurveTarget_Parameter; ++c) {
                  parameterIndex = model.getParameterIndex(curves.at(c).id);
                  if (parameterIndex == -1) {
                      continue;
                  }
                  const sourceValue = model.getParameterValueByIndex(parameterIndex);
                  value = evaluateCurve(this._motionData, c, time);
                  if (eyeBlinkValue != Number.MAX_VALUE) {
                      for (let i = 0; i < this._eyeBlinkParameterIds.getSize() && i < MaxTargetSize; ++i) {
                          if (this._eyeBlinkParameterIds.at(i) == curves.at(c).id) {
                              value *= eyeBlinkValue;
                              eyeBlinkFlags |= 1 << i;
                              break;
                          }
                      }
                  }
                  if (lipSyncValue != Number.MAX_VALUE) {
                      for (let i = 0; i < this._lipSyncParameterIds.getSize() && i < MaxTargetSize; ++i) {
                          if (this._lipSyncParameterIds.at(i) == curves.at(c).id) {
                              value += lipSyncValue;
                              lipSyncFlags |= 1 << i;
                              break;
                          }
                      }
                  }
                  let v;
                  if (curves.at(c).fadeInTime < 0.0 && curves.at(c).fadeOutTime < 0.0) {
                      v = sourceValue + (value - sourceValue) * fadeWeight;
                  }
                  else {
                      let fin;
                      let fout;
                      if (curves.at(c).fadeInTime < 0.0) {
                          fin = tmpFadeIn;
                      }
                      else {
                          fin =
                              curves.at(c).fadeInTime == 0.0
                                  ? 1.0
                                  : CubismMath$1.getEasingSine((userTimeSeconds - motionQueueEntry.getFadeInStartTime()) /
                                      curves.at(c).fadeInTime);
                      }
                      if (curves.at(c).fadeOutTime < 0.0) {
                          fout = tmpFadeOut;
                      }
                      else {
                          fout =
                              curves.at(c).fadeOutTime == 0.0 ||
                                  motionQueueEntry.getEndTime() < 0.0
                                  ? 1.0
                                  : CubismMath$1.getEasingSine((motionQueueEntry.getEndTime() - userTimeSeconds) /
                                      curves.at(c).fadeOutTime);
                      }
                      const paramWeight = this._weight * fin * fout;
                      v = sourceValue + (value - sourceValue) * paramWeight;
                  }
                  model.setParameterValueByIndex(parameterIndex, v, 1.0);
              }
              {
                  if (eyeBlinkValue != Number.MAX_VALUE) {
                      for (let i = 0; i < this._eyeBlinkParameterIds.getSize() && i < MaxTargetSize; ++i) {
                          const sourceValue = model.getParameterValueById(this._eyeBlinkParameterIds.at(i));
                          if ((eyeBlinkFlags >> i) & 0x01) {
                              continue;
                          }
                          const v = sourceValue + (eyeBlinkValue - sourceValue) * fadeWeight;
                          model.setParameterValueById(this._eyeBlinkParameterIds.at(i), v);
                      }
                  }
                  if (lipSyncValue != Number.MAX_VALUE) {
                      for (let i = 0; i < this._lipSyncParameterIds.getSize() && i < MaxTargetSize; ++i) {
                          const sourceValue = model.getParameterValueById(this._lipSyncParameterIds.at(i));
                          if ((lipSyncFlags >> i) & 0x01) {
                              continue;
                          }
                          const v = sourceValue + (lipSyncValue - sourceValue) * fadeWeight;
                          model.setParameterValueById(this._lipSyncParameterIds.at(i), v);
                      }
                  }
              }
              for (; c < this._motionData.curveCount &&
                  curves.at(c).type ==
                      CubismMotionCurveTarget.CubismMotionCurveTarget_PartOpacity; ++c) {
                  parameterIndex = model.getParameterIndex(curves.at(c).id);
                  if (parameterIndex == -1) {
                      continue;
                  }
                  value = evaluateCurve(this._motionData, c, time);
                  model.setParameterValueByIndex(parameterIndex, value);
              }
              if (timeOffsetSeconds >= this._motionData.duration) {
                  if (this._isLoop) {
                      motionQueueEntry.setStartTime(userTimeSeconds);
                      if (this._isLoopFadeIn) {
                          motionQueueEntry.setFadeInStartTime(userTimeSeconds);
                      }
                  }
                  else {
                      if (this._onFinishedMotion) {
                          this._onFinishedMotion(this);
                      }
                      motionQueueEntry.setIsFinished(true);
                  }
              }
              this._lastWeight = fadeWeight;
          }
          setIsLoop(loop) {
              this._isLoop = loop;
          }
          isLoop() {
              return this._isLoop;
          }
          setIsLoopFadeIn(loopFadeIn) {
              this._isLoopFadeIn = loopFadeIn;
          }
          isLoopFadeIn() {
              return this._isLoopFadeIn;
          }
          getDuration() {
              return this._isLoop ? -1.0 : this._loopDurationSeconds;
          }
          getLoopDuration() {
              return this._loopDurationSeconds;
          }
          setParameterFadeInTime(parameterId, value) {
              const curves = this._motionData.curves;
              for (let i = 0; i < this._motionData.curveCount; ++i) {
                  if (parameterId == curves.at(i).id) {
                      curves.at(i).fadeInTime = value;
                      return;
                  }
              }
          }
          setParameterFadeOutTime(parameterId, value) {
              const curves = this._motionData.curves;
              for (let i = 0; i < this._motionData.curveCount; ++i) {
                  if (parameterId == curves.at(i).id) {
                      curves.at(i).fadeOutTime = value;
                      return;
                  }
              }
          }
          getParameterFadeInTime(parameterId) {
              const curves = this._motionData.curves;
              for (let i = 0; i < this._motionData.curveCount; ++i) {
                  if (parameterId == curves.at(i).id) {
                      return curves.at(i).fadeInTime;
                  }
              }
              return -1;
          }
          getParameterFadeOutTime(parameterId) {
              const curves = this._motionData.curves;
              for (let i = 0; i < this._motionData.curveCount; ++i) {
                  if (parameterId == curves.at(i).id) {
                      return curves.at(i).fadeOutTime;
                  }
              }
              return -1;
          }
          setEffectIds(eyeBlinkParameterIds, lipSyncParameterIds) {
              this._eyeBlinkParameterIds = eyeBlinkParameterIds;
              this._lipSyncParameterIds = lipSyncParameterIds;
          }
          release() {
              this._motionData = void 0;
              this._motionData = null;
          }
          parse(motionJson, size) {
              this._motionData = new CubismMotionData();
              let json = new CubismMotionJson(motionJson, size);
              this._motionData.duration = json.getMotionDuration();
              this._motionData.loop = json.isMotionLoop();
              this._motionData.curveCount = json.getMotionCurveCount();
              this._motionData.fps = json.getMotionFps();
              this._motionData.eventCount = json.getEventCount();
              if (json.isExistMotionFadeInTime()) {
                  this._fadeInSeconds =
                      json.getMotionFadeInTime() < 0.0 ? 1.0 : json.getMotionFadeInTime();
              }
              else {
                  this._fadeInSeconds = 1.0;
              }
              if (json.isExistMotionFadeOutTime()) {
                  this._fadeOutSeconds =
                      json.getMotionFadeOutTime() < 0.0 ? 1.0 : json.getMotionFadeOutTime();
              }
              else {
                  this._fadeOutSeconds = 1.0;
              }
              this._motionData.curves.updateSize(this._motionData.curveCount, CubismMotionCurve, true);
              this._motionData.segments.updateSize(json.getMotionTotalSegmentCount(), CubismMotionSegment, true);
              this._motionData.points.updateSize(json.getMotionTotalPointCount(), CubismMotionPoint, true);
              this._motionData.events.updateSize(this._motionData.eventCount, CubismMotionEvent, true);
              let totalPointCount = 0;
              let totalSegmentCount = 0;
              for (let curveCount = 0; curveCount < this._motionData.curveCount; ++curveCount) {
                  if (json.getMotionCurveTarget(curveCount) == TargetNameModel) {
                      this._motionData.curves.at(curveCount).type =
                          CubismMotionCurveTarget.CubismMotionCurveTarget_Model;
                  }
                  else if (json.getMotionCurveTarget(curveCount) == TargetNameParameter) {
                      this._motionData.curves.at(curveCount).type =
                          CubismMotionCurveTarget.CubismMotionCurveTarget_Parameter;
                  }
                  else if (json.getMotionCurveTarget(curveCount) == TargetNamePartOpacity) {
                      this._motionData.curves.at(curveCount).type =
                          CubismMotionCurveTarget.CubismMotionCurveTarget_PartOpacity;
                  }
                  this._motionData.curves.at(curveCount).id = json.getMotionCurveId(curveCount);
                  this._motionData.curves.at(curveCount).baseSegmentIndex = totalSegmentCount;
                  this._motionData.curves.at(curveCount).fadeInTime = json.isExistMotionCurveFadeInTime(curveCount)
                      ? json.getMotionCurveFadeInTime(curveCount)
                      : -1.0;
                  this._motionData.curves.at(curveCount).fadeOutTime = json.isExistMotionCurveFadeOutTime(curveCount)
                      ? json.getMotionCurveFadeOutTime(curveCount)
                      : -1.0;
                  for (let segmentPosition = 0; segmentPosition < json.getMotionCurveSegmentCount(curveCount);) {
                      if (segmentPosition == 0) {
                          this._motionData.segments.at(totalSegmentCount).basePointIndex = totalPointCount;
                          this._motionData.points.at(totalPointCount).time = json.getMotionCurveSegment(curveCount, segmentPosition);
                          this._motionData.points.at(totalPointCount).value = json.getMotionCurveSegment(curveCount, segmentPosition + 1);
                          totalPointCount += 1;
                          segmentPosition += 2;
                      }
                      else {
                          this._motionData.segments.at(totalSegmentCount).basePointIndex =
                              totalPointCount - 1;
                      }
                      const segment = json.getMotionCurveSegment(curveCount, segmentPosition);
                      switch (segment) {
                          case CubismMotionSegmentType.CubismMotionSegmentType_Linear: {
                              this._motionData.segments.at(totalSegmentCount).segmentType =
                                  CubismMotionSegmentType.CubismMotionSegmentType_Linear;
                              this._motionData.segments.at(totalSegmentCount).evaluate = linearEvaluate;
                              this._motionData.points.at(totalPointCount).time = json.getMotionCurveSegment(curveCount, segmentPosition + 1);
                              this._motionData.points.at(totalPointCount).value = json.getMotionCurveSegment(curveCount, segmentPosition + 2);
                              totalPointCount += 1;
                              segmentPosition += 3;
                              break;
                          }
                          case CubismMotionSegmentType.CubismMotionSegmentType_Bezier: {
                              this._motionData.segments.at(totalSegmentCount).segmentType =
                                  CubismMotionSegmentType.CubismMotionSegmentType_Bezier;
                              this._motionData.segments.at(totalSegmentCount).evaluate = bezierEvaluate;
                              this._motionData.points.at(totalPointCount).time = json.getMotionCurveSegment(curveCount, segmentPosition + 1);
                              this._motionData.points.at(totalPointCount).value = json.getMotionCurveSegment(curveCount, segmentPosition + 2);
                              this._motionData.points.at(totalPointCount + 1).time = json.getMotionCurveSegment(curveCount, segmentPosition + 3);
                              this._motionData.points.at(totalPointCount + 1).value = json.getMotionCurveSegment(curveCount, segmentPosition + 4);
                              this._motionData.points.at(totalPointCount + 2).time = json.getMotionCurveSegment(curveCount, segmentPosition + 5);
                              this._motionData.points.at(totalPointCount + 2).value = json.getMotionCurveSegment(curveCount, segmentPosition + 6);
                              totalPointCount += 3;
                              segmentPosition += 7;
                              break;
                          }
                          case CubismMotionSegmentType.CubismMotionSegmentType_Stepped: {
                              this._motionData.segments.at(totalSegmentCount).segmentType =
                                  CubismMotionSegmentType.CubismMotionSegmentType_Stepped;
                              this._motionData.segments.at(totalSegmentCount).evaluate = steppedEvaluate;
                              this._motionData.points.at(totalPointCount).time = json.getMotionCurveSegment(curveCount, segmentPosition + 1);
                              this._motionData.points.at(totalPointCount).value = json.getMotionCurveSegment(curveCount, segmentPosition + 2);
                              totalPointCount += 1;
                              segmentPosition += 3;
                              break;
                          }
                          case CubismMotionSegmentType.CubismMotionSegmentType_InverseStepped: {
                              this._motionData.segments.at(totalSegmentCount).segmentType =
                                  CubismMotionSegmentType.CubismMotionSegmentType_InverseStepped;
                              this._motionData.segments.at(totalSegmentCount).evaluate = inverseSteppedEvaluate;
                              this._motionData.points.at(totalPointCount).time = json.getMotionCurveSegment(curveCount, segmentPosition + 1);
                              this._motionData.points.at(totalPointCount).value = json.getMotionCurveSegment(curveCount, segmentPosition + 2);
                              totalPointCount += 1;
                              segmentPosition += 3;
                              break;
                          }
                          default: {
                              CSM_ASSERT(0);
                              break;
                          }
                      }
                      ++this._motionData.curves.at(curveCount).segmentCount;
                      ++totalSegmentCount;
                  }
              }
              for (let userdatacount = 0; userdatacount < json.getEventCount(); ++userdatacount) {
                  this._motionData.events.at(userdatacount).fireTime = json.getEventTime(userdatacount);
                  this._motionData.events.at(userdatacount).value = json.getEventValue(userdatacount);
              }
              json.release();
              json = void 0;
              json = null;
          }
          getFiredEvent(beforeCheckTimeSeconds, motionTimeSeconds) {
              this._firedEventValues.updateSize(0);
              for (let u = 0; u < this._motionData.eventCount; ++u) {
                  if (this._motionData.events.at(u).fireTime > beforeCheckTimeSeconds &&
                      this._motionData.events.at(u).fireTime <= motionTimeSeconds) {
                      this._firedEventValues.pushBack(new csmString$3(this._motionData.events.at(u).value.s));
                  }
              }
              return this._firedEventValues;
          }
      }
      Live2DCubismFramework.CubismMotion = CubismMotion;
  })(Live2DCubismFramework$j || (Live2DCubismFramework$j = {}));

  var csmVector$5 = Live2DCubismFramework$3.csmVector;
  var CubismFramework$2 = Live2DCubismFramework$9.CubismFramework;
  var CubismJson$1 = Live2DCubismFramework$4.CubismJson;
  var ACubismMotion$2 = Live2DCubismFramework$c.ACubismMotion;
  var Live2DCubismFramework$k;
  (function (Live2DCubismFramework) {
      const ExpressionKeyFadeIn = 'FadeInTime';
      const ExpressionKeyFadeOut = 'FadeOutTime';
      const ExpressionKeyParameters = 'Parameters';
      const ExpressionKeyId = 'Id';
      const ExpressionKeyValue = 'Value';
      const ExpressionKeyBlend = 'Blend';
      const BlendValueAdd = 'Add';
      const BlendValueMultiply = 'Multiply';
      const BlendValueOverwrite = 'Overwrite';
      const DefaultFadeTime = 1.0;
      class CubismExpressionMotion extends ACubismMotion$2 {
          constructor() {
              super();
              this._parameters = new csmVector$5();
          }
          static create(buffer, size) {
              const expression = new CubismExpressionMotion();
              const json = CubismJson$1.create(buffer, size);
              const root = json.getRoot();
              expression.setFadeInTime(root.getValueByString(ExpressionKeyFadeIn).toFloat(DefaultFadeTime));
              expression.setFadeOutTime(root.getValueByString(ExpressionKeyFadeOut).toFloat(DefaultFadeTime));
              const parameterCount = root
                  .getValueByString(ExpressionKeyParameters)
                  .getSize();
              expression._parameters.prepareCapacity(parameterCount);
              for (let i = 0; i < parameterCount; ++i) {
                  const param = root
                      .getValueByString(ExpressionKeyParameters)
                      .getValueByIndex(i);
                  const parameterId = CubismFramework$2.getIdManager().getId(param.getValueByString(ExpressionKeyId).getRawString());
                  const value = param
                      .getValueByString(ExpressionKeyValue)
                      .toFloat();
                  let blendType;
                  if (param.getValueByString(ExpressionKeyBlend).isNull() ||
                      param.getValueByString(ExpressionKeyBlend).getString() ==
                          BlendValueAdd) {
                      blendType = ExpressionBlendType.ExpressionBlendType_Add;
                  }
                  else if (param.getValueByString(ExpressionKeyBlend).getString() ==
                      BlendValueMultiply) {
                      blendType = ExpressionBlendType.ExpressionBlendType_Multiply;
                  }
                  else if (param.getValueByString(ExpressionKeyBlend).getString() ==
                      BlendValueOverwrite) {
                      blendType = ExpressionBlendType.ExpressionBlendType_Overwrite;
                  }
                  else {
                      blendType = ExpressionBlendType.ExpressionBlendType_Add;
                  }
                  const item = new ExpressionParameter();
                  item.parameterId = parameterId;
                  item.blendType = blendType;
                  item.value = value;
                  expression._parameters.pushBack(item);
              }
              CubismJson$1.delete(json);
              return expression;
          }
          doUpdateParameters(model, userTimeSeconds, weight, motionQueueEntry) {
              for (let i = 0; i < this._parameters.getSize(); ++i) {
                  const parameter = this._parameters.at(i);
                  switch (parameter.blendType) {
                      case ExpressionBlendType.ExpressionBlendType_Add: {
                          model.addParameterValueById(parameter.parameterId, parameter.value, weight);
                          break;
                      }
                      case ExpressionBlendType.ExpressionBlendType_Multiply: {
                          model.multiplyParameterValueById(parameter.parameterId, parameter.value, weight);
                          break;
                      }
                      case ExpressionBlendType.ExpressionBlendType_Overwrite: {
                          model.setParameterValueById(parameter.parameterId, parameter.value, weight);
                          break;
                      }
                  }
              }
          }
      }
      Live2DCubismFramework.CubismExpressionMotion = CubismExpressionMotion;
      let ExpressionBlendType;
      (function (ExpressionBlendType) {
          ExpressionBlendType[ExpressionBlendType["ExpressionBlendType_Add"] = 0] = "ExpressionBlendType_Add";
          ExpressionBlendType[ExpressionBlendType["ExpressionBlendType_Multiply"] = 1] = "ExpressionBlendType_Multiply";
          ExpressionBlendType[ExpressionBlendType["ExpressionBlendType_Overwrite"] = 2] = "ExpressionBlendType_Overwrite";
      })(ExpressionBlendType = Live2DCubismFramework.ExpressionBlendType || (Live2DCubismFramework.ExpressionBlendType = {}));
      class ExpressionParameter {
      }
      Live2DCubismFramework.ExpressionParameter = ExpressionParameter;
  })(Live2DCubismFramework$k || (Live2DCubismFramework$k = {}));

  var Live2DCubismFramework$l;
  (function (Live2DCubismFramework) {
      class ICubismModelSetting {
      }
      Live2DCubismFramework.ICubismModelSetting = ICubismModelSetting;
  })(Live2DCubismFramework$l || (Live2DCubismFramework$l = {}));

  var csmVector$6 = Live2DCubismFramework$3.csmVector;
  var CubismFramework$3 = Live2DCubismFramework$9.CubismFramework;
  var CubismJson$2 = Live2DCubismFramework$4.CubismJson;
  var ICubismModelSetting = Live2DCubismFramework$l.ICubismModelSetting;
  var Live2DCubismFramework$m;
  (function (Live2DCubismFramework) {
      const FileReferences = 'FileReferences';
      const Groups = 'Groups';
      const Layout = 'Layout';
      const HitAreas = 'HitAreas';
      const Moc = 'Moc';
      const Textures = 'Textures';
      const Physics = 'Physics';
      const Pose = 'Pose';
      const Expressions = 'Expressions';
      const Motions = 'Motions';
      const UserData = 'UserData';
      const Name = 'Name';
      const FilePath = 'File';
      const Id = 'Id';
      const Ids = 'Ids';
      const SoundPath = 'Sound';
      const FadeInTime = 'FadeInTime';
      const FadeOutTime = 'FadeOutTime';
      const LipSync = 'LipSync';
      const EyeBlink = 'EyeBlink';
      let FrequestNode;
      (function (FrequestNode) {
          FrequestNode[FrequestNode["FrequestNode_Groups"] = 0] = "FrequestNode_Groups";
          FrequestNode[FrequestNode["FrequestNode_Moc"] = 1] = "FrequestNode_Moc";
          FrequestNode[FrequestNode["FrequestNode_Motions"] = 2] = "FrequestNode_Motions";
          FrequestNode[FrequestNode["FrequestNode_Expressions"] = 3] = "FrequestNode_Expressions";
          FrequestNode[FrequestNode["FrequestNode_Textures"] = 4] = "FrequestNode_Textures";
          FrequestNode[FrequestNode["FrequestNode_Physics"] = 5] = "FrequestNode_Physics";
          FrequestNode[FrequestNode["FrequestNode_Pose"] = 6] = "FrequestNode_Pose";
          FrequestNode[FrequestNode["FrequestNode_HitAreas"] = 7] = "FrequestNode_HitAreas";
      })(FrequestNode || (FrequestNode = {}));
      class CubismModelSettingJson extends ICubismModelSetting {
          constructor(buffer, size) {
              super();
              this._json = CubismJson$2.create(buffer, size);
              if (this._json) {
                  this._jsonValue = new csmVector$6();
                  this._jsonValue.pushBack(this._json.getRoot().getValueByString(Groups));
                  this._jsonValue.pushBack(this._json
                      .getRoot()
                      .getValueByString(FileReferences)
                      .getValueByString(Moc));
                  this._jsonValue.pushBack(this._json
                      .getRoot()
                      .getValueByString(FileReferences)
                      .getValueByString(Motions));
                  this._jsonValue.pushBack(this._json
                      .getRoot()
                      .getValueByString(FileReferences)
                      .getValueByString(Expressions));
                  this._jsonValue.pushBack(this._json
                      .getRoot()
                      .getValueByString(FileReferences)
                      .getValueByString(Textures));
                  this._jsonValue.pushBack(this._json
                      .getRoot()
                      .getValueByString(FileReferences)
                      .getValueByString(Physics));
                  this._jsonValue.pushBack(this._json
                      .getRoot()
                      .getValueByString(FileReferences)
                      .getValueByString(Pose));
                  this._jsonValue.pushBack(this._json.getRoot().getValueByString(HitAreas));
              }
          }
          release() {
              CubismJson$2.delete(this._json);
              this._jsonValue = null;
          }
          GetJson() {
              return this._json;
          }
          getModelFileName() {
              if (!this.isExistModelFile()) {
                  return '';
              }
              return this._jsonValue.at(FrequestNode.FrequestNode_Moc).getRawString();
          }
          getTextureCount() {
              if (!this.isExistTextureFiles()) {
                  return 0;
              }
              return this._jsonValue.at(FrequestNode.FrequestNode_Textures).getSize();
          }
          getTextureDirectory() {
              return this._jsonValue
                  .at(FrequestNode.FrequestNode_Textures)
                  .getRawString();
          }
          getTextureFileName(index) {
              return this._jsonValue
                  .at(FrequestNode.FrequestNode_Textures)
                  .getValueByIndex(index)
                  .getRawString();
          }
          getHitAreasCount() {
              if (!this.isExistHitAreas()) {
                  return 0;
              }
              return this._jsonValue.at(FrequestNode.FrequestNode_HitAreas).getSize();
          }
          getHitAreaId(index) {
              return CubismFramework$3.getIdManager().getId(this._jsonValue
                  .at(FrequestNode.FrequestNode_HitAreas)
                  .getValueByIndex(index)
                  .getValueByString(Id)
                  .getRawString());
          }
          getHitAreaName(index) {
              return this._jsonValue
                  .at(FrequestNode.FrequestNode_HitAreas)
                  .getValueByIndex(index)
                  .getValueByString(Name)
                  .getRawString();
          }
          getPhysicsFileName() {
              if (!this.isExistPhysicsFile()) {
                  return '';
              }
              return this._jsonValue
                  .at(FrequestNode.FrequestNode_Physics)
                  .getRawString();
          }
          getPoseFileName() {
              if (!this.isExistPoseFile()) {
                  return '';
              }
              return this._jsonValue.at(FrequestNode.FrequestNode_Pose).getRawString();
          }
          getExpressionCount() {
              if (!this.isExistExpressionFile()) {
                  return 0;
              }
              return this._jsonValue
                  .at(FrequestNode.FrequestNode_Expressions)
                  .getSize();
          }
          getExpressionName(index) {
              return this._jsonValue
                  .at(FrequestNode.FrequestNode_Expressions)
                  .getValueByIndex(index)
                  .getValueByString(Name)
                  .getRawString();
          }
          getExpressionFileName(index) {
              return this._jsonValue
                  .at(FrequestNode.FrequestNode_Expressions)
                  .getValueByIndex(index)
                  .getValueByString(FilePath)
                  .getRawString();
          }
          getMotionGroupCount() {
              if (!this.isExistMotionGroups()) {
                  return 0;
              }
              return this._jsonValue
                  .at(FrequestNode.FrequestNode_Motions)
                  .getKeys()
                  .getSize();
          }
          getMotionGroupName(index) {
              if (!this.isExistMotionGroups()) {
                  return null;
              }
              return this._jsonValue
                  .at(FrequestNode.FrequestNode_Motions)
                  .getKeys()
                  .at(index);
          }
          getMotionCount(groupName) {
              if (!this.isExistMotionGroupName(groupName)) {
                  return 0;
              }
              return this._jsonValue
                  .at(FrequestNode.FrequestNode_Motions)
                  .getValueByString(groupName)
                  .getSize();
          }
          getMotionFileName(groupName, index) {
              if (!this.isExistMotionGroupName(groupName)) {
                  return '';
              }
              return this._jsonValue
                  .at(FrequestNode.FrequestNode_Motions)
                  .getValueByString(groupName)
                  .getValueByIndex(index)
                  .getValueByString(FilePath)
                  .getRawString();
          }
          getMotionSoundFileName(groupName, index) {
              if (!this.isExistMotionSoundFile(groupName, index)) {
                  return '';
              }
              return this._jsonValue
                  .at(FrequestNode.FrequestNode_Motions)
                  .getValueByString(groupName)
                  .getValueByIndex(index)
                  .getValueByString(SoundPath)
                  .getRawString();
          }
          getMotionFadeInTimeValue(groupName, index) {
              if (!this.isExistMotionFadeIn(groupName, index)) {
                  return -1.0;
              }
              return this._jsonValue
                  .at(FrequestNode.FrequestNode_Motions)
                  .getValueByString(groupName)
                  .getValueByIndex(index)
                  .getValueByString(FadeInTime)
                  .toFloat();
          }
          getMotionFadeOutTimeValue(groupName, index) {
              if (!this.isExistMotionFadeOut(groupName, index)) {
                  return -1.0;
              }
              return this._jsonValue
                  .at(FrequestNode.FrequestNode_Motions)
                  .getValueByString(groupName)
                  .getValueByIndex(index)
                  .getValueByString(FadeOutTime)
                  .toFloat();
          }
          getUserDataFile() {
              if (!this.isExistUserDataFile()) {
                  return '';
              }
              return this._json
                  .getRoot()
                  .getValueByString(FileReferences)
                  .getValueByString(UserData)
                  .getRawString();
          }
          getLayoutMap(outLayoutMap) {
              const map = this._json
                  .getRoot()
                  .getValueByString(Layout)
                  .getMap();
              if (map == null) {
                  return false;
              }
              let ret = false;
              for (const ite = map.begin(); ite.notEqual(map.end()); ite.preIncrement()) {
                  outLayoutMap.setValue(ite.ptr().first, ite.ptr().second.toFloat());
                  ret = true;
              }
              return ret;
          }
          getEyeBlinkParameterCount() {
              if (!this.isExistEyeBlinkParameters()) {
                  return 0;
              }
              let num = 0;
              for (let i = 0; i < this._jsonValue.at(FrequestNode.FrequestNode_Groups).getSize(); i++) {
                  const refI = this._jsonValue
                      .at(FrequestNode.FrequestNode_Groups)
                      .getValueByIndex(i);
                  if (refI.isNull() || refI.isError()) {
                      continue;
                  }
                  if (refI.getValueByString(Name).getRawString() == EyeBlink) {
                      num = refI
                          .getValueByString(Ids)
                          .getVector()
                          .getSize();
                      break;
                  }
              }
              return num;
          }
          getEyeBlinkParameterId(index) {
              if (!this.isExistEyeBlinkParameters()) {
                  return null;
              }
              for (let i = 0; i < this._jsonValue.at(FrequestNode.FrequestNode_Groups).getSize(); i++) {
                  const refI = this._jsonValue
                      .at(FrequestNode.FrequestNode_Groups)
                      .getValueByIndex(i);
                  if (refI.isNull() || refI.isError()) {
                      continue;
                  }
                  if (refI.getValueByString(Name).getRawString() == EyeBlink) {
                      return CubismFramework$3.getIdManager().getId(refI
                          .getValueByString(Ids)
                          .getValueByIndex(index)
                          .getRawString());
                  }
              }
              return null;
          }
          getLipSyncParameterCount() {
              if (!this.isExistLipSyncParameters()) {
                  return 0;
              }
              let num = 0;
              for (let i = 0; i < this._jsonValue.at(FrequestNode.FrequestNode_Groups).getSize(); i++) {
                  const refI = this._jsonValue
                      .at(FrequestNode.FrequestNode_Groups)
                      .getValueByIndex(i);
                  if (refI.isNull() || refI.isError()) {
                      continue;
                  }
                  if (refI.getValueByString(Name).getRawString() == LipSync) {
                      num = refI
                          .getValueByString(Ids)
                          .getVector()
                          .getSize();
                      break;
                  }
              }
              return num;
          }
          getLipSyncParameterId(index) {
              if (!this.isExistLipSyncParameters()) {
                  return null;
              }
              for (let i = 0; i < this._jsonValue.at(FrequestNode.FrequestNode_Groups).getSize(); i++) {
                  const refI = this._jsonValue
                      .at(FrequestNode.FrequestNode_Groups)
                      .getValueByIndex(i);
                  if (refI.isNull() || refI.isError()) {
                      continue;
                  }
                  if (refI.getValueByString(Name).getRawString() == LipSync) {
                      return CubismFramework$3.getIdManager().getId(refI
                          .getValueByString(Ids)
                          .getValueByIndex(index)
                          .getRawString());
                  }
              }
              return null;
          }
          isExistModelFile() {
              const node = this._jsonValue.at(FrequestNode.FrequestNode_Moc);
              return !node.isNull() && !node.isError();
          }
          isExistTextureFiles() {
              const node = this._jsonValue.at(FrequestNode.FrequestNode_Textures);
              return !node.isNull() && !node.isError();
          }
          isExistHitAreas() {
              const node = this._jsonValue.at(FrequestNode.FrequestNode_HitAreas);
              return !node.isNull() && !node.isError();
          }
          isExistPhysicsFile() {
              const node = this._jsonValue.at(FrequestNode.FrequestNode_Physics);
              return !node.isNull() && !node.isError();
          }
          isExistPoseFile() {
              const node = this._jsonValue.at(FrequestNode.FrequestNode_Pose);
              return !node.isNull() && !node.isError();
          }
          isExistExpressionFile() {
              const node = this._jsonValue.at(FrequestNode.FrequestNode_Expressions);
              return !node.isNull() && !node.isError();
          }
          isExistMotionGroups() {
              const node = this._jsonValue.at(FrequestNode.FrequestNode_Motions);
              return !node.isNull() && !node.isError();
          }
          isExistMotionGroupName(groupName) {
              const node = this._jsonValue
                  .at(FrequestNode.FrequestNode_Motions)
                  .getValueByString(groupName);
              return !node.isNull() && !node.isError();
          }
          isExistMotionSoundFile(groupName, index) {
              const node = this._jsonValue
                  .at(FrequestNode.FrequestNode_Motions)
                  .getValueByString(groupName)
                  .getValueByIndex(index)
                  .getValueByString(SoundPath);
              return !node.isNull() && !node.isError();
          }
          isExistMotionFadeIn(groupName, index) {
              const node = this._jsonValue
                  .at(FrequestNode.FrequestNode_Motions)
                  .getValueByString(groupName)
                  .getValueByIndex(index)
                  .getValueByString(FadeInTime);
              return !node.isNull() && !node.isError();
          }
          isExistMotionFadeOut(groupName, index) {
              const node = this._jsonValue
                  .at(FrequestNode.FrequestNode_Motions)
                  .getValueByString(groupName)
                  .getValueByIndex(index)
                  .getValueByString(FadeOutTime);
              return !node.isNull() && !node.isError();
          }
          isExistUserDataFile() {
              const node = this._json
                  .getRoot()
                  .getValueByString(FileReferences)
                  .getValueByString(UserData);
              return !node.isNull() && !node.isError();
          }
          isExistEyeBlinkParameters() {
              if (this._jsonValue.at(FrequestNode.FrequestNode_Groups).isNull() ||
                  this._jsonValue.at(FrequestNode.FrequestNode_Groups).isError()) {
                  return false;
              }
              for (let i = 0; i < this._jsonValue.at(FrequestNode.FrequestNode_Groups).getSize(); ++i) {
                  if (this._jsonValue
                      .at(FrequestNode.FrequestNode_Groups)
                      .getValueByIndex(i)
                      .getValueByString(Name)
                      .getRawString() == EyeBlink) {
                      return true;
                  }
              }
              return false;
          }
          isExistLipSyncParameters() {
              if (this._jsonValue.at(FrequestNode.FrequestNode_Groups).isNull() ||
                  this._jsonValue.at(FrequestNode.FrequestNode_Groups).isError()) {
                  return false;
              }
              for (let i = 0; i < this._jsonValue.at(FrequestNode.FrequestNode_Groups).getSize(); ++i) {
                  if (this._jsonValue
                      .at(FrequestNode.FrequestNode_Groups)
                      .getValueByIndex(i)
                      .getValueByString(Name)
                      .getRawString() == LipSync) {
                      return true;
                  }
              }
              return false;
          }
      }
      Live2DCubismFramework.CubismModelSettingJson = CubismModelSettingJson;
  })(Live2DCubismFramework$m || (Live2DCubismFramework$m = {}));

  var CubismFramework$4 = Live2DCubismFramework$9.CubismFramework;
  var CubismBlendMode = Live2DCubismFramework$8.CubismBlendMode;
  var csmVector$7 = Live2DCubismFramework$3.csmVector;
  var csmMap$1 = Live2DCubismFramework$2.csmMap;
  var Live2DCubismFramework$n;
  (function (Live2DCubismFramework) {
      class CubismModel {
          constructor(model) {
              this._model = model;
              this._parameterValues = null;
              this._parameterMaximumValues = null;
              this._parameterMinimumValues = null;
              this._partOpacities = null;
              this._savedParameters = new csmVector$7();
              this._parameterIds = new csmVector$7();
              this._drawableIds = new csmVector$7();
              this._partIds = new csmVector$7();
              this._notExistPartId = new csmMap$1();
              this._notExistParameterId = new csmMap$1();
              this._notExistParameterValues = new csmMap$1();
              this._notExistPartOpacities = new csmMap$1();
          }
          update() {
              this._model.update();
              this._model.drawables.resetDynamicFlags();
          }
          getCanvasWidth() {
              if (this._model == null) {
                  return 0.0;
              }
              return (this._model.canvasinfo.CanvasWidth /
                  this._model.canvasinfo.PixelsPerUnit);
          }
          getCanvasHeight() {
              if (this._model == null) {
                  return 0.0;
              }
              return (this._model.canvasinfo.CanvasHeight /
                  this._model.canvasinfo.PixelsPerUnit);
          }
          saveParameters() {
              const parameterCount = this._model.parameters.count;
              const savedParameterCount = this._savedParameters.getSize();
              for (let i = 0; i < parameterCount; ++i) {
                  if (i < savedParameterCount) {
                      this._savedParameters.set(i, this._parameterValues[i]);
                  }
                  else {
                      this._savedParameters.pushBack(this._parameterValues[i]);
                  }
              }
          }
          getModel() {
              return this._model;
          }
          getPartIndex(partId) {
              let partIndex;
              const partCount = this._model.parts.count;
              for (partIndex = 0; partIndex < partCount; ++partIndex) {
                  if (partId == this._partIds.at(partIndex)) {
                      return partIndex;
                  }
              }
              if (this._notExistPartId.isExist(partId)) {
                  return this._notExistPartId.getValue(partId);
              }
              partIndex = partCount + this._notExistPartId.getSize();
              this._notExistPartId.setValue(partId, partIndex);
              this._notExistPartOpacities.appendKey(partIndex);
              return partIndex;
          }
          getPartCount() {
              const partCount = this._model.parts.count;
              return partCount;
          }
          setPartOpacityByIndex(partIndex, opacity) {
              if (this._notExistPartOpacities.isExist(partIndex)) {
                  this._notExistPartOpacities.setValue(partIndex, opacity);
                  return;
              }
              CSM_ASSERT(0 <= partIndex && partIndex < this.getPartCount());
              this._partOpacities[partIndex] = opacity;
          }
          setPartOpacityById(partId, opacity) {
              const index = this.getPartIndex(partId);
              if (index < 0) {
                  return;
              }
              this.setPartOpacityByIndex(index, opacity);
          }
          getPartOpacityByIndex(partIndex) {
              if (this._notExistPartOpacities.isExist(partIndex)) {
                  return this._notExistPartOpacities.getValue(partIndex);
              }
              CSM_ASSERT(0 <= partIndex && partIndex < this.getPartCount());
              return this._partOpacities[partIndex];
          }
          getPartOpacityById(partId) {
              const index = this.getPartIndex(partId);
              if (index < 0) {
                  return 0;
              }
              return this.getPartOpacityByIndex(index);
          }
          getParameterIndex(parameterId) {
              let parameterIndex;
              const idCount = this._model.parameters.count;
              for (parameterIndex = 0; parameterIndex < idCount; ++parameterIndex) {
                  if (parameterId != this._parameterIds.at(parameterIndex)) {
                      continue;
                  }
                  return parameterIndex;
              }
              if (this._notExistParameterId.isExist(parameterId)) {
                  return this._notExistParameterId.getValue(parameterId);
              }
              parameterIndex =
                  this._model.parameters.count + this._notExistParameterId.getSize();
              this._notExistParameterId.setValue(parameterId, parameterIndex);
              this._notExistParameterValues.appendKey(parameterIndex);
              return parameterIndex;
          }
          getParameterCount() {
              return this._model.parameters.count;
          }
          getParameterMaximumValue(parameterIndex) {
              return this._model.parameters.maximumValues[parameterIndex];
          }
          getParameterMinimumValue(parameterIndex) {
              return this._model.parameters.minimumValues[parameterIndex];
          }
          getParameterDefaultValue(parameterIndex) {
              return this._model.parameters.defaultValues[parameterIndex];
          }
          getParameterValueByIndex(parameterIndex) {
              if (this._notExistParameterValues.isExist(parameterIndex)) {
                  return this._notExistParameterValues.getValue(parameterIndex);
              }
              CSM_ASSERT(0 <= parameterIndex && parameterIndex < this.getParameterCount());
              return this._parameterValues[parameterIndex];
          }
          getParameterValueById(parameterId) {
              const parameterIndex = this.getParameterIndex(parameterId);
              return this.getParameterValueByIndex(parameterIndex);
          }
          setParameterValueByIndex(parameterIndex, value, weight = 1.0) {
              if (this._notExistParameterValues.isExist(parameterIndex)) {
                  this._notExistParameterValues.setValue(parameterIndex, weight == 1
                      ? value
                      : this._notExistParameterValues.getValue(parameterIndex) *
                          (1 - weight) +
                          value * weight);
                  return;
              }
              CSM_ASSERT(0 <= parameterIndex && parameterIndex < this.getParameterCount());
              if (this._model.parameters.maximumValues[parameterIndex] < value) {
                  value = this._model.parameters.maximumValues[parameterIndex];
              }
              if (this._model.parameters.minimumValues[parameterIndex] > value) {
                  value = this._model.parameters.minimumValues[parameterIndex];
              }
              this._parameterValues[parameterIndex] =
                  weight == 1
                      ? value
                      : (this._parameterValues[parameterIndex] =
                          this._parameterValues[parameterIndex] * (1 - weight) +
                              value * weight);
          }
          setParameterValueById(parameterId, value, weight = 1.0) {
              const index = this.getParameterIndex(parameterId);
              this.setParameterValueByIndex(index, value, weight);
          }
          addParameterValueByIndex(parameterIndex, value, weight = 1.0) {
              this.setParameterValueByIndex(parameterIndex, this.getParameterValueByIndex(parameterIndex) + value * weight);
          }
          addParameterValueById(parameterId, value, weight = 1.0) {
              const index = this.getParameterIndex(parameterId);
              this.addParameterValueByIndex(index, value, weight);
          }
          multiplyParameterValueById(parameterId, value, weight = 1.0) {
              const index = this.getParameterIndex(parameterId);
              this.multiplyParameterValueByIndex(index, value, weight);
          }
          multiplyParameterValueByIndex(parameterIndex, value, weight = 1.0) {
              this.setParameterValueByIndex(parameterIndex, this.getParameterValueByIndex(parameterIndex) *
                  (1.0 + (value - 1.0) * weight));
          }
          getDrawableIndex(drawableId) {
              const drawableCount = this._model.drawables.count;
              for (let drawableIndex = 0; drawableIndex < drawableCount; ++drawableIndex) {
                  if (this._drawableIds.at(drawableIndex) == drawableId) {
                      return drawableIndex;
                  }
              }
              return -1;
          }
          getDrawableCount() {
              const drawableCount = this._model.drawables.count;
              return drawableCount;
          }
          getDrawableId(drawableIndex) {
              const parameterIds = this._model.drawables.ids;
              return CubismFramework$4.getIdManager().getId(parameterIds[drawableIndex]);
          }
          getDrawableRenderOrders() {
              const renderOrders = this._model.drawables.renderOrders;
              return renderOrders;
          }
          getDrawableTextureIndices(drawableIndex) {
              const textureIndices = this._model.drawables.textureIndices;
              return textureIndices[drawableIndex];
          }
          getDrawableDynamicFlagVertexPositionsDidChange(drawableIndex) {
              const dynamicFlags = this._model.drawables.dynamicFlags;
              return Live2DCubismCore.Utils.hasVertexPositionsDidChangeBit(dynamicFlags[drawableIndex]);
          }
          getDrawableVertexIndexCount(drawableIndex) {
              const indexCounts = this._model.drawables.indexCounts;
              return indexCounts[drawableIndex];
          }
          getDrawableVertexCount(drawableIndex) {
              const vertexCounts = this._model.drawables.vertexCounts;
              return vertexCounts[drawableIndex];
          }
          getDrawableVertices(drawableIndex) {
              return this.getDrawableVertexPositions(drawableIndex);
          }
          getDrawableVertexIndices(drawableIndex) {
              const indicesArray = this._model.drawables.indices;
              return indicesArray[drawableIndex];
          }
          getDrawableVertexPositions(drawableIndex) {
              const verticesArray = this._model.drawables
                  .vertexPositions;
              return verticesArray[drawableIndex];
          }
          getDrawableVertexUvs(drawableIndex) {
              const uvsArray = this._model.drawables.vertexUvs;
              return uvsArray[drawableIndex];
          }
          getDrawableOpacity(drawableIndex) {
              const opacities = this._model.drawables.opacities;
              return opacities[drawableIndex];
          }
          getDrawableCulling(drawableIndex) {
              const constantFlags = this._model.drawables.constantFlags;
              return !Live2DCubismCore.Utils.hasIsDoubleSidedBit(constantFlags[drawableIndex]);
          }
          getDrawableBlendMode(drawableIndex) {
              const constantFlags = this._model.drawables.constantFlags;
              return Live2DCubismCore.Utils.hasBlendAdditiveBit(constantFlags[drawableIndex])
                  ? CubismBlendMode.CubismBlendMode_Additive
                  : Live2DCubismCore.Utils.hasBlendMultiplicativeBit(constantFlags[drawableIndex])
                      ? CubismBlendMode.CubismBlendMode_Multiplicative
                      : CubismBlendMode.CubismBlendMode_Normal;
          }
          getDrawableInvertedMaskBit(drawableIndex) {
              const constantFlags = this._model.drawables.constantFlags;
              return Live2DCubismCore.Utils.hasIsInvertedMaskBit(constantFlags[drawableIndex]);
          }
          getDrawableMasks() {
              const masks = this._model.drawables.masks;
              return masks;
          }
          getDrawableMaskCounts() {
              const maskCounts = this._model.drawables.maskCounts;
              return maskCounts;
          }
          isUsingMasking() {
              for (let d = 0; d < this._model.drawables.count; ++d) {
                  if (this._model.drawables.maskCounts[d] <= 0) {
                      continue;
                  }
                  return true;
              }
              return false;
          }
          getDrawableDynamicFlagIsVisible(drawableIndex) {
              const dynamicFlags = this._model.drawables.dynamicFlags;
              return Live2DCubismCore.Utils.hasIsVisibleBit(dynamicFlags[drawableIndex]);
          }
          getDrawableDynamicFlagVisibilityDidChange(drawableIndex) {
              const dynamicFlags = this._model.drawables.dynamicFlags;
              return Live2DCubismCore.Utils.hasVisibilityDidChangeBit(dynamicFlags[drawableIndex]);
          }
          getDrawableDynamicFlagOpacityDidChange(drawableIndex) {
              const dynamicFlags = this._model.drawables.dynamicFlags;
              return Live2DCubismCore.Utils.hasOpacityDidChangeBit(dynamicFlags[drawableIndex]);
          }
          getDrawableDynamicFlagRenderOrderDidChange(drawableIndex) {
              const dynamicFlags = this._model.drawables.dynamicFlags;
              return Live2DCubismCore.Utils.hasRenderOrderDidChangeBit(dynamicFlags[drawableIndex]);
          }
          loadParameters() {
              let parameterCount = this._model.parameters.count;
              const savedParameterCount = this._savedParameters.getSize();
              if (parameterCount > savedParameterCount) {
                  parameterCount = savedParameterCount;
              }
              for (let i = 0; i < parameterCount; ++i) {
                  this._parameterValues[i] = this._savedParameters.at(i);
              }
          }
          initialize() {
              CSM_ASSERT(this._model);
              this._parameterValues = this._model.parameters.values;
              this._partOpacities = this._model.parts.opacities;
              this._parameterMaximumValues = this._model.parameters.maximumValues;
              this._parameterMinimumValues = this._model.parameters.minimumValues;
              {
                  const parameterIds = this._model.parameters.ids;
                  const parameterCount = this._model.parameters.count;
                  this._parameterIds.prepareCapacity(parameterCount);
                  for (let i = 0; i < parameterCount; ++i) {
                      this._parameterIds.pushBack(CubismFramework$4.getIdManager().getId(parameterIds[i]));
                  }
              }
              {
                  const partIds = this._model.parts.ids;
                  const partCount = this._model.parts.count;
                  this._partIds.prepareCapacity(partCount);
                  for (let i = 0; i < partCount; ++i) {
                      this._partIds.pushBack(CubismFramework$4.getIdManager().getId(partIds[i]));
                  }
              }
              {
                  const drawableIds = this._model.drawables.ids;
                  const drawableCount = this._model.drawables.count;
                  this._drawableIds.prepareCapacity(drawableCount);
                  for (let i = 0; i < drawableCount; ++i) {
                      this._drawableIds.pushBack(CubismFramework$4.getIdManager().getId(drawableIds[i]));
                  }
              }
          }
          release() {
              this._model.release();
              this._model = null;
          }
      }
      Live2DCubismFramework.CubismModel = CubismModel;
  })(Live2DCubismFramework$n || (Live2DCubismFramework$n = {}));

  var CubismModel = Live2DCubismFramework$n.CubismModel;
  var Live2DCubismFramework$o;
  (function (Live2DCubismFramework) {
      class CubismMoc {
          constructor(moc) {
              this._moc = moc;
              this._modelCount = 0;
          }
          static create(mocBytes) {
              let cubismMoc = null;
              const moc = Live2DCubismCore.Moc.fromArrayBuffer(mocBytes);
              if (moc) {
                  cubismMoc = new CubismMoc(moc);
              }
              return cubismMoc;
          }
          static delete(moc) {
              moc._moc._release();
              moc._moc = null;
              moc = null;
          }
          createModel() {
              let cubismModel = null;
              const model = Live2DCubismCore.Model.fromMoc(this._moc);
              if (model) {
                  cubismModel = new CubismModel(model);
                  cubismModel.initialize();
                  ++this._modelCount;
              }
              return cubismModel;
          }
          deleteModel(model) {
              if (model != null) {
                  model.release();
                  model = null;
                  --this._modelCount;
              }
          }
          release() {
              CSM_ASSERT(this._modelCount == 0);
              this._moc._release();
              this._moc = null;
          }
      }
      Live2DCubismFramework.CubismMoc = CubismMoc;
  })(Live2DCubismFramework$o || (Live2DCubismFramework$o = {}));

  var csmVector$8 = Live2DCubismFramework$3.csmVector;
  var CubismVector2$1 = Live2DCubismFramework$a.CubismVector2;
  var Live2DCubismFramework$p;
  (function (Live2DCubismFramework) {
      let CubismPhysicsTargetType;
      (function (CubismPhysicsTargetType) {
          CubismPhysicsTargetType[CubismPhysicsTargetType["CubismPhysicsTargetType_Parameter"] = 0] = "CubismPhysicsTargetType_Parameter";
      })(CubismPhysicsTargetType = Live2DCubismFramework.CubismPhysicsTargetType || (Live2DCubismFramework.CubismPhysicsTargetType = {}));
      let CubismPhysicsSource;
      (function (CubismPhysicsSource) {
          CubismPhysicsSource[CubismPhysicsSource["CubismPhysicsSource_X"] = 0] = "CubismPhysicsSource_X";
          CubismPhysicsSource[CubismPhysicsSource["CubismPhysicsSource_Y"] = 1] = "CubismPhysicsSource_Y";
          CubismPhysicsSource[CubismPhysicsSource["CubismPhysicsSource_Angle"] = 2] = "CubismPhysicsSource_Angle";
      })(CubismPhysicsSource = Live2DCubismFramework.CubismPhysicsSource || (Live2DCubismFramework.CubismPhysicsSource = {}));
      class PhysicsJsonEffectiveForces {
          constructor() {
              this.gravity = new CubismVector2$1(0, 0);
              this.wind = new CubismVector2$1(0, 0);
          }
      }
      Live2DCubismFramework.PhysicsJsonEffectiveForces = PhysicsJsonEffectiveForces;
      class CubismPhysicsParameter {
      }
      Live2DCubismFramework.CubismPhysicsParameter = CubismPhysicsParameter;
      class CubismPhysicsNormalization {
      }
      Live2DCubismFramework.CubismPhysicsNormalization = CubismPhysicsNormalization;
      class CubismPhysicsParticle {
          constructor() {
              this.initialPosition = new CubismVector2$1(0, 0);
              this.position = new CubismVector2$1(0, 0);
              this.lastPosition = new CubismVector2$1(0, 0);
              this.lastGravity = new CubismVector2$1(0, 0);
              this.force = new CubismVector2$1(0, 0);
              this.velocity = new CubismVector2$1(0, 0);
          }
      }
      Live2DCubismFramework.CubismPhysicsParticle = CubismPhysicsParticle;
      class CubismPhysicsSubRig {
          constructor() {
              this.normalizationPosition = new CubismPhysicsNormalization();
              this.normalizationAngle = new CubismPhysicsNormalization();
          }
      }
      Live2DCubismFramework.CubismPhysicsSubRig = CubismPhysicsSubRig;
      class CubismPhysicsInput {
          constructor() {
              this.source = new CubismPhysicsParameter();
          }
      }
      Live2DCubismFramework.CubismPhysicsInput = CubismPhysicsInput;
      class CubismPhysicsOutput {
          constructor() {
              this.destination = new CubismPhysicsParameter();
              this.translationScale = new CubismVector2$1(0, 0);
          }
      }
      Live2DCubismFramework.CubismPhysicsOutput = CubismPhysicsOutput;
      class CubismPhysicsRig {
          constructor() {
              this.settings = new csmVector$8();
              this.inputs = new csmVector$8();
              this.outputs = new csmVector$8();
              this.particles = new csmVector$8();
              this.gravity = new CubismVector2$1(0, 0);
              this.wind = new CubismVector2$1(0, 0);
          }
      }
      Live2DCubismFramework.CubismPhysicsRig = CubismPhysicsRig;
  })(Live2DCubismFramework$p || (Live2DCubismFramework$p = {}));

  var CubismFramework$5 = Live2DCubismFramework$9.CubismFramework;
  var CubismVector2$2 = Live2DCubismFramework$a.CubismVector2;
  var CubismJson$3 = Live2DCubismFramework$4.CubismJson;
  var Live2DCubismFramework$q;
  (function (Live2DCubismFramework) {
      const Position = 'Position';
      const X = 'X';
      const Y = 'Y';
      const Angle = 'Angle';
      const Type = 'Type';
      const Id = 'Id';
      const Meta = 'Meta';
      const EffectiveForces = 'EffectiveForces';
      const TotalInputCount = 'TotalInputCount';
      const TotalOutputCount = 'TotalOutputCount';
      const PhysicsSettingCount = 'PhysicsSettingCount';
      const Gravity = 'Gravity';
      const Wind = 'Wind';
      const VertexCount = 'VertexCount';
      const PhysicsSettings = 'PhysicsSettings';
      const Normalization = 'Normalization';
      const Minimum = 'Minimum';
      const Maximum = 'Maximum';
      const Default = 'Default';
      const Reflect = 'Reflect';
      const Weight = 'Weight';
      const Input = 'Input';
      const Source = 'Source';
      const Output = 'Output';
      const Scale = 'Scale';
      const VertexIndex = 'VertexIndex';
      const Destination = 'Destination';
      const Vertices = 'Vertices';
      const Mobility = 'Mobility';
      const Delay = 'Delay';
      const Radius = 'Radius';
      const Acceleration = 'Acceleration';
      class CubismPhysicsJson {
          constructor(buffer, size) {
              this._json = CubismJson$3.create(buffer, size);
          }
          release() {
              CubismJson$3.delete(this._json);
          }
          getGravity() {
              const ret = new CubismVector2$2(0, 0);
              ret.x = this._json
                  .getRoot()
                  .getValueByString(Meta)
                  .getValueByString(EffectiveForces)
                  .getValueByString(Gravity)
                  .getValueByString(X)
                  .toFloat();
              ret.y = this._json
                  .getRoot()
                  .getValueByString(Meta)
                  .getValueByString(EffectiveForces)
                  .getValueByString(Gravity)
                  .getValueByString(Y)
                  .toFloat();
              return ret;
          }
          getWind() {
              const ret = new CubismVector2$2(0, 0);
              ret.x = this._json
                  .getRoot()
                  .getValueByString(Meta)
                  .getValueByString(EffectiveForces)
                  .getValueByString(Wind)
                  .getValueByString(X)
                  .toFloat();
              ret.y = this._json
                  .getRoot()
                  .getValueByString(Meta)
                  .getValueByString(EffectiveForces)
                  .getValueByString(Wind)
                  .getValueByString(Y)
                  .toFloat();
              return ret;
          }
          getSubRigCount() {
              return this._json
                  .getRoot()
                  .getValueByString(Meta)
                  .getValueByString(PhysicsSettingCount)
                  .toInt();
          }
          getTotalInputCount() {
              return this._json
                  .getRoot()
                  .getValueByString(Meta)
                  .getValueByString(TotalInputCount)
                  .toInt();
          }
          getTotalOutputCount() {
              return this._json
                  .getRoot()
                  .getValueByString(Meta)
                  .getValueByString(TotalOutputCount)
                  .toInt();
          }
          getVertexCount() {
              return this._json
                  .getRoot()
                  .getValueByString(Meta)
                  .getValueByString(VertexCount)
                  .toInt();
          }
          getNormalizationPositionMinimumValue(physicsSettingIndex) {
              return this._json
                  .getRoot()
                  .getValueByString(PhysicsSettings)
                  .getValueByIndex(physicsSettingIndex)
                  .getValueByString(Normalization)
                  .getValueByString(Position)
                  .getValueByString(Minimum)
                  .toFloat();
          }
          getNormalizationPositionMaximumValue(physicsSettingIndex) {
              return this._json
                  .getRoot()
                  .getValueByString(PhysicsSettings)
                  .getValueByIndex(physicsSettingIndex)
                  .getValueByString(Normalization)
                  .getValueByString(Position)
                  .getValueByString(Maximum)
                  .toFloat();
          }
          getNormalizationPositionDefaultValue(physicsSettingIndex) {
              return this._json
                  .getRoot()
                  .getValueByString(PhysicsSettings)
                  .getValueByIndex(physicsSettingIndex)
                  .getValueByString(Normalization)
                  .getValueByString(Position)
                  .getValueByString(Default)
                  .toFloat();
          }
          getNormalizationAngleMinimumValue(physicsSettingIndex) {
              return this._json
                  .getRoot()
                  .getValueByString(PhysicsSettings)
                  .getValueByIndex(physicsSettingIndex)
                  .getValueByString(Normalization)
                  .getValueByString(Angle)
                  .getValueByString(Minimum)
                  .toFloat();
          }
          getNormalizationAngleMaximumValue(physicsSettingIndex) {
              return this._json
                  .getRoot()
                  .getValueByString(PhysicsSettings)
                  .getValueByIndex(physicsSettingIndex)
                  .getValueByString(Normalization)
                  .getValueByString(Angle)
                  .getValueByString(Maximum)
                  .toFloat();
          }
          getNormalizationAngleDefaultValue(physicsSettingIndex) {
              return this._json
                  .getRoot()
                  .getValueByString(PhysicsSettings)
                  .getValueByIndex(physicsSettingIndex)
                  .getValueByString(Normalization)
                  .getValueByString(Angle)
                  .getValueByString(Default)
                  .toFloat();
          }
          getInputCount(physicsSettingIndex) {
              return this._json
                  .getRoot()
                  .getValueByString(PhysicsSettings)
                  .getValueByIndex(physicsSettingIndex)
                  .getValueByString(Input)
                  .getVector()
                  .getSize();
          }
          getInputWeight(physicsSettingIndex, inputIndex) {
              return this._json
                  .getRoot()
                  .getValueByString(PhysicsSettings)
                  .getValueByIndex(physicsSettingIndex)
                  .getValueByString(Input)
                  .getValueByIndex(inputIndex)
                  .getValueByString(Weight)
                  .toFloat();
          }
          getInputReflect(physicsSettingIndex, inputIndex) {
              return this._json
                  .getRoot()
                  .getValueByString(PhysicsSettings)
                  .getValueByIndex(physicsSettingIndex)
                  .getValueByString(Input)
                  .getValueByIndex(inputIndex)
                  .getValueByString(Reflect)
                  .toBoolean();
          }
          getInputType(physicsSettingIndex, inputIndex) {
              return this._json
                  .getRoot()
                  .getValueByString(PhysicsSettings)
                  .getValueByIndex(physicsSettingIndex)
                  .getValueByString(Input)
                  .getValueByIndex(inputIndex)
                  .getValueByString(Type)
                  .getRawString();
          }
          getInputSourceId(physicsSettingIndex, inputIndex) {
              return CubismFramework$5.getIdManager().getId(this._json
                  .getRoot()
                  .getValueByString(PhysicsSettings)
                  .getValueByIndex(physicsSettingIndex)
                  .getValueByString(Input)
                  .getValueByIndex(inputIndex)
                  .getValueByString(Source)
                  .getValueByString(Id)
                  .getRawString());
          }
          getOutputCount(physicsSettingIndex) {
              return this._json
                  .getRoot()
                  .getValueByString(PhysicsSettings)
                  .getValueByIndex(physicsSettingIndex)
                  .getValueByString(Output)
                  .getVector()
                  .getSize();
          }
          getOutputVertexIndex(physicsSettingIndex, outputIndex) {
              return this._json
                  .getRoot()
                  .getValueByString(PhysicsSettings)
                  .getValueByIndex(physicsSettingIndex)
                  .getValueByString(Output)
                  .getValueByIndex(outputIndex)
                  .getValueByString(VertexIndex)
                  .toInt();
          }
          getOutputAngleScale(physicsSettingIndex, outputIndex) {
              return this._json
                  .getRoot()
                  .getValueByString(PhysicsSettings)
                  .getValueByIndex(physicsSettingIndex)
                  .getValueByString(Output)
                  .getValueByIndex(outputIndex)
                  .getValueByString(Scale)
                  .toFloat();
          }
          getOutputWeight(physicsSettingIndex, outputIndex) {
              return this._json
                  .getRoot()
                  .getValueByString(PhysicsSettings)
                  .getValueByIndex(physicsSettingIndex)
                  .getValueByString(Output)
                  .getValueByIndex(outputIndex)
                  .getValueByString(Weight)
                  .toFloat();
          }
          getOutputDestinationId(physicsSettingIndex, outputIndex) {
              return CubismFramework$5.getIdManager().getId(this._json
                  .getRoot()
                  .getValueByString(PhysicsSettings)
                  .getValueByIndex(physicsSettingIndex)
                  .getValueByString(Output)
                  .getValueByIndex(outputIndex)
                  .getValueByString(Destination)
                  .getValueByString(Id)
                  .getRawString());
          }
          getOutputType(physicsSettingIndex, outputIndex) {
              return this._json
                  .getRoot()
                  .getValueByString(PhysicsSettings)
                  .getValueByIndex(physicsSettingIndex)
                  .getValueByString(Output)
                  .getValueByIndex(outputIndex)
                  .getValueByString(Type)
                  .getRawString();
          }
          getOutputReflect(physicsSettingIndex, outputIndex) {
              return this._json
                  .getRoot()
                  .getValueByString(PhysicsSettings)
                  .getValueByIndex(physicsSettingIndex)
                  .getValueByString(Output)
                  .getValueByIndex(outputIndex)
                  .getValueByString(Reflect)
                  .toBoolean();
          }
          getParticleCount(physicsSettingIndex) {
              return this._json
                  .getRoot()
                  .getValueByString(PhysicsSettings)
                  .getValueByIndex(physicsSettingIndex)
                  .getValueByString(Vertices)
                  .getVector()
                  .getSize();
          }
          getParticleMobility(physicsSettingIndex, vertexIndex) {
              return this._json
                  .getRoot()
                  .getValueByString(PhysicsSettings)
                  .getValueByIndex(physicsSettingIndex)
                  .getValueByString(Vertices)
                  .getValueByIndex(vertexIndex)
                  .getValueByString(Mobility)
                  .toFloat();
          }
          getParticleDelay(physicsSettingIndex, vertexIndex) {
              return this._json
                  .getRoot()
                  .getValueByString(PhysicsSettings)
                  .getValueByIndex(physicsSettingIndex)
                  .getValueByString(Vertices)
                  .getValueByIndex(vertexIndex)
                  .getValueByString(Delay)
                  .toFloat();
          }
          getParticleAcceleration(physicsSettingIndex, vertexIndex) {
              return this._json
                  .getRoot()
                  .getValueByString(PhysicsSettings)
                  .getValueByIndex(physicsSettingIndex)
                  .getValueByString(Vertices)
                  .getValueByIndex(vertexIndex)
                  .getValueByString(Acceleration)
                  .toFloat();
          }
          getParticleRadius(physicsSettingIndex, vertexIndex) {
              return this._json
                  .getRoot()
                  .getValueByString(PhysicsSettings)
                  .getValueByIndex(physicsSettingIndex)
                  .getValueByString(Vertices)
                  .getValueByIndex(vertexIndex)
                  .getValueByString(Radius)
                  .toInt();
          }
          getParticlePosition(physicsSettingIndex, vertexIndex) {
              const ret = new CubismVector2$2(0, 0);
              ret.x = this._json
                  .getRoot()
                  .getValueByString(PhysicsSettings)
                  .getValueByIndex(physicsSettingIndex)
                  .getValueByString(Vertices)
                  .getValueByIndex(vertexIndex)
                  .getValueByString(Position)
                  .getValueByString(X)
                  .toFloat();
              ret.y = this._json
                  .getRoot()
                  .getValueByString(PhysicsSettings)
                  .getValueByIndex(physicsSettingIndex)
                  .getValueByString(Vertices)
                  .getValueByIndex(vertexIndex)
                  .getValueByString(Position)
                  .getValueByString(Y)
                  .toFloat();
              return ret;
          }
      }
      Live2DCubismFramework.CubismPhysicsJson = CubismPhysicsJson;
  })(Live2DCubismFramework$q || (Live2DCubismFramework$q = {}));

  var CubismPhysicsJson = Live2DCubismFramework$q.CubismPhysicsJson;
  var CubismMath$2 = Live2DCubismFramework$b.CubismMath;
  var CubismPhysicsRig = Live2DCubismFramework$p.CubismPhysicsRig;
  var CubismPhysicsSubRig = Live2DCubismFramework$p.CubismPhysicsSubRig;
  var CubismPhysicsInput = Live2DCubismFramework$p.CubismPhysicsInput;
  var CubismPhysicsOutput = Live2DCubismFramework$p.CubismPhysicsOutput;
  var CubismPhysicsParticle = Live2DCubismFramework$p.CubismPhysicsParticle;
  var CubismPhysicsSource = Live2DCubismFramework$p.CubismPhysicsSource;
  var CubismPhysicsTargetType = Live2DCubismFramework$p.CubismPhysicsTargetType;
  var CubismVector2$3 = Live2DCubismFramework$a.CubismVector2;
  var Live2DCubismFramework$r;
  (function (Live2DCubismFramework) {
      const PhysicsTypeTagX = 'X';
      const PhysicsTypeTagY = 'Y';
      const PhysicsTypeTagAngle = 'Angle';
      const AirResistance = 5.0;
      const MaximumWeight = 100.0;
      const MovementThreshold = 0.001;
      class CubismPhysics {
          constructor() {
              this._physicsRig = null;
              this._options = new Options();
              this._options.gravity.y = -1.0;
              this._options.gravity.x = 0;
              this._options.wind.x = 0;
              this._options.wind.y = 0;
          }
          static create(buffer, size) {
              const ret = new CubismPhysics();
              ret.parse(buffer, size);
              ret._physicsRig.gravity.y = 0;
              return ret;
          }
          static delete(physics) {
              if (physics != null) {
                  physics.release();
                  physics = null;
              }
          }
          evaluate(model, deltaTimeSeconds) {
              let totalAngle;
              let weight;
              let radAngle;
              let outputValue;
              const totalTranslation = new CubismVector2$3();
              let currentSetting;
              let currentInput;
              let currentOutput;
              let currentParticles;
              let parameterValue;
              let parameterMaximumValue;
              let parameterMinimumValue;
              let parameterDefaultValue;
              parameterValue = model.getModel().parameters.values;
              parameterMaximumValue = model.getModel().parameters.maximumValues;
              parameterMinimumValue = model.getModel().parameters.minimumValues;
              parameterDefaultValue = model.getModel().parameters.defaultValues;
              for (let settingIndex = 0; settingIndex < this._physicsRig.subRigCount; ++settingIndex) {
                  totalAngle = { angle: 0.0 };
                  totalTranslation.x = 0.0;
                  totalTranslation.y = 0.0;
                  currentSetting = this._physicsRig.settings.at(settingIndex);
                  currentInput = this._physicsRig.inputs.get(currentSetting.baseInputIndex);
                  currentOutput = this._physicsRig.outputs.get(currentSetting.baseOutputIndex);
                  currentParticles = this._physicsRig.particles.get(currentSetting.baseParticleIndex);
                  for (let i = 0; i < currentSetting.inputCount; ++i) {
                      weight = currentInput[i].weight / MaximumWeight;
                      if (currentInput[i].sourceParameterIndex == -1) {
                          currentInput[i].sourceParameterIndex = model.getParameterIndex(currentInput[i].source.id);
                      }
                      currentInput[i].getNormalizedParameterValue(totalTranslation, totalAngle, parameterValue[currentInput[i].sourceParameterIndex], parameterMinimumValue[currentInput[i].sourceParameterIndex], parameterMaximumValue[currentInput[i].sourceParameterIndex], parameterDefaultValue[currentInput[i].sourceParameterIndex], currentSetting.normalizationPosition, currentSetting.normalizationAngle, currentInput[0].reflect, weight);
                  }
                  radAngle = CubismMath$2.degreesToRadian(-totalAngle.angle);
                  totalTranslation.x =
                      totalTranslation.x * CubismMath$2.cos(radAngle) -
                          totalTranslation.y * CubismMath$2.sin(radAngle);
                  totalTranslation.y =
                      totalTranslation.x * CubismMath$2.sin(radAngle) +
                          totalTranslation.y * CubismMath$2.cos(radAngle);
                  updateParticles(currentParticles, currentSetting.particleCount, totalTranslation, totalAngle.angle, this._options.wind, MovementThreshold * currentSetting.normalizationPosition.maximum, deltaTimeSeconds, AirResistance);
                  for (let i = 0; i < currentSetting.outputCount; ++i) {
                      const particleIndex = currentOutput[i].vertexIndex;
                      if (particleIndex < 1 ||
                          particleIndex >= currentSetting.particleCount) {
                          break;
                      }
                      if (currentOutput[i].destinationParameterIndex == -1) {
                          currentOutput[i].destinationParameterIndex = model.getParameterIndex(currentOutput[i].destination.id);
                      }
                      const translation = new CubismVector2$3();
                      translation.x =
                          currentParticles[particleIndex].position.x -
                              currentParticles[particleIndex - 1].position.x;
                      translation.y =
                          currentParticles[particleIndex].position.y -
                              currentParticles[particleIndex - 1].position.y;
                      outputValue = currentOutput[i].getValue(translation, currentParticles, particleIndex, currentOutput[i].reflect, this._options.gravity);
                      const destinationParameterIndex = currentOutput[i].destinationParameterIndex;
                      const outParameterValue = !Float32Array.prototype.slice &&
                          'subarray' in Float32Array.prototype
                          ? JSON.parse(JSON.stringify(parameterValue.subarray(destinationParameterIndex)))
                          : parameterValue.slice(destinationParameterIndex);
                      updateOutputParameterValue(outParameterValue, parameterMinimumValue[destinationParameterIndex], parameterMaximumValue[destinationParameterIndex], outputValue, currentOutput[i]);
                      for (let offset = destinationParameterIndex, outParamIndex = 0; offset < parameterValue.length; offset++, outParamIndex++) {
                          parameterValue[offset] = outParameterValue[outParamIndex];
                      }
                  }
              }
          }
          setOptions(options) {
              this._options = options;
          }
          getOption() {
              return this._options;
          }
          release() {
              this._physicsRig = void 0;
              this._physicsRig = null;
          }
          parse(physicsJson, size) {
              this._physicsRig = new CubismPhysicsRig();
              let json = new CubismPhysicsJson(physicsJson, size);
              this._physicsRig.gravity = json.getGravity();
              this._physicsRig.wind = json.getWind();
              this._physicsRig.subRigCount = json.getSubRigCount();
              this._physicsRig.settings.updateSize(this._physicsRig.subRigCount, CubismPhysicsSubRig, true);
              this._physicsRig.inputs.updateSize(json.getTotalInputCount(), CubismPhysicsInput, true);
              this._physicsRig.outputs.updateSize(json.getTotalOutputCount(), CubismPhysicsOutput, true);
              this._physicsRig.particles.updateSize(json.getVertexCount(), CubismPhysicsParticle, true);
              let inputIndex = 0, outputIndex = 0, particleIndex = 0;
              for (let i = 0; i < this._physicsRig.settings.getSize(); ++i) {
                  this._physicsRig.settings.at(i).normalizationPosition.minimum = json.getNormalizationPositionMinimumValue(i);
                  this._physicsRig.settings.at(i).normalizationPosition.maximum = json.getNormalizationPositionMaximumValue(i);
                  this._physicsRig.settings.at(i).normalizationPosition.defalut = json.getNormalizationPositionDefaultValue(i);
                  this._physicsRig.settings.at(i).normalizationAngle.minimum = json.getNormalizationAngleMinimumValue(i);
                  this._physicsRig.settings.at(i).normalizationAngle.maximum = json.getNormalizationAngleMaximumValue(i);
                  this._physicsRig.settings.at(i).normalizationAngle.defalut = json.getNormalizationAngleDefaultValue(i);
                  this._physicsRig.settings.at(i).inputCount = json.getInputCount(i);
                  this._physicsRig.settings.at(i).baseInputIndex = inputIndex;
                  for (let j = 0; j < this._physicsRig.settings.at(i).inputCount; ++j) {
                      this._physicsRig.inputs.at(inputIndex + j).sourceParameterIndex = -1;
                      this._physicsRig.inputs.at(inputIndex + j).weight = json.getInputWeight(i, j);
                      this._physicsRig.inputs.at(inputIndex + j).reflect = json.getInputReflect(i, j);
                      if (json.getInputType(i, j) == PhysicsTypeTagX) {
                          this._physicsRig.inputs.at(inputIndex + j).type =
                              CubismPhysicsSource.CubismPhysicsSource_X;
                          this._physicsRig.inputs.at(inputIndex + j).getNormalizedParameterValue = getInputTranslationXFromNormalizedParameterValue;
                      }
                      else if (json.getInputType(i, j) == PhysicsTypeTagY) {
                          this._physicsRig.inputs.at(inputIndex + j).type =
                              CubismPhysicsSource.CubismPhysicsSource_Y;
                          this._physicsRig.inputs.at(inputIndex + j).getNormalizedParameterValue = getInputTranslationYFromNormalizedParamterValue;
                      }
                      else if (json.getInputType(i, j) == PhysicsTypeTagAngle) {
                          this._physicsRig.inputs.at(inputIndex + j).type =
                              CubismPhysicsSource.CubismPhysicsSource_Angle;
                          this._physicsRig.inputs.at(inputIndex + j).getNormalizedParameterValue = getInputAngleFromNormalizedParameterValue;
                      }
                      this._physicsRig.inputs.at(inputIndex + j).source.targetType =
                          CubismPhysicsTargetType.CubismPhysicsTargetType_Parameter;
                      this._physicsRig.inputs.at(inputIndex + j).source.id = json.getInputSourceId(i, j);
                  }
                  inputIndex += this._physicsRig.settings.at(i).inputCount;
                  this._physicsRig.settings.at(i).outputCount = json.getOutputCount(i);
                  this._physicsRig.settings.at(i).baseOutputIndex = outputIndex;
                  for (let j = 0; j < this._physicsRig.settings.at(i).outputCount; ++j) {
                      this._physicsRig.outputs.at(outputIndex + j).destinationParameterIndex = -1;
                      this._physicsRig.outputs.at(outputIndex + j).vertexIndex = json.getOutputVertexIndex(i, j);
                      this._physicsRig.outputs.at(outputIndex + j).angleScale = json.getOutputAngleScale(i, j);
                      this._physicsRig.outputs.at(outputIndex + j).weight = json.getOutputWeight(i, j);
                      this._physicsRig.outputs.at(outputIndex + j).destination.targetType =
                          CubismPhysicsTargetType.CubismPhysicsTargetType_Parameter;
                      this._physicsRig.outputs.at(outputIndex + j).destination.id = json.getOutputDestinationId(i, j);
                      if (json.getOutputType(i, j) == PhysicsTypeTagX) {
                          this._physicsRig.outputs.at(outputIndex + j).type =
                              CubismPhysicsSource.CubismPhysicsSource_X;
                          this._physicsRig.outputs.at(outputIndex + j).getValue = getOutputTranslationX;
                          this._physicsRig.outputs.at(outputIndex + j).getScale = getOutputScaleTranslationX;
                      }
                      else if (json.getOutputType(i, j) == PhysicsTypeTagY) {
                          this._physicsRig.outputs.at(outputIndex + j).type =
                              CubismPhysicsSource.CubismPhysicsSource_Y;
                          this._physicsRig.outputs.at(outputIndex + j).getValue = getOutputTranslationY;
                          this._physicsRig.outputs.at(outputIndex + j).getScale = getOutputScaleTranslationY;
                      }
                      else if (json.getOutputType(i, j) == PhysicsTypeTagAngle) {
                          this._physicsRig.outputs.at(outputIndex + j).type =
                              CubismPhysicsSource.CubismPhysicsSource_Angle;
                          this._physicsRig.outputs.at(outputIndex + j).getValue = getOutputAngle;
                          this._physicsRig.outputs.at(outputIndex + j).getScale = getOutputScaleAngle;
                      }
                      this._physicsRig.outputs.at(outputIndex + j).reflect = json.getOutputReflect(i, j);
                  }
                  outputIndex += this._physicsRig.settings.at(i).outputCount;
                  this._physicsRig.settings.at(i).particleCount = json.getParticleCount(i);
                  this._physicsRig.settings.at(i).baseParticleIndex = particleIndex;
                  for (let j = 0; j < this._physicsRig.settings.at(i).particleCount; ++j) {
                      this._physicsRig.particles.at(particleIndex + j).mobility = json.getParticleMobility(i, j);
                      this._physicsRig.particles.at(particleIndex + j).delay = json.getParticleDelay(i, j);
                      this._physicsRig.particles.at(particleIndex + j).acceleration = json.getParticleAcceleration(i, j);
                      this._physicsRig.particles.at(particleIndex + j).radius = json.getParticleRadius(i, j);
                      this._physicsRig.particles.at(particleIndex + j).position = json.getParticlePosition(i, j);
                  }
                  particleIndex += this._physicsRig.settings.at(i).particleCount;
              }
              this.initialize();
              json.release();
              json = void 0;
              json = null;
          }
          initialize() {
              let strand;
              let currentSetting;
              let radius;
              for (let settingIndex = 0; settingIndex < this._physicsRig.subRigCount; ++settingIndex) {
                  currentSetting = this._physicsRig.settings.at(settingIndex);
                  strand = this._physicsRig.particles.get(currentSetting.baseParticleIndex);
                  strand[0].initialPosition = new CubismVector2$3(0.0, 0.0);
                  strand[0].lastPosition = new CubismVector2$3(strand[0].initialPosition.x, strand[0].initialPosition.y);
                  strand[0].lastGravity = new CubismVector2$3(0.0, -1.0);
                  strand[0].lastGravity.y *= -1.0;
                  strand[0].velocity = new CubismVector2$3(0.0, 0.0);
                  strand[0].force = new CubismVector2$3(0.0, 0.0);
                  for (let i = 1; i < currentSetting.particleCount; ++i) {
                      radius = new CubismVector2$3(0.0, 0.0);
                      radius.y = strand[i].radius;
                      strand[i].initialPosition = new CubismVector2$3(strand[i - 1].initialPosition.x + radius.x, strand[i - 1].initialPosition.y + radius.y);
                      strand[i].position = new CubismVector2$3(strand[i].initialPosition.x, strand[i].initialPosition.y);
                      strand[i].lastPosition = new CubismVector2$3(strand[i].initialPosition.x, strand[i].initialPosition.y);
                      strand[i].lastGravity = new CubismVector2$3(0.0, -1.0);
                      strand[i].lastGravity.y *= -1.0;
                      strand[i].velocity = new CubismVector2$3(0.0, 0.0);
                      strand[i].force = new CubismVector2$3(0.0, 0.0);
                  }
              }
          }
      }
      Live2DCubismFramework.CubismPhysics = CubismPhysics;
      class Options {
          constructor() {
              this.gravity = new CubismVector2$3(0, 0);
              this.wind = new CubismVector2$3(0, 0);
          }
      }
      Live2DCubismFramework.Options = Options;
      function sign(value) {
          let ret = 0;
          if (value > 0.0) {
              ret = 1;
          }
          else if (value < 0.0) {
              ret = -1;
          }
          return ret;
      }
      function getInputTranslationXFromNormalizedParameterValue(targetTranslation, targetAngle, value, parameterMinimumValue, parameterMaximumValue, parameterDefaultValue, normalizationPosition, normalizationAngle, isInverted, weight) {
          targetTranslation.x +=
              normalizeParameterValue(value, parameterMinimumValue, parameterMaximumValue, parameterDefaultValue, normalizationPosition.minimum, normalizationPosition.maximum, normalizationPosition.defalut, isInverted) * weight;
      }
      function getInputTranslationYFromNormalizedParamterValue(targetTranslation, targetAngle, value, parameterMinimumValue, parameterMaximumValue, parameterDefaultValue, normalizationPosition, normalizationAngle, isInverted, weight) {
          targetTranslation.y +=
              normalizeParameterValue(value, parameterMinimumValue, parameterMaximumValue, parameterDefaultValue, normalizationPosition.minimum, normalizationPosition.maximum, normalizationPosition.defalut, isInverted) * weight;
      }
      function getInputAngleFromNormalizedParameterValue(targetTranslation, targetAngle, value, parameterMinimumValue, parameterMaximumValue, parameterDefaultValue, normalizaitionPosition, normalizationAngle, isInverted, weight) {
          targetAngle.angle +=
              normalizeParameterValue(value, parameterMinimumValue, parameterMaximumValue, parameterDefaultValue, normalizationAngle.minimum, normalizationAngle.maximum, normalizationAngle.defalut, isInverted) * weight;
      }
      function getOutputTranslationX(translation, particles, particleIndex, isInverted, parentGravity) {
          let outputValue = translation.x;
          if (isInverted) {
              outputValue *= -1.0;
          }
          return outputValue;
      }
      function getOutputTranslationY(translation, particles, particleIndex, isInverted, parentGravity) {
          let outputValue = translation.y;
          if (isInverted) {
              outputValue *= -1.0;
          }
          return outputValue;
      }
      function getOutputAngle(translation, particles, particleIndex, isInverted, parentGravity) {
          let outputValue;
          if (particleIndex >= 2) {
              parentGravity = particles[particleIndex - 1].position.substract(particles[particleIndex - 2].position);
          }
          else {
              parentGravity = parentGravity.multiplyByScaler(-1.0);
          }
          outputValue = CubismMath$2.directionToRadian(parentGravity, translation);
          if (isInverted) {
              outputValue *= -1.0;
          }
          return outputValue;
      }
      function getRangeValue(min, max) {
          const maxValue = CubismMath$2.max(min, max);
          const minValue = CubismMath$2.min(min, max);
          return CubismMath$2.abs(maxValue - minValue);
      }
      function getDefaultValue(min, max) {
          const minValue = CubismMath$2.min(min, max);
          return minValue + getRangeValue(min, max) / 2.0;
      }
      function getOutputScaleTranslationX(translationScale, angleScale) {
          return JSON.parse(JSON.stringify(translationScale.x));
      }
      function getOutputScaleTranslationY(translationScale, angleScale) {
          return JSON.parse(JSON.stringify(translationScale.y));
      }
      function getOutputScaleAngle(translationScale, angleScale) {
          return JSON.parse(JSON.stringify(angleScale));
      }
      function updateParticles(strand, strandCount, totalTranslation, totalAngle, windDirection, thresholdValue, deltaTimeSeconds, airResistance) {
          let totalRadian;
          let delay;
          let radian;
          let currentGravity;
          let direction = new CubismVector2$3(0.0, 0.0);
          let velocity = new CubismVector2$3(0.0, 0.0);
          let force = new CubismVector2$3(0.0, 0.0);
          let newDirection = new CubismVector2$3(0.0, 0.0);
          strand[0].position = new CubismVector2$3(totalTranslation.x, totalTranslation.y);
          totalRadian = CubismMath$2.degreesToRadian(totalAngle);
          currentGravity = CubismMath$2.radianToDirection(totalRadian);
          currentGravity.normalize();
          for (let i = 1; i < strandCount; ++i) {
              strand[i].force = currentGravity
                  .multiplyByScaler(strand[i].acceleration)
                  .add(windDirection);
              strand[i].lastPosition = new CubismVector2$3(strand[i].position.x, strand[i].position.y);
              delay = strand[i].delay * deltaTimeSeconds * 30.0;
              direction = strand[i].position.substract(strand[i - 1].position);
              radian =
                  CubismMath$2.directionToRadian(strand[i].lastGravity, currentGravity) /
                      airResistance;
              direction.x =
                  CubismMath$2.cos(radian) * direction.x -
                      direction.y * CubismMath$2.sin(radian);
              direction.y =
                  CubismMath$2.sin(radian) * direction.x +
                      direction.y * CubismMath$2.cos(radian);
              strand[i].position = strand[i - 1].position.add(direction);
              velocity = strand[i].velocity.multiplyByScaler(delay);
              force = strand[i].force.multiplyByScaler(delay).multiplyByScaler(delay);
              strand[i].position = strand[i].position.add(velocity).add(force);
              newDirection = strand[i].position.substract(strand[i - 1].position);
              newDirection.normalize();
              strand[i].position = strand[i - 1].position.add(newDirection.multiplyByScaler(strand[i].radius));
              if (CubismMath$2.abs(strand[i].position.x) < thresholdValue) {
                  strand[i].position.x = 0.0;
              }
              if (delay != 0.0) {
                  strand[i].velocity = strand[i].position.substract(strand[i].lastPosition);
                  strand[i].velocity = strand[i].velocity.divisionByScalar(delay);
                  strand[i].velocity = strand[i].velocity.multiplyByScaler(strand[i].mobility);
              }
              strand[i].force = new CubismVector2$3(0.0, 0.0);
              strand[i].lastGravity = new CubismVector2$3(currentGravity.x, currentGravity.y);
          }
      }
      function updateOutputParameterValue(parameterValue, parameterValueMinimum, parameterValueMaximum, translation, output) {
          let outputScale;
          let value;
          let weight;
          outputScale = output.getScale(output.translationScale, output.angleScale);
          value = translation * outputScale;
          if (value < parameterValueMinimum) {
              if (value < output.valueBelowMinimum) {
                  output.valueBelowMinimum = value;
              }
              value = parameterValueMinimum;
          }
          else if (value > parameterValueMaximum) {
              if (value > output.valueExceededMaximum) {
                  output.valueExceededMaximum = value;
              }
              value = parameterValueMaximum;
          }
          weight = output.weight / MaximumWeight;
          if (weight >= 1.0) {
              parameterValue[0] = value;
          }
          else {
              value = parameterValue[0] * (1.0 - weight) + value * weight;
              parameterValue[0] = value;
          }
      }
      function normalizeParameterValue(value, parameterMinimum, parameterMaximum, parameterDefault, normalizedMinimum, normalizedMaximum, normalizedDefault, isInverted) {
          let result = 0.0;
          const maxValue = CubismMath$2.max(parameterMaximum, parameterMinimum);
          if (maxValue < value) {
              value = maxValue;
          }
          const minValue = CubismMath$2.min(parameterMaximum, parameterMinimum);
          if (minValue > value) {
              value = minValue;
          }
          const minNormValue = CubismMath$2.min(normalizedMinimum, normalizedMaximum);
          const maxNormValue = CubismMath$2.max(normalizedMinimum, normalizedMaximum);
          const middleNormValue = normalizedDefault;
          const middleValue = getDefaultValue(minValue, maxValue);
          const paramValue = value - middleValue;
          switch (sign(paramValue)) {
              case 1: {
                  const nLength = maxNormValue - middleNormValue;
                  const pLength = maxValue - middleValue;
                  if (pLength != 0.0) {
                      result = paramValue * (nLength / pLength);
                      result += middleNormValue;
                  }
                  break;
              }
              case -1: {
                  const nLength = minNormValue - middleNormValue;
                  const pLength = minValue - middleValue;
                  if (pLength != 0.0) {
                      result = paramValue * (nLength / pLength);
                      result += middleNormValue;
                  }
                  break;
              }
              case 0: {
                  result = middleNormValue;
                  break;
              }
          }
          return isInverted ? result : result * -1.0;
      }
  })(Live2DCubismFramework$r || (Live2DCubismFramework$r = {}));

  var csmVector$9 = Live2DCubismFramework$3.csmVector;
  var CubismFramework$6 = Live2DCubismFramework$9.CubismFramework;
  var CubismJson$4 = Live2DCubismFramework$4.CubismJson;
  var Live2DCubismFramework$s;
  (function (Live2DCubismFramework) {
      const Epsilon = 0.001;
      const DefaultFadeInSeconds = 0.5;
      const FadeIn = 'FadeInTime';
      const Link = 'Link';
      const Groups = 'Groups';
      const Id = 'Id';
      class CubismPose {
          constructor() {
              this._fadeTimeSeconds = DefaultFadeInSeconds;
              this._lastModel = null;
              this._partGroups = new csmVector$9();
              this._partGroupCounts = new csmVector$9();
          }
          static create(pose3json, size) {
              const ret = new CubismPose();
              const json = CubismJson$4.create(pose3json, size);
              const root = json.getRoot();
              if (!root.getValueByString(FadeIn).isNull()) {
                  ret._fadeTimeSeconds = root
                      .getValueByString(FadeIn)
                      .toFloat(DefaultFadeInSeconds);
                  if (ret._fadeTimeSeconds <= 0.0) {
                      ret._fadeTimeSeconds = DefaultFadeInSeconds;
                  }
              }
              const poseListInfo = root.getValueByString(Groups);
              const poseCount = poseListInfo.getSize();
              for (let poseIndex = 0; poseIndex < poseCount; ++poseIndex) {
                  const idListInfo = poseListInfo.getValueByIndex(poseIndex);
                  const idCount = idListInfo.getSize();
                  let groupCount = 0;
                  for (let groupIndex = 0; groupIndex < idCount; ++groupIndex) {
                      const partInfo = idListInfo.getValueByIndex(groupIndex);
                      const partData = new PartData();
                      const parameterId = CubismFramework$6.getIdManager().getId(partInfo.getValueByString(Id).getRawString());
                      partData.partId = parameterId;
                      if (!partInfo.getValueByString(Link).isNull()) {
                          const linkListInfo = partInfo.getValueByString(Link);
                          const linkCount = linkListInfo.getSize();
                          for (let linkIndex = 0; linkIndex < linkCount; ++linkIndex) {
                              const linkPart = new PartData();
                              const linkId = CubismFramework$6.getIdManager().getId(linkListInfo.getValueByIndex(linkIndex).getString());
                              linkPart.partId = linkId;
                              partData.link.pushBack(linkPart);
                          }
                      }
                      ret._partGroups.pushBack(partData.clone());
                      ++groupCount;
                  }
                  ret._partGroupCounts.pushBack(groupCount);
              }
              CubismJson$4.delete(json);
              return ret;
          }
          static delete(pose) {
          }
          updateParameters(model, deltaTimeSeconds) {
              if (model != this._lastModel) {
                  this.reset(model);
              }
              this._lastModel = model;
              if (deltaTimeSeconds < 0.0) {
                  deltaTimeSeconds = 0.0;
              }
              let beginIndex = 0;
              for (let i = 0; i < this._partGroupCounts.getSize(); i++) {
                  const partGroupCount = this._partGroupCounts.at(i);
                  this.doFade(model, deltaTimeSeconds, beginIndex, partGroupCount);
                  beginIndex += partGroupCount;
              }
              this.copyPartOpacities(model);
          }
          reset(model) {
              let beginIndex = 0;
              for (let i = 0; i < this._partGroupCounts.getSize(); ++i) {
                  const groupCount = this._partGroupCounts.at(i);
                  for (let j = beginIndex; j < beginIndex + groupCount; ++j) {
                      this._partGroups.at(j).initialize(model);
                      const partsIndex = this._partGroups.at(j).partIndex;
                      const paramIndex = this._partGroups.at(j).parameterIndex;
                      if (partsIndex < 0) {
                          continue;
                      }
                      model.setPartOpacityByIndex(partsIndex, j == beginIndex ? 1.0 : 0.0);
                      model.setParameterValueByIndex(paramIndex, j == beginIndex ? 1.0 : 0.0);
                      for (let k = 0; k < this._partGroups.at(j).link.getSize(); ++k) {
                          this._partGroups
                              .at(j)
                              .link.at(k)
                              .initialize(model);
                      }
                  }
                  beginIndex += groupCount;
              }
          }
          copyPartOpacities(model) {
              for (let groupIndex = 0; groupIndex < this._partGroups.getSize(); ++groupIndex) {
                  const partData = this._partGroups.at(groupIndex);
                  if (partData.link.getSize() == 0) {
                      continue;
                  }
                  const partIndex = this._partGroups.at(groupIndex).partIndex;
                  const opacity = model.getPartOpacityByIndex(partIndex);
                  for (let linkIndex = 0; linkIndex < partData.link.getSize(); ++linkIndex) {
                      const linkPart = partData.link.at(linkIndex);
                      const linkPartIndex = linkPart.partIndex;
                      if (linkPartIndex < 0) {
                          continue;
                      }
                      model.setPartOpacityByIndex(linkPartIndex, opacity);
                  }
              }
          }
          doFade(model, deltaTimeSeconds, beginIndex, partGroupCount) {
              let visiblePartIndex = -1;
              let newOpacity = 1.0;
              const phi = 0.5;
              const backOpacityThreshold = 0.15;
              for (let i = beginIndex; i < beginIndex + partGroupCount; ++i) {
                  const partIndex = this._partGroups.at(i).partIndex;
                  const paramIndex = this._partGroups.at(i).parameterIndex;
                  if (model.getParameterValueByIndex(paramIndex) > Epsilon) {
                      if (visiblePartIndex >= 0) {
                          break;
                      }
                      visiblePartIndex = i;
                      newOpacity = model.getPartOpacityByIndex(partIndex);
                      newOpacity += deltaTimeSeconds / this._fadeTimeSeconds;
                      if (newOpacity > 1.0) {
                          newOpacity = 1.0;
                      }
                  }
              }
              if (visiblePartIndex < 0) {
                  visiblePartIndex = 0;
                  newOpacity = 1.0;
              }
              for (let i = beginIndex; i < beginIndex + partGroupCount; ++i) {
                  const partsIndex = this._partGroups.at(i).partIndex;
                  if (visiblePartIndex == i) {
                      model.setPartOpacityByIndex(partsIndex, newOpacity);
                  }
                  else {
                      let opacity = model.getPartOpacityByIndex(partsIndex);
                      let a1;
                      if (newOpacity < phi) {
                          a1 = (newOpacity * (phi - 1)) / phi + 1.0;
                      }
                      else {
                          a1 = ((1 - newOpacity) * phi) / (1.0 - phi);
                      }
                      const backOpacity = (1.0 - a1) * (1.0 - newOpacity);
                      if (backOpacity > backOpacityThreshold) {
                          a1 = 1.0 - backOpacityThreshold / (1.0 - newOpacity);
                      }
                      if (opacity > a1) {
                          opacity = a1;
                      }
                      model.setPartOpacityByIndex(partsIndex, opacity);
                  }
              }
          }
      }
      Live2DCubismFramework.CubismPose = CubismPose;
      class PartData {
          constructor(v) {
              this.parameterIndex = 0;
              this.partIndex = 0;
              this.link = new csmVector$9();
              if (v != undefined) {
                  this.partId = v.partId;
                  for (const ite = v.link.begin(); ite.notEqual(v.link.end()); ite.preIncrement()) {
                      this.link.pushBack(ite.ptr().clone());
                  }
              }
          }
          assignment(v) {
              this.partId = v.partId;
              for (const ite = v.link.begin(); ite.notEqual(v.link.end()); ite.preIncrement()) {
                  this.link.pushBack(ite.ptr().clone());
              }
              return this;
          }
          initialize(model) {
              this.parameterIndex = model.getParameterIndex(this.partId);
              this.partIndex = model.getPartIndex(this.partId);
              model.setParameterValueByIndex(this.parameterIndex, 1);
          }
          clone() {
              const clonePartData = new PartData();
              clonePartData.partId = this.partId;
              clonePartData.parameterIndex = this.parameterIndex;
              clonePartData.partIndex = this.partIndex;
              clonePartData.link = new csmVector$9();
              for (let ite = this.link.begin(); ite.notEqual(this.link.end()); ite.increment()) {
                  clonePartData.link.pushBack(ite.ptr().clone());
              }
              return clonePartData;
          }
      }
      Live2DCubismFramework.PartData = PartData;
  })(Live2DCubismFramework$s || (Live2DCubismFramework$s = {}));

  var Live2DCubismFramework$t;
  (function (Live2DCubismFramework) {
      class CubismBreath {
          constructor() {
              this._currentTime = 0.0;
          }
          static create() {
              return new CubismBreath();
          }
          static delete(instance) {
          }
          setParameters(breathParameters) {
              this._breathParameters = breathParameters;
          }
          getParameters() {
              return this._breathParameters;
          }
          updateParameters(model, deltaTimeSeconds) {
              this._currentTime += deltaTimeSeconds;
              const t = this._currentTime * 2.0 * 3.14159;
              for (let i = 0; i < this._breathParameters.getSize(); ++i) {
                  const data = this._breathParameters.at(i);
                  model.addParameterValueById(data.parameterId, data.offset + data.peak * Math.sin(t / data.cycle), data.weight);
              }
          }
      }
      Live2DCubismFramework.CubismBreath = CubismBreath;
      class BreathParameterData {
          constructor(parameterId, offset, peak, cycle, weight) {
              this.parameterId = parameterId == undefined ? null : parameterId;
              this.offset = offset == undefined ? 0.0 : offset;
              this.peak = peak == undefined ? 0.0 : peak;
              this.cycle = cycle == undefined ? 0.0 : cycle;
              this.weight = weight == undefined ? 0.0 : weight;
          }
      }
      Live2DCubismFramework.BreathParameterData = BreathParameterData;
  })(Live2DCubismFramework$t || (Live2DCubismFramework$t = {}));

  var csmVector$a = Live2DCubismFramework$3.csmVector;
  var Live2DCubismFramework$u;
  (function (Live2DCubismFramework) {
      class CubismEyeBlink {
          constructor(modelSetting) {
              this._blinkingState = EyeState.EyeState_First;
              this._nextBlinkingTime = 0.0;
              this._stateStartTimeSeconds = 0.0;
              this._blinkingIntervalSeconds = 4.0;
              this._closingSeconds = 0.1;
              this._closedSeconds = 0.05;
              this._openingSeconds = 0.15;
              this._userTimeSeconds = 0.0;
              this._parameterIds = new csmVector$a();
              if (modelSetting == null) {
                  return;
              }
              for (let i = 0; i < modelSetting.getEyeBlinkParameterCount(); ++i) {
                  this._parameterIds.pushBack(modelSetting.getEyeBlinkParameterId(i));
              }
          }
          static create(modelSetting = null) {
              return new CubismEyeBlink(modelSetting);
          }
          static delete(eyeBlink) {
          }
          setBlinkingInterval(blinkingInterval) {
              this._blinkingIntervalSeconds = blinkingInterval;
          }
          setBlinkingSetting(closing, closed, opening) {
              this._closingSeconds = closing;
              this._closedSeconds = closed;
              this._openingSeconds = opening;
          }
          setParameterIds(parameterIds) {
              this._parameterIds = parameterIds;
          }
          getParameterIds() {
              return this._parameterIds;
          }
          updateParameters(model, deltaTimeSeconds) {
              this._userTimeSeconds += deltaTimeSeconds;
              let parameterValue;
              let t = 0.0;
              switch (this._blinkingState) {
                  case EyeState.EyeState_Closing:
                      t =
                          (this._userTimeSeconds - this._stateStartTimeSeconds) /
                              this._closingSeconds;
                      if (t >= 1.0) {
                          t = 1.0;
                          this._blinkingState = EyeState.EyeState_Closed;
                          this._stateStartTimeSeconds = this._userTimeSeconds;
                      }
                      parameterValue = 1.0 - t;
                      break;
                  case EyeState.EyeState_Closed:
                      t =
                          (this._userTimeSeconds - this._stateStartTimeSeconds) /
                              this._closedSeconds;
                      if (t >= 1.0) {
                          this._blinkingState = EyeState.EyeState_Opening;
                          this._stateStartTimeSeconds = this._userTimeSeconds;
                      }
                      parameterValue = 0.0;
                      break;
                  case EyeState.EyeState_Opening:
                      t =
                          (this._userTimeSeconds - this._stateStartTimeSeconds) /
                              this._openingSeconds;
                      if (t >= 1.0) {
                          t = 1.0;
                          this._blinkingState = EyeState.EyeState_Interval;
                          this._nextBlinkingTime = this.determinNextBlinkingTiming();
                      }
                      parameterValue = t;
                      break;
                  case EyeState.EyeState_Interval:
                      if (this._nextBlinkingTime < this._userTimeSeconds) {
                          this._blinkingState = EyeState.EyeState_Closing;
                          this._stateStartTimeSeconds = this._userTimeSeconds;
                      }
                      parameterValue = 1.0;
                      break;
                  case EyeState.EyeState_First:
                  default:
                      this._blinkingState = EyeState.EyeState_Interval;
                      this._nextBlinkingTime = this.determinNextBlinkingTiming();
                      parameterValue = 1.0;
                      break;
              }
              if (!CubismEyeBlink.CloseIfZero) {
                  parameterValue = -parameterValue;
              }
              for (let i = 0; i < this._parameterIds.getSize(); ++i) {
                  model.setParameterValueById(this._parameterIds.at(i), parameterValue);
              }
          }
          determinNextBlinkingTiming() {
              const r = Math.random();
              return (this._userTimeSeconds + r * (2.0 * this._blinkingIntervalSeconds - 1.0));
          }
      }
      CubismEyeBlink.CloseIfZero = true;
      Live2DCubismFramework.CubismEyeBlink = CubismEyeBlink;
      let EyeState;
      (function (EyeState) {
          EyeState[EyeState["EyeState_First"] = 0] = "EyeState_First";
          EyeState[EyeState["EyeState_Interval"] = 1] = "EyeState_Interval";
          EyeState[EyeState["EyeState_Closing"] = 2] = "EyeState_Closing";
          EyeState[EyeState["EyeState_Closed"] = 3] = "EyeState_Closed";
          EyeState[EyeState["EyeState_Opening"] = 4] = "EyeState_Opening";
      })(EyeState = Live2DCubismFramework.EyeState || (Live2DCubismFramework.EyeState = {}));
  })(Live2DCubismFramework$u || (Live2DCubismFramework$u = {}));

  var Live2DCubismFramework$v;
  (function (Live2DCubismFramework) {
      Live2DCubismFramework.HitAreaPrefix = 'HitArea';
      Live2DCubismFramework.HitAreaHead = 'Head';
      Live2DCubismFramework.HitAreaBody = 'Body';
      Live2DCubismFramework.PartsIdCore = 'Parts01Core';
      Live2DCubismFramework.PartsArmPrefix = 'Parts01Arm_';
      Live2DCubismFramework.PartsArmLPrefix = 'Parts01ArmL_';
      Live2DCubismFramework.PartsArmRPrefix = 'Parts01ArmR_';
      Live2DCubismFramework.ParamAngleX = 'ParamAngleX';
      Live2DCubismFramework.ParamAngleY = 'ParamAngleY';
      Live2DCubismFramework.ParamAngleZ = 'ParamAngleZ';
      Live2DCubismFramework.ParamEyeLOpen = 'ParamEyeLOpen';
      Live2DCubismFramework.ParamEyeLSmile = 'ParamEyeLSmile';
      Live2DCubismFramework.ParamEyeROpen = 'ParamEyeROpen';
      Live2DCubismFramework.ParamEyeRSmile = 'ParamEyeRSmile';
      Live2DCubismFramework.ParamEyeBallX = 'ParamEyeBallX';
      Live2DCubismFramework.ParamEyeBallY = 'ParamEyeBallY';
      Live2DCubismFramework.ParamEyeBallForm = 'ParamEyeBallForm';
      Live2DCubismFramework.ParamBrowLY = 'ParamBrowLY';
      Live2DCubismFramework.ParamBrowRY = 'ParamBrowRY';
      Live2DCubismFramework.ParamBrowLX = 'ParamBrowLX';
      Live2DCubismFramework.ParamBrowRX = 'ParamBrowRX';
      Live2DCubismFramework.ParamBrowLAngle = 'ParamBrowLAngle';
      Live2DCubismFramework.ParamBrowRAngle = 'ParamBrowRAngle';
      Live2DCubismFramework.ParamBrowLForm = 'ParamBrowLForm';
      Live2DCubismFramework.ParamBrowRForm = 'ParamBrowRForm';
      Live2DCubismFramework.ParamMouthForm = 'ParamMouthForm';
      Live2DCubismFramework.ParamMouthOpenY = 'ParamMouthOpenY';
      Live2DCubismFramework.ParamCheek = 'ParamCheek';
      Live2DCubismFramework.ParamBodyAngleX = 'ParamBodyAngleX';
      Live2DCubismFramework.ParamBodyAngleY = 'ParamBodyAngleY';
      Live2DCubismFramework.ParamBodyAngleZ = 'ParamBodyAngleZ';
      Live2DCubismFramework.ParamBreath = 'ParamBreath';
      Live2DCubismFramework.ParamArmLA = 'ParamArmLA';
      Live2DCubismFramework.ParamArmRA = 'ParamArmRA';
      Live2DCubismFramework.ParamArmLB = 'ParamArmLB';
      Live2DCubismFramework.ParamArmRB = 'ParamArmRB';
      Live2DCubismFramework.ParamHandL = 'ParamHandL';
      Live2DCubismFramework.ParamHandR = 'ParamHandR';
      Live2DCubismFramework.ParamHairFront = 'ParamHairFront';
      Live2DCubismFramework.ParamHairSide = 'ParamHairSide';
      Live2DCubismFramework.ParamHairBack = 'ParamHairBack';
      Live2DCubismFramework.ParamHairFluffy = 'ParamHairFluffy';
      Live2DCubismFramework.ParamShoulderY = 'ParamShoulderY';
      Live2DCubismFramework.ParamBustX = 'ParamBustX';
      Live2DCubismFramework.ParamBustY = 'ParamBustY';
      Live2DCubismFramework.ParamBaseX = 'ParamBaseX';
      Live2DCubismFramework.ParamBaseY = 'ParamBaseY';
      Live2DCubismFramework.ParamNONE = 'NONE:';
  })(Live2DCubismFramework$v || (Live2DCubismFramework$v = {}));

  var CubismFramework$7 = Live2DCubismFramework$9.CubismFramework;
  var CubismJson$5 = Live2DCubismFramework$4.CubismJson;
  var Live2DCubismFramework$w;
  (function (Live2DCubismFramework) {
      const Meta = 'Meta';
      const UserDataCount = 'UserDataCount';
      const TotalUserDataSize = 'TotalUserDataSize';
      const UserData = 'UserData';
      const Target = 'Target';
      const Id = 'Id';
      const Value = 'Value';
      class CubismModelUserDataJson {
          constructor(buffer, size) {
              this._json = CubismJson$5.create(buffer, size);
          }
          release() {
              CubismJson$5.delete(this._json);
          }
          getUserDataCount() {
              return this._json
                  .getRoot()
                  .getValueByString(Meta)
                  .getValueByString(UserDataCount)
                  .toInt();
          }
          getTotalUserDataSize() {
              return this._json
                  .getRoot()
                  .getValueByString(Meta)
                  .getValueByString(TotalUserDataSize)
                  .toInt();
          }
          getUserDataTargetType(i) {
              return this._json
                  .getRoot()
                  .getValueByString(UserData)
                  .getValueByIndex(i)
                  .getValueByString(Target)
                  .getRawString();
          }
          getUserDataId(i) {
              return CubismFramework$7.getIdManager().getId(this._json
                  .getRoot()
                  .getValueByString(UserData)
                  .getValueByIndex(i)
                  .getValueByString(Id)
                  .getRawString());
          }
          getUserDataValue(i) {
              return this._json
                  .getRoot()
                  .getValueByString(UserData)
                  .getValueByIndex(i)
                  .getValueByString(Value)
                  .getRawString();
          }
      }
      Live2DCubismFramework.CubismModelUserDataJson = CubismModelUserDataJson;
  })(Live2DCubismFramework$w || (Live2DCubismFramework$w = {}));

  var CubismFramework$8 = Live2DCubismFramework$9.CubismFramework;
  var csmVector$b = Live2DCubismFramework$3.csmVector;
  var csmString$4 = Live2DCubismFramework.csmString;
  var CubismModelUserDataJson = Live2DCubismFramework$w.CubismModelUserDataJson;
  var Live2DCubismFramework$x;
  (function (Live2DCubismFramework) {
      const ArtMesh = 'ArtMesh';
      class CubismModelUserDataNode {
      }
      Live2DCubismFramework.CubismModelUserDataNode = CubismModelUserDataNode;
      class CubismModelUserData {
          constructor() {
              this._userDataNodes = new csmVector$b();
              this._artMeshUserDataNode = new csmVector$b();
          }
          static create(buffer, size) {
              const ret = new CubismModelUserData();
              ret.parseUserData(buffer, size);
              return ret;
          }
          static delete(modelUserData) {
              if (modelUserData != null) {
                  modelUserData.release();
                  modelUserData = null;
              }
          }
          getArtMeshUserDatas() {
              return this._artMeshUserDataNode;
          }
          parseUserData(buffer, size) {
              let json = new CubismModelUserDataJson(buffer, size);
              const typeOfArtMesh = CubismFramework$8.getIdManager().getId(ArtMesh);
              const nodeCount = json.getUserDataCount();
              for (let i = 0; i < nodeCount; i++) {
                  const addNode = new CubismModelUserDataNode();
                  addNode.targetId = json.getUserDataId(i);
                  addNode.targetType = CubismFramework$8.getIdManager().getId(json.getUserDataTargetType(i));
                  addNode.value = new csmString$4(json.getUserDataValue(i));
                  this._userDataNodes.pushBack(addNode);
                  if (addNode.targetType == typeOfArtMesh) {
                      this._artMeshUserDataNode.pushBack(addNode);
                  }
              }
              json.release();
              json = void 0;
          }
          release() {
              for (let i = 0; i < this._userDataNodes.getSize(); ++i) {
                  this._userDataNodes.set(i, null);
              }
              this._userDataNodes = null;
          }
      }
      Live2DCubismFramework.CubismModelUserData = CubismModelUserData;
  })(Live2DCubismFramework$x || (Live2DCubismFramework$x = {}));

  var CubismMath$3 = Live2DCubismFramework$b.CubismMath;
  var Live2DCubismFramework$y;
  (function (Live2DCubismFramework) {
      const FrameRate = 30;
      const Epsilon = 0.01;
      class CubismTargetPoint {
          constructor() {
              this._faceTargetX = 0.0;
              this._faceTargetY = 0.0;
              this._faceX = 0.0;
              this._faceY = 0.0;
              this._faceVX = 0.0;
              this._faceVY = 0.0;
              this._lastTimeSeconds = 0.0;
              this._userTimeSeconds = 0.0;
          }
          update(deltaTimeSeconds) {
              this._userTimeSeconds += deltaTimeSeconds;
              const faceParamMaxV = 40.0 / 10.0;
              const maxV = (faceParamMaxV * 1.0) / FrameRate;
              if (this._lastTimeSeconds == 0.0) {
                  this._lastTimeSeconds = this._userTimeSeconds;
                  return;
              }
              const deltaTimeWeight = (this._userTimeSeconds - this._lastTimeSeconds) * FrameRate;
              this._lastTimeSeconds = this._userTimeSeconds;
              const timeToMaxSpeed = 0.15;
              const frameToMaxSpeed = timeToMaxSpeed * FrameRate;
              const maxA = (deltaTimeWeight * maxV) / frameToMaxSpeed;
              const dx = this._faceTargetX - this._faceX;
              const dy = this._faceTargetY - this._faceY;
              if (CubismMath$3.abs(dx) <= Epsilon && CubismMath$3.abs(dy) <= Epsilon) {
                  return;
              }
              const d = CubismMath$3.sqrt(dx * dx + dy * dy);
              const vx = (maxV * dx) / d;
              const vy = (maxV * dy) / d;
              let ax = vx - this._faceVX;
              let ay = vy - this._faceVY;
              const a = CubismMath$3.sqrt(ax * ax + ay * ay);
              if (a < -maxA || a > maxA) {
                  ax *= maxA / a;
                  ay *= maxA / a;
              }
              this._faceVX += ax;
              this._faceVY += ay;
              {
                  const maxV = 0.5 *
                      (CubismMath$3.sqrt(maxA * maxA + 16.0 * maxA * d - 8.0 * maxA * d) -
                          maxA);
                  const curV = CubismMath$3.sqrt(this._faceVX * this._faceVX + this._faceVY * this._faceVY);
                  if (curV > maxV) {
                      this._faceVX *= maxV / curV;
                      this._faceVY *= maxV / curV;
                  }
              }
              this._faceX += this._faceVX;
              this._faceY += this._faceVY;
          }
          getX() {
              return this._faceX;
          }
          getY() {
              return this._faceY;
          }
          set(x, y) {
              this._faceTargetX = x;
              this._faceTargetY = y;
          }
      }
      Live2DCubismFramework.CubismTargetPoint = CubismTargetPoint;
  })(Live2DCubismFramework$y || (Live2DCubismFramework$y = {}));

  var Live2DCubismFramework$z;
  (function (Live2DCubismFramework) {
      class csmRect {
          constructor(x, y, w, h) {
              this.x = x;
              this.y = y;
              this.width = w;
              this.height = h;
          }
          getCenterX() {
              return this.x + 0.5 * this.width;
          }
          getCenterY() {
              return this.y + 0.5 * this.height;
          }
          getRight() {
              return this.x + this.width;
          }
          getBottom() {
              return this.y + this.height;
          }
          setRect(r) {
              this.x = r.x;
              this.y = r.y;
              this.width = r.width;
              this.height = r.height;
          }
          expand(w, h) {
              this.x -= w;
              this.y -= h;
              this.width += w * 2.0;
              this.height += h * 2.0;
          }
      }
      Live2DCubismFramework.csmRect = csmRect;
  })(Live2DCubismFramework$z || (Live2DCubismFramework$z = {}));

  class Live2DTime {
      static getDeltaTime() {
          return this.s_deltaTime;
      }
      static updateTime() {
          this.s_currentFrame = Date.now();
          this.s_deltaTime = (this.s_currentFrame - this.s_lastFrame) / 1000;
          this.s_lastFrame = this.s_currentFrame;
      }
  }
  Live2DTime.s_currentFrame = 0.0;
  Live2DTime.s_lastFrame = 0.0;
  Live2DTime.s_deltaTime = 0.0;

  class Live2DSubmit {
      constructor() {
          this._key = {};
      }
      static __init__(gl) {
          Live2DSubmit._gl = gl;
          var _originBindBuffer = gl.bindBuffer;
          function bindBuffer(target, buffer) {
              if (Live2DSubmit.isMark) {
                  if (target == Live2DSubmit._gl.ARRAY_BUFFER) {
                      Live2DSubmit._curAB = buffer;
                  }
                  else if (target == Live2DSubmit._gl.ELEMENT_ARRAY_BUFFER) {
                      Live2DSubmit._curEAB = buffer;
                  }
              }
              _originBindBuffer.call(Live2DSubmit._gl, target, buffer);
          }
          gl.bindBuffer = bindBuffer;
      }
      init(model) {
          this._model = model;
          this.saveParameter = {};
          this.saveParameter.vertexs = [];
      }
      renderSubmit() {
          Live2DTime.updateTime();
          Live2DSubmit.isMark = false;
          this.start();
          this._model.update(Live2DTime.getDeltaTime());
          this.end();
          Live2DSubmit.isMark = true;
          return 1;
      }
      getRenderType() {
          return Live2DSubmit.TYPE_LIVE2D;
      }
      releaseRender() {
          this._model = null;
          this.saveParameter = null;
          Laya.Pool.recover("Live2DSubmit_Pool", this);
      }
      start() {
          let gl = Laya.WebGLContext.mainContext;
          this.saveParameter.BLEND = gl.getParameter(gl.BLEND);
          this.saveParameter.CULL_FACE = gl.getParameter(gl.CULL_FACE);
          this.saveParameter.SCISSOR_TEST = gl.getParameter(gl.SCISSOR_TEST);
          this.saveParameter.STENCIL_TEST = gl.getParameter(gl.STENCIL_TEST);
          this.saveParameter.DEPTH_TEST = gl.getParameter(gl.DEPTH_TEST);
          this.saveParameter.bindTexture = gl.getParameter(gl.TEXTURE_BINDING_2D);
          this.saveParameter.program = gl.getParameter(gl.CURRENT_PROGRAM);
          this.saveParameter.frontFace = gl.getParameter(gl.FRONT_FACE);
          this.saveParameter.ARRAY_BUFFER_BINDING = gl.getParameter(gl.ARRAY_BUFFER_BINDING);
          this.saveParameter.ELEMENT_ARRAY_BUFFER_BINDING = gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING);
          this.saveParameter.BLEND_DST_ALPHA = gl.getParameter(gl.BLEND_DST_ALPHA);
          this.saveParameter.BLEND_DST_RGB = gl.getParameter(gl.BLEND_DST_RGB);
          this.saveParameter.BLEND_SRC_ALPHA = gl.getParameter(gl.BLEND_SRC_ALPHA);
          this.saveParameter.BLEND_SRC_RGB = gl.getParameter(gl.BLEND_SRC_RGB);
          this.saveParameter.FRAMEBUFFER_BINDING = gl.getParameter(gl.FRAMEBUFFER_BINDING);
          let enable, data;
          let vertexs = this.saveParameter.vertexs;
          vertexs.length = 0;
          let max = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
          for (let index = 0; index < max; index++) {
              enable = gl.getVertexAttrib(index, gl.VERTEX_ATTRIB_ARRAY_ENABLED);
              if (enable) {
                  data = vertexs[index] = {};
                  data.index = index;
                  data.buffer = gl.getVertexAttrib(index, gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING);
                  data.size = gl.getVertexAttrib(index, gl.VERTEX_ATTRIB_ARRAY_SIZE);
                  data.type = gl.getVertexAttrib(index, gl.VERTEX_ATTRIB_ARRAY_TYPE);
                  data.normalized = gl.getVertexAttrib(index, gl.VERTEX_ATTRIB_ARRAY_NORMALIZED);
                  data.stride = gl.getVertexAttrib(index, gl.VERTEX_ATTRIB_ARRAY_STRIDE);
                  data.offset = gl.getVertexAttribOffset(index, gl.VERTEX_ATTRIB_ARRAY_POINTER);
              }
              else {
                  break;
              }
          }
      }
      end() {
          let _webglContext = Laya.WebGLContext;
          let gl = _webglContext.mainContext;
          if (this.saveParameter.BLEND) {
              gl.enable(gl.BLEND);
          }
          else
              gl.disable(gl.BLEND);
          if (this.saveParameter.CULL_FACE) {
              gl.enable(gl.CULL_FACE);
          }
          else
              gl.disable(gl.CULL_FACE);
          if (this.saveParameter.SCISSOR_TEST) {
              gl.enable(gl.SCISSOR_TEST);
          }
          if (this.saveParameter.STENCIL_TEST) {
              gl.enable(gl.STENCIL_TEST);
          }
          if (this.saveParameter.DEPTH_TEST) {
              gl.enable(gl.DEPTH_TEST);
          }
          if (this.saveParameter.bindTexture) {
              gl.bindTexture(gl.TEXTURE_2D, this.saveParameter.bindTexture);
          }
          else {
              gl.bindTexture(gl.TEXTURE_2D, _webglContext._activeTextures[_webglContext._activedTextureID - gl.TEXTURE0]);
          }
          gl.blendFuncSeparate(this.saveParameter.BLEND_SRC_RGB, this.saveParameter.BLEND_DST_RGB, this.saveParameter.BLEND_SRC_ALPHA, this.saveParameter.BLEND_DST_ALPHA);
          gl.frontFace(this.saveParameter.frontFace);
          gl.useProgram(_webglContext._useProgram);
          if (this.saveParameter.ARRAY_BUFFER_BINDING) {
              gl.bindBuffer(gl.ARRAY_BUFFER, this.saveParameter.ARRAY_BUFFER_BINDING);
          }
          else {
              gl.bindBuffer(gl.ARRAY_BUFFER, Live2DSubmit._curAB);
          }
          let vertexs = this.saveParameter.vertexs;
          for (let index = 0; index < vertexs.length; index++) {
              const element = vertexs[index];
              if (element.buffer == this.saveParameter.ARRAY_BUFFER_BINDING || !this.saveParameter.ARRAY_BUFFER_BINDING) {
                  gl.enableVertexAttribArray(element.index);
                  gl.vertexAttribPointer(element.index, element.size, element.type, element.normalized, element.stride, element.offset);
              }
          }
          if (this.saveParameter.ELEMENT_ARRAY_BUFFER_BINDING) {
              gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.saveParameter.ELEMENT_ARRAY_BUFFER_BINDING);
          }
          else {
              gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Live2DSubmit._curEAB);
          }
      }
      static create(model) {
          let o = Laya.Pool.getItemByClass("Live2DSubmit_Pool", Live2DSubmit);
          o.init(model);
          return o;
      }
  }
  Live2DSubmit.TYPE_LIVE2D = 11000;
  Live2DSubmit.isMark = true;

  var Constant = Live2DCubismFramework$9.Constant;
  var CubismMatrix44$2 = Live2DCubismFramework$7.CubismMatrix44;
  var csmRect = Live2DCubismFramework$z.csmRect;
  var csmMap$2 = Live2DCubismFramework$2.csmMap;
  var csmVector$c = Live2DCubismFramework$3.csmVector;
  var CubismRenderer$1 = Live2DCubismFramework$8.CubismRenderer;
  var CubismBlendMode$1 = Live2DCubismFramework$8.CubismBlendMode;
  var CubismTextureColor = Live2DCubismFramework$8.CubismTextureColor;
  var Live2DCubismFramework$A;
  (function (Live2DCubismFramework) {
      const ColorChannelCount = 4;
      const shaderCount = 10;
      let s_instance;
      let s_fbo;
      class CubismClippingManager_WebGL {
          constructor() {
              this._maskRenderTexture = null;
              this._colorBuffer = null;
              this._currentFrameNo = 0;
              this._clippingMaskBufferSize = 256;
              this._clippingContextListForMask = new csmVector$c();
              this._clippingContextListForDraw = new csmVector$c();
              this._channelColors = new csmVector$c();
              this._tmpBoundsOnModel = new csmRect();
              this._tmpMatrix = new CubismMatrix44$2();
              this._tmpMatrixForMask = new CubismMatrix44$2();
              this._tmpMatrixForDraw = new CubismMatrix44$2();
              this._maskTexture = null;
              let tmp = new CubismTextureColor();
              tmp.R = 1.0;
              tmp.G = 0.0;
              tmp.B = 0.0;
              tmp.A = 0.0;
              this._channelColors.pushBack(tmp);
              tmp = new CubismTextureColor();
              tmp.R = 0.0;
              tmp.G = 1.0;
              tmp.B = 0.0;
              tmp.A = 0.0;
              this._channelColors.pushBack(tmp);
              tmp = new CubismTextureColor();
              tmp.R = 0.0;
              tmp.G = 0.0;
              tmp.B = 1.0;
              tmp.A = 0.0;
              this._channelColors.pushBack(tmp);
              tmp = new CubismTextureColor();
              tmp.R = 0.0;
              tmp.G = 0.0;
              tmp.B = 0.0;
              tmp.A = 1.0;
              this._channelColors.pushBack(tmp);
          }
          getChannelFlagAsColor(channelNo) {
              return this._channelColors.at(channelNo);
          }
          getMaskRenderTexture() {
              let ret = null;
              if (this._maskTexture && this._maskTexture.texture) {
                  this._maskTexture.frameNo = this._currentFrameNo;
                  ret = this._maskTexture.texture;
              }
              if (!ret) {
                  const size = this._clippingMaskBufferSize;
                  this._colorBuffer = this.gl.createTexture();
                  this.gl.bindTexture(this.gl.TEXTURE_2D, this._colorBuffer);
                  this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, size, size, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
                  this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
                  this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
                  this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
                  this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
                  this.gl.bindTexture(this.gl.TEXTURE_2D, null);
                  ret = this.gl.createFramebuffer();
                  this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, ret);
                  this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this._colorBuffer, 0);
                  this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, s_fbo);
                  this._maskTexture = new CubismRenderTextureResource(this._currentFrameNo, ret);
              }
              return ret;
          }
          calcClippedDrawTotalBounds(model, clippingContext) {
              let clippedDrawTotalMinX = Number.MAX_VALUE;
              let clippedDrawTotalMinY = Number.MAX_VALUE;
              let clippedDrawTotalMaxX = Number.MIN_VALUE;
              let clippedDrawTotalMaxY = Number.MIN_VALUE;
              const clippedDrawCount = clippingContext._clippedDrawableIndexList.length;
              for (let clippedDrawableIndex = 0; clippedDrawableIndex < clippedDrawCount; clippedDrawableIndex++) {
                  const drawableIndex = clippingContext._clippedDrawableIndexList[clippedDrawableIndex];
                  const drawableVertexCount = model.getDrawableVertexCount(drawableIndex);
                  const drawableVertexes = model.getDrawableVertices(drawableIndex);
                  let minX = Number.MAX_VALUE;
                  let minY = Number.MAX_VALUE;
                  let maxX = Number.MIN_VALUE;
                  let maxY = Number.MIN_VALUE;
                  const loop = drawableVertexCount * Constant.vertexStep;
                  for (let pi = Constant.vertexOffset; pi < loop; pi += Constant.vertexStep) {
                      const x = drawableVertexes[pi];
                      const y = drawableVertexes[pi + 1];
                      if (x < minX) {
                          minX = x;
                      }
                      if (x > maxX) {
                          maxX = x;
                      }
                      if (y < minY) {
                          minY = y;
                      }
                      if (y > maxY) {
                          maxY = y;
                      }
                  }
                  if (minX == Number.MAX_VALUE) {
                      continue;
                  }
                  if (minX < clippedDrawTotalMinX) {
                      clippedDrawTotalMinX = minX;
                  }
                  if (minY < clippedDrawTotalMinY) {
                      clippedDrawTotalMinY = minY;
                  }
                  if (maxX > clippedDrawTotalMaxX) {
                      clippedDrawTotalMaxX = maxX;
                  }
                  if (maxY > clippedDrawTotalMaxY) {
                      clippedDrawTotalMaxY = maxY;
                  }
                  if (clippedDrawTotalMinX == Number.MAX_VALUE) {
                      clippingContext._allClippedDrawRect.x = 0.0;
                      clippingContext._allClippedDrawRect.y = 0.0;
                      clippingContext._allClippedDrawRect.width = 0.0;
                      clippingContext._allClippedDrawRect.height = 0.0;
                      clippingContext._isUsing = false;
                  }
                  else {
                      clippingContext._isUsing = true;
                      const w = clippedDrawTotalMaxX - clippedDrawTotalMinX;
                      const h = clippedDrawTotalMaxY - clippedDrawTotalMinY;
                      clippingContext._allClippedDrawRect.x = clippedDrawTotalMinX;
                      clippingContext._allClippedDrawRect.y = clippedDrawTotalMinY;
                      clippingContext._allClippedDrawRect.width = w;
                      clippingContext._allClippedDrawRect.height = h;
                  }
              }
          }
          release() {
              for (let i = 0; i < this._clippingContextListForMask.getSize(); i++) {
                  if (this._clippingContextListForMask.at(i)) {
                      this._clippingContextListForMask.at(i).release();
                      this._clippingContextListForMask.set(i, void 0);
                  }
                  this._clippingContextListForMask.set(i, null);
              }
              this._clippingContextListForMask = null;
              for (let i = 0; i < this._clippingContextListForDraw.getSize(); i++) {
                  this._clippingContextListForDraw.set(i, null);
              }
              this._clippingContextListForDraw = null;
              if (this._maskTexture) {
                  this.gl.deleteFramebuffer(this._maskTexture.texture);
                  this._maskTexture = null;
              }
              for (let i = 0; i < this._channelColors.getSize(); i++) {
                  this._channelColors.set(i, null);
              }
              this._channelColors = null;
              this.gl.deleteTexture(this._colorBuffer);
              this._colorBuffer = null;
          }
          initialize(model, drawableCount, drawableMasks, drawableMaskCounts) {
              for (let i = 0; i < drawableCount; i++) {
                  if (drawableMaskCounts[i] <= 0) {
                      this._clippingContextListForDraw.pushBack(null);
                      continue;
                  }
                  let clippingContext = this.findSameClip(drawableMasks[i], drawableMaskCounts[i]);
                  if (clippingContext == null) {
                      clippingContext = new CubismClippingContext(this, drawableMasks[i], drawableMaskCounts[i]);
                      this._clippingContextListForMask.pushBack(clippingContext);
                  }
                  clippingContext.addClippedDrawable(i);
                  this._clippingContextListForDraw.pushBack(clippingContext);
              }
          }
          setupClippingContext(model, renderer) {
              this._currentFrameNo++;
              let usingClipCount = 0;
              for (let clipIndex = 0; clipIndex < this._clippingContextListForMask.getSize(); clipIndex++) {
                  const cc = this._clippingContextListForMask.at(clipIndex);
                  this.calcClippedDrawTotalBounds(model, cc);
                  if (cc._isUsing) {
                      usingClipCount++;
                  }
              }
              if (usingClipCount > 0) {
                  this.gl.viewport(0, 0, this._clippingMaskBufferSize, this._clippingMaskBufferSize);
                  this._maskRenderTexture = this.getMaskRenderTexture();
                  const modelToWorldF = renderer.getMvpMatrix();
                  renderer.preDraw();
                  this.setupLayoutBounds(usingClipCount);
                  this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this._maskRenderTexture);
                  this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
                  this.gl.clear(this.gl.COLOR_BUFFER_BIT);
                  for (let clipIndex = 0; clipIndex < this._clippingContextListForMask.getSize(); clipIndex++) {
                      const clipContext = this._clippingContextListForMask.at(clipIndex);
                      const allClipedDrawRect = clipContext._allClippedDrawRect;
                      const layoutBoundsOnTex01 = clipContext._layoutBounds;
                      const MARGIN = 0.05;
                      this._tmpBoundsOnModel.setRect(allClipedDrawRect);
                      this._tmpBoundsOnModel.expand(allClipedDrawRect.width * MARGIN, allClipedDrawRect.height * MARGIN);
                      const scaleX = layoutBoundsOnTex01.width / this._tmpBoundsOnModel.width;
                      const scaleY = layoutBoundsOnTex01.height / this._tmpBoundsOnModel.height;
                      {
                          this._tmpMatrix.loadIdentity();
                          {
                              this._tmpMatrix.translateRelative(-1.0, -1.0);
                              this._tmpMatrix.scaleRelative(2.0, 2.0);
                          }
                          {
                              this._tmpMatrix.translateRelative(layoutBoundsOnTex01.x, layoutBoundsOnTex01.y);
                              this._tmpMatrix.scaleRelative(scaleX, scaleY);
                              this._tmpMatrix.translateRelative(-this._tmpBoundsOnModel.x, -this._tmpBoundsOnModel.y);
                          }
                          this._tmpMatrixForMask.setMatrix(this._tmpMatrix.getArray());
                      }
                      {
                          this._tmpMatrix.loadIdentity();
                          {
                              this._tmpMatrix.translateRelative(layoutBoundsOnTex01.x, layoutBoundsOnTex01.y);
                              this._tmpMatrix.scaleRelative(scaleX, scaleY);
                              this._tmpMatrix.translateRelative(-this._tmpBoundsOnModel.x, -this._tmpBoundsOnModel.y);
                          }
                          this._tmpMatrixForDraw.setMatrix(this._tmpMatrix.getArray());
                      }
                      clipContext._matrixForMask.setMatrix(this._tmpMatrixForMask.getArray());
                      clipContext._matrixForDraw.setMatrix(this._tmpMatrixForDraw.getArray());
                      const clipDrawCount = clipContext._clippingIdCount;
                      for (let i = 0; i < clipDrawCount; i++) {
                          const clipDrawIndex = clipContext._clippingIdList[i];
                          if (!model.getDrawableDynamicFlagVertexPositionsDidChange(clipDrawIndex)) {
                              continue;
                          }
                          renderer.setIsCulling(model.getDrawableCulling(clipDrawIndex) != false);
                          renderer.setClippingContextBufferForMask(clipContext);
                          renderer.drawMesh(model.getDrawableTextureIndices(clipDrawIndex), model.getDrawableVertexIndexCount(clipDrawIndex), model.getDrawableVertexCount(clipDrawIndex), model.getDrawableVertexIndices(clipDrawIndex), model.getDrawableVertices(clipDrawIndex), model.getDrawableVertexUvs(clipDrawIndex), model.getDrawableOpacity(clipDrawIndex), CubismBlendMode$1.CubismBlendMode_Normal, false);
                      }
                  }
                  this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, s_fbo);
                  renderer.setClippingContextBufferForMask(null);
                  this.gl.viewport(0, 0, Laya.Browser.mainCanvas.width, Laya.Browser.mainCanvas.height);
              }
          }
          findSameClip(drawableMasks, drawableMaskCounts) {
              for (let i = 0; i < this._clippingContextListForMask.getSize(); i++) {
                  const clippingContext = this._clippingContextListForMask.at(i);
                  const count = clippingContext._clippingIdCount;
                  if (count != drawableMaskCounts) {
                      continue;
                  }
                  let sameCount = 0;
                  for (let j = 0; j < count; j++) {
                      const clipId = clippingContext._clippingIdList[j];
                      for (let k = 0; k < count; k++) {
                          if (drawableMasks[k] == clipId) {
                              sameCount++;
                              break;
                          }
                      }
                  }
                  if (sameCount == count) {
                      return clippingContext;
                  }
              }
              return null;
          }
          setupLayoutBounds(usingClipCount) {
              let div = usingClipCount / ColorChannelCount;
              let mod = usingClipCount % ColorChannelCount;
              div = ~~div;
              mod = ~~mod;
              let curClipIndex = 0;
              for (let channelNo = 0; channelNo < ColorChannelCount; channelNo++) {
                  const layoutCount = div + (channelNo < mod ? 1 : 0);
                  if (layoutCount == 0) ;
                  else if (layoutCount == 1) {
                      const clipContext = this._clippingContextListForMask.at(curClipIndex++);
                      clipContext._layoutChannelNo = channelNo;
                      clipContext._layoutBounds.x = 0.0;
                      clipContext._layoutBounds.y = 0.0;
                      clipContext._layoutBounds.width = 1.0;
                      clipContext._layoutBounds.height = 1.0;
                  }
                  else if (layoutCount == 2) {
                      for (let i = 0; i < layoutCount; i++) {
                          let xpos = i % 2;
                          xpos = ~~xpos;
                          const cc = this._clippingContextListForMask.at(curClipIndex++);
                          cc._layoutChannelNo = channelNo;
                          cc._layoutBounds.x = xpos * 0.5;
                          cc._layoutBounds.y = 0.0;
                          cc._layoutBounds.width = 0.5;
                          cc._layoutBounds.height = 1.0;
                      }
                  }
                  else if (layoutCount <= 4) {
                      for (let i = 0; i < layoutCount; i++) {
                          let xpos = i % 2;
                          let ypos = i / 2;
                          xpos = ~~xpos;
                          ypos = ~~ypos;
                          const cc = this._clippingContextListForMask.at(curClipIndex++);
                          cc._layoutChannelNo = channelNo;
                          cc._layoutBounds.x = xpos * 0.5;
                          cc._layoutBounds.y = ypos * 0.5;
                          cc._layoutBounds.width = 0.5;
                          cc._layoutBounds.height = 0.5;
                      }
                  }
                  else if (layoutCount <= 9) {
                      for (let i = 0; i < layoutCount; i++) {
                          let xpos = i % 3;
                          let ypos = i / 3;
                          xpos = ~~xpos;
                          ypos = ~~ypos;
                          const cc = this._clippingContextListForMask.at(curClipIndex++);
                          cc._layoutChannelNo = channelNo;
                          cc._layoutBounds.x = xpos / 3.0;
                          cc._layoutBounds.y = ypos / 3.0;
                          cc._layoutBounds.width = 1.0 / 3.0;
                          cc._layoutBounds.height = 1.0 / 3.0;
                      }
                  }
                  else {
                      console.error('not supported mask count : {0}', layoutCount);
                  }
              }
          }
          getColorBuffer() {
              return this._colorBuffer;
          }
          getClippingContextListForDraw() {
              return this._clippingContextListForDraw;
          }
          setClippingMaskBufferSize(size) {
              this._clippingMaskBufferSize = size;
          }
          getClippingMaskBufferSize() {
              return this._clippingMaskBufferSize;
          }
          get gl() {
              return CubismShader_Laya.gl;
          }
      }
      Live2DCubismFramework.CubismClippingManager_WebGL = CubismClippingManager_WebGL;
      class CubismRenderTextureResource {
          constructor(frameNo, texture) {
              this.frameNo = frameNo;
              this.texture = texture;
          }
      }
      Live2DCubismFramework.CubismRenderTextureResource = CubismRenderTextureResource;
      class CubismClippingContext {
          constructor(manager, clippingDrawableIndices, clipCount) {
              this._owner = manager;
              this._clippingIdList = clippingDrawableIndices;
              this._clippingIdCount = clipCount;
              this._allClippedDrawRect = new csmRect();
              this._layoutBounds = new csmRect();
              this._clippedDrawableIndexList = [];
              this._matrixForMask = new CubismMatrix44$2();
              this._matrixForDraw = new CubismMatrix44$2();
          }
          release() {
              if (this._layoutBounds != null) {
                  this._layoutBounds = null;
              }
              if (this._allClippedDrawRect != null) {
                  this._allClippedDrawRect = null;
              }
              if (this._clippedDrawableIndexList != null) {
                  this._clippedDrawableIndexList = null;
              }
          }
          addClippedDrawable(drawableIndex) {
              this._clippedDrawableIndexList.push(drawableIndex);
          }
          getClippingManager() {
              return this._owner;
          }
      }
      Live2DCubismFramework.CubismClippingContext = CubismClippingContext;
      class CubismShader_Laya {
          constructor() {
              this._shaderSets = new csmVector$c();
          }
          static __init__() {
              CubismShader_Laya.getInstance();
              CubismShader_Laya.gl = Laya.LayaGL.instance;
              s_fbo = CubismShader_Laya.gl.getParameter(CubismShader_Laya.gl.FRAMEBUFFER_BINDING);
              Live2DSubmit.__init__(CubismShader_Laya.gl);
          }
          static getInstance() {
              if (s_instance == null) {
                  s_instance = new CubismShader_Laya();
                  return s_instance;
              }
              return s_instance;
          }
          static deleteInstance() {
              if (s_instance) {
                  s_instance.release();
                  s_instance = null;
              }
          }
          release() {
              this.releaseShaderProgram();
          }
          setupShaderProgram(renderer, textureId, vertexCount, vertexArray, indexArray, uvArray, bufferData, opacity, colorBlendMode, baseColor, isPremultipliedAlpha, matrix4x4, invertedMask, cutArr) {
              if (!isPremultipliedAlpha) {
                  console.error('NoPremultipliedAlpha is not allowed');
              }
              if (this._shaderSets.getSize() == 0) {
                  this.generateShaders();
              }
              let SRC_COLOR;
              let DST_COLOR;
              let SRC_ALPHA;
              let DST_ALPHA;
              if (renderer.getClippingContextBufferForMask() != null) {
                  const shaderSet = this._shaderSets.at(ShaderNames.ShaderNames_SetupMask);
                  this.gl.useProgram(shaderSet.shaderProgram);
                  this.gl.activeTexture(this.gl.TEXTURE0);
                  this.gl.bindTexture(this.gl.TEXTURE_2D, textureId);
                  this.gl.uniform1i(shaderSet.samplerTexture0Location, 0);
                  if (bufferData.vertex == null) {
                      bufferData.vertex = this.gl.createBuffer();
                  }
                  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferData.vertex);
                  this.gl.bufferData(this.gl.ARRAY_BUFFER, vertexArray, this.gl.DYNAMIC_DRAW);
                  this.gl.enableVertexAttribArray(shaderSet.attributePositionLocation);
                  this.gl.vertexAttribPointer(shaderSet.attributePositionLocation, 2, this.gl.FLOAT, false, 0, 0);
                  if (bufferData.uv == null) {
                      bufferData.uv = this.gl.createBuffer();
                  }
                  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferData.uv);
                  this.gl.bufferData(this.gl.ARRAY_BUFFER, uvArray, this.gl.DYNAMIC_DRAW);
                  this.gl.enableVertexAttribArray(shaderSet.attributeTexCoordLocation);
                  this.gl.vertexAttribPointer(shaderSet.attributeTexCoordLocation, 2, this.gl.FLOAT, false, 0, 0);
                  const channelNo = renderer.getClippingContextBufferForMask()
                      ._layoutChannelNo;
                  const colorChannel = renderer
                      .getClippingContextBufferForMask()
                      .getClippingManager()
                      .getChannelFlagAsColor(channelNo);
                  this.gl.uniform4f(shaderSet.uniformChannelFlagLocation, colorChannel.R, colorChannel.G, colorChannel.B, colorChannel.A);
                  this.gl.uniformMatrix4fv(shaderSet.uniformClipMatrixLocation, false, renderer.getClippingContextBufferForMask()._matrixForMask.getArray());
                  const rect = renderer.getClippingContextBufferForMask()
                      ._layoutBounds;
                  this.gl.uniform4f(shaderSet.uniformBaseColorLocation, rect.x * 2.0 - 1.0, rect.y * 2.0 - 1.0, rect.getRight() * 2.0 - 1.0, rect.getBottom() * 2.0 - 1.0);
                  SRC_COLOR = this.gl.ZERO;
                  DST_COLOR = this.gl.ONE_MINUS_SRC_COLOR;
                  SRC_ALPHA = this.gl.ZERO;
                  DST_ALPHA = this.gl.ONE_MINUS_SRC_ALPHA;
              }
              else {
                  const masked = renderer.getClippingContextBufferForDraw() != null;
                  const offset = masked ? (invertedMask ? 2 : 1) : 0;
                  let shaderSet;
                  switch (colorBlendMode) {
                      case CubismBlendMode$1.CubismBlendMode_Normal:
                      default:
                          shaderSet = this._shaderSets.at(ShaderNames.ShaderNames_NormalPremultipliedAlpha + offset);
                          SRC_COLOR = this.gl.ONE;
                          DST_COLOR = this.gl.ONE_MINUS_SRC_ALPHA;
                          SRC_ALPHA = this.gl.ONE;
                          DST_ALPHA = this.gl.ONE_MINUS_SRC_ALPHA;
                          break;
                      case CubismBlendMode$1.CubismBlendMode_Additive:
                          shaderSet = this._shaderSets.at(ShaderNames.ShaderNames_AddPremultipliedAlpha + offset);
                          SRC_COLOR = this.gl.ONE;
                          DST_COLOR = this.gl.ONE;
                          SRC_ALPHA = this.gl.ZERO;
                          DST_ALPHA = this.gl.ONE;
                          break;
                      case CubismBlendMode$1.CubismBlendMode_Multiplicative:
                          shaderSet = this._shaderSets.at(ShaderNames.ShaderNames_MultPremultipliedAlpha + offset);
                          SRC_COLOR = this.gl.DST_COLOR;
                          DST_COLOR = this.gl.ONE_MINUS_SRC_ALPHA;
                          SRC_ALPHA = this.gl.ZERO;
                          DST_ALPHA = this.gl.ONE;
                          break;
                  }
                  this.gl.useProgram(shaderSet.shaderProgram);
                  if (bufferData.vertex == null) {
                      bufferData.vertex = this.gl.createBuffer();
                  }
                  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferData.vertex);
                  this.gl.bufferData(this.gl.ARRAY_BUFFER, vertexArray, this.gl.DYNAMIC_DRAW);
                  this.gl.enableVertexAttribArray(shaderSet.attributePositionLocation);
                  this.gl.vertexAttribPointer(shaderSet.attributePositionLocation, 2, this.gl.FLOAT, false, 0, 0);
                  if (bufferData.uv == null) {
                      bufferData.uv = this.gl.createBuffer();
                  }
                  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferData.uv);
                  this.gl.bufferData(this.gl.ARRAY_BUFFER, uvArray, this.gl.DYNAMIC_DRAW);
                  this.gl.enableVertexAttribArray(shaderSet.attributeTexCoordLocation);
                  this.gl.vertexAttribPointer(shaderSet.attributeTexCoordLocation, 2, this.gl.FLOAT, false, 0, 0);
                  if (masked) {
                      this.gl.activeTexture(this.gl.TEXTURE1);
                      const tex = renderer
                          .getClippingContextBufferForDraw()
                          .getClippingManager()
                          .getColorBuffer();
                      this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
                      this.gl.uniform1i(shaderSet.samplerTexture1Location, 1);
                      this.gl.uniformMatrix4fv(shaderSet.uniformClipMatrixLocation, false, renderer.getClippingContextBufferForDraw()._matrixForDraw.getArray());
                      const channelNo = renderer.getClippingContextBufferForDraw()
                          ._layoutChannelNo;
                      const colorChannel = renderer
                          .getClippingContextBufferForDraw()
                          .getClippingManager()
                          .getChannelFlagAsColor(channelNo);
                      this.gl.uniform4f(shaderSet.uniformChannelFlagLocation, colorChannel.R, colorChannel.G, colorChannel.B, colorChannel.A);
                  }
                  this.gl.activeTexture(this.gl.TEXTURE0);
                  this.gl.bindTexture(this.gl.TEXTURE_2D, textureId);
                  this.gl.uniform1i(shaderSet.samplerTexture0Location, 0);
                  this.gl.uniformMatrix4fv(shaderSet.uniformMatrixLocation, false, matrix4x4.getArray());
                  this.gl.uniform4f(shaderSet.uniformBaseColorLocation, baseColor.R, baseColor.G, baseColor.B, baseColor.A);
                  this.gl.uniform4f(shaderSet.uniformCutRectLocation, cutArr[0], cutArr[1], cutArr[2], cutArr[3]);
              }
              if (bufferData.index == null) {
                  bufferData.index = this.gl.createBuffer();
              }
              this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, bufferData.index);
              this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, indexArray, this.gl.DYNAMIC_DRAW);
              this.gl.blendFuncSeparate(SRC_COLOR, DST_COLOR, SRC_ALPHA, DST_ALPHA);
          }
          releaseShaderProgram() {
              for (let i = 0; i < this._shaderSets.getSize(); i++) {
                  this.gl.deleteProgram(this._shaderSets.at(i).shaderProgram);
                  this._shaderSets.at(i).shaderProgram = null;
                  this._shaderSets.set(i, void 0);
                  this._shaderSets.set(i, null);
              }
          }
          generateShaders() {
              for (let i = 0; i < shaderCount; i++) {
                  this._shaderSets.pushBack(new CubismShaderSet());
              }
              this._shaderSets.at(0).shaderProgram = this.loadShaderProgram(Live2DCubismFramework.vertexShaderSrcSetupMask, Live2DCubismFramework.fragmentShaderSrcsetupMask);
              this._shaderSets.at(1).shaderProgram = this.loadShaderProgram(Live2DCubismFramework.vertexShaderSrc, Live2DCubismFramework.fragmentShaderSrcPremultipliedAlpha);
              this._shaderSets.at(2).shaderProgram = this.loadShaderProgram(Live2DCubismFramework.vertexShaderSrcMasked, Live2DCubismFramework.fragmentShaderSrcMaskPremultipliedAlpha);
              this._shaderSets.at(3).shaderProgram = this.loadShaderProgram(Live2DCubismFramework.vertexShaderSrcMasked, Live2DCubismFramework.fragmentShaderSrcMaskInvertedPremultipliedAlpha);
              this._shaderSets.at(4).shaderProgram = this._shaderSets.at(1).shaderProgram;
              this._shaderSets.at(5).shaderProgram = this._shaderSets.at(2).shaderProgram;
              this._shaderSets.at(6).shaderProgram = this._shaderSets.at(3).shaderProgram;
              this._shaderSets.at(7).shaderProgram = this._shaderSets.at(1).shaderProgram;
              this._shaderSets.at(8).shaderProgram = this._shaderSets.at(2).shaderProgram;
              this._shaderSets.at(9).shaderProgram = this._shaderSets.at(3).shaderProgram;
              this._shaderSets.at(0).attributePositionLocation = this.gl.getAttribLocation(this._shaderSets.at(0).shaderProgram, 'a_position');
              this._shaderSets.at(0).attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets.at(0).shaderProgram, 'a_texCoord');
              this._shaderSets.at(0).samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets.at(0).shaderProgram, 's_texture0');
              this._shaderSets.at(0).uniformClipMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(0).shaderProgram, 'u_clipMatrix');
              this._shaderSets.at(0).uniformChannelFlagLocation = this.gl.getUniformLocation(this._shaderSets.at(0).shaderProgram, 'u_channelFlag');
              this._shaderSets.at(0).uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets.at(0).shaderProgram, 'u_baseColor');
              this._shaderSets.at(0).uniformCutRectLocation = this.gl.getUniformLocation(this._shaderSets.at(0).shaderProgram, 'u_cutRect');
              this._shaderSets.at(1).attributePositionLocation = this.gl.getAttribLocation(this._shaderSets.at(1).shaderProgram, 'a_position');
              this._shaderSets.at(1).attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets.at(1).shaderProgram, 'a_texCoord');
              this._shaderSets.at(1).samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets.at(1).shaderProgram, 's_texture0');
              this._shaderSets.at(1).uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(1).shaderProgram, 'u_matrix');
              this._shaderSets.at(1).uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets.at(1).shaderProgram, 'u_baseColor');
              this._shaderSets.at(1).uniformCutRectLocation = this.gl.getUniformLocation(this._shaderSets.at(1).shaderProgram, 'u_cutRect');
              this._shaderSets.at(2).attributePositionLocation = this.gl.getAttribLocation(this._shaderSets.at(2).shaderProgram, 'a_position');
              this._shaderSets.at(2).attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets.at(2).shaderProgram, 'a_texCoord');
              this._shaderSets.at(2).samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets.at(2).shaderProgram, 's_texture0');
              this._shaderSets.at(2).samplerTexture1Location = this.gl.getUniformLocation(this._shaderSets.at(2).shaderProgram, 's_texture1');
              this._shaderSets.at(2).uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(2).shaderProgram, 'u_matrix');
              this._shaderSets.at(2).uniformClipMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(2).shaderProgram, 'u_clipMatrix');
              this._shaderSets.at(2).uniformChannelFlagLocation = this.gl.getUniformLocation(this._shaderSets.at(2).shaderProgram, 'u_channelFlag');
              this._shaderSets.at(2).uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets.at(2).shaderProgram, 'u_baseColor');
              this._shaderSets.at(2).uniformCutRectLocation = this.gl.getUniformLocation(this._shaderSets.at(2).shaderProgram, 'u_cutRect');
              this._shaderSets.at(3).attributePositionLocation = this.gl.getAttribLocation(this._shaderSets.at(3).shaderProgram, 'a_position');
              this._shaderSets.at(3).attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets.at(3).shaderProgram, 'a_texCoord');
              this._shaderSets.at(3).samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets.at(3).shaderProgram, 's_texture0');
              this._shaderSets.at(3).samplerTexture1Location = this.gl.getUniformLocation(this._shaderSets.at(3).shaderProgram, 's_texture1');
              this._shaderSets.at(3).uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(3).shaderProgram, 'u_matrix');
              this._shaderSets.at(3).uniformClipMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(3).shaderProgram, 'u_clipMatrix');
              this._shaderSets.at(3).uniformChannelFlagLocation = this.gl.getUniformLocation(this._shaderSets.at(3).shaderProgram, 'u_channelFlag');
              this._shaderSets.at(3).uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets.at(3).shaderProgram, 'u_baseColor');
              this._shaderSets.at(3).uniformCutRectLocation = this.gl.getUniformLocation(this._shaderSets.at(3).shaderProgram, 'u_cutRect');
              this._shaderSets.at(4).attributePositionLocation = this.gl.getAttribLocation(this._shaderSets.at(4).shaderProgram, 'a_position');
              this._shaderSets.at(4).attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets.at(4).shaderProgram, 'a_texCoord');
              this._shaderSets.at(4).samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets.at(4).shaderProgram, 's_texture0');
              this._shaderSets.at(4).uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(4).shaderProgram, 'u_matrix');
              this._shaderSets.at(4).uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets.at(4).shaderProgram, 'u_baseColor');
              this._shaderSets.at(4).uniformCutRectLocation = this.gl.getUniformLocation(this._shaderSets.at(4).shaderProgram, 'u_cutRect');
              this._shaderSets.at(5).attributePositionLocation = this.gl.getAttribLocation(this._shaderSets.at(5).shaderProgram, 'a_position');
              this._shaderSets.at(5).attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets.at(5).shaderProgram, 'a_texCoord');
              this._shaderSets.at(5).samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets.at(5).shaderProgram, 's_texture0');
              this._shaderSets.at(5).samplerTexture1Location = this.gl.getUniformLocation(this._shaderSets.at(5).shaderProgram, 's_texture1');
              this._shaderSets.at(5).uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(5).shaderProgram, 'u_matrix');
              this._shaderSets.at(5).uniformClipMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(5).shaderProgram, 'u_clipMatrix');
              this._shaderSets.at(5).uniformChannelFlagLocation = this.gl.getUniformLocation(this._shaderSets.at(5).shaderProgram, 'u_channelFlag');
              this._shaderSets.at(5).uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets.at(5).shaderProgram, 'u_baseColor');
              this._shaderSets.at(5).uniformCutRectLocation = this.gl.getUniformLocation(this._shaderSets.at(5).shaderProgram, 'u_cutRect');
              this._shaderSets.at(6).attributePositionLocation = this.gl.getAttribLocation(this._shaderSets.at(6).shaderProgram, 'a_position');
              this._shaderSets.at(6).attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets.at(6).shaderProgram, 'a_texCoord');
              this._shaderSets.at(6).samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets.at(6).shaderProgram, 's_texture0');
              this._shaderSets.at(6).samplerTexture1Location = this.gl.getUniformLocation(this._shaderSets.at(6).shaderProgram, 's_texture1');
              this._shaderSets.at(6).uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(6).shaderProgram, 'u_matrix');
              this._shaderSets.at(6).uniformClipMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(6).shaderProgram, 'u_clipMatrix');
              this._shaderSets.at(6).uniformChannelFlagLocation = this.gl.getUniformLocation(this._shaderSets.at(6).shaderProgram, 'u_channelFlag');
              this._shaderSets.at(6).uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets.at(6).shaderProgram, 'u_baseColor');
              this._shaderSets.at(6).uniformCutRectLocation = this.gl.getUniformLocation(this._shaderSets.at(6).shaderProgram, 'u_cutRect');
              this._shaderSets.at(7).attributePositionLocation = this.gl.getAttribLocation(this._shaderSets.at(7).shaderProgram, 'a_position');
              this._shaderSets.at(7).attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets.at(7).shaderProgram, 'a_texCoord');
              this._shaderSets.at(7).samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets.at(7).shaderProgram, 's_texture0');
              this._shaderSets.at(7).uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(7).shaderProgram, 'u_matrix');
              this._shaderSets.at(7).uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets.at(7).shaderProgram, 'u_baseColor');
              this._shaderSets.at(7).uniformCutRectLocation = this.gl.getUniformLocation(this._shaderSets.at(7).shaderProgram, 'u_cutRect');
              this._shaderSets.at(8).attributePositionLocation = this.gl.getAttribLocation(this._shaderSets.at(8).shaderProgram, 'a_position');
              this._shaderSets.at(8).attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets.at(8).shaderProgram, 'a_texCoord');
              this._shaderSets.at(8).samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets.at(8).shaderProgram, 's_texture0');
              this._shaderSets.at(8).samplerTexture1Location = this.gl.getUniformLocation(this._shaderSets.at(8).shaderProgram, 's_texture1');
              this._shaderSets.at(8).uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(8).shaderProgram, 'u_matrix');
              this._shaderSets.at(8).uniformClipMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(8).shaderProgram, 'u_clipMatrix');
              this._shaderSets.at(8).uniformChannelFlagLocation = this.gl.getUniformLocation(this._shaderSets.at(8).shaderProgram, 'u_channelFlag');
              this._shaderSets.at(8).uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets.at(8).shaderProgram, 'u_baseColor');
              this._shaderSets.at(8).uniformCutRectLocation = this.gl.getUniformLocation(this._shaderSets.at(8).shaderProgram, 'u_cutRect');
              this._shaderSets.at(9).attributePositionLocation = this.gl.getAttribLocation(this._shaderSets.at(9).shaderProgram, 'a_position');
              this._shaderSets.at(9).attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets.at(9).shaderProgram, 'a_texCoord');
              this._shaderSets.at(9).samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets.at(9).shaderProgram, 's_texture0');
              this._shaderSets.at(9).samplerTexture1Location = this.gl.getUniformLocation(this._shaderSets.at(9).shaderProgram, 's_texture1');
              this._shaderSets.at(9).uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(9).shaderProgram, 'u_matrix');
              this._shaderSets.at(9).uniformClipMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(9).shaderProgram, 'u_clipMatrix');
              this._shaderSets.at(9).uniformChannelFlagLocation = this.gl.getUniformLocation(this._shaderSets.at(9).shaderProgram, 'u_channelFlag');
              this._shaderSets.at(9).uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets.at(9).shaderProgram, 'u_baseColor');
              this._shaderSets.at(9).uniformCutRectLocation = this.gl.getUniformLocation(this._shaderSets.at(9).shaderProgram, 'u_cutRect');
          }
          loadShaderProgram(vertexShaderSource, fragmentShaderSource) {
              let shaderProgram = this.gl.createProgram();
              let vertShader = this.compileShaderSource(this.gl.VERTEX_SHADER, vertexShaderSource);
              if (!vertShader) {
                  console.error('Vertex shader compile error!', vertShader);
                  return null;
              }
              let fragShader = this.compileShaderSource(this.gl.FRAGMENT_SHADER, fragmentShaderSource);
              if (!fragShader) {
                  console.error('Vertex shader compile error!', fragShader);
                  return null;
              }
              this.gl.attachShader(shaderProgram, vertShader);
              this.gl.attachShader(shaderProgram, fragShader);
              this.gl.linkProgram(shaderProgram);
              const linkStatus = this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS);
              if (!linkStatus) {
                  console.error('Failed to link program: {0}', shaderProgram);
                  this.gl.deleteShader(vertShader);
                  vertShader = null;
                  this.gl.deleteShader(fragShader);
                  fragShader = null;
                  if (shaderProgram) {
                      this.gl.deleteProgram(shaderProgram);
                      shaderProgram = null;
                  }
                  return null;
              }
              this.gl.deleteShader(vertShader);
              this.gl.deleteShader(fragShader);
              return shaderProgram;
          }
          compileShaderSource(shaderType, shaderSource) {
              const source = shaderSource;
              const shader = this.gl.createShader(shaderType);
              this.gl.shaderSource(shader, source);
              this.gl.compileShader(shader);
              if (!shader) {
                  const log = this.gl.getShaderInfoLog(shader);
                  console.error('Shader compile log: {0} ', log);
              }
              const status = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
              if (!status) {
                  this.gl.deleteShader(shader);
                  return null;
              }
              return shader;
          }
          get gl() {
              return CubismShader_Laya.gl;
          }
      }
      Live2DCubismFramework.CubismShader_Laya = CubismShader_Laya;
      class CubismShaderSet {
      }
      Live2DCubismFramework.CubismShaderSet = CubismShaderSet;
      let ShaderNames;
      (function (ShaderNames) {
          ShaderNames[ShaderNames["ShaderNames_SetupMask"] = 0] = "ShaderNames_SetupMask";
          ShaderNames[ShaderNames["ShaderNames_NormalPremultipliedAlpha"] = 1] = "ShaderNames_NormalPremultipliedAlpha";
          ShaderNames[ShaderNames["ShaderNames_NormalMaskedPremultipliedAlpha"] = 2] = "ShaderNames_NormalMaskedPremultipliedAlpha";
          ShaderNames[ShaderNames["ShaderNames_NomralMaskedInvertedPremultipliedAlpha"] = 3] = "ShaderNames_NomralMaskedInvertedPremultipliedAlpha";
          ShaderNames[ShaderNames["ShaderNames_AddPremultipliedAlpha"] = 4] = "ShaderNames_AddPremultipliedAlpha";
          ShaderNames[ShaderNames["ShaderNames_AddMaskedPremultipliedAlpha"] = 5] = "ShaderNames_AddMaskedPremultipliedAlpha";
          ShaderNames[ShaderNames["ShaderNames_AddMaskedPremultipliedAlphaInverted"] = 6] = "ShaderNames_AddMaskedPremultipliedAlphaInverted";
          ShaderNames[ShaderNames["ShaderNames_MultPremultipliedAlpha"] = 7] = "ShaderNames_MultPremultipliedAlpha";
          ShaderNames[ShaderNames["ShaderNames_MultMaskedPremultipliedAlpha"] = 8] = "ShaderNames_MultMaskedPremultipliedAlpha";
          ShaderNames[ShaderNames["ShaderNames_MultMaskedPremultipliedAlphaInverted"] = 9] = "ShaderNames_MultMaskedPremultipliedAlphaInverted";
      })(ShaderNames = Live2DCubismFramework.ShaderNames || (Live2DCubismFramework.ShaderNames = {}));
      Live2DCubismFramework.vertexShaderSrcSetupMask = 'attribute vec4     a_position;' +
          'attribute vec2     a_texCoord;' +
          'varying vec2       v_texCoord;' +
          'varying vec4       v_myPos;' +
          'uniform mat4       u_clipMatrix;' +
          'void main()' +
          '{' +
          '   gl_Position = u_clipMatrix * a_position;' +
          '   v_myPos = u_clipMatrix * a_position;' +
          '   v_texCoord = a_texCoord;' +
          '   v_texCoord.y = 1.0 - v_texCoord.y;' +
          '}';
      Live2DCubismFramework.fragmentShaderSrcsetupMask = 'precision mediump float;' +
          'varying vec2       v_texCoord;' +
          'varying vec4       v_myPos;' +
          'uniform vec4       u_baseColor;' +
          'uniform vec4       u_channelFlag;' +
          'uniform sampler2D  s_texture0;' +
          'void main()' +
          '{' +
          '   float isInside = ' +
          '       step(u_baseColor.x, v_myPos.x/v_myPos.w)' +
          '       * step(u_baseColor.y, v_myPos.y/v_myPos.w)' +
          '       * step(v_myPos.x/v_myPos.w, u_baseColor.z)' +
          '       * step(v_myPos.y/v_myPos.w, u_baseColor.w);' +
          '   gl_FragColor = u_channelFlag * texture2D(s_texture0, v_texCoord).a * isInside;' +
          '}';
      Live2DCubismFramework.vertexShaderSrc = 'attribute vec4     a_position;' +
          'attribute vec2     a_texCoord;' +
          'varying vec2       v_texCoord;' +
          'uniform mat4       u_matrix;' +
          'void main()' +
          '{' +
          '   gl_Position = u_matrix * a_position;' +
          '   v_texCoord = a_texCoord;' +
          '   v_texCoord.y = 1.0 - v_texCoord.y;' +
          '}';
      Live2DCubismFramework.vertexShaderSrcMasked = 'attribute vec4     a_position;' +
          'attribute vec2     a_texCoord;' +
          'varying vec2       v_texCoord;' +
          'varying vec4       v_clipPos;' +
          'uniform mat4       u_matrix;' +
          'uniform mat4       u_clipMatrix;' +
          'void main()' +
          '{' +
          '   gl_Position = u_matrix * a_position;' +
          '   v_clipPos = u_clipMatrix * a_position;' +
          '   v_texCoord = a_texCoord;' +
          '   v_texCoord.y = 1.0 - v_texCoord.y;' +
          '}';
      Live2DCubismFramework.fragmentShaderSrcPremultipliedAlpha = `precision mediump float;
    varying vec2       v_texCoord; 
    uniform vec4       u_baseColor;
    uniform sampler2D  s_texture0;
    uniform vec4       u_cutRect;
    void main()
    {
      if(gl_FragCoord.x<u_cutRect.x)discard;
      if(gl_FragCoord.y<u_cutRect.y)discard;
      if(gl_FragCoord.x>u_cutRect.z)discard;
      if(gl_FragCoord.y>u_cutRect.w)discard;
      gl_FragColor = texture2D(s_texture0 , v_texCoord) * u_baseColor;
    }`;
      Live2DCubismFramework.fragmentShaderSrcMaskPremultipliedAlpha = 'precision mediump float;' +
          'varying vec2       v_texCoord;' +
          'varying vec4       v_clipPos;' +
          'uniform vec4       u_baseColor;' +
          'uniform vec4       u_channelFlag;' +
          'uniform sampler2D  s_texture0;' +
          'uniform sampler2D  s_texture1;' +
          'uniform vec4       u_cutRect;' +
          'void main()' +
          '{' +
          'if(gl_FragCoord.x<u_cutRect.x)discard;' +
          'if(gl_FragCoord.y<u_cutRect.y)discard;' +
          'if(gl_FragCoord.x>u_cutRect.z)discard;' +
          'if(gl_FragCoord.y>u_cutRect.w)discard;' +
          '   vec4 col_formask = texture2D(s_texture0 , v_texCoord) * u_baseColor;' +
          '   vec4 clipMask = (1.0 - texture2D(s_texture1, v_clipPos.xy / v_clipPos.w)) * u_channelFlag;' +
          '   float maskVal = clipMask.r + clipMask.g + clipMask.b + clipMask.a;' +
          '   col_formask = col_formask * maskVal;' +
          '   gl_FragColor = col_formask;' +
          '}';
      Live2DCubismFramework.fragmentShaderSrcMaskInvertedPremultipliedAlpha = 'precision mediump float;' +
          'varying vec2 v_texCoord;' +
          'varying vec4 v_clipPos;' +
          'uniform sampler2D s_texture0;' +
          'uniform sampler2D s_texture1;' +
          'uniform vec4 u_channelFlag;' +
          'uniform vec4 u_baseColor;' +
          'uniform vec4 u_cutRect;' +
          'void main()' +
          '{' +
          'if(gl_FragCoord.x<u_cutRect.x)discard;' +
          'if(gl_FragCoord.y<u_cutRect.y)discard;' +
          'if(gl_FragCoord.x>u_cutRect.z)discard;' +
          'if(gl_FragCoord.y>u_cutRect.w)discard;' +
          'vec4 col_formask = texture2D(s_texture0, v_texCoord) * u_baseColor;' +
          'vec4 clipMask = (1.0 - texture2D(s_texture1, v_clipPos.xy / v_clipPos.w)) * u_channelFlag;' +
          'float maskVal = clipMask.r + clipMask.g + clipMask.b + clipMask.a;' +
          'col_formask = col_formask * (1.0 - maskVal);' +
          'gl_FragColor = col_formask;' +
          '}';
      class CubismRenderer_WebGL extends CubismRenderer$1 {
          constructor() {
              super();
              this._cutRect = [0, 0, 0, 0];
              this._isPremultipliedAlpha = true;
              this._clippingContextBufferForMask = null;
              this._clippingContextBufferForDraw = null;
              this._clippingManager = new CubismClippingManager_WebGL();
              this.firstDraw = true;
              this._textures = new csmMap$2();
              this._sortedDrawableIndexList = new csmVector$c();
              this._bufferData = {
                  vertex: null,
                  uv: null,
                  index: null
              };
              this._textures.prepareCapacity(32, true);
          }
          getCilpRect() {
              return this._cutRect;
          }
          setClipRect(minx, miny, maxx, maxy) {
              this._cutRect[0] = minx * Laya.Laya.stage.clientScaleX;
              this._cutRect[3] = Laya.Browser.mainCanvas.height - miny * Laya.Laya.stage.clientScaleY;
              this._cutRect[2] = maxx * Laya.Laya.stage.clientScaleX;
              this._cutRect[1] = Laya.Browser.mainCanvas.height - maxy * Laya.Laya.stage.clientScaleY;
          }
          initialize(model) {
              if (model.isUsingMasking()) {
                  this._clippingManager = new CubismClippingManager_WebGL();
                  this._clippingManager.initialize(model, model.getDrawableCount(), model.getDrawableMasks(), model.getDrawableMaskCounts());
              }
              this._sortedDrawableIndexList.resize(model.getDrawableCount(), 0);
              super.initialize(model);
          }
          bindTexture(modelTextureNo, glTexture) {
              this._textures.setValue(modelTextureNo, glTexture);
          }
          getBindedTextures() {
              return this._textures;
          }
          setClippingMaskBufferSize(size) {
              this._clippingManager.release();
              this._clippingManager = void 0;
              this._clippingManager = null;
              this._clippingManager = new CubismClippingManager_WebGL();
              this._clippingManager.setClippingMaskBufferSize(size);
              this._clippingManager.initialize(this.getModel(), this.getModel().getDrawableCount(), this.getModel().getDrawableMasks(), this.getModel().getDrawableMaskCounts());
          }
          getClippingMaskBufferSize() {
              return this._clippingManager.getClippingMaskBufferSize();
          }
          release() {
              this.owner = null;
              this._clippingManager.release();
              this._clippingManager = void 0;
              this._clippingManager = null;
              this.gl.deleteBuffer(this._bufferData.vertex);
              this._bufferData.vertex = null;
              this.gl.deleteBuffer(this._bufferData.uv);
              this._bufferData.uv = null;
              this.gl.deleteBuffer(this._bufferData.index);
              this._bufferData.index = null;
              this._bufferData = null;
              this._textures = null;
          }
          doDrawModel() {
              if (this._clippingManager != null) {
                  this.preDraw();
                  this._clippingManager.setupClippingContext(this.getModel(), this);
              }
              this.preDraw();
              const drawableCount = this.getModel().getDrawableCount();
              const renderOrder = this.getModel().getDrawableRenderOrders();
              for (let i = 0; i < drawableCount; ++i) {
                  const order = renderOrder[i];
                  this._sortedDrawableIndexList.set(order, i);
              }
              for (let i = 0; i < drawableCount; ++i) {
                  const drawableIndex = this._sortedDrawableIndexList.at(i);
                  if (!this.getModel().getDrawableDynamicFlagIsVisible(drawableIndex)) {
                      continue;
                  }
                  this.setClippingContextBufferForDraw(this._clippingManager != null
                      ? this._clippingManager
                          .getClippingContextListForDraw()
                          .at(drawableIndex)
                      : null);
                  this.setIsCulling(this.getModel().getDrawableCulling(drawableIndex));
                  this.drawMesh(this.getModel().getDrawableTextureIndices(drawableIndex), this.getModel().getDrawableVertexIndexCount(drawableIndex), this.getModel().getDrawableVertexCount(drawableIndex), this.getModel().getDrawableVertexIndices(drawableIndex), this.getModel().getDrawableVertices(drawableIndex), this.getModel().getDrawableVertexUvs(drawableIndex), this.getModel().getDrawableOpacity(drawableIndex), this.getModel().getDrawableBlendMode(drawableIndex), this.getModel().getDrawableInvertedMaskBit(drawableIndex));
              }
          }
          drawMesh(textureNo, indexCount, vertexCount, indexArray, vertexArray, uvArray, opacity, colorBlendMode, invertedMask) {
              if (this.isCulling()) {
                  this.gl.enable(this.gl.CULL_FACE);
              }
              else {
                  this.gl.disable(this.gl.CULL_FACE);
              }
              this.gl.frontFace(this.gl.CCW);
              const modelColorRGBA = this.getModelColor();
              if (this.getClippingContextBufferForMask() == null) {
                  modelColorRGBA.A *= opacity;
                  if (this.isPremultipliedAlpha()) {
                      modelColorRGBA.R *= modelColorRGBA.A;
                      modelColorRGBA.G *= modelColorRGBA.A;
                      modelColorRGBA.B *= modelColorRGBA.A;
                  }
              }
              let drawtexture = this._textures.getValue(textureNo);
              if (!drawtexture) {
                  console.log("webglTexture lost!!", "color:red");
                  drawtexture = null;
              }
              CubismShader_Laya.getInstance().setupShaderProgram(this, drawtexture, vertexCount, vertexArray, indexArray, uvArray, this._bufferData, opacity, colorBlendMode, modelColorRGBA, this.isPremultipliedAlpha(), this.getMvpMatrix(), invertedMask, this._cutRect);
              this.gl.drawElements(this.gl.TRIANGLES, indexCount, this.gl.UNSIGNED_SHORT, 0);
              Laya.Stat.renderBatches++;
              this.gl.useProgram(null);
              this.setClippingContextBufferForDraw(null);
              this.setClippingContextBufferForMask(null);
          }
          static doStaticRelease() {
              CubismShader_Laya.deleteInstance();
          }
          preDraw() {
              if (this.firstDraw) {
                  this.firstDraw = false;
                  this._anisortopy =
                      this.gl.getExtension('EXT_texture_filter_anisotropic') ||
                          this.gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic') ||
                          this.gl.getExtension('MOZ_EXT_texture_filter_anisotropic');
              }
              this.gl.disable(this.gl.SCISSOR_TEST);
              this.gl.disable(this.gl.STENCIL_TEST);
              this.gl.disable(this.gl.DEPTH_TEST);
              this.gl.frontFace(this.gl.CW);
              this.gl.enable(this.gl.BLEND);
              this.gl.colorMask(true, true, true, true);
              this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
              this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
          }
          setClippingContextBufferForMask(clip) {
              this._clippingContextBufferForMask = clip;
          }
          getClippingContextBufferForMask() {
              return this._clippingContextBufferForMask;
          }
          setClippingContextBufferForDraw(clip) {
              this._clippingContextBufferForDraw = clip;
          }
          getClippingContextBufferForDraw() {
              return this._clippingContextBufferForDraw;
          }
          get gl() {
              return CubismShader_Laya.gl;
          }
      }
      Live2DCubismFramework.CubismRenderer_WebGL = CubismRenderer_WebGL;
      CubismRenderer$1.staticRelease = () => {
          CubismRenderer_WebGL.doStaticRelease();
      };
  })(Live2DCubismFramework$A || (Live2DCubismFramework$A = {}));

  class Live2DConfig {
      constructor() {
      }
  }
  Live2DConfig.debugMode = false;

  var CubismRenderer_WebGL = Live2DCubismFramework$A.CubismRenderer_WebGL;
  var CubismModelUserData = Live2DCubismFramework$x.CubismModelUserData;
  var Constant$1 = Live2DCubismFramework$9.Constant;
  var CubismMatrix44$3 = Live2DCubismFramework$7.CubismMatrix44;
  var CubismPose = Live2DCubismFramework$s.CubismPose;
  var CubismMoc = Live2DCubismFramework$o.CubismMoc;
  var CubismBreath = Live2DCubismFramework$t.CubismBreath;
  var CubismEyeBlink = Live2DCubismFramework$u.CubismEyeBlink;
  var BreathParameterData = Live2DCubismFramework$t.BreathParameterData;
  var CubismModelSettingJson = Live2DCubismFramework$m.CubismModelSettingJson;
  var ACubismMotion$3 = Live2DCubismFramework$c.ACubismMotion;
  var csmVector$d = Live2DCubismFramework$3.csmVector;
  var CubismMotion = Live2DCubismFramework$j.CubismMotion;
  var CubismPhysics = Live2DCubismFramework$r.CubismPhysics;
  var CubismExpressionMotion = Live2DCubismFramework$k.CubismExpressionMotion;
  var CubismModelMatrix = Live2DCubismFramework$g.CubismModelMatrix;
  var CubismFramework$9 = Live2DCubismFramework$9.CubismFramework;
  var csmMap$3 = Live2DCubismFramework$2.csmMap;
  var CubismDefaultParameterId = Live2DCubismFramework$v;
  var CubismMotionManager = Live2DCubismFramework$f.CubismMotionManager;
  var CubismTargetPoint = Live2DCubismFramework$y.CubismTargetPoint;
  class Live2DModel extends Laya.Sprite {
      constructor() {
          super();
          this._expressions = new csmMap$3();
          this._motions = new csmMap$3();
          this._initialized = true;
          this.isAutoPlay = true;
          this._needChanged = true;
          this._fileMap = {};
          this.mouseThrough = false;
          this.mouseEnabled = true;
          this._userTimeSeconds = 0;
          this._lipsync = false;
          this._lastMat = new Laya.Matrix();
          this.customRenderEnable = true;
          this.scaleAndTran = new CubismMatrix44$3();
          this.projection = new CubismMatrix44$3();
          this._motionManager = new CubismMotionManager();
          this._motionManager.setEventCallback(Live2DModel.cubismDefaultMotionEventCallback, this);
          this._expressionManager = new CubismMotionManager();
          this._dragManager = new CubismTargetPoint();
          this._eyeBlinkIds = new csmVector$d();
          this._lipSyncIds = new csmVector$d();
          this._idParamAngleX = CubismFramework$9.getIdManager().getId(CubismDefaultParameterId.ParamAngleX);
          this._idParamAngleY = CubismFramework$9.getIdManager().getId(CubismDefaultParameterId.ParamAngleY);
          this._idParamAngleZ = CubismFramework$9.getIdManager().getId(CubismDefaultParameterId.ParamAngleZ);
          this._idParamEyeBallX = CubismFramework$9.getIdManager().getId(CubismDefaultParameterId.ParamEyeBallX);
          this._idParamEyeBallY = CubismFramework$9.getIdManager().getId(CubismDefaultParameterId.ParamEyeBallY);
          this._idParamBodyAngleX = CubismFramework$9.getIdManager().getId(CubismDefaultParameterId.ParamBodyAngleX);
          Laya.Laya.stage.on(Laya.Event.RESIZE, this, this._onResize);
      }
      _onResize() {
          this._needChanged = true;
      }
      loadModel(buffer) {
          this._moc = CubismMoc.create(buffer);
          this._model = this._moc.createModel();
          this._model.saveParameters();
          if (this._moc == null || this._model == null) {
              console.warn('Failed to CreateModel().');
              return;
          }
          this._modelMatrix = new CubismModelMatrix(this._model.getCanvasWidth(), this._model.getCanvasHeight());
          this.modelWidth = this._model.getModel().canvasinfo.CanvasWidth;
          this.modelHeight = this._model.getModel().canvasinfo.CanvasHeight;
          this.modelOriginX = this._model.getModel().canvasinfo.CanvasOriginX;
          this.modelOriginY = this._model.getModel().canvasinfo.CanvasOriginY;
          this._needChanged = true;
          this.width = this.modelWidth;
          this.height = this.modelHeight;
      }
      createSetting(buffer) {
          this._initialized = false;
          this.setting = new CubismModelSettingJson(buffer, buffer.byteLength);
      }
      loadMotion(buffer, size, onFinishedMotionHandler) {
          return CubismMotion.create(buffer, size, onFinishedMotionHandler);
      }
      loadExpression(buffer, size, name) {
          let motion = CubismExpressionMotion.create(buffer, size);
          if (this._expressions.getValue(name) != null) {
              ACubismMotion$3.delete(this._expressions.getValue(name));
              this._expressions.setValue(name, null);
          }
          this._expressions.setValue(name, motion);
      }
      loadUserData(buffer, size) {
          this._modelUserData = CubismModelUserData.create(buffer, size);
      }
      loadPhysics(buffer, size) {
          this._physics = CubismPhysics.create(buffer, size);
      }
      loadPose(buffer, size) {
          this._pose = CubismPose.create(buffer, size);
      }
      setupEyeBlink() {
          if (this.setting.getEyeBlinkParameterCount() > 0) {
              this._eyeBlink = CubismEyeBlink.create(this.setting);
          }
      }
      setupBreath() {
          this._breath = CubismBreath.create();
          let breathParameters = new csmVector$d();
          breathParameters.pushBack(new BreathParameterData(this._idParamAngleX, 0.0, 15.0, 6.5345, 0.5));
          breathParameters.pushBack(new BreathParameterData(this._idParamAngleY, 0.0, 8.0, 3.5345, 0.5));
          breathParameters.pushBack(new BreathParameterData(this._idParamAngleZ, 0.0, 10.0, 5.5345, 0.5));
          breathParameters.pushBack(new BreathParameterData(this._idParamBodyAngleX, 0.0, 4.0, 15.5345, 0.5));
          breathParameters.pushBack(new BreathParameterData(CubismFramework$9.getIdManager().getId(CubismDefaultParameterId.ParamBreath), 0.0, 0.5, 3.2345, 0.5));
          this._breath.setParameters(breathParameters);
      }
      setupEyeBlinkIds() {
          let eyeBlinkIdCount = this.setting.getEyeBlinkParameterCount();
          for (let i = 0; i < eyeBlinkIdCount; ++i) {
              this._eyeBlinkIds.pushBack(this.setting.getEyeBlinkParameterId(i));
          }
      }
      setupLipSyncIds() {
          let lipSyncIdCount = this.setting.getLipSyncParameterCount();
          for (let i = 0; i < lipSyncIdCount; ++i) {
              this._lipSyncIds.pushBack(this.setting.getLipSyncParameterId(i));
          }
      }
      setupLayout() {
          let layout = new csmMap$3();
          this.setting.getLayoutMap(layout);
          this._modelMatrix.setupFromLayout(layout);
      }
      loadCubismMotion() {
          this._model.saveParameters();
          this._allMotionCount = 0;
          let motionGroupCount = this.setting.getMotionGroupCount();
          if (motionGroupCount) {
              this._motionGroups = [];
              let group;
              for (let i = 0; i < motionGroupCount; i++) {
                  group = this.setting.getMotionGroupName(i);
                  this._motionGroups.push(group);
                  this._allMotionCount += this.setting.getMotionCount(group);
              }
              this._defaultGroup = this._motionGroups[0];
          }
      }
      loadMotionGroup() {
          let element;
          for (let i = 0; i < this._motionUrls.length; i++) {
              element = this._motionUrls[i];
              this.createMotion(element.name, element.url, element.key, element.index);
          }
      }
      createMotion(name, url, group, index) {
          let buffer = Laya.Laya.loader.getRes(url);
          if (!buffer || !(buffer instanceof ArrayBuffer)) {
              console.warn(`createMotion fail! filename: ${url}, name:${name},group:${group},index:${index}`);
              return;
          }
          let strs = url.split("/");
          let filename = strs[strs.length - 1].split(".")[0];
          this._fileMap[group + "_" + filename] = index;
          let tmpMotion = this.loadMotion(buffer, buffer.byteLength);
          let fadeTime = this.setting.getMotionFadeInTimeValue(group, index);
          if (fadeTime >= 0.0) {
              tmpMotion.setFadeInTime(fadeTime);
          }
          fadeTime = this.setting.getMotionFadeOutTimeValue(group, index);
          if (fadeTime >= 0.0) {
              tmpMotion.setFadeOutTime(fadeTime);
          }
          tmpMotion.setEffectIds(this._eyeBlinkIds, this._lipSyncIds);
          if (name) {
              if (this._motions.getValue(name) != null) {
                  ACubismMotion$3.delete(this._motions.getValue(name));
              }
              this._motions.setValue(name, tmpMotion);
          }
          if (Live2DConfig.debugMode) {
              console.log(`[APP]load motion: ${url} => [${group}_${index}]`);
          }
          return tmpMotion;
      }
      initModel(isPremultipliedAlpha = true) {
          this._motionManager.stopAllMotions();
          this._initialized = true;
          this.createRenderer();
          this.renderer.setClipRect(0, 0, Laya.Laya.stage.width, Laya.Laya.stage.height);
          this._texturePool = [];
          let element, texture, img;
          for (let index = 0; index < this._textureUrls.length; index++) {
              element = this._textureUrls[index];
              img = Laya.Laya.loader.getRes(element.url);
              texture = new Laya.Texture2D(img.width, img.height, Laya.TextureFormat.R8G8B8A8, true, false);
              texture.wrapModeU = Laya.WarpMode.Clamp;
              texture.wrapModeV = Laya.WarpMode.Clamp;
              texture.loadImageSource(img, isPremultipliedAlpha);
              texture._setCreateURL(img.src);
              if (!texture) {
                  console.warn("Texture load fail! url:" + element);
                  return;
              }
              this.renderer.bindTexture(index, texture._glTexture);
              texture.lock = true;
              this._texturePool[index] = texture;
          }
          this.renderer.setIsPremultipliedAlpha(isPremultipliedAlpha);
      }
      customRender(context, x, y) {
          let _cMat = context._curMat;
          if (this._lastMat.a != _cMat.a) {
              this._lastMat.a = _cMat.a;
              this._needChanged = true;
          }
          if (this._lastMat.d != _cMat.d) {
              this._lastMat.d = _cMat.d;
              this._needChanged = true;
          }
          if (_cMat.tx + _cMat.a * x != this._lastMat.tx) {
              this._lastMat.tx = _cMat.tx + _cMat.a * x;
              this._needChanged = true;
          }
          if (this._lastMat.ty != _cMat.ty + _cMat.d * y) {
              this._lastMat.ty = _cMat.ty + _cMat.d * y;
              this._needChanged = true;
          }
          this.refreshScaleAndTranM();
          context.addRenderObject(Live2DSubmit.create(this));
          context.breakNextMerge();
      }
      update(deltaTimeSeconds) {
          this._userTimeSeconds += deltaTimeSeconds;
          this._dragManager.update(deltaTimeSeconds);
          this._dragX = this._dragManager.getX();
          this._dragY = this._dragManager.getY();
          let motionUpdated = false;
          this._model.loadParameters();
          if (this._motionManager.isFinished()) {
              if (this.isAutoPlay) {
                  this.startRandomMotion(this._defaultGroup, 3);
              }
          }
          else {
              motionUpdated = this._motionManager.updateMotion(this._model, deltaTimeSeconds);
          }
          this._model.saveParameters();
          if (!motionUpdated) {
              if (this._eyeBlink != null) {
                  this._eyeBlink.updateParameters(this._model, deltaTimeSeconds);
              }
          }
          if (this._expressionManager != null) {
              this._expressionManager.updateMotion(this._model, deltaTimeSeconds);
          }
          this._model.addParameterValueById(this._idParamAngleX, this._dragX * 30);
          this._model.addParameterValueById(this._idParamAngleY, this._dragY * 30);
          this._model.addParameterValueById(this._idParamAngleZ, this._dragX * this._dragY * -30);
          this._model.addParameterValueById(this._idParamBodyAngleX, this._dragX * 10);
          this._model.addParameterValueById(this._idParamEyeBallX, this._dragX);
          this._model.addParameterValueById(this._idParamEyeBallY, this._dragY);
          if (this._breath != null) {
              this._breath.updateParameters(this._model, deltaTimeSeconds);
          }
          if (this._physics != null) {
              this._physics.evaluate(this._model, deltaTimeSeconds);
          }
          if (this._lipsync) {
              let value = 0;
              for (let i = 0; i < this._lipSyncIds.getSize(); ++i) {
                  this._model.addParameterValueById(this._lipSyncIds.at(i), value, 0.8);
              }
          }
          if (this._pose != null) {
              this._pose.updateParameters(this._model, deltaTimeSeconds);
          }
          this.mvpMatrix = this.scaleAndTran.clone();
          this.mvpMatrix.multiplyByMatrix(this.projection);
          this._model.update();
          this.renderer.setMvpMatrix(this.mvpMatrix);
          this._renderer.doDrawModel();
      }
      refreshScaleAndTranM() {
          if (!this._needChanged) {
              return;
          }
          this._needChanged = false;
          let width = Laya.Browser.mainCanvas.width;
          let height = Laya.Browser.mainCanvas.height;
          let scaleNum;
          if (this.modelHeight > this.modelWidth) {
              scaleNum = this.modelWidth * 2 / width;
          }
          else {
              scaleNum = this.modelHeight * 2 / width;
          }
          this.projection.scale(scaleNum, scaleNum * width / height);
          let a = this._lastMat.a, d = this._lastMat.d, x = this._lastMat.tx, y = this._lastMat.ty;
          this.scaleAndTran.scale(a, d);
          let canvasx = (x + a * (this.modelOriginX - this.pivotX)) * 2 / width - 1;
          let canvasy = 1 - (y + d * (this.modelOriginY - this.pivotY)) * 2 / height;
          this.scaleAndTran.translate(canvasx, canvasy);
      }
      set defaultGroup(group) {
          if (group != this._defaultGroup) {
              if (this._defaultGroup.indexOf(group) == -1) {
                  console.log("Can not find Motion Group:", group);
                  this._defaultGroup = group;
              }
          }
      }
      get defaultGroup() {
          return this._defaultGroup;
      }
      get renderer() {
          return this._renderer;
      }
      createRenderer() {
          if (this._renderer) {
              this.deleteRenderer();
          }
          this._renderer = new CubismRenderer_WebGL();
          this._renderer.initialize(this._model);
          this._renderer.owner = this;
      }
      deleteRenderer() {
          if (this._renderer != null) {
              this._renderer.release();
              this._renderer = null;
          }
      }
      getModel() {
          return this._model;
      }
      get motionManager() {
          return this._motionManager;
      }
      get expressionManager() {
          return this._expressionManager;
      }
      get physics() {
          return this._physics;
      }
      get dragManager() {
          return this._dragManager;
      }
      get allMotionCount() {
          return this._allMotionCount;
      }
      get lipsync() {
          return this._lipsync;
      }
      set lipsync(value) {
          this._lipsync = value;
      }
      setDragging(x, y) {
          let point = Live2DModel.TEMPPOINT.setTo(x, y);
          this.changeToRenderPoint(point);
          this._dragManager.set(point.x, point.y);
      }
      startMotion(group, no, priority, onFinishedMotionHandler) {
          if (priority == 3) {
              this._motionManager.setReservePriority(priority);
          }
          else if (!this._motionManager.reserveMotion(priority)) {
              console.warn("[APP]can't start motion.");
              return -1;
          }
          let motion = this.getMotion(group, no);
          let autoDelete = false;
          if (motion == null) {
              let motionFileName = this.setting.getMotionFileName(group, no);
              motion = this.createMotion(null, `${this._modelHomeDir}/${motionFileName}`, group, no);
              if (!motion) {
                  console.warn("[APP]can't start motion.");
                  return -1;
              }
              autoDelete = true;
          }
          else {
              motion.setFinishedMotionHandler(onFinishedMotionHandler);
          }
          if (Live2DConfig.debugMode) {
              console.log(`[APP]start motion: [${group}_${no}`);
          }
          return this._motionManager.startMotionPriority(motion, autoDelete, priority);
      }
      startMotionByName(group, filename, priority, onFinishedMotionHandler) {
          if (priority == 3) {
              this._motionManager.setReservePriority(priority);
          }
          else if (!this._motionManager.reserveMotion(priority)) {
              console.warn("[APP]can't start motion.");
              return -1;
          }
          let motion = this.getMotionByFileName(group, filename);
          if (motion == null) {
              console.warn("[APP]can't start motion.");
              return -1;
          }
          else {
              motion.setFinishedMotionHandler(onFinishedMotionHandler);
          }
          if (Live2DConfig.debugMode) {
              console.log(`[APP]start motion: [${group}_${filename}`);
          }
          return this._motionManager.startMotionPriority(motion, false, priority);
      }
      getMotion(group, index) {
          return this._motions.getValue(`${group}_${index}`);
      }
      getMotionByFileName(group, filename) {
          return this._motions.getValue(`${group}_${this._fileMap[group + "_" + filename]}`);
      }
      startRandomMotion(group, priority, onFinishedMotionHandler) {
          if (this.setting.getMotionCount(group) == 0) {
              return -1;
          }
          let no = Math.floor(Math.random() * this.setting.getMotionCount(group));
          return this.startMotion(group, no, priority, onFinishedMotionHandler);
      }
      getExpression(expressionId) {
          return this._expressions.getValue(expressionId);
      }
      setExpression(expressionId) {
          const motion = this.getExpression(expressionId);
          if (motion != null) {
              this._expressionManager.startMotionPriority(motion, false, 3);
          }
          else {
              console.warn(`[APP]expression[${expressionId}] is null`);
          }
      }
      setRandomExpression() {
          if (this._expressions.getSize() == 0) {
              return;
          }
          const no = Math.floor(Math.random() * this._expressions.getSize());
          for (let i = 0; i < this._expressions.getSize(); i++) {
              if (i == no) {
                  let name = this._expressions._keyValues[i].first;
                  this.setExpression(name);
                  return;
              }
          }
      }
      changeToRenderPoint(form, out = null) {
          if (!out) {
              out = form;
          }
          else {
              out.setTo(form.x, form.y);
          }
          let cheight = Laya.Browser.mainCanvas.height, cwidth = Laya.Browser.mainCanvas.width;
          out.x = out.x / Laya.Laya.stage.width * cwidth;
          out.y = out.y / Laya.Laya.stage.height * cheight;
          out.x = out.x * 2 / cwidth - 1;
          out.y = 1 - out.y * 2 / cheight;
          let tx = this.projection.invertTransformX(this.scaleAndTran.invertTransformX(out.x));
          let ty = this.projection.invertTransformY(this.scaleAndTran.invertTransformY(out.y));
          out.setTo(tx, ty);
          return out;
      }
      live2DHitTest(hitArenaName, x, y) {
          if (!this.hitTestPoint(x, y)) {
              return false;
          }
          let point = Live2DModel.TEMPPOINT.setTo(x, y);
          this.changeToRenderPoint(point);
          let count = this.setting.getHitAreasCount();
          for (let i = 0; i < count; i++) {
              if (this.setting.getHitAreaName(i) == hitArenaName) {
                  const drawId = this.setting.getHitAreaId(i);
                  return this.live2DIsHit(drawId, point.x, point.y);
              }
          }
          return false;
      }
      live2DIsHit(drawableId, pointX, pointY) {
          const drawIndex = this._model.getDrawableIndex(drawableId);
          if (drawIndex < 0) {
              return false;
          }
          const count = this._model.getDrawableVertexCount(drawIndex);
          const vertices = this._model.getDrawableVertices(drawIndex);
          let left = vertices[0];
          let right = vertices[0];
          let top = vertices[1];
          let bottom = vertices[1];
          for (let j = 1; j < count; ++j) {
              const x = vertices[Constant$1.vertexOffset + j * Constant$1.vertexStep];
              const y = vertices[Constant$1.vertexOffset + j * Constant$1.vertexStep + 1];
              if (x < left) {
                  left = x;
              }
              if (x > right) {
                  right = x;
              }
              if (y < top) {
                  top = y;
              }
              if (y > bottom) {
                  bottom = y;
              }
          }
          return left <= pointX && pointX <= right && top <= pointY && pointY <= bottom;
      }
      release() {
          if (this._motionManager != null) {
              this._motionManager.release();
              this._motionManager = null;
          }
          if (this._expressionManager != null) {
              this._expressionManager.release();
              this._expressionManager = null;
          }
          if (this._moc != null) {
              this._moc.deleteModel(this._model);
              this._moc.release();
              this._moc = null;
          }
          this._motionGroups = null;
          this._motionUrls = null;
          this._textureUrls = null;
          this._expressionNames = null;
          this._expressionUrls = null;
          this._modelMatrix = null;
          for (let i = 0; i < this._texturePool.length; i++) {
              let tex = this._texturePool[i];
              tex.destroy();
              Laya.Loader.clearRes(tex.url);
          }
          this._texturePool = null;
          CubismPose.delete(this._pose);
          CubismEyeBlink.delete(this._eyeBlink);
          CubismBreath.delete(this._breath);
          this._dragManager = null;
          CubismPhysics.delete(this._physics);
          CubismModelUserData.delete(this._modelUserData);
      }
      destroy(destroyTexture = true, destroyChildren) {
          if (this.destroyed)
              return;
          Laya.Laya.stage.off(Laya.Event.RESIZE, this, this._onResize);
          super.destroy(destroyChildren);
          this.release();
          this._pose = null;
          this._eyeBlink = null;
          this._breath = null;
          this._physics = null;
          this._modelUserData = null;
      }
      motionEventFired(eventValue) {
          this.event(Laya.Event.CHANGE, eventValue.s);
      }
      static cubismDefaultMotionEventCallback(caller, eventValue, customData) {
          customData.motionEventFired(eventValue);
      }
  }
  Live2DModel.TEMPPOINT = new Laya.Point();

  var LoadStep;
  (function (LoadStep) {
      LoadStep[LoadStep["LoadAssets"] = 0] = "LoadAssets";
      LoadStep[LoadStep["LoadModel"] = 1] = "LoadModel";
      LoadStep[LoadStep["WaitLoadModel"] = 2] = "WaitLoadModel";
      LoadStep[LoadStep["LoadExpression"] = 3] = "LoadExpression";
      LoadStep[LoadStep["WaitLoadExpression"] = 4] = "WaitLoadExpression";
      LoadStep[LoadStep["LoadPhysics"] = 5] = "LoadPhysics";
      LoadStep[LoadStep["WaitLoadPhysics"] = 6] = "WaitLoadPhysics";
      LoadStep[LoadStep["LoadPose"] = 7] = "LoadPose";
      LoadStep[LoadStep["WaitLoadPose"] = 8] = "WaitLoadPose";
      LoadStep[LoadStep["SetupEyeBlink"] = 9] = "SetupEyeBlink";
      LoadStep[LoadStep["SetupBreath"] = 10] = "SetupBreath";
      LoadStep[LoadStep["LoadUserData"] = 11] = "LoadUserData";
      LoadStep[LoadStep["WaitLoadUserData"] = 12] = "WaitLoadUserData";
      LoadStep[LoadStep["SetupEyeBlinkIds"] = 13] = "SetupEyeBlinkIds";
      LoadStep[LoadStep["SetupLipSyncIds"] = 14] = "SetupLipSyncIds";
      LoadStep[LoadStep["SetupLayout"] = 15] = "SetupLayout";
      LoadStep[LoadStep["LoadMotion"] = 16] = "LoadMotion";
      LoadStep[LoadStep["WaitLoadMotion"] = 17] = "WaitLoadMotion";
      LoadStep[LoadStep["CompleteInitialize"] = 18] = "CompleteInitialize";
      LoadStep[LoadStep["CompleteSetupModel"] = 19] = "CompleteSetupModel";
      LoadStep[LoadStep["LoadTexture"] = 20] = "LoadTexture";
      LoadStep[LoadStep["WaitLoadTexture"] = 21] = "WaitLoadTexture";
      LoadStep[LoadStep["CompleteSetup"] = 22] = "CompleteSetup";
  })(LoadStep || (LoadStep = {}));
  class Live2DLoader extends Laya.EventDispatcher {
      constructor() {
          super();
          this.textureCount = 0;
          this.jsonUrls = [];
      }
      loadZipAssets(resPath, filedName, dirName, complete = null) {
          this._model = new Live2DModel();
          this._model._modelHomeDir = this._modelHomeDir = dirName;
          this._completeHandler = complete;
          this.jsonUrls.push(`${dirName}/${dirName}.model3.json`);
          var THIS = this;
          Laya.Laya.loader.load(`${resPath}/${filedName}`, Laya.Handler.create(this, (buffer) => {
              let zip = new JSZip(buffer);
              let isloaded = THIS.loadModel3JsonByFiles(zip.files);
              if (isloaded) {
                  isloaded = THIS.setupModelByFiles(zip.files);
                  if (isloaded) {
                      THIS.loadCubismExpressionByFiles(zip.files);
                      THIS.loadCubismPhysicsByFiles(zip.files);
                      THIS.loadCubismPoseByFiles(zip.files);
                      THIS.loadDetailsinitByFiles(zip.files);
                      THIS.loadDetailsinit2ByFiles(zip.files);
                      THIS.loadTextureByFiles(zip);
                  }
              }
          }), null, Laya.Loader.BUFFER);
      }
      static btoa(input) {
          var str = String(input);
          for (var block, charCode, idx = 0, map = this.chars, output = ''; str.charAt(idx | 0) || (map = '=', idx % 1); output += map.charAt(63 & block >> 8 - idx % 1 * 8)) {
              charCode = str.charCodeAt(idx += 3 / 4);
              if (charCode > 0xFF) {
                  throw new Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
              }
              block = block << 8 | charCode;
          }
          return output;
      }
      loadTextureByFiles(zip) {
          let textureCount = this._setting.getTextureCount();
          this._model._textureUrls = [];
          let texturePath;
          var THIS = this;
          this.textureCount = textureCount;
          for (let i = 0; i < textureCount; i++) {
              texturePath = `${this._modelHomeDir}/${this._setting.getTextureFileName(i)}`;
              this._model._textureUrls.push({ url: texturePath, type: "nativeimage" });
              let file = zip.files[texturePath];
              if (file) {
                  let bytes = file.asArrayBuffer();
                  if (bytes) {
                      var image = new Laya.Laya.Browser.window.Image();
                      image.crossOrigin = "";
                      Laya.Laya.Loader.cacheRes(texturePath, image);
                      var onload = function (e) {
                          e.target.onerror = null;
                          e.target.onload = null;
                          THIS.checkTextureAllLoaded();
                      };
                      var onerror = function (e) {
                          e.target.onerror = null;
                          e.target.onload = null;
                      };
                      image.onerror = onerror;
                      image.onload = onload;
                      let binary = Laya.Laya.glTFBase64Tool.encode(bytes);
                      let pIndex = file.name.indexOf('.');
                      let type = file.name.substr(pIndex + 1);
                      let re = 'data:image/' + type + ';base64,';
                      image.src = re + binary;
                  }
              }
          }
      }
      checkTextureAllLoaded() {
          this.textureCount--;
          if (this.textureCount <= 0) {
              this._completeHandler && this._completeHandler.runWith([this._model, this]);
          }
      }
      loadDetailsinit2ByFiles(files) {
          this._model.setupEyeBlinkIds();
          this._model.setupLipSyncIds();
          this._model.setupLayout();
          this._model.loadCubismMotion();
          if (this._model.allMotionCount) {
              this.preMotionUrls();
              for (let i = 0; i < this._model._motionUrls.length; i++) {
                  const item = this._model._motionUrls[i];
                  let file = files[item.url];
                  if (file) {
                      let buffer = file.asArrayBuffer();
                      if (buffer) {
                          Laya.Laya.Loader.cacheRes(item.url, buffer);
                      }
                  }
              }
              this._model.loadMotionGroup();
              this._model._motionUrls = null;
          }
      }
      loadDetailsinitByFiles(files) {
          let isLoad = false;
          this._model.setupEyeBlink();
          this._model.setupBreath();
          let userDataFile = this._setting.getUserDataFile();
          if (userDataFile != '') {
              let url = `${this._modelHomeDir}/${userDataFile}`;
              this.jsonUrls.push(url);
              let file = files[url];
              if (file) {
                  let buffer = file.asArrayBuffer();
                  if (buffer) {
                      this._model.loadUserData(buffer, buffer.byteLength);
                      isLoad = true;
                  }
              }
          }
          return isLoad;
      }
      loadModel3JsonByFiles(files) {
          let isLoad = false;
          let file = files[this._modelHomeDir + "/" + this._modelHomeDir + ".model3.json"];
          if (file) {
              let buffer = file.asArrayBuffer();
              if (buffer) {
                  this._model.createSetting(buffer);
                  this._setting = this._model.setting;
                  this.state = LoadStep.LoadModel;
                  isLoad = true;
              }
          }
          return isLoad;
      }
      setupModelByFiles(files) {
          let isLoad = false;
          let modelFileName = this._setting.getModelFileName();
          let url = `${this._modelHomeDir}/${modelFileName}`;
          this.jsonUrls.push(url);
          let file = files[url];
          if (file) {
              let buffer = file.asArrayBuffer();
              this._model.loadModel(buffer);
              this.state = LoadStep.LoadExpression;
              isLoad = true;
          }
          else
              isLoad = true;
          return isLoad;
      }
      loadCubismExpressionByFiles(files) {
          let expressionCount = this._setting.getExpressionCount();
          if (expressionCount > 0) {
              this._model._expressionUrls = [];
              this._model._expressionNames = [];
              let url;
              for (let i = 0; i < expressionCount; i++) {
                  this._model._expressionNames.push(this._setting.getExpressionName(i));
                  url = `${this._modelHomeDir}/${this._setting.getExpressionFileName(i)}`;
                  this.jsonUrls.push(url);
                  this._model._expressionUrls.push(url);
              }
              this.state = LoadStep.WaitLoadExpression;
              for (let i = 0; i < expressionCount; i++) {
                  let file = files[this._model._expressionUrls[i]];
                  let buffer = file.asArrayBuffer();
                  if (!buffer) {
                      console.log(`[WARNNING]:${this._model._expressionUrls[i]} data load fail!`);
                  }
                  else
                      this._model.loadExpression(buffer, buffer.byteLength, this._model._expressionNames[i]);
              }
              this._model._expressionUrls = null;
          }
      }
      loadCubismPhysicsByFiles(files) {
          let physicsFileName = this._setting.getPhysicsFileName();
          if (physicsFileName != "") {
              let url = `${this._modelHomeDir}/${physicsFileName}`;
              this.jsonUrls.push(url);
              let file = files[url];
              if (file) {
                  let buffer = file.asArrayBuffer();
                  this._model.loadPhysics(buffer, buffer.byteLength);
              }
          }
      }
      loadCubismPoseByFiles(files) {
          let poseFileName = this._setting.getPoseFileName();
          if (poseFileName != '') {
              let url = `${this._modelHomeDir}/${poseFileName}`;
              this.jsonUrls.push(url);
              let file = files[url];
              if (file) {
                  let buffer = file.asArrayBuffer();
                  this._model.loadPose(buffer, buffer.byteLength);
              }
          }
      }
      loadAssets(dir, fileName, complete = null) {
          this._model = new Live2DModel();
          this._model._modelHomeDir = this._modelHomeDir = dir;
          this._completeHandler = complete;
          let url = `${dir}/${fileName}`;
          this.jsonUrls.push(url);
          Laya.Laya.loader.load(url, Laya.Handler.create(this, this._loadAssetsComplete), null, Laya.Loader.BUFFER);
      }
      _loadAssetsComplete(buffer) {
          if (!buffer) {
              console.error("loadAssets fail!");
              this._completeHandler && this._completeHandler.run();
              return;
          }
          this._model.createSetting(buffer);
          this._setting = this._model.setting;
          this.state = LoadStep.LoadModel;
          this.setupModel();
      }
      setupModel() {
          let modelFileName = this._setting.getModelFileName();
          if (modelFileName != '') {
              this.state = LoadStep.WaitLoadModel;
              let url = `${this._modelHomeDir}/${modelFileName}`;
              this.jsonUrls.push(url);
              Laya.Laya.loader.load(url, Laya.Handler.create(this, this._setupModelComplete), null, Laya.Loader.BUFFER);
          }
          else {
              console.warn('Model data does not exist.');
          }
      }
      _setupModelComplete(buffer) {
          if (!buffer) {
              console.error("loadModel fail!");
              this._completeHandler && this._completeHandler.run();
              return;
          }
          this._model.loadModel(buffer);
          this.state = LoadStep.LoadExpression;
          this.loadCubismExpression();
      }
      loadCubismExpression() {
          let expressionCount = this._setting.getExpressionCount();
          if (expressionCount > 0) {
              this._model._expressionUrls = [];
              this._model._expressionNames = [];
              let url;
              for (let i = 0; i < expressionCount; i++) {
                  this._model._expressionNames.push(this._setting.getExpressionName(i));
                  url = `${this._modelHomeDir}/${this._setting.getExpressionFileName(i)}`;
                  this.jsonUrls.push(url);
                  this._model._expressionUrls.push(url);
              }
              this.state = LoadStep.WaitLoadExpression;
              Laya.Laya.loader.load(this._model._expressionUrls, Laya.Handler.create(this, this._loadCubismExpressionComplete, [expressionCount]), null, Laya.Loader.BUFFER);
          }
          else {
              this.state = LoadStep.LoadPhysics;
              this.loadCubismPhysics();
          }
      }
      _loadCubismExpressionComplete(count) {
          for (let i = 0; i < count; i++) {
              let buffer = Laya.Laya.loader.getRes(this._model._expressionUrls[i]);
              if (!buffer) {
                  console.log(`[WARNNING]:${this._model._expressionUrls[i]} data load fail!`);
              }
              else
                  this._model.loadExpression(buffer, buffer.byteLength, this._model._expressionNames[i]);
          }
          this._model._expressionUrls = null;
          this.state = LoadStep.LoadPhysics;
          this.loadCubismPhysics();
      }
      loadCubismPhysics() {
          let physicsFileName = this._setting.getPhysicsFileName();
          if (physicsFileName != '') {
              this.state = LoadStep.WaitLoadPhysics;
              let url = `${this._modelHomeDir}/${physicsFileName}`;
              this.jsonUrls.push(url);
              Laya.Laya.loader.load(url, Laya.Handler.create(this, this._loadCubismPhysicsComplete), null, Laya.Loader.BUFFER);
          }
          else {
              this.state = LoadStep.LoadPose;
              this.loadCubismPose();
          }
      }
      _loadCubismPhysicsComplete(buffer) {
          if (!buffer) {
              console.log("[WARNNING]:Physics data load fail!");
          }
          else {
              this._model.loadPhysics(buffer, buffer.byteLength);
          }
          this.state = LoadStep.LoadPose;
          this.loadCubismPose();
      }
      loadCubismPose() {
          let poseFileName = this._setting.getPoseFileName();
          if (poseFileName != '') {
              this.state = LoadStep.WaitLoadPose;
              let url = `${this._modelHomeDir}/${poseFileName}`;
              this.jsonUrls.push(url);
              Laya.Laya.loader.load(url, Laya.Handler.create(this, this._loadCubismPoseComplete), null, Laya.Loader.BUFFER);
          }
          else {
              this.state = LoadStep.SetupEyeBlink;
              this.detailsinit();
          }
      }
      _loadCubismPoseComplete(buffer) {
          if (!buffer) {
              console.log("[WARNNING]:Pose data load fail!");
          }
          else
              this._model.loadPose(buffer, buffer.byteLength);
          this.state = LoadStep.SetupEyeBlink;
          this.detailsinit();
      }
      detailsinit() {
          this._model.setupEyeBlink();
          this.state = LoadStep.SetupBreath;
          this._model.setupBreath();
          this.state = LoadStep.LoadUserData;
          let userDataFile = this._setting.getUserDataFile();
          if (userDataFile != '') {
              this.state = LoadStep.WaitLoadUserData;
              let url = `${this._modelHomeDir}/${userDataFile}`;
              this.jsonUrls.push(url);
              Laya.Laya.loader.load(url, Laya.Handler.create(this, this._loadUserDataComplete), null, Laya.Loader.BUFFER);
          }
          else {
              this.state = LoadStep.SetupEyeBlinkIds;
              this.detailsinit2();
          }
      }
      _loadUserDataComplete(buffer) {
          if (!buffer) {
              console.log("[WARNNING]:UserData load fail!");
          }
          else {
              this._model.loadUserData(buffer, buffer.byteLength);
          }
          this.state = LoadStep.SetupEyeBlinkIds;
          this.detailsinit2();
      }
      detailsinit2() {
          this._model.setupEyeBlinkIds();
          this.state = LoadStep.SetupLipSyncIds;
          this._model.setupLipSyncIds();
          this.state = LoadStep.SetupLayout;
          this._model.setupLayout();
          this.state = LoadStep.WaitLoadMotion;
          this._model.loadCubismMotion();
          if (this._model.allMotionCount) {
              this.preMotionUrls();
              this.state = LoadStep.LoadMotion;
              Laya.Laya.loader.load(this._model._motionUrls, Laya.Handler.create(this, this._preLoadMotionGroupComplete));
          }
          else {
              this.state = LoadStep.LoadTexture;
              this.loadTexture();
          }
      }
      preMotionUrls() {
          this._model._motionUrls = [];
          let motionGroups = this._model._motionGroups;
          let group, count, motionFileName;
          for (let i = 0; i < motionGroups.length; i++) {
              group = motionGroups[i];
              count = this._setting.getMotionCount(group);
              for (let j = 0; j < count; j++) {
                  motionFileName = `${this._modelHomeDir}/${this._setting.getMotionFileName(group, j)}`;
                  this.jsonUrls.push(motionFileName);
                  this._model._motionUrls.push({
                      url: motionFileName,
                      key: group,
                      index: j,
                      name: `${group}_${j}`,
                      type: Laya.Loader.BUFFER
                  });
              }
          }
      }
      _preLoadMotionGroupComplete() {
          this._model.loadMotionGroup();
          this._model._motionUrls = null;
          this.state = LoadStep.LoadTexture;
          this.loadTexture();
      }
      loadTexture() {
          if (this.state !== LoadStep.LoadTexture) {
              return;
          }
          let textureCount = this._setting.getTextureCount();
          this._model._textureUrls = [];
          let texturePath;
          for (let i = 0; i < textureCount; i++) {
              texturePath = `${this._modelHomeDir}/${this._setting.getTextureFileName(i)}`;
              this._model._textureUrls.push({ url: texturePath, type: "nativeimage" });
          }
          Laya.Laya.loader.load(this._model._textureUrls.slice(), Laya.Handler.create(this, this.loadComplete));
      }
      loadComplete() {
          this.state = LoadStep.CompleteSetup;
          this._completeHandler && this._completeHandler.runWith([this._model, this]);
      }
      clear(clearJson = true) {
          this._modelHomeDir = null;
          this._setting = null;
          this._model = null;
          if (clearJson) {
              for (let index = 0; index < this.jsonUrls.length; index++) {
                  let url = this.jsonUrls[index];
                  Laya.Laya.loader.clearRes(url);
              }
          }
          this.jsonUrls.length = 0;
          this.state = LoadStep.LoadAssets;
      }
  }
  Live2DLoader.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  var CubismShader_Laya = Live2DCubismFramework$A.CubismShader_Laya;
  class Live2DDemo {
      constructor() {
          this._modelurls = [
              "Haru", "Hiyori", "Mark", "Natori", "Rice"
          ];
          this.index = 2;
          Laya.Config.useRetinalCanvas = true;
          Laya.Laya.init(720, 1280);
          Laya.Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_AUTO;
          Laya.Laya.alertGlobalError(true);
          CubismShader_Laya.__init__();
          CubismShader_Laya.getInstance().generateShaders();
          Delegate.instance.initializeCubism();
          this.initRedBtn();
      }
      changeModel() {
          if (this._model) {
              this._model.destroy();
          }
          console.log(Laya.Browser.now());
          this._model = null;
          let loader = new Live2DLoader();
          this.index++;
          loader.loadZipAssets("res", "Hiyori.zip", "Hiyori", Laya.Handler.create(this, this._loadSuccess));
      }
      _loadSuccess(model, loader) {
          if (!model)
              return;
          if (!this.sp) {
              this.sp = new Laya.Box();
              Laya.Laya.stage.addChild(this.sp);
          }
          this._model = model;
          model.isAutoPlay = false;
          model.initModel();
          Laya.Laya.stage.addChildAt(model, 0);
          model.scale(0.2, 0.2);
          let widget = model.addComponent(Laya.Widget);
          loader.clear();
          model.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
          model.on(Laya.Event.CHANGE, this, this.aboutEvent);
          Laya.Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.stageOnMouseDown);
      }
      initRedBtn() {
          let sp = new Laya.Sprite();
          Laya.Laya.stage.addChild(sp);
          sp.graphics.drawRect(0, 0, 100, 100, "red");
          sp.mouseEnabled = true;
          sp.mouseThrough = true;
          sp.x = Laya.Laya.stage.width - 100;
          sp.on(Laya.Event.MOUSE_DOWN, this, this.changeModel);
      }
      aboutEvent(eventValue) {
          console.log(eventValue);
      }
      stageOnMouseDown() {
          Laya.Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
          Laya.Laya.stage.on(Laya.Event.MOUSE_OUT, this, this.onMouseUp);
          Laya.Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
      }
      onMouseDown() {
          if (!this._model) {
              return;
          }
          let model = this._model;
          if (model.live2DHitTest("Body", Laya.Laya.stage.mouseX, Laya.Laya.stage.mouseY)) {
              console.log("点击到了Body");
              model.startRandomMotion("TapBody", 3);
          }
          else if (model.live2DHitTest("Head", Laya.Laya.stage.mouseX, Laya.Laya.stage.mouseY)) {
              console.log("点到Head了");
              model.setRandomExpression();
          }
      }
      onMouseUp() {
          Laya.Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
          Laya.Laya.stage.off(Laya.Event.MOUSE_OUT, this, this.onMouseUp);
          Laya.Laya.stage.off(Laya.Event.MOUSE_UP, this, this.onMouseUp);
      }
      onMouseMove() {
          if (!this._model) {
              return;
          }
          this._model.setDragging(Laya.Laya.stage.mouseX, Laya.Laya.stage.mouseY);
      }
  }
  new Live2DDemo();

}(Laya));
//# sourceMappingURL=bundle.js.map
