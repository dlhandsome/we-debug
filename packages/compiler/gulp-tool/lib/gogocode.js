const setAttributeToAST = (ast, attrName, attrValue) => {
  if (!ast || typeof attrName !== 'string') {
    return;
  }

  // 如果属性存在，则直接修改属性
  let isModified = false;
  const attrs = ast.attr('content.attributes') || [];
  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i];
    if (attr.key.content === attrName) {
      attr.value.content = attrValue;
      isModified = true;
      break;
    }
  }

  // 如果属性不存在，则新增属性
  if (!isModified) {
    attrs.push({
      key: {
        type: 'token:attribute-key',
        content: attrName
      },
      startWrapper: {
        type: 'token:attribute-value-wrapper-start',
        content: '"'
      },
      value: {
        type: 'token:attribute-value',
        content: attrValue
      },
      endWrapper: {
        type: 'token:attribute-value-wrapper-end',
        content: '"'
      }
    });
  }
  ast.attr('content.attributes', attrs);
};

const getAttributeValueWithAST = (ast, attrName) => {
  if (!ast || typeof attrName !== 'string') {
    return;
  }

  const attrs = ast.attr('content.attributes') || [];
  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i];
    if (attr.key.content === attrName) {
      return attr.value.content;
    }
  }

  return;
};

module.exports = {
  setAttributeToAST,
  getAttributeValueWithAST
};
